"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Server and the very first client render must match exactly, so neither
  // can know yet whether the blocking script (which runs before hydration,
  // outside React) landed on light or dark. `mounted` renders a neutral
  // placeholder for that one frame; only after mount do we read the real
  // state and swap to the correct icon, entirely post-hydration.
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // One-time read of client-only DOM state right after mount (see comment
    // above); not a loop, so the cascading-render concern this rule guards
    // against doesn't apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("escala-theme", next ? "dark" : "light");
    } catch {
      // Private browsing or storage disabled: theme just won't persist.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white ${className}`}
    >
      {mounted ? (
        isDark ? (
          <Sun size={15} />
        ) : (
          <Moon size={15} />
        )
      ) : (
        <span className="block h-[15px] w-[15px]" />
      )}
    </button>
  );
}
