import { useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/chrome/theme";
import { Masthead } from "@/sections/Masthead";
import { Ledger } from "@/sections/Ledger";
import { Index } from "@/sections/Index";
import { Summary, Experience, Background } from "@/sections/Record";
import { Projects } from "@/sections/Projects";
import { Demos } from "@/sections/Demos";
import { Skills } from "@/sections/Skills";
import { Footer } from "@/sections/Footer";
import { liveDemos } from "@/content";
import { useMediaQuery } from "@/lib/useMediaQuery";

// The apex page. Regions in reading order (DESIGN-PLAN.md): B1 name row, B2 test ledger, C index, D..J the record.
function Shell() {
  const { theme } = useTheme();
  // On a phone the notices sit at the top: at the bottom they cover the Contact sheet's Close button for the few seconds a notice stays.
  const phone = useMediaQuery("(max-width: 639px)");
  // "open the live demo" on a project card selects that project's demo and goes to the demos; the address stays as it was.
  const [demo, setDemo] = useState(liveDemos[0].key);
  const openDemo = (key: string) => { setDemo(key); document.getElementById("live-demos")?.scrollIntoView({ block: "start" }); };
  return (
    <>
      <a href="#summary" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[9px] focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-ink">
        Skip to the record
      </a>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col px-5 pb-8 md:px-10">
        <Masthead />
        <div className="mt-8 flex flex-col gap-6">
          <Index />
          <Ledger />
        </div>
        <main className="mt-6 flex flex-col">
          <Summary />
          <Experience />
          <Projects onOpenDemo={openDemo} />
          <Demos tab={demo} onTab={setDemo} />
          <Skills />
          <Background />
        </main>
        <Footer />
      </div>
      <Toaster position={phone ? "top-center" : "bottom-right"} theme={theme} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
