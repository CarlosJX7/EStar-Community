"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { events, isPast, todayISO } from "@/lib/data";

const filters = [
  { id: "todos", label: "Todos", emoji: "📅" },
  { id: "proximos", label: "Próximos", emoji: "⏭️" },
  { id: "pasados", label: "Ya celebrados", emoji: "✔" },
];

export default function Eventos() {
  const [filter, setFilter] = useState("todos");
  const [today, setToday] = useState(null);
  useEffect(() => setToday(todayISO()), []);

  const upcoming = today ? events.filter((e) => !isPast(e, today)) : [];
  const past = today ? events.filter((e) => isPast(e, today)) : events;

  // Primero los próximos (los más cercanos arriba) y después los pasados (los más recientes arriba).
  const sortedUpcoming = [...upcoming].sort((a, b) => a.date.localeCompare(b.date));
  const sortedPast = [...past].sort((a, b) => b.date.localeCompare(a.date));
  const list =
    filter === "proximos" ? sortedUpcoming : filter === "pasados" ? sortedPast : [...sortedUpcoming, ...sortedPast];

  return (
    <>
      <h1>📅 Eventos</h1>
      <p className="muted">
        Eventos reales por la inclusión en España. Algunos ya pasaron: sirven para que veas qué se hace
        y cómo puedes participar la próxima vez.
      </p>

      <div className="tabs" role="group" aria-label="Filtrar eventos">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className="tab"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            <span aria-hidden="true">{f.emoji}</span> {f.label}
          </button>
        ))}
      </div>

      {today && list.length === 0 ? (
        <div className="empty">
          <p>No hay eventos en esta lista.</p>
        </div>
      ) : (
        <div className="grid">
          {list.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      <p className="notice" role="note" style={{ marginTop: "1.5rem" }}>
        ℹ️ Cada evento tiene un enlace a la fuente donde lo comprobamos. Antes de ir a uno, confirma
        la fecha y el lugar con quien lo organiza.
      </p>
    </>
  );
}
