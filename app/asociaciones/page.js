"use client";

import { useRef, useState } from "react";
import { associations, portalTabs, portals } from "@/lib/data";

const telHref = (n) => "tel:" + (n.length > 3 ? "+34" : "") + n.replace(/\s/g, "");
const host = (url) => new URL(url).hostname.replace(/^www\./, "");

function AssociationCard({ a }) {
  return (
    <article className="card">
      <div className="logo-box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.logo} alt={`Logo de ${a.name}`} />
      </div>
      <h2>{a.name}</h2>
      <p>{a.description}</p>
      <p>
        {a.focus.map((f) => (
          <span key={f} className="tag">
            {f}
          </span>
        ))}
      </p>
      <ul className="contact">
        {a.phone && (
          <li>
            📞 <a href={telHref(a.phone)}>{a.phone}</a>
          </li>
        )}
        {a.phone2 && (
          <li>
            📱 <a href={telHref(a.phone2)}>{a.phone2}</a>
          </li>
        )}
        {a.email && (
          <li>
            ✉️ <a href={`mailto:${a.email}`}>{a.email}</a>
          </li>
        )}
        {a.address && <li>📍 {a.address}</li>}
        {a.hours && <li>🕒 {a.hours}</li>}
      </ul>
      <div className="card-actions">
        <a className="btn btn-primary" href={a.web} target="_blank" rel="noopener noreferrer">
          🌐 Visitar su web
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </article>
  );
}

function PortalCard({ p }) {
  return (
    <article className={`card ${p.urgent ? "card-urgent" : ""}`}>
      <div className="card-emoji" aria-hidden="true">
        {p.emoji}
      </div>
      {p.first && <span className="tag">👉 Empieza aquí</span>}
      <h2>{p.name}</h2>
      <p className="muted" style={{ marginBottom: 0 }}>
        <span className={`badge ${p.kind === "oficial" ? "badge-official" : ""}`}>
          {p.kind === "oficial" ? "✔ Oficial" : "Entidad de referencia"}
        </span>{" "}
        {p.org}
      </p>
      <p>{p.description}</p>
      <div className="card-actions">
        {p.phone && (
          <a className="btn btn-primary" href={telHref(p.phone)}>
            📞 Llamar al {p.phone}
          </a>
        )}
        <a
          className={`btn ${p.phone ? "" : "btn-primary"}`}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          🌐 Abrir {host(p.url)}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </article>
  );
}

export default function Asociaciones() {
  const [active, setActive] = useState("asociaciones");
  const tabRefs = useRef({});

  function onKeyDown(e, index) {
    let next = null;
    if (e.key === "ArrowRight") next = (index + 1) % portalTabs.length;
    if (e.key === "ArrowLeft") next = (index - 1 + portalTabs.length) % portalTabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = portalTabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = portalTabs[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  const section = portals[active];

  return (
    <>
      <h1>🤝 Ayuda y asociaciones</h1>
      <p className="muted">Elige una pestaña para encontrar lo que necesitas.</p>

      <div className="tabs" role="tablist" aria-label="Secciones de ayuda">
        {portalTabs.map((t, i) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            ref={(el) => (tabRefs.current[t.id] = el)}
            role="tab"
            type="button"
            className="tab"
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0}>
        {active === "asociaciones" ? (
          <>
            <p className="muted">
              Son organizaciones reales de España que te pueden acompañar y ayudar. Puedes llamarles
              o escribirles. Cada una tiene asociaciones locales en tu ciudad: pregunta por la más
              cercana a ti.
            </p>
            <div className="grid">
              {associations.map((a) => (
                <AssociationCard key={a.id} a={a} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="muted">{section.intro}</p>
            <div className="grid">
              {section.items.map((p) => (
                <PortalCard key={p.id} p={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
