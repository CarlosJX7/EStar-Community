"use client";

import { useGoing } from "@/lib/store";

export default function GoingButton({ id, title }) {
  const { going, toggle, ready } = useGoing();
  const isGoing = ready && going.includes(id);
  return (
    <button
      className={`btn ${isGoing ? "btn-ok" : "btn-primary"}`}
      onClick={() => toggle(id)}
      aria-pressed={isGoing}
      aria-label={isGoing ? `No iré a ${title}` : `Quiero ir a ${title}`}
    >
      {isGoing ? "✅ ¡Voy a ir!" : "🙋 Quiero ir"}
    </button>
  );
}
