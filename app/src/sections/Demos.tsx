import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { InView } from "@/components/ui/in-view";
import { demoWords, liveDemos } from "@/content";
import { tapTarget } from "@/lib/utils";
import { reveal } from "@/motion";

// A live frame runs its app at the desktop viewport its capture was taken at (1280 x 800) and is scaled to the width the page gives it
// (the full width of the page content from 1100 px up), so the app lays out the way its own capture shows it. Below 1100 px the frame is
// the column's own width and the app answers to that.
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
    <div ref={box} className="relative h-[560px] w-full overflow-hidden rounded-[14px] border border-hairline bg-surface min-[1100px]:-ml-[14.5rem] min-[1100px]:aspect-[16/10] min-[1100px]:h-auto min-[1100px]:w-[calc(100%+14.5rem)]">
      <iframe title={title} src={src} loading="lazy" className="size-full min-[1100px]:h-[800px] min-[1100px]:w-[1280px] min-[1100px]:origin-top-left min-[1100px]:[transform:scale(var(--fit))]" />
    </div>
  );
}

// Region G: the three real app builds, each running in its own frame, with what runs, what is fixture and why it is here.
// The Ergon demo keeps what a visitor decided in this browser (one localStorage key); the reset clears it and loads the frame again.
const ERGON_STATE = "ergon.frontend.v1";

export function Demos({ tab, onTab }: { tab: string; onTab: (key: string) => void }) {
  const [ergonRuns, setErgonRuns] = useState(0);
  const resetErgon = () => {
    try { localStorage.removeItem(ERGON_STATE); } catch { /* storage blocked: the frame still loads again */ }
    setErgonRuns((n) => n + 1);
    toast("The Ergon demo is reset: its approval waits for you again.");
  };
  return (
    <InView>
      <section id="live-demos" aria-labelledby="demos-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <div className="grid content-start gap-2">
          <h2 id="demos-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="4">demos</h2>
          <p className="font-mono text-xs text-ink-2">{demoWords.count}</p>
          <p className="max-w-[28ch] text-sm text-ink-2">These are the real app builds, served from this site. No recording stands in for a demo.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => onTab(String(v))}>
          <TabsList aria-label="Live demos" className="max-w-full flex-wrap">
            {liveDemos.map((d, i) => (
              <TabsTab key={d.key} value={d.key} className="gap-2 whitespace-nowrap max-sm:min-h-11">
                <span className="font-mono text-xs text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                {d.key}
                <span className="font-mono text-xs text-ink-2">{tab === d.key ? demoWords.running : demoWords.idle}</span>
              </TabsTab>
            ))}
          </TabsList>
          {liveDemos.map((d) => (
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
                <DemoFrame key={d.key === "Ergon" ? ergonRuns : 0} title={d.title} src={d.url} />
                {d.hint ? <p className="font-mono text-xs text-ink-2">{d.hint}</p> : null}
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
                <div className="flex flex-wrap items-center gap-x-6">
                  <a
                    className={`${tapTarget} w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
                    href={d.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open the full demo ↗
                  </a>
                  {d.key === "Ergon" ? (
                    <Button
                      variant="link"
                      size="xs"
                      onClick={resetErgon}
                      className="h-6 w-fit px-0 font-mono text-xs font-normal text-ink-2 hover:text-ink active:text-blue max-sm:h-11"
                    >
                      reset the demo
                    </Button>
                  ) : null}
                </div>
              </motion.div>
            </TabsPanel>
          ))}
        </Tabs>
      </section>
    </InView>
  );
}
