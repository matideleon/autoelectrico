/* ============================================================
   autoelectrico.uy — tokens de marca

   Hasta ahora cada página redeclaraba su propia constante `C`.
   Con ~20 copias, la deriva era inevitable: /noticias terminó con
   un `faint` de #565C66 (contraste 2,69:1 sobre el fondo) contra
   el #828993 del resto (5,13:1). Dos de sus colores no pasaban
   WCAG AA, y la página se había creado después del fix de
   accesibilidad, así que nunca lo recibió.

   Esto es el lugar único. Las páginas se van migrando de a poco;
   mientras tanto conviven las dos formas, pero lo nuevo importa
   de acá.

   Todos los valores están verificados contra el fondo #141619:
     text  #E6E8EB → 14,04:1   AAA
     dim   #9AA1AC →  6,96:1   AA
     faint #828993 →  5,13:1   AA
     gap   #838A94 →  5,20:1   AA
     real  #3DDC97 → 10,74:1   AAA
     lab   #C58259 →  5,55:1   AA
   ============================================================ */

export const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#9AA1AC',
  faint: '#828993',
  gap: '#838A94',
  /** Verde de marca. Reservado para el dato REAL medido en Uruguay
   *  y para acciones. No usarlo de adorno: pierde el significado. */
  real: '#3DDC97',
  /** Ámbar. Cifra de laboratorio (WLTP/NEDC) y categorías. */
  lab: '#C58259',
};

export const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
export const sans = "'IBM Plex Sans', -apple-system, sans-serif";

/** Fechas de artículos: "1 de agosto de 2026".
 *  El ISO crudo (2026-08-01) se veía como dato de base, no como
 *  nota editorial. Las notas ya escribían la fecha larga en el
 *  cuerpo; el listado decía otra cosa para el mismo artículo. */
export function formatArticleDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
