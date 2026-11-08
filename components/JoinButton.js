"use client";

import { useJoined } from "@/lib/store";

export default function JoinButton({ id, name }) {
  const { joined, toggle, ready } = useJoined();
  const isIn = ready && joined.includes(id);
  return (
    <button
      className={`btn ${isIn ? "btn-ok" : "btn-primary"}`}
      onClick={() => toggle(id)}
      aria-pressed={isIn}
      aria-label={isIn ? `Salir de ${name}` : `Unirme a ${name}`}
    >
      {isIn ? "✅ Ya estoy aquí" : "➕ Unirme"}
    </button>
  );
}
