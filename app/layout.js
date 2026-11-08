import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import "@fontsource/lexend/latin-400.css";
import "@fontsource/lexend/latin-700.css";
import "@fontsource/opendyslexic/latin-400.css";
import "@fontsource/opendyslexic/latin-700.css";
import "./globals.css";
import "./adapt.css";
import { PrefsProvider } from "@/components/PrefsProvider";
import Shell from "@/components/Shell";
import { INIT_SCRIPT } from "@/lib/prefs";

export const metadata = {
  title: "STAR — Nunca estás solo",
  description:
    "Una plataforma sencilla para encontrar comunidades, eventos y asociaciones, y hacer amigos.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    // Los atributos de <html> los pone el script antes de pintar, según las necesidades guardadas.
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body>
        <PrefsProvider>
          <Shell>{children}</Shell>
        </PrefsProvider>
      </body>
    </html>
  );
}
