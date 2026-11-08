"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { OPTIONS } from "@/lib/prefs";
import { collectBlocks } from "@/lib/reader";
import {
  cancelSpeech,
  claimVoice,
  makeUtterance,
  onVoiceClaimed,
  onVoices,
  prefersReducedMotion,
  speechSupported,
} from "@/lib/speech";
import { usePrefs } from "./PrefsProvider";

const ME = "page";

// Botón «Escuchar»: lee la página entera, bloque a bloque.
// Solo aparece si la persona activó la lectura en voz alta.
export default function AudioReader() {
  const pathname = usePathname();
  const { prefs, setPrefs } = usePrefs();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | playing | paused
  const [supported, setSupported] = useState(true);
  const [noSpanish, setNoSpanish] = useState(false);
  const [message, setMessage] = useState("");

  const queue = useRef([]);
  const index = useRef(0);
  const gen = useRef(0); // invalida lecturas anteriores cuando cancelamos
  const rateRef = useRef(prefs.rate);
  const marked = useRef(null);

  useEffect(() => {
    rateRef.current = prefs.rate;
  }, [prefs.rate]);

  useEffect(() => {
    if (!speechSupported()) {
      setSupported(false);
      return;
    }
    return onVoices((hasSpanish) => setNoSpanish(!hasSpanish));
  }, []);

  const unmark = () => {
    marked.current?.classList.remove("reading");
    marked.current = null;
  };

  const halt = useCallback(() => {
    gen.current += 1;
    cancelSpeech();
    unmark();
  }, []);

  // Si otra parte de la página empieza a hablar (por ejemplo, al tocar algo), nos pausamos.
  useEffect(
    () =>
      onVoiceClaimed((who) => {
        if (who === ME) return;
        gen.current += 1;
        unmark();
        setStatus((s) => (s === "playing" ? "paused" : s));
      }),
    []
  );

  const speakFrom = useCallback(
    (start) => {
      halt();
      claimVoice(ME);
      const myGen = gen.current;
      index.current = Math.max(0, Math.min(start, queue.current.length));

      const next = () => {
        if (gen.current !== myGen) return;
        const item = queue.current[index.current];
        if (!item) {
          unmark();
          index.current = 0;
          setStatus("idle");
          setMessage("Terminé de leer la página.");
          return;
        }
        if (marked.current !== item.el) {
          unmark();
          item.el.classList.add("reading");
          item.el.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
          marked.current = item.el;
        }
        const u = makeUtterance(item.text, rateRef.current);
        const advance = () => {
          if (gen.current !== myGen) return;
          index.current += 1;
          next();
        };
        u.onend = advance;
        u.onerror = (e) => {
          if (gen.current !== myGen) return;
          if (e.error === "canceled" || e.error === "interrupted") return;
          if (e.error === "not-allowed") {
            // El navegador no deja hablar hasta que la persona toque la página.
            gen.current += 1;
            unmark();
            setStatus("paused");
            setMessage("Pulsa «Seguir» para empezar a escuchar.");
            return;
          }
          advance();
        };
        window.speechSynthesis.speak(u);
      };

      setStatus("playing");
      setMessage("");
      next();
    },
    [halt]
  );

  const start = useCallback(() => {
    const root = document.getElementById("contenido");
    queue.current = root ? collectBlocks(root) : [];
    if (!queue.current.length) {
      setMessage("No hay nada que leer en esta página.");
      setStatus("idle");
      return;
    }
    speakFrom(0);
  }, [speakFrom]);

  const stop = useCallback(() => {
    halt();
    index.current = 0;
    setStatus("idle");
    setMessage("");
  }, [halt]);

  const pause = () => {
    halt();
    setStatus("paused");
  };

  // Al cambiar de página: se para y, si la persona lo pidió, empieza a leer la nueva.
  const autoRead = prefs.autoRead;
  useEffect(() => {
    stop();
    if (!autoRead) {
      setOpen(false);
      return;
    }
    setOpen(true);
    const t = setTimeout(start, 600); // deja que la página termine de pintarse
    return () => clearTimeout(t);
  }, [pathname, autoRead, stop, start]);

  useEffect(() => () => halt(), [halt]);

  // Si cambias la velocidad leyendo, se aplica ya, repitiendo el trozo actual.
  const changeRate = (r) => {
    rateRef.current = r;
    setPrefs({ rate: r });
    if (status === "playing") speakFrom(index.current);
  };

  const toggle = () => {
    if (open) {
      stop();
      setOpen(false);
    } else {
      setOpen(true);
      start();
    }
  };

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-small"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="lector"
        aria-label={open ? "Cerrar lectura en voz alta" : "Escuchar esta página en voz alta"}
        data-no-tap
      >
        <span aria-hidden="true">🔊</span> Escuchar
      </button>

      {open && (
        <section id="lector" className="reader" aria-label="Lectura en voz alta" data-no-tap>
          <div className="reader-row">
            <button
              type="button"
              className="btn btn-small"
              onClick={() => speakFrom(index.current - 1)}
              aria-label="Bloque anterior"
              disabled={status === "idle"}
            >
              ⏮
            </button>
            {status === "playing" ? (
              <button type="button" className="btn btn-primary" onClick={pause}>
                ⏸ Pausa
              </button>
            ) : status === "paused" ? (
              <button type="button" className="btn btn-primary" onClick={() => speakFrom(index.current)}>
                ▶ Seguir
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={start}>
                ▶ Escuchar
              </button>
            )}
            <button
              type="button"
              className="btn btn-small"
              onClick={() => speakFrom(index.current + 1)}
              aria-label="Bloque siguiente"
              disabled={status === "idle"}
            >
              ⏭
            </button>
            <button type="button" className="btn btn-small" onClick={stop} aria-label="Parar" disabled={status === "idle"}>
              ⏹
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => {
                stop();
                setOpen(false);
              }}
              aria-label="Cerrar lector"
            >
              ✕
            </button>
          </div>

          <div className="reader-row" role="group" aria-label="Velocidad de lectura">
            <span className="reader-label">Velocidad:</span>
            {OPTIONS.rate.choices.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className="chip chip-small"
                aria-pressed={prefs.rate === value}
                onClick={() => changeRate(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {message && (
            <p className="reader-msg" role="status">
              {message}
            </p>
          )}
          {noSpanish && (
            <p className="reader-msg" role="note">
              ⚠️ Este dispositivo no tiene una voz en español instalada, así que puede sonar raro. Se
              instala en los ajustes de voz del sistema.
            </p>
          )}
        </section>
      )}
    </>
  );
}
