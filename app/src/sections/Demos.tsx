import { motion } from "motion/react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { InView } from "@/components/ui/in-view";
import { demoWords, liveDemos } from "@/content";
import { reveal } from "@/motion";

// Region G: the three real app builds, each running in its own frame, with what runs, what is fixture and why it is here.
export function Demos({ tab, onTab }: { tab: string; onTab: (key: string) => void }) {
  return (
    <InView>
      <section id="live-demos" aria-labelledby="demos-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <div className="grid content-start gap-2">
          <h2 id="demos-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="4">demos</h2>
          <p className="font-mono text-xs text-ink-2">{demoWords.count}</p>
          <p className="max-w-[28ch] text-sm text-ink-2">These are the real app builds, served from this site. No recording stands in for a demo.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => onTab(String(v))}>
          <TabsList aria-label="Live demos" className="max-w-full overflow-x-auto">
            {liveDemos.map((d, i) => (
              <TabsTab key={d.key} value={d.key} className="gap-2 whitespace-nowrap">
                <span className="font-mono text-xs text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                {d.key}
                <span className="font-mono text-xs text-ink-2">{tab === d.key ? demoWords.running : demoWords.idle}</span>
              </TabsTab>
            ))}
          </TabsList>
          {liveDemos.map((d) => (
            <TabsPanel key={d.key} value={d.key} className="pt-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reveal} className="grid gap-4">
                <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-ink-2">
                  <span>{d.tag}</span>
                  <span>{demoWords.eyebrow}</span>
                </p>
                <div className="grid gap-1">
                  <h3 className="text-ui font-medium text-ink">{d.title}</h3>
                  <p className="max-w-[68ch] text-sm text-ink-2">{d.blurb}</p>
                </div>
                <iframe title={d.title} src={d.url} loading="lazy" className="h-[560px] w-full rounded-[14px] border border-hairline bg-surface" />
                {d.hint ? <p className="font-mono text-xs text-ink-2">{d.hint}</p> : null}
                <p className="max-w-[68ch] text-sm text-ink-2">
                  <span className="font-mono text-xs text-ink">{demoWords.tryIt}</span> {d.action}
                </p>
                <div className="grid gap-2 rounded-[14px] border border-hairline bg-board p-4 text-sm text-ink-2">
                  <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs">
                    <span className="text-ink">{demoWords.provenance}</span>
                    <span>{demoWords.noCalls}</span>
                  </p>
                  <p className="font-mono text-xs">{d.build}</p>
                  {d.provenance.map((l) => (
                    <p key={l.label} className="max-w-[68ch]">
                      <span className="font-medium text-ink">{`${l.label} `}</span>
                      {l.text}
                    </p>
                  ))}
                </div>
                <a
                  className="w-fit rounded-[4px] font-mono text-xs text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue"
                  href={d.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open the full demo ↗
                </a>
              </motion.div>
            </TabsPanel>
          ))}
        </Tabs>
      </section>
    </InView>
  );
}
