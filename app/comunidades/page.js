"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import JoinButton from "@/components/JoinButton";
import { communities } from "@/lib/data";
import { useJoined } from "@/lib/store";

// Quita tildes y mayúsculas para que "musica" encuentre "Música".
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const allTopics = [...new Set(communities.flatMap((c) => c.topics))].sort((a, b) => a.localeCompare(b, "es"));

export default function Comunidades() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(null);
  const [onlyMine, setOnlyMine] = useState(false);
  const { joined, ready } = useJoined();

  const results = useMemo(() => {
    const q = norm(query);
    return communities.filter((c) => {
      if (topic && !c.topics.includes(topic)) return false;
      if (onlyMine && !joined.includes(c.id)) return false;
      if (!q) return true;
      return norm([c.name, c.description, ...c.topics].join(" ")).includes(q);
    });
  }, [query, topic, onlyMine, joined]);

  const filtering = query.trim() !== "" || topic !== null || onlyMine;
  const clearAll = () => {
    setQuery("");
    setTopic(null);
    setOnlyMine(false);
  };

  return (
    <>
      <h1>👥 Grupos</h1>
      <p className="muted">Elige un grupo que te guste y únete. Puedes salir cuando quieras.</p>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="buscar" className="filter-label" style={{ display: "block" }}>
          Buscar un grupo
        </label>
        <div className="search">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            id="buscar"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Por ejemplo: música, mascotas, cocina…"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Borrar búsqueda">
              ✕
            </button>
          )}
        </div>
      </form>

      <div role="group" aria-labelledby="temas-label">
        <p id="temas-label" className="filter-label">
          Temas
        </p>
        <div className="chips">
          <button type="button" className="chip" aria-pressed={topic === null} onClick={() => setTopic(null)}>
            Todos
          </button>
          {allTopics.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="chips">
        <button
          type="button"
          className="chip"
          aria-pressed={onlyMine}
          onClick={() => setOnlyMine((v) => !v)}
        >
          ✅ Solo mis grupos{ready && joined.length > 0 ? ` (${joined.length})` : ""}
        </button>
        {filtering && (
          <button type="button" className="chip" onClick={clearAll}>
            🧹 Quitar filtros
          </button>
        )}
      </div>

      <p className="results-count" role="status" aria-live="polite">
        {results.length === 0
          ? "No encontramos grupos"
          : results.length === 1
            ? "1 grupo encontrado"
            : `${results.length} grupos encontrados`}
      </p>

      {results.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: "3rem", margin: 0 }} aria-hidden="true">
            🔎
          </p>
          <h2>{onlyMine && !query && !topic ? "Aún no estás en ningún grupo" : "No hay grupos con esa búsqueda"}</h2>
          <p>Prueba con otra palabra o quita los filtros.</p>
          <button type="button" className="btn btn-primary" onClick={clearAll}>
            Ver todos los grupos
          </button>
        </div>
      ) : (
        <div className="grid">
          {results.map((c) => (
            <article key={c.id} className="card" style={{ borderColor: c.color }}>
              <div className="card-emoji" aria-hidden="true">
                {c.emoji}
              </div>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <p className="muted">
                {c.topics.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
                <br />
                👤 {c.members} personas
              </p>
              <div className="card-actions">
                <JoinButton id={c.id} name={c.name} />
                <Link className="btn" href={`/comunidades/${c.id}`} aria-label={`Ver más sobre ${c.name}`}>
                  Ver más
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
