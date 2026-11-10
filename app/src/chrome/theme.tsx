import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(Ctx);

/** Light by default; dark follows the system scheme. A press on the switch lasts for this load only: a reload starts from the system scheme again. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"));
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // The switch cross-fades the page with a view transition; under reduced motion (or without the API) it simply swaps.
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const swap = () => { document.documentElement.setAttribute("data-theme", next); setTheme(next); };
    const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (start && !matchMedia("(prefers-reduced-motion: reduce)").matches) start.call(document, () => flushSync(swap));
    else swap();
  };
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
