import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; setTheme: (next: Theme) => void; toggle: () => void }>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});
export const useTheme = () => useContext(Ctx);

/** Light by default; dark follows the system scheme until the person chooses (the pre-paint bootstrap in index.html sets the initial data-theme); the choice is kept in localStorage (guarded), key "theme", and every page of the site reads it. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"));
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // Switching theme cross-fades the page with a view transition; under reduced motion (or without the API) it swaps immediately.
  const setTheme = (next: Theme) => {
    if (next === theme) return;
    const swap = () => {
      document.documentElement.setAttribute("data-theme", next);
      setThemeState(next);
      try { localStorage.setItem("theme", next); } catch { /* private mode: the choice is just not remembered */ }
    };
    const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (start && !matchMedia("(prefers-reduced-motion: reduce)").matches) start.call(document, () => flushSync(swap));
    else swap();
  };
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}
