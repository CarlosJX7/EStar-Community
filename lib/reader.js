// Convierte lo que hay en pantalla en texto para leerlo en voz alta.
// - collectBlocks(): toda la página, en orden (botón «Escuchar»).
// - blockFor() + describeElement(): solo lo que se toca o enfoca («Leer lo que toco»).

// Un bloque es un trozo de texto "hoja": no contiene otros bloques dentro.
const BLOCK =
  "h1,h2,h3,h4,p,li,dt,dd,legend,label,.bubble,.card-actions > *,.tabs > *,.chips > *,.big-link,.sos-box > a";

// Controles dentro de la página: se leen con su nombre accesible y se avisa de qué son.
const CONTROL = ".card-actions > *, .tabs > *, .chips > *, .big-link, .sos-box > a";

// Cualquier elemento con el que se puede interactuar.
const INTERACTIVE =
  'a[href], button, input, select, textarea, [role="tab"], [role="button"], summary';

// Los emojis se ven bien pero la voz los lee mal ("cara sonriente con ojos sonrientes").
const EMOJI = /[\p{Extended_Pictographic}‍️⃣]/gu;

// Algunos emojis hacen de etiqueta ("📞 917 160 710"): sin ellos el dato queda suelto.
// Se convierten en palabra antes de quitarlos. No se aplica a los títulos.
const LABELS = [
  [/📞/g, "Teléfono: "],
  [/📱/g, "Móvil: "],
  [/✉️?/g, "Correo: "],
  [/📍/g, "Lugar: "],
  [/📅/g, "Fecha: "],
  [/🕒/g, "Horario: "],
  [/🤝/g, "Organiza: "],
];

const clean = (s) => (s || "").replace(EMOJI, " ").replace(/\s+/g, " ").trim();

// Texto visible de un elemento, sin lo decorativo y sin que se peguen las palabras.
function visibleText(el, { dropButtons = false } = {}) {
  const clone = el.cloneNode(true);
  const drop = dropButtons ? '[aria-hidden="true"], button, script, style' : '[aria-hidden="true"], script, style';
  clone.querySelectorAll(drop).forEach((n) => n.remove());
  clone.querySelectorAll("*").forEach((n) => n.after(" "));
  return clone.textContent;
}

function stateSuffix(el) {
  let s = "";
  if (el.getAttribute("aria-selected") === "true" || el.getAttribute("aria-pressed") === "true") s += ", activado";
  if (el.getAttribute("aria-current") === "page") s += ", estás aquí";
  if (el.disabled || el.getAttribute("aria-disabled") === "true") s += ", no disponible";
  return s;
}

function textOf(el) {
  const isControl = el.matches(CONTROL);
  const isHeading = /^H[1-6]$/.test(el.tagName);
  let label = isControl ? el.getAttribute("aria-label") : null;

  if (!label) {
    label = visibleText(el, { dropButtons: true });
    if (!isHeading && !isControl) for (const [re, word] of LABELS) label = label.replace(re, word);
    if (isControl && !clean(label)) label = el.textContent;
  }

  label = clean(label);
  if (!label) return "";
  if (isControl) return `${el.tagName === "A" ? "Enlace" : "Botón"}: ${label}${stateSuffix(el)}`;
  return label;
}

// Parte textos largos en frases para que ninguna lectura se corte a mitad.
function sentences(text, max = 220) {
  if (text.length <= max) return [text];
  const out = [];
  let cur = "";
  for (const s of text.split(/(?<=[.!?:;])\s+/)) {
    if ((cur + " " + s).trim().length > max && cur) {
      out.push(cur);
      cur = s;
    } else {
      cur = (cur + " " + s).trim();
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function collectBlocks(root) {
  const items = [];
  for (const el of root.querySelectorAll(BLOCK)) {
    if (el.closest('[aria-hidden="true"], [hidden], .skip-link')) continue;
    if (el.querySelector(BLOCK)) continue; // no es una hoja
    const text = textOf(el);
    if (!text) continue;
    for (const piece of sentences(text)) items.push({ el, text: piece });
  }
  return items;
}

function accessibleName(el) {
  const aria = el.getAttribute("aria-label");
  if (aria && clean(aria)) return clean(aria);
  const ids = el.getAttribute("aria-labelledby");
  if (ids) {
    const t = ids
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id)?.textContent || "")
      .join(" ");
    if (clean(t)) return clean(t);
  }
  if (el.labels && el.labels.length) return clean(el.labels[0].textContent);
  const t = clean(visibleText(el));
  if (t) return t;
  return clean(el.getAttribute("placeholder") || el.getAttribute("title") || el.value || "");
}

// Qué elemento leer cuando se toca o enfoca algo.
export function blockFor(target) {
  if (!target || !target.closest) return null;
  return (
    target.closest(INTERACTIVE) ||
    target.closest(BLOCK) ||
    target.closest(".card, .notice, .hero, .empty, .bubble")
  );
}

// Descripción hablada de un elemento: "Botón: Unirme a Cocina fácil, activado".
export function describeElement(el) {
  if (!el.matches(INTERACTIVE)) return textOf(el);

  const tag = el.tagName;
  const type = (el.getAttribute("type") || "").toLowerCase();
  let role = "Botón";
  if (tag === "A") role = "Enlace";
  else if (tag === "SELECT") role = "Lista para elegir";
  else if (tag === "TEXTAREA" || (tag === "INPUT" && !["submit", "button", "checkbox", "radio"].includes(type)))
    role = "Campo para escribir";
  else if (type === "checkbox") role = "Casilla";
  else if (type === "radio") role = "Opción";

  let out = `${role}: ${accessibleName(el)}`;

  if (role === "Campo para escribir" && type !== "password") {
    const v = clean(el.value);
    out += v ? `. Escrito: ${v}` : ". Está vacío";
  } else if (role === "Lista para elegir") {
    const opt = el.options?.[el.selectedIndex];
    if (opt) out += `. Elegido: ${clean(opt.textContent)}`;
  } else if (role === "Casilla" || role === "Opción") {
    out += el.checked ? ", marcada" : ", sin marcar";
  }

  out += stateSuffix(el);
  if (el.getAttribute("target") === "_blank" && !/pestaña nueva/.test(out)) out += ", se abre en una pestaña nueva";
  return out;
}
