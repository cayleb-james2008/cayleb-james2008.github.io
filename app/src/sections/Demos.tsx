import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { InView } from "@/components/ui/in-view";
import { demoWords, liveDemos } from "@/content";
import { tapTarget } from "@/lib/utils";
import { reveal } from "@/motion";

// A capture frame holds a still of the current build at the size it was taken (1280 x 800). From 1100 px up the frame is as wide as
// the app's own 1280 px where the window allows it (24 px from each edge), centred on the page content, so a 12 px label is drawn at
// 12 px on a 1328 px window and wider; narrower windows scale it down by the least they must. Below 1100 px the frame is the column's
// own width. The still is the app's real interface, captured from the app itself — nothing in it is drawn or mocked.
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
      <img src={src} alt={title} width={1280} height={800} className="size-full min-[1100px]:h-[800px] min-[1100px]:w-[1280px] min-[1100px]:origin-top-left min-[1100px]:[transform:scale(var(--fit))]" />
    </div>
  );
}

// Region G: captures of the three current builds, each in its own frame, with what is shown, what is fixture and why it is here.
// The interactive demos that ran in these frames were the retired builds; they were removed in the capture pass (18 November 2026).

export function Demos({ tab, onTab }: { tab: string; onTab: (key: string) => void }) {
  return (
    <InView>
      <section id="live-demos" aria-labelledby="demos-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <div className="grid content-start gap-2">
          <h2 id="demos-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="4">demos</h2>
          <p className="font-mono text-xs text-ink-2">{demoWords.count}</p>
          <p className="max-w-[28ch] text-sm text-ink-2">Captures of the current builds, taken from the apps themselves. The builds are native apps and are not served from this site; the retired builds that ran in these frames are gone.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => onTab(String(v))}>
          <TabsList aria-label="Captures of the current builds" className="max-w-full flex-wrap">
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
                <DemoFrame title={d.title} src={d.img} />
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
                    href={d.img}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open the full capture ↗
                  </a>
                </div>
              </motion.div>
            </TabsPanel>
          ))}
        </Tabs>
      </section>
    </InView>
  );
}
