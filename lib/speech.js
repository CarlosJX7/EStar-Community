// Voz del navegador (Web Speech API), compartida por el botón "Escuchar" y por "Leer lo que toco".

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

let voice = null;
let voicesKnown = false;
let started = false;
const voiceListeners = new Set();

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const es = voices.filter((v) => v.lang.toLowerCase().startsWith("es"));
  voice = es.find((v) => v.lang.toLowerCase() === "es-es") || es[0] || null;
  voicesKnown = true;
  voiceListeners.forEach((fn) => fn(voice !== null));
}

function initVoices() {
  if (started || !speechSupported()) return;
  started = true;
  pickVoice();
  window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
}

// Avisa de si hay voz en español (true/false) cuando el navegador lo sabe.
export function onVoices(fn) {
  initVoices();
  voiceListeners.add(fn);
  if (voicesKnown) fn(voice !== null);
  return () => voiceListeners.delete(fn);
}

export function makeUtterance(text, rate) {
  initVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  if (voice) u.voice = voice;
  u.rate = rate;
  return u;
}

// Solo una fuente habla a la vez. Quien empieza a hablar "reclama" la voz
// y los demás se enteran para pausarse.
let owner = null;
const ownerListeners = new Set();

export function claimVoice(id) {
  if (owner === id) return;
  owner = id;
  ownerListeners.forEach((fn) => fn(id));
}

export function onVoiceClaimed(fn) {
  ownerListeners.add(fn);
  return () => ownerListeners.delete(fn);
}

export function cancelSpeech() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.dataset.motion === "reduce" ||
    document.documentElement.dataset.calm === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
