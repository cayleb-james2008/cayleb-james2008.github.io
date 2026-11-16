import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Expandable, ExpandableContent, ExpandableTrigger } from "@/components/ui/expandable";
import { InView } from "@/components/ui/in-view";
import { cn } from "@/lib/utils";
import { dur } from "@/motion";
import { additional, education, experience, summary } from "@/content";

// The prose record: summary, experience, the additional experience and education. Copied, never reworded.
export function Summary() {
  return (
    <InView>
      <section id="summary" aria-labelledby="summary-label" className="scroll-mt-6 grid gap-4 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <h2 id="summary-label" className="font-mono text-xs uppercase tracking-wider text-ink-2">summary</h2>
        <div className="max-w-[68ch] space-y-4 text-base leading-relaxed text-ink">
          <p>{summary[0]}</p>
          <p className="text-ink-2">{summary[1]}</p>
        </div>
      </section>
    </InView>
  );
}

function ExperienceEntry({ e }: { e: (typeof experience)[number] }) {
  // Open on arrival: every bullet is in the default view. The trigger folds the entry to its line and back.
  const [open, setOpen] = useState(true);
  return (
    <Expandable expanded={open} onToggle={() => setOpen((v) => !v)} transitionDuration={dur.enter} className="grid gap-3">
      <ExpandableTrigger
        aria-label={`${open ? "Fold" : "Open"} ${e.org}`}
        className="flex min-h-11 items-start justify-between gap-4 rounded-[9px] text-left outline-none focus-visible:ring-2 focus-visible:ring-blue"
      >
        <span className="grid gap-1">
          <span className="font-mono text-xs text-ink-2">{e.date}</span>
          <span className="text-ui font-medium text-ink">{e.org}</span>
        </span>
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-icon transition-transform duration-(--dur-enter) ease-(--ease-house) motion-reduce:transition-none", open && "rotate-180")} strokeWidth={1.5} aria-hidden />
      </ExpandableTrigger>
      <ExpandableContent preset="fade">
        <ul className="flex max-w-[68ch] list-disc flex-col gap-3 pl-5 text-sm leading-relaxed text-ink-2 marker:text-ink-2">
          {e.bullets.map((b) => (
            <li key={b.slice(0, 40)}>{b}</li>
          ))}
        </ul>
      </ExpandableContent>
    </Expandable>
  );
}

export function Experience() {
  return (
    <InView>
      <section id="experience" aria-labelledby="experience-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <h2 id="experience-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="5">experience</h2>
        <div className="flex flex-col gap-10">
          {experience.map((e) => (
            <ExperienceEntry key={e.org} e={e} />
          ))}
        </div>
      </section>
    </InView>
  );
}

export function Background() {
  return (
    <>
      <InView>
        <section id="additional" aria-labelledby="additional-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
          <h2 id="additional-label" className="font-mono text-xs uppercase tracking-wider text-ink-2">additional experience</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {additional.map((a) => (
              <li key={a.org} className="grid gap-1 rounded-[9px] border border-hairline bg-surface p-4">
                <span className="text-sm font-medium text-ink">{a.org}</span>
                <span className="text-sm text-ink-2">{a.role}</span>
                <span className="font-mono text-xs text-ink-2">{a.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </InView>
      <InView>
        <section id="education" aria-labelledby="education-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
          <h2 id="education-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="6">education</h2>
          <div className="grid gap-2 rounded-[9px] border border-hairline bg-surface p-5">
            <p className="text-ui font-medium text-ink">{education.school}</p>
            <p className="font-mono text-xs text-ink-2">{education.date}</p>
            <p className="max-w-[68ch] text-sm text-ink-2">{education.detail}</p>
          </div>
        </section>
      </InView>
    </>
  );
}
