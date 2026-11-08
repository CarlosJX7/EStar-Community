"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { communities, demoPeople, demoReplies, quickPhrases } from "@/lib/data";
import { useMessages } from "@/lib/store";

export default function ChatRoom() {
  const { id } = useParams();
  const community = communities.find((c) => c.id === id);
  const { messages, add, ready } = useMessages(id);
  const [text, setText] = useState("");
  const logRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!community) {
    return (
      <>
        <h1>No encontramos este chat</h1>
        <Link className="btn" href="/chat">
          Volver
        </Link>
      </>
    );
  }

  function send(content) {
    const clean = content.trim().slice(0, 300);
    if (!clean) return;
    add({ from: "me", text: clean });
    setText("");

    // Respuesta simulada: sólo para la demostración del prototipo.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const who = demoPeople[Math.floor(Math.random() * demoPeople.length)];
      const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
      add({ from: who.name, emoji: who.emoji, text: reply });
    }, 1200);
  }

  function report(m) {
    alert(`Gracias por avisar. Un adulto de confianza revisará el mensaje de ${m.from}.`);
  }

  return (
    <div className="chat">
      <p style={{ marginBottom: "0.4rem" }}>
        <Link href="/chat">← Mis chats</Link>
      </p>
      <h1 style={{ fontSize: "1.5rem" }}>
        {community.emoji} {community.name}
      </h1>

      <div className="notice" role="note">
        🛡️ Este es un espacio seguro. Sé amable. Si algo te incomoda, toca “Avisar”. (Demostración: las
        respuestas son simuladas.)
      </div>

      <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-label="Mensajes">
        {ready && messages.length === 0 && (
          <p className="muted">Nadie ha escrito todavía. ¡Saluda tú primero! 👋</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.from === "me" ? "me" : ""}`}>
            {m.from !== "me" && (
              <small>
                {m.emoji} {m.from}
              </small>
            )}
            {m.text}
            {m.from !== "me" && (
              <div>
                <button
                  className="btn btn-small"
                  style={{ marginTop: "0.4rem", minHeight: 36 }}
                  onClick={() => report(m)}
                >
                  🚩 Avisar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="quick" role="group" aria-label="Frases rápidas">
        {quickPhrases.map((p) => (
          <button key={p} className="btn btn-small" onClick={() => send(p)}>
            {p}
          </button>
        ))}
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí…"
          aria-label="Escribe tu mensaje"
          maxLength={300}
        />
        <button className="btn btn-primary" type="submit">
          Enviar ➤
        </button>
      </form>
    </div>
  );
}
