"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_PREFS, PREFS_KEY, applyPrefs, normalizePrefs } from "@/lib/prefs";

const PrefsContext = createContext({
  prefs: DEFAULT_PREFS,
  setPrefs: () => {},
  resetPrefs: () => {},
  ready: false,
});

function readStored() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return normalizePrefs(JSON.parse(raw));
    // Ajustes de versiones anteriores (botones A−/A+ y modo oscuro).
    const old = {};
    const t = localStorage.getItem("star:theme");
    const s = localStorage.getItem("star:scale");
    if (t) old.theme = JSON.parse(t);
    if (s) old.scale = JSON.parse(s);
    return normalizePrefs(old);
  } catch {
    return normalizePrefs(null);
  }
}

export function PrefsProvider({ children }) {
  const [prefs, setState] = useState(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) applyPrefs(prefs);
  }, [prefs, ready]);

  // Acepta un objeto parcial ({ theme: "dark" }) o una función.
  const setPrefs = useCallback((patch) => {
    setState((prev) => {
      const next = normalizePrefs(typeof patch === "function" ? patch(prev) : { ...prev, ...patch });
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefs({ ...DEFAULT_PREFS, configured: true, bannerDismissed: true });
  }, [setPrefs]);

  return (
    <PrefsContext.Provider value={{ prefs, setPrefs, resetPrefs, ready }}>{children}</PrefsContext.Provider>
  );
}

export const usePrefs = () => useContext(PrefsContext);
