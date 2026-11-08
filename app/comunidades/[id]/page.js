import Link from "next/link";
import { notFound } from "next/navigation";
import EventCard from "@/components/EventCard";
import JoinButton from "@/components/JoinButton";
import { communities, events } from "@/lib/data";

export function generateStaticParams() {
  return communities.map((c) => ({ id: c.id }));
}

export default function Comunidad({ params }) {
  const c = communities.find((x) => x.id === params.id);
  if (!c) notFound();
  const related = events.filter((e) => e.communityId === c.id);

  return (
    <>
      <p>
        <Link href="/comunidades">← Volver a grupos</Link>
      </p>
      <div className="card-emoji" aria-hidden="true">
        {c.emoji}
      </div>
      <h1>{c.name}</h1>
      <p>{c.description}</p>
      <p className="muted">👤 {c.members} personas</p>
      <div className="card-actions" style={{ marginBottom: "1.5rem" }}>
        <JoinButton id={c.id} name={c.name} />
        <Link className="btn" href={`/chat/${c.id}`}>
          💬 Ir al chat del grupo
        </Link>
      </div>

      <h2>Eventos de este grupo</h2>
      {related.length ? (
        <div className="grid">
          {related.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <p className="muted">Todavía no hay eventos. ¡Pronto habrá!</p>
      )}
    </>
  );
}
