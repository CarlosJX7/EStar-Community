"use client";

import Link from "next/link";
import { communities } from "@/lib/data";
import { useJoined } from "@/lib/store";

export default function ChatList() {
  const { joined, ready } = useJoined();
  const mine = communities.filter((c) => joined.includes(c.id));

  return (
    <>
      <h1>💬 Chat</h1>
      <p className="muted">Habla con las personas de tus grupos.</p>

      {!ready ? null : mine.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: "3rem", margin: 0 }} aria-hidden="true">
            🫶
          </p>
          <h2>Aún no estás en ningún grupo</h2>
          <p>Únete a un grupo para empezar a chatear.</p>
          <Link className="btn btn-primary" href="/comunidades">
            Buscar grupos
          </Link>
        </div>
      ) : (
        <div className="grid">
          {mine.map((c) => (
            <Link key={c.id} href={`/chat/${c.id}`} className="card" style={{ textDecoration: "none" }}>
              <div className="card-emoji" aria-hidden="true">
                {c.emoji}
              </div>
              <h2>{c.name}</h2>
              <p className="muted">Entrar al chat →</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
