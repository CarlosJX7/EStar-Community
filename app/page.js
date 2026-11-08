import Link from "next/link";
import AdaptBanner from "@/components/AdaptBanner";
import NextEvent from "@/components/NextEvent";

export default function Home() {
  return (
    <>
      <AdaptBanner />
      <section className="hero">
        <h1>¡Hola! Aquí no estás solo 👋</h1>
        <p>
          Encuentra grupos con tus mismos gustos, eventos cerca de ti y personas que quieren ser tus
          amigos.
        </p>
      </section>

      <nav className="big-links" aria-label="Qué quieres hacer">
        <Link className="big-link" href="/comunidades">
          <span aria-hidden="true">👥</span>Buscar grupos
        </Link>
        <Link className="big-link" href="/eventos">
          <span aria-hidden="true">📅</span>Ver eventos
        </Link>
        <Link className="big-link" href="/asociaciones">
          <span aria-hidden="true">🤝</span>Pedir ayuda
        </Link>
        <Link className="big-link" href="/chat">
          <span aria-hidden="true">💬</span>Hablar con amigos
        </Link>
        <Link className="big-link" href="/perfil">
          <span aria-hidden="true">🆘</span>Mi perfil y SOS
        </Link>
      </nav>

      <h2>Próximo evento</h2>
      <NextEvent />
    </>
  );
}
