// Preferencias de accesibilidad: cómo se adapta la página a cada persona.
// Se guardan en este dispositivo (localStorage, clave "star:prefs").

export const PREFS_KEY = "star:prefs";

export const DEFAULT_PREFS = {
  scale: 1, // tamaño de letra (0.9 – 1.6)
  theme: "light", // light | dark | contrast
  font: "atkinson", // atkinson | lexend | dyslexic
  spacing: "normal", // normal | wide
  tint: "none", // none | cream
  cvd: "none", // daltonismo: none | redgreen | blueyellow | mono
  calm: false, // colores suaves y sin movimiento
  motion: "normal", // normal | reduce
  targets: "normal", // normal | big
  reader: "off", // lectura en voz alta: off | button | tap
  rate: 0.85, // velocidad de la voz
  autoRead: false, // leer cada página al entrar
  needs: [], // necesidades elegidas
  configured: false, // la persona ya pasó por "Adaptar la página"
  bannerDismissed: false,
};

// Atributos que se ponen en <html> para que el CSS adapte la página.
export const ATTR_KEYS = ["theme", "font", "spacing", "tint", "cvd", "motion", "targets"];

// Cada necesidad activa un conjunto de ajustes. Luego se pueden cambiar a mano.
export const NEEDS = [
  {
    id: "vision",
    emoji: "👓",
    title: "Veo poco o me cuesta ver la pantalla",
    preset: { scale: 1.3, reader: "tap", targets: "big" },
  },
  {
    id: "dyslexia",
    emoji: "🔤",
    title: "Me cuesta leer las letras (dislexia)",
    preset: { font: "dyslexic", spacing: "wide", tint: "cream", reader: "button" },
  },
  {
    id: "color",
    emoji: "🎨",
    title: "Veo los colores de otra forma (daltonismo)",
    preset: { cvd: "redgreen" },
  },
  {
    id: "sensory",
    emoji: "🌿",
    title: "Me molestan los colores fuertes o el movimiento",
    preset: { calm: true, motion: "reduce" },
  },
  {
    id: "reading",
    emoji: "🧠",
    title: "Me cuesta entender textos largos",
    preset: { reader: "button", scale: 1.15, spacing: "wide" },
  },
  {
    id: "motor",
    emoji: "✋",
    title: "Me cuesta tocar botones pequeños",
    preset: { targets: "big", scale: 1.15 },
  },
];

// Tipos de daltonismo, en palabras sencillas.
export const CVD_TYPES = [
  {
    id: "redgreen",
    title: "Confundo el rojo y el verde",
    hint: "Es lo más común (protanopia y deuteranopia). Si no sabes cuál es el tuyo, elige este.",
    swatches: ["#d62728", "#2ca02c"],
  },
  {
    id: "blueyellow",
    title: "Confundo el azul y el amarillo",
    hint: "Tritanopia. Es menos común.",
    swatches: ["#1f77b4", "#e6c229"],
  },
  {
    id: "mono",
    title: "No distingo los colores",
    hint: "Acromatopsia: veo en tonos de gris.",
    swatches: ["#555555", "#bbbbbb"],
  },
];

// Ajustes que la persona puede cambiar a mano, con sus opciones.
export const OPTIONS = {
  theme: {
    label: "Colores de la página",
    choices: [
      ["light", "☀️ Claro"],
      ["dark", "🌙 Oscuro"],
      ["contrast", "◐ Alto contraste"],
    ],
  },
  font: {
    label: "Tipo de letra",
    choices: [
      ["atkinson", "Normal"],
      ["lexend", "Lexend"],
      ["dyslexic", "OpenDyslexic"],
    ],
  },
  spacing: {
    label: "Espacio entre letras y líneas",
    choices: [
      ["normal", "Normal"],
      ["wide", "Más espacio"],
    ],
  },
  tint: {
    label: "Color del fondo",
    choices: [
      ["none", "Blanco"],
      ["cream", "Crema"],
    ],
  },
  cvd: {
    label: "Colores para daltonismo",
    choices: [
      ["none", "Colores normales"],
      ["redgreen", "Rojo y verde"],
      ["blueyellow", "Azul y amarillo"],
      ["mono", "Sin colores"],
    ],
  },
  calm: {
    label: "Modo calma",
    choices: [
      [false, "No"],
      [true, "Sí: colores suaves"],
    ],
  },
  motion: {
    label: "Movimiento",
    choices: [
      ["normal", "Normal"],
      ["reduce", "Sin animaciones"],
    ],
  },
  targets: {
    label: "Tamaño de los botones",
    choices: [
      ["normal", "Normales"],
      ["big", "Grandes"],
    ],
  },
  reader: {
    label: "Lectura en voz alta",
    choices: [
      ["off", "Desactivada"],
      ["button", "Botón «Escuchar»"],
      ["tap", "Leer lo que toco"],
    ],
  },
  rate: {
    label: "Velocidad de la voz",
    choices: [
      [0.7, "Muy lenta"],
      [0.85, "Lenta"],
      [1, "Normal"],
      [1.2, "Rápida"],
    ],
  },
  autoRead: {
    label: "Leer cada página al entrar",
    choices: [
      [false, "No"],
      [true, "Sí"],
    ],
  },
};

