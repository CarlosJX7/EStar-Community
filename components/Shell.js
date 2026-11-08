"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AudioReader from "./AudioReader";
import { usePrefs } from "./PrefsProvider";
import TapReader from "./TapReader";

const links = [
  { href: "/", label: "Inicio", emoji: "🏠" },
  { href: "/comunidades", label: "Grupos", emoji: "👥" },
  { href: "/eventos", label: "Eventos", emoji: "📅" },
  { href: "/asociaciones", label: "Ayuda", emoji: "🤝" },
  { href: "/chat", label: "Chat", emoji: "💬" },
];

export default function Shell({ children }) {
  const pathname = usePathname();
  const { prefs, ready } = usePrefs();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const reader = ready ? prefs.reader : "off";

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="logo">
            ⭐ STAR
          </Link>
          <div className="tools" role="group" aria-label="Perfil y accesibilidad">
            <Link
              href="/perfil"
              className="btn btn-small"
              aria-current={pathname.startsWith("/perfil") ? "page" : undefined}
            >
              <span aria-hidden="true">👤</span> Perfil
            </Link>
            <Link
              href="/adaptar"
              className="btn btn-small"
              aria-current={pathname.startsWith("/adaptar") ? "page" : undefined}
              aria-label="Adaptar la página a mis necesidades"
            >
              <span aria-hidden="true">⚙️</span> Adaptar
            </Link>
            {reader !== "off" && <AudioReader />}
          </div>
        </div>
      </header>

      {reader === "tap" && <TapReader />}

      <main id="contenido" className="container">
        {children}
      </main>

      <nav className="nav" aria-label="Principal">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
            <span aria-hidden="true">{l.emoji}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
