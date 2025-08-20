import { useEffect, useState } from "react";

function getSystemPrefersDark(): boolean {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", isDark);
}

const STORAGE_KEY = "pl_theme_dark";

export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (saved === "true") return true;
    if (saved === "false") return false;
    return getSystemPrefersDark();
  });

  useEffect(() => {
    applyTheme(isDark);
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {}
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) {
        setIsDark(mq.matches);
      }
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className="btn focus-ring text-sm"
      onClick={() => setIsDark((v) => !v)}
    >
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
