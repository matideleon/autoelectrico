// ============================================================
// evuy — Chunking
//
// Acá se define la calidad del RAG. Un chunk que corta una tabla
// de specs al medio produce respuestas incompletas, y respuestas
// incompletas sobre un auto de USD 40.000 te cuestan la credibilidad.
//
// Estrategia: respetar límites semánticos (secciones > párrafos >
// oraciones), nunca cortar al medio de una palabra, y arrastrar
// el encabezado de sección a cada chunk para no perder contexto.
// ============================================================

export interface RawPage {
  page: number;
  text: string;
}

export interface Chunk {
  content: string;
  page: number;
  chunkIdx: number;
  tokens: number;
  section: string | null;
}

export interface ChunkOptions {
  targetTokens?: number;   // tamaño objetivo
  overlapTokens?: number;  // solape entre chunks contiguos
  minTokens?: number;      // por debajo de esto, se fusiona
}

const DEFAULTS: Required<ChunkOptions> = {
  targetTokens: 800,
  overlapTokens: 100,
  minTokens: 50,
};

/**
 * Estimación de tokens. En español ~3.5 chars/token (más que
 * inglés por acentos y palabras largas). No es exacto pero no
 * necesita serlo: es para dimensionar chunks, no para facturar.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

/**
 * Detecta encabezados de sección en manuales.
 * Cubre: "3.2 Sistema de carga", "SISTEMA DE CARGA", "Capítulo 4"
 */
function detectSection(line: string): string | null {
  const t = line.trim();
  if (!t || t.length > 80) return null;

  if (/^\d+(\.\d+)*\.?\s+\S/.test(t)) return t;                    // 3.2 Título
  if (/^(cap[íi]tulo|secci[óo]n|parte)\s+\d+/i.test(t)) return t;  // Capítulo 4
  // Mayúsculas sostenidas, sin punto final
  if (t.length > 3 && t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(t) && !t.endsWith('.')) {
    return t;
  }
  return null;
}

/** Corta en oraciones sin romper abreviaturas ni decimales. */
function splitSentences(text: string): string[] {
  const protectedText = text
    .replace(/(\d)\.(\d)/g, '$1<DOT>$2')              // 10.5 kW
    .replace(/\b(Sr|Sra|Dr|Ing|etc|aprox|máx|mín|pág|fig|ref|art)\./gi, '$1<DOT>');

  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/)
    .map((s) => s.replace(/<DOT>/g, '.').trim())
    .filter(Boolean);
}

/** Limpieza de artefactos típicos de PDF. */
export function cleanPageText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/-\n(\p{Ll})/gu, '$1')      // guion de corte de línea
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^\s*\d+\s*$/gm, '')        // números de página sueltos
    .trim();
}

/**
 * Chunking principal. Mantiene el número de página real de cada
 * chunk: es lo que después se cita ("manual pág. 47"). Sin eso,
 * el bot no puede probar lo que dice.
 */
export function chunkPages(pages: RawPage[], opts: ChunkOptions = {}): Chunk[] {
  const { targetTokens, overlapTokens, minTokens } = { ...DEFAULTS, ...opts };
  const chunks: Chunk[] = [];

  let buffer: string[] = [];
  let bufferTokens = 0;
  let bufferPage = pages[0]?.page ?? 1;
  let currentSection: string | null = null;
  let idx = 0;

  /**
   * `hard = true` corta sin arrastrar solape. Se usa al cambiar de
   * sección: el solape entre dos temas distintos contamina el chunk
   * y hace que el bot cite la sección equivocada.
   */
  const flush = (opts: { forcePage?: number; hard?: boolean } = {}) => {
    if (!buffer.length) return;
    const body = buffer.join(' ').trim();
    if (!body) {
      buffer = [];
      bufferTokens = 0;
      return;
    }

    // El encabezado de sección viaja con el chunk: sin esto, un
    // chunk suelto no dice de qué sistema del auto está hablando.
    const content = currentSection && !body.startsWith(currentSection)
      ? `[${currentSection}]\n${body}`
      : body;

    chunks.push({
      content,
      page: opts.forcePage ?? bufferPage,
      chunkIdx: idx++,
      tokens: estimateTokens(content),
      section: currentSection,
    });

    // Solape: se arrastran las últimas oraciones al próximo chunk
    if (overlapTokens > 0 && !opts.hard) {
      const tail: string[] = [];
      let tailTokens = 0;
      for (let i = buffer.length - 1; i >= 0; i--) {
        const t = estimateTokens(buffer[i]);
        if (tailTokens + t > overlapTokens) break;
        tail.unshift(buffer[i]);
        tailTokens += t;
      }
      buffer = tail;
      bufferTokens = tailTokens;
    } else {
      buffer = [];
      bufferTokens = 0;
    }
  };

  for (const page of pages) {
    const text = cleanPageText(page.text);
    if (!text) continue;

    const blocks = text.split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.split('\n');
      const heading = lines.length ? detectSection(lines[0]) : null;

      if (heading) {
        // Sección nueva → corte duro. Sin solape: no se mezclan temas.
        flush({ hard: true });
        currentSection = heading;
        bufferPage = page.page;
        const rest = lines.slice(1).join(' ').trim();
        if (!rest) continue;
        buffer.push(rest);
        bufferTokens += estimateTokens(rest);
        continue;
      }

      const blockText = lines.join(' ').trim();
      if (!blockText) continue;

      const blockTokens = estimateTokens(blockText);

      if (bufferTokens + blockTokens <= targetTokens) {
        if (!buffer.length) bufferPage = page.page;
        buffer.push(blockText);
        bufferTokens += blockTokens;
        continue;
      }

      // El bloque no entra: si él solo pasa el target, se parte por oraciones
      if (blockTokens > targetTokens) {
        flush();
        bufferPage = buffer.length ? bufferPage : page.page;
        for (const sentence of splitSentences(blockText)) {
          const st = estimateTokens(sentence);
          if (bufferTokens + st > targetTokens) {
            flush();
          }
          if (!buffer.length) bufferPage = page.page;
          buffer.push(sentence);
          bufferTokens += st;
        }
      } else {
        flush();
        if (!buffer.length) bufferPage = page.page;
        buffer.push(blockText);
        bufferTokens += blockTokens;
      }
    }
  }

  flush();

  // Fusionar colas huérfanas: un chunk de 20 tokens no aporta nada.
  // PERO nunca cruzando secciones ni páginas: eso rompe las citas.
  const merged: Chunk[] = [];
  for (const c of chunks) {
    const prev = merged[merged.length - 1];
    const sameSection = prev?.section === c.section;
    const samePage = prev?.page === c.page;
    if (
      prev &&
      sameSection &&
      samePage &&
      c.tokens < minTokens &&
      prev.tokens + c.tokens <= targetTokens * 1.2
    ) {
      prev.content = `${prev.content} ${c.content}`;
      prev.tokens = estimateTokens(prev.content);
      continue;
    }
    merged.push(c);
  }

  return merged.map((c, i) => ({ ...c, chunkIdx: i }));
}
