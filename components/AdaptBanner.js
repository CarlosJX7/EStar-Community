"use client";

import Link from "next/link";
import { usePrefs } from "./PrefsProvider";

// Aviso en la portada para quien todavía no ha adaptado la página.
export default function AdaptBanner() {
  const { prefs, setPrefs, ready } = usePrefs();
  if (!ready || prefs.configured || prefs.bannerDismissed) return null;

  return (
    <aside className="adapt-banner" aria-label="Adaptar la página">
      <span style={{ fontSize: "2.2rem" }} aria-hidden="true">
        ⚙️
      </span>
      <p>
        ¿Quieres que la página se adapte a ti? Letra más grande, letra para dislexia, colores para
        daltonismo o que te lea en voz alta.
      </p>
      <Link className="btn btn-primary" href="/adaptar">
        Adaptar la página
      </Link>
      <button type="button" className="btn" onClick={() => setPrefs({ bannerDismissed: true })}>
        Ahora no
      </button>
    </aside>
  );
}