export const SCALE_MIN = 0.9;
export const SCALE_MAX = 1.6;

const READER_RANK = { off: 0, button: 1, tap: 2 };

// Junta los ajustes de varias necesidades. Si dos chocan, gana el que más ayuda
// (la letra más grande, la lectura más completa).
export function prefsFromNeeds(needs, cvdType, current = DEFAULT_PREFS) {
  const p = {
    ...DEFAULT_PREFS,
    theme: current.theme === "contrast" ? "light" : current.theme,
    rate: current.rate,
    needs: [...needs],
    configured: true,
    bannerDismissed: true,
  };
  for (const id of needs) {
    const need = NEEDS.find((n) => n.id === id);
    if (!need) continue;
    for (const [k, v] of Object.entries(need.preset)) {
      if (k === "scale") p.scale = Math.max(p.scale, v);
      else if (k === "reader") p.reader = READER_RANK[v] > READER_RANK[p.reader] ? v : p.reader;
      else p[k] = v;
    }
  }
  if (needs.includes("color")) p.cvd = cvdType || "redgreen";
  return p;
}

// Lista en palabras de lo que está cambiado respecto a la página normal.
export function describePrefs(p) {
  const out = [];
  if (p.scale !== DEFAULT_PREFS.scale) out.push(`Tamaño de letra: ${Math.round(p.scale * 100)} %`);
  for (const [key, opt] of Object.entries(OPTIONS)) {
    if (key === "rate" && p.reader === "off") continue;
    if (key === "autoRead" && p.reader === "off") continue;
    if (p[key] === DEFAULT_PREFS[key]) continue;
    const choice = opt.choices.find(([v]) => v === p[key]);
    // Quita el emoji del principio ("☀️ Claro" → "Claro").
    if (choice) out.push(`${opt.label}: ${choice[1].replace(/^[^\p{L}\d]+/u, "")}`);
  }
  return out;
}

// Mezcla lo guardado con los valores por defecto (por si se añaden ajustes nuevos).
export function normalizePrefs(stored) {
  const p = { ...DEFAULT_PREFS, ...(stored && typeof stored === "object" ? stored : {}) };
  p.scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, Number(p.scale) || 1));
  return p;
}

// Pone los atributos en <html>. El CSS hace el resto.
export function applyPrefs(p, root = document.documentElement) {
  for (const k of ATTR_KEYS) root.dataset[k] = String(p[k]);
  root.dataset.calm = p.calm ? "1" : "0";
  root.style.setProperty("--font-scale", String(p.scale));
}

// Script que se ejecuta antes de pintar la página, para que no "parpadee" con los
// colores por defecto. Lee también los ajustes antiguos (star:theme, star:scale).
export const INIT_SCRIPT = `(function(){try{
var D=${JSON.stringify(DEFAULT_PREFS)},K=${JSON.stringify(ATTR_KEYS)},r=document.documentElement,p=null;
try{p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_KEY)}));}catch(e){}
if(!p||typeof p!=="object"){p={};try{var t=localStorage.getItem("star:theme"),s=localStorage.getItem("star:scale");if(t)p.theme=JSON.parse(t);if(s)p.scale=JSON.parse(s);}catch(e){}}
for(var k in D){if(p[k]===undefined)p[k]=D[k];}
for(var i=0;i<K.length;i++){r.setAttribute("data-"+K[i],String(p[K[i]]));}
r.setAttribute("data-calm",p.calm?"1":"0");
var sc=Math.min(${SCALE_MAX},Math.max(${SCALE_MIN},Number(p.scale)||1));r.style.setProperty("--font-scale",String(sc));
}catch(e){}})();`;
