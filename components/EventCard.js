"use client";

import { useEffect, useState } from "react";
import { communities, formatRange, isPast, todayISO } from "@/lib/data";
import GoingButton from "./GoingButton";

export default function EventCard({ event }) {
  const community = communities.find((c) => c.id === event.communityId);
  // Se calcula en el navegador para que "ya se celebró" nunca quede desfasado.
  const [past, setPast] = useState(null);
  useEffect(() => setPast(isPast(event, todayISO())), [event]);

  return (
    <article className="card">
      <div className="card-emoji" aria-hidden="true">
        {event.emoji}
      </div>
      <p style={{ margin: 0 }}>
        {past === true && <span className="badge">✔ Ya se celebró</span>}
        {past === false && <span className="badge badge-official">📅 Próximamente</span>}
        {event.unconfirmed && (
          <>
            {" "}
            <span className="badge">⚠️ Fechas por confirmar</span>
          </>
        )}
      </p>
      <h2>{event.title}</h2>
      <p>
        <strong>📅 {formatRange(event.date, event.endDate)}</strong>
        <br />
        📍 {event.place}
        <br />
        🤝 {event.organizer}
      </p>
      <p>{event.description}</p>
      <p className="muted">{community && <span className="tag">{community.name}</span>}</p>
      <div className="card-actions">
        {past === false && <GoingButton id={event.id} title={event.title} />}
        <a className="btn" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
          🔗 Ver fuente: {event.sourceName}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </article>
  );
}
