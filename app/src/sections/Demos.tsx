import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTheme } from "@/chrome/theme";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { InView } from "@/components/ui/in-view";
import { demoWords, liveDemos } from "@/content";
import { tapTarget } from "@/lib/utils";
import { reveal } from "@/motion";

// A live frame runs its app at a 1280 x 800 desktop canvas on >= 1100 px windows so dense multi-pane workspaces
// lay out cleanly without crowding, scaled down only by the minimum needed when the viewport is under 1328 px.
// Below 1100 px the frame takes the column width directly so each app renders its responsive phone/tablet layout.
const NATIVE_W = 1280;
function DemoFrame({ title, src }: { title: string; src: string }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--fit", String(Math.min(1, el.clientWidth / NATIVE_W)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={box}
      style={{ "--frame-w": "max(calc(100% + 14.5rem), min(1280px, calc(100vw - 3rem)))" } as CSSProperties}
      className="relative h-[680px] w-full overflow-hidden rounded-[14px] border border-hairline bg-surface min-[1100px]:ml-[calc((100%-var(--frame-w)-14.5rem)/2)] min-[1100px]:aspect-[16/10] min-[1100px]:h-auto min-[1100px]:w-[var(--frame-w)]"
    >
      <iframe title={title} src={src} className="size-full border-0 min-[1100px]:h-[800px] min-[1100px]:w-[1280px] min-[1100px]:origin-top-left min-[1100px]:[transform:scale(var(--fit))]" />
    </div>
  );
}

// Region G: the three flagship interactive web apps (Open-Ro v1.1.0, OpenBell v0.9.0 sandbox, Fleet v0.9.0), paired with links to their
// standalone full-screen routes, live captures, product pages, and GitHub repositories.
export function Demos({ tab, onTab }: { tab: string; onTab: (key: string) => void }) {
  const { theme } = useTheme();
  const [runs, setRuns] = useState<Record<string, number>>({});
  const resetDemo = async (key: string, prefix?: string) => {
    try {
      if (prefix) {
        for (const k of Object.keys(localStorage)) {
          if (k !== "theme" && k.toLowerCase().includes(prefix)) localStorage.removeItem(k);
        }
        if (typeof indexedDB !== "undefined" && typeof indexedDB.databases === "function") {
          const dbs = await indexedDB.databases();
          for (const db of dbs) {
            if (db.name && db.name.toLowerCase().includes(prefix)) {
              indexedDB.deleteDatabase(db.name);
            }
          }
        }
      }
    } catch { /* storage blocked: remounting the iframe still resets in-memory state */ }
    setRuns((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    toast(`The ${key} local workspace is reset to its starting state.`);
  };
  return (
    <InView>
      <section id="live-demos" aria-labelledby="demos-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <div className="grid content-start gap-2">
          <h2 id="demos-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="4">live apps</h2>
          <p className="font-mono text-xs text-ink-2">{demoWords.count}</p>
          <p className="max-w-[28ch] text-sm text-ink-2">Real interactive web engines running 100% locally in your browser (Studio Copilot 3-pane IDE Open-Ro v1.1.0, Institutional Quant Terminal OpenBell v0.9.0, Goal-to-DAG workbench Fleet v0.9.0) with zero external requests by default.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => onTab(String(v))}>
          <TabsList aria-label="Interactive web apps" className="max-w-full flex-wrap">
            {liveDemos.map((d, i) => (
              <TabsTab key={d.key} value={d.key} className="gap-2 whitespace-nowrap max-sm:min-h-11">
                <span className="font-mono text-xs text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                {d.key}
                <span className="font-mono text-xs text-ink-2">{tab === d.key ? demoWords.running : demoWords.idle}</span>
              </TabsTab>
            ))}
          </TabsList>
          {liveDemos.map((d) => {
            const shot = theme === "dark" && d.darkImg ? d.darkImg : d.img;
            return (
              <TabsPanel key={d.key} value={d.key} className="rounded-[14px] pt-4 focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reveal} className="grid gap-4">
                  <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-ink-2">
                    <span>{d.tag}</span>
                    <span>{demoWords.eyebrow}</span>
                  </p>
                  <div className="grid gap-1">
                    <h3 className="text-ui font-medium text-ink">{d.title}</h3>
                    <p className="max-w-[68ch] text-sm text-ink-2">{d.blurb}</p>
                  </div>
                  <DemoFrame key={runs[d.key] ?? 0} title={d.title} src={d.url} />
                  <p className="max-w-[68ch] text-sm text-ink-2">
                    <span className="font-mono text-xs text-ink">{demoWords.tryIt}</span> {d.action}
                  </p>
                  <div className="grid gap-2 rounded-[14px] border border-hairline bg-board p-4 text-sm text-ink-2">
                    <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs">
                      <span className="text-ink">{demoWords.provenance}</span>
                      <span>{demoWords.noCalls}</span>
                    </p>
                    {d.provenance.map((l) => (
                      <p key={l.label} className="max-w-[68ch]">
                        <span className="font-medium text-ink">{`${l.label} `}</span>
                        {l.text}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a
                      className={`${tapTarget} w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
                      href={d.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Open full-screen app ↗
                    </a>
                    <a
                      className={`${tapTarget} w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
                      href={shot}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Open live capture ↗
                    </a>
                    <a
                      className={`${tapTarget} w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
                      href={d.page}
                    >
                      Product page ↗
                    </a>
                    <a
                      className={`${tapTarget} w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
                      href={d.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Source on GitHub ↗
                    </a>
                    <Button
                      variant="link"
                      size="xs"
                      onClick={() => resetDemo(d.key, d.storagePrefix)}
                      className="h-6 w-fit px-0 font-mono text-xs font-normal text-ink-2 hover:text-ink active:text-blue max-sm:h-11"
                    >
                      reset workspace
                    </Button>
                  </div>
                </motion.div>
              </TabsPanel>
            );
          })}
        </Tabs>
      </section>
    </InView>
  );
}
