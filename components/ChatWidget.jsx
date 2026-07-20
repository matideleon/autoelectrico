import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ============================================================
   autoelectrico.uy — Chat widget

   Flotante abajo a la derecha. Tres estados:
   1. Burbuja cerrada
   2. Chat abierto → pregunta → respuesta con citas
   3. Captura de lead cuando shouldCaptureLead = true

   El bot no vende. Cita fuentes. Y cuando no sabe, lo dice.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
  lab: '#E8A33D',
  gap: '#4A505A',
  input: '#0E1013',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

function genSessionId() {
  return 'chat_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function CitationPill({ cite }) {
  return (
    <span style={S.pill} title={`${cite.docTitle}${cite.page ? ', pág. ' + cite.page : ''}`}>
      {cite.label} {cite.page ? `pág. ${cite.page}` : cite.docTitle}
    </span>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <div style={{ ...S.msg, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...S.bubble, ...(isUser ? S.userBubble : S.botBubble) }}>
        <div style={S.msgText}>{msg.content}</div>
        {msg.citations?.length > 0 && (
          <div style={S.citations}>
            {msg.citations.map((c, i) => <CitationPill key={i} cite={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function LeadForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [timeframe, setTimeframe] = useState('');

  const TF = [
    { v: 'lt_3m', l: '< 3 meses' },
    { v: '3_6m', l: '3-6 meses' },
    { v: '6_12m', l: '6-12 meses' },
    { v: 'browsing', l: 'Solo miro' },
  ];

  return (
    <div style={S.leadForm}>
      <div style={S.leadTitle}>¿Querés que un concesionario te contacte?</div>
      <div style={S.leadNote}>Sin compromiso. Te van a hablar, no a presionar.</div>

      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        style={S.leadInput}
        className="chat-in"
      />
      <input
        type="tel"
        placeholder="Tu teléfono o WhatsApp"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={S.leadInput}
        className="chat-in"
      />

      <div style={S.leadTfLabel}>¿Cuándo pensás comprar?</div>
      <div style={S.leadChips}>
        {TF.map(t => (
          <button
            key={t.v}
            type="button"
            onClick={() => setTimeframe(t.v === timeframe ? '' : t.v)}
            className="chat-chip"
            style={{
              ...S.leadChip,
              borderColor: timeframe === t.v ? C.real : C.line,
              color: timeframe === t.v ? C.real : C.dim,
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!phone.trim() || loading}
        onClick={() => onSubmit({ name, phone, timeframe, wantsTestDrive: true })}
        className="chat-send"
        style={{
          ...S.leadBtn,
          opacity: !phone.trim() || loading ? 0.4 : 1,
        }}
      >
        {loading ? 'Enviando...' : 'Sí, que me contacten'}
      </button>

      <button
        type="button"
        onClick={() => onSubmit(null)}
        style={S.leadSkip}
      >
        No, solo quiero seguir preguntando
      </button>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [sessionId] = useState(genSessionId);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLead, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      if (err.name === 'AbortError') {
        throw new Error('La consulta tardó demasiado. Probá de nuevo.');
      }
      throw err;
    }
  };

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;

    const userMsg = { role: 'user', content: q };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setShowLead(false);

    try {
      const history = updated
        .filter(m => !m.system)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetchWithTimeout('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          sessionId,
          history: history.slice(-8),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();

      const botMsg = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
      };

      setMessages(prev => [...prev, botMsg]);

      if (data.shouldCaptureLead && !leadSent) {
        setShowLead(true);
      }
    } catch (err) {
      console.error('[chat] send failed:', err);
      // Devolvemos la pregunta al input para que el usuario no la pierda.
      setInput(q);
      const isNetwork = /fetch|network|Failed to fetch|abort/i.test(err.message);
      const errorText = isNetwork
        ? 'No me pude conectar con el servidor. Revisá tu conexión y probá de nuevo.'
        : err.message || 'No pude procesar tu consulta. Probá de nuevo en un momento.';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorText,
          system: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitLead = async (leadData) => {
    if (!leadData) {
      setShowLead(false);
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Quiero que me contacten',
          sessionId,
          history: messages.map(m => ({ role: m.role, content: m.content })).slice(-8),
          lead: {
            name: leadData.name,
            phone: leadData.phone,
            timeframe: leadData.timeframe || undefined,
            wantsTestDrive: leadData.wantsTestDrive,
          },
        }),
      });

      setLeadSent(true);
      setShowLead(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Listo, van a contactarte. ¿Querés seguir preguntando algo?',
          system: true,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'No pude enviar tus datos. Probá de nuevo.', system: true },
      ]);
    } finally {
      setLoading(false);
      setShowLead(false);
    }
  };

  if (!open) {
    return (
      <>
        <style>{CSS}</style>
        <button
          onClick={() => setOpen(true)}
          className="chat-fab"
          style={S.fab}
          aria-label="Abrir chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div style={S.container}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={S.headerTitle}>autoelectrico.uy</div>
            <div style={S.headerSub}>Preguntá sobre autos eléctricos en Uruguay</div>
          </div>
          <button onClick={() => setOpen(false)} style={S.close} aria-label="Cerrar chat">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={S.body} ref={scrollRef}>
          {messages.length === 0 && (
            <div style={S.welcome}>
              <div style={S.welcomeTitle}>Hola</div>
              <div style={S.welcomeText}>
                Preguntame sobre precios, autonomía, carga o cualquier dato técnico.
                Si no sé algo, te lo digo.
              </div>
              <div style={S.starters}>
                {[
                  '¿Cuánto sale el EX5?',
                  'Tengo 35 mil dólares',
                  '¿Qué autonomía real tiene el Dolphin?',
                ].map(q => (
                  <button
                    key={q}
                    type="button"
                    className="chat-starter"
                    style={S.starter}
                    onClick={() => { setInput(q); }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => <Message key={i} msg={m} />)}

          {loading && (
            <div style={{ ...S.msg, alignItems: 'flex-start' }}>
              <div style={{ ...S.bubble, ...S.botBubble }}>
                <div style={S.typing}>
                  <span style={S.dot1} />
                  <span style={S.dot2} />
                  <span style={S.dot3} />
                </div>
              </div>
            </div>
          )}

          {showLead && <LeadForm onSubmit={submitLead} loading={loading} />}
        </div>

        {/* Input */}
        <div style={S.footer}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escribí tu pregunta..."
            style={S.input}
            className="chat-in"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="chat-send"
            style={{
              ...S.sendBtn,
              opacity: !input.trim() || loading ? 0.3 : 1,
            }}
            aria-label="Enviar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ============================================================ */

const S = {
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: C.real,
    color: C.bg,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    zIndex: 9999,
    transition: 'transform 150ms ease',
  },
  container: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 380,
    maxWidth: 'calc(100vw - 32px)',
    height: 560,
    maxHeight: 'calc(100vh - 48px)',
    background: C.bg,
    border: `1px solid ${C.line}`,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    zIndex: 9999,
    fontFamily: sans,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: `1px solid ${C.line}`,
    background: C.surface,
  },
  headerTitle: {
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
    color: C.real,
    letterSpacing: '0.02em',
  },
  headerSub: {
    fontSize: 11,
    color: C.faint,
    marginTop: 2,
  },
  close: {
    background: 'none',
    border: 'none',
    color: C.dim,
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  welcome: { padding: '8px 4px' },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
    color: C.text,
  },
  welcomeText: {
    fontSize: 13,
    color: C.dim,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  starters: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  starter: {
    fontFamily: mono,
    fontSize: 11,
    padding: '9px 12px',
    background: 'transparent',
    color: C.dim,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 140ms ease',
  },
  msg: {
    display: 'flex',
    flexDirection: 'column',
  },
  bubble: {
    maxWidth: '85%',
    padding: '10px 13px',
    borderRadius: 6,
    fontSize: 13,
    lineHeight: 1.55,
  },
  userBubble: {
    background: C.real,
    color: C.bg,
    borderBottomRightRadius: 2,
  },
  botBubble: {
    background: C.surface,
    color: C.text,
    borderBottomLeftRadius: 2,
    border: `1px solid ${C.line}`,
  },
  msgText: { whiteSpace: 'pre-wrap' },
  citations: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTop: `1px solid ${C.line}`,
  },
  pill: {
    fontFamily: mono,
    fontSize: 9,
    color: C.lab,
    background: 'rgba(232,163,61,0.1)',
    padding: '3px 7px',
    borderRadius: 2,
    cursor: 'help',
  },
  typing: {
    display: 'flex',
    gap: 4,
    padding: '4px 0',
  },
  dot1: {
    width: 6, height: 6, borderRadius: '50%', background: C.faint,
    animation: 'chatdot 1s infinite',
  },
  dot2: {
    width: 6, height: 6, borderRadius: '50%', background: C.faint,
    animation: 'chatdot 1s infinite 0.2s',
  },
  dot3: {
    width: 6, height: 6, borderRadius: '50%', background: C.faint,
    animation: 'chatdot 1s infinite 0.4s',
  },
  footer: {
    display: 'flex',
    gap: 8,
    padding: '12px',
    borderTop: `1px solid ${C.line}`,
    background: C.surface,
  },
  input: {
    flex: 1,
    fontFamily: sans,
    fontSize: 13,
    padding: '10px 12px',
    background: C.input,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 4,
    outline: 'none',
  },
  sendBtn: {
    background: C.real,
    color: C.bg,
    border: 'none',
    borderRadius: 4,
    padding: '0 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 150ms ease',
  },
  leadForm: {
    padding: '14px',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
  },
  leadTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
    marginBottom: 4,
  },
  leadNote: {
    fontSize: 11,
    color: C.faint,
    marginBottom: 14,
  },
  leadInput: {
    width: '100%',
    fontFamily: sans,
    fontSize: 13,
    padding: '9px 11px',
    background: C.input,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    outline: 'none',
    marginBottom: 8,
    boxSizing: 'border-box',
  },
  leadTfLabel: {
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
    marginTop: 4,
  },
  leadChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 12,
  },
  leadChip: {
    fontFamily: mono,
    fontSize: 10,
    padding: '6px 10px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 140ms ease',
  },
  leadBtn: {
    width: '100%',
    fontFamily: mono,
    fontSize: 12,
    fontWeight: 500,
    padding: '11px',
    background: C.real,
    color: C.bg,
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
    marginBottom: 8,
    transition: 'opacity 150ms ease',
  },
  leadSkip: {
    width: '100%',
    fontFamily: mono,
    fontSize: 11,
    padding: '8px',
    background: 'transparent',
    color: C.faint,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
  },
};

const CSS = `
@keyframes chatdot {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
.chat-fab:hover { transform: scale(1.08); }
.chat-in:focus { border-color: ${C.real} !important; }
.chat-in::placeholder { color: ${C.faint}; }
.chat-starter:hover { border-color: ${C.dim} !important; color: ${C.text} !important; }
.chat-chip:hover { border-color: ${C.dim} !important; }
.chat-send:hover:not(:disabled) { filter: brightness(1.08); }
button:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
@media (max-width: 420px) {
  .chat-fab { bottom: 16px !important; right: 16px !important; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
`;
