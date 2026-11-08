"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/PrefsProvider";
import {
  CVD_TYPES,
  NEEDS,
  OPTIONS,
  SCALE_MAX,
  SCALE_MIN,
  describePrefs,
  prefsFromNeeds,
} from "@/lib/prefs";

const FONT_FAMILY = {
  atkinson: '"Atkinson Hyperlegible", sans-serif',
  lexend: '"Lexend", sans-serif',
  dyslexic: '"OpenDyslexic", sans-serif',
};

function OptionGroup({ name, value, onChange, hint, chipStyle }) {
  const opt = OPTIONS[name];
  return (
    <fieldset className="option-group">
      <legend>{opt.label}</legend>
      {hint && <p className="muted" style={{ margin: "0 0 0.35rem", fontSize: "0.85rem" }}>{hint}</p>}
      <div className="chips">
        {opt.choices.map(([v, label]) => (
          <button
            key={String(v)}
            type="button"
            className="chip"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            style={chipStyle ? chipStyle(v) : undefined}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Adaptar() {
  const { prefs, setPrefs, resetPrefs, ready } = usePrefs();
  const [needs, setNeeds] = useState([]);
  const [cvd, setCvd] = useState("redgreen");
  const [applied, setApplied] = useState(false);
  const summaryRef = useRef(null);
  const loaded = useRef(false);

  // Al entrar, se marcan las necesidades que ya estaban guardadas.
  useEffect(() => {
    if (!ready || loaded.current) return;
    loaded.current = true;
    setNeeds(prefs.needs || []);
    if (prefs.cvd !== "none") setCvd(prefs.cvd);
  }, [ready, prefs.needs, prefs.cvd]);

  useEffect(() => {
    if (applied) summaryRef.current?.focus();
  }, [applied]);

  if (!ready) return <h1>⚙️ Adaptar la página</h1>;

  const toggleNeed = (id) =>
    setNeeds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const apply = () => {
    setPrefs(prefsFromNeeds(needs, cvd, prefs));
    setApplied(true);
  };

  // Un cambio a mano se aplica en el momento.
  const change = (key) => (value) => {
    setApplied(false);
    setPrefs({ [key]: value, configured: true, bannerDismissed: true });
  };

  const changeScale = (delta) =>
    change("scale")(Math.min(SCALE_MAX, Math.max(SCALE_MIN, +(prefs.scale + delta).toFixed(2))));

  const reset = () => {
    resetPrefs();
    setNeeds([]);
    setApplied(false);
  };

  const changes = describePrefs(prefs);

  return (
    <>
      <h1>⚙️ Adaptar la página</h1>
      <p className="muted">
        La página puede cambiar para que te resulte más fácil. Estos cambios son solo para ti y se
        guardan en este dispositivo.
      </p>

      {/* 1. Necesidades */}
      <section aria-labelledby="needs-title" style={{ marginBottom: "1.5rem" }}>
        <h2 id="needs-title">1. ¿Qué te pasa al usar la pantalla?</h2>
        <p className="muted">Puedes elegir varias. Luego pulsa «Adaptar».</p>

        <div className="need-grid">
          {NEEDS.map((n) => {
            const on = needs.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                className="need-card"
                aria-pressed={on}
                onClick={() => toggleNeed(n.id)}
              >
                <span className="need-emoji" aria-hidden="true">
                  {n.emoji}
                </span>
                <span>{n.title}</span>
                {on && (
                  <span className="need-check" aria-hidden="true">
                    ✅
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {needs.includes("color") && (
          <div role="group" aria-labelledby="cvd-title">
            <p id="cvd-title" className="filter-label">
              ¿Qué colores confundes?
            </p>
            <div className="cvd-choice">
              {CVD_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="cvd-option"
                  aria-pressed={cvd === t.id}
                  onClick={() => setCvd(t.id)}
                >
                  <span className="swatches" aria-hidden="true">
                    {t.swatches.map((c) => (
                      <span key={c} className="swatch" style={{ background: c }} />
                    ))}
                  </span>
                  <span>
                    <strong>{t.title}</strong>
                    <small>{t.hint}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="button" className="btn btn-primary" onClick={apply}>
          ✅ Adaptar la página
        </button>

        {applied && (
          <div className="notice" role="status" style={{ marginTop: "1rem" }}>
            <p ref={summaryRef} tabIndex={-1} style={{ margin: 0, fontWeight: 800 }}>
              {changes.length ? "¡Listo! Así queda la página:" : "La página está como siempre."}
            </p>
            {changes.length > 0 && (
              <ul className="changes">
                {changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            {prefs.reader === "tap" && (
              <p style={{ margin: "0.5rem 0 0" }}>
                🔊 Ahora, cuando toques algo, la página te lo leerá en voz alta.
              </p>
            )}
          </div>
        )}
      </section>

      {/* 2. Ajustes a mano */}
      <section aria-labelledby="manual-title" className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 id="manual-title">2. Ajustar a mano</h2>
        <p className="muted">Los cambios se ven al momento.</p>

        <fieldset className="option-group">
          <legend>Tamaño de la letra</legend>
          <div className="scale-row">
            <button
              type="button"
              className="btn btn-small"
              onClick={() => changeScale(-0.1)}
              disabled={prefs.scale <= SCALE_MIN}
              aria-label="Letra más pequeña"
            >
              A−
            </button>
            <span className="scale-value" aria-live="polite">
              {Math.round(prefs.scale * 100)} %
            </span>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => changeScale(0.1)}
              disabled={prefs.scale >= SCALE_MAX}
              aria-label="Letra más grande"
            >
              A+
            </button>
          </div>
        </fieldset>

        <OptionGroup name="theme" value={prefs.theme} onChange={change("theme")} />
        <OptionGroup
          name="font"
          value={prefs.font}
          onChange={change("font")}
          hint="Cada botón está escrito con su letra, para que veas cómo queda."
          chipStyle={(v) => ({ fontFamily: FONT_FAMILY[v] })}
        />
        <OptionGroup name="spacing" value={prefs.spacing} onChange={change("spacing")} />
        <OptionGroup
          name="tint"
          value={prefs.tint}
          onChange={change("tint")}
          hint={prefs.theme !== "light" ? "Solo se nota con los colores claros." : undefined}
        />
        <OptionGroup
          name="cvd"
          value={prefs.cvd}
          onChange={change("cvd")}
          hint={prefs.theme === "contrast" ? "Con alto contraste ya se usan solo blanco, negro y amarillo." : undefined}
        />
        <OptionGroup name="calm" value={prefs.calm} onChange={change("calm")} />
        <OptionGroup name="motion" value={prefs.motion} onChange={change("motion")} />
        <OptionGroup name="targets" value={prefs.targets} onChange={change("targets")} />
        <OptionGroup
          name="reader"
          value={prefs.reader}
          onChange={change("reader")}
          hint="«Leer lo que toco» lee en voz alta cada cosa que tocas. Si ya usas VoiceOver o TalkBack, no lo actives: hablarían los dos a la vez."
        />
        {prefs.reader !== "off" && (
          <>
            <OptionGroup name="rate" value={prefs.rate} onChange={change("rate")} />
            <OptionGroup name="autoRead" value={prefs.autoRead} onChange={change("autoRead")} />
          </>
        )}
      </section>

      {/* 3. Vista previa */}
      <section aria-labelledby="preview-title" style={{ marginBottom: "1.5rem" }}>
        <h2 id="preview-title">3. Así se ve</h2>
        <div className="preview">
          <p style={{ margin: 0 }}>
            <span className="tag">Música</span> <span className="badge badge-official">✔ Oficial</span>{" "}
            <span className="badge">✔ Ya se celebró</span>
          </p>
          <p style={{ margin: 0 }}>
            Esto es un texto de ejemplo para que veas cómo se lee con tus ajustes. ¿Se lee bien?
          </p>
          <div className="card-actions" style={{ paddingTop: 0 }}>
            <span className="btn btn-primary" aria-hidden="true">
              ➕ Unirme
            </span>
            <span className="btn btn-ok" aria-hidden="true">
              ✅ Ya estoy aquí
            </span>
            <span className="btn call-btn" aria-hidden="true">
              📞 Llamar
            </span>
          </div>
          <div className="sos-btn" style={{ minHeight: 64, fontSize: "1.2rem" }} aria-hidden="true">
            🆘 SOS (ejemplo)
          </div>
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
            Los botones de este ejemplo no hacen nada.
          </p>
        </div>
      </section>

      {/* 4. Volver a lo normal */}
      <section aria-labelledby="reset-title">
        <h2 id="reset-title">4. Volver a la página normal</h2>
        <p className="muted">Quita todos los cambios. Puedes volver a adaptarla cuando quieras.</p>
        <button type="button" className="btn" onClick={reset}>
          ↩️ Quitar todos los cambios
        </button>
      </section>
    </>
  );
}
