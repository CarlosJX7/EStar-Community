"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { events, isPast, todayISO } from "@/lib/data";
import EventCard from "./EventCard";

// Muestra el evento más próximo; si ya no queda ninguno, el más reciente.
export default function NextEvent() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const today = todayISO();
    const upcoming = events.filter((e) => !isPast(e, today)).sort((a, b) => a.date.localeCompare(b.date));
    const recent = events.filter((e) => isPast(e, today)).sort((a, b) => b.date.localeCompare(a.date));
    setEvent(upcoming[0] || recent[0] || null);
  }, []);

  if (!event) return null;
  return (
    <>
      <div className="grid">
        <EventCard event={event} />
      </div>
      <p>
        <Link href="/eventos">Ver todos los eventos →</Link>
      </p>
    </>
  );
}
