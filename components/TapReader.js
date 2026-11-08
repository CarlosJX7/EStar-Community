"use client";

import { useEffect, useRef } from "react";
import { blockFor, describeElement } from "@/lib/reader";
import { cancelSpeech, claimVoice, makeUtterance, speechSupported } from "@/lib/speech";
import { usePrefs } from "./PrefsProvider";

const ME = "tap";

// «Leer lo que toco»: lee en voz alta lo que la persona toca o enfoca con el teclado.
// No dibuja nada; solo escucha toques y cambios de foco en toda la página.
export default function TapReader() {
  const { prefs } = usePrefs();
  const rateRef = useRef(prefs.rate);

  useEffect(() => {
    rateRef.current = prefs.rate;
  }, [prefs.rate]);

  useEffect(() => {
    if (!speechSupported()) return;
    let last = { el: null, at: 0 };
    let marked = null;

    const unmark = () => {
      marked?.classList.remove("reading");
      marked = null;
    };

    const handle = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      // Los controles del propio lector no se leen (si no, se interrumpiría solo).
      if (target.closest("[data-no-tap]")) return;
      const el = blockFor(target);
      if (!el) return;

      // Un toque provoca "foco" y luego "clic": se lee una sola vez.
      const now = Date.now();
      if (last.el === el && now - last.at < 800) return;
      last = { el, at: now };

      const text = describeElement(el);
      if (!text) return;

      claimVoice(ME);
      cancelSpeech();
      unmark();
      el.classList.add("reading");
      marked = el;

      const u = makeUtterance(text, rateRef.current);
      u.onend = () => {
        if (marked === el) unmark();
      };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
    };

    document.addEventListener("focusin", handle, true);
    document.addEventListener("click", handle, true);
    return () => {
      document.removeEventListener("focusin", handle, true);
      document.removeEventListener("click", handle, true);
      cancelSpeech();
      unmark();
    };
  }, []);

  return null;
}
