"use client";

import { useCallback, useEffect, useState } from "react";

// Guarda datos en el navegador (sin servidor). Es un prototipo.
// Devuelve [valor, setValor, listo]; "listo" evita parpadeos de hidratación.
export function useStored(key, initial) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {}
        return resolved;
      });
    },
    [key]
  );

  return [value, set, ready];
}

export function useJoined() {
  const [joined, setJoined, ready] = useStored("star:joined", []);
  const toggle = (id) =>
    setJoined((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  return { joined, toggle, ready };
}

export function useGoing() {
  const [going, setGoing, ready] = useStored("star:going", []);
  const toggle = (id) =>
    setGoing((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  return { going, toggle, ready };
}

export function useMessages(roomId) {
  const [messages, setMessages, ready] = useStored(`star:chat:${roomId}`, []);
  const add = (msg) => setMessages((list) => [...list, { id: Date.now() + Math.random(), ...msg }]);
  return { messages, add, ready };
}
