import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { InView } from "@/components/ui/in-view";
import { skills } from "@/content";

// Region H: skills. One search field filters the list; the count says what it counts.
export function Skills() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const groups = useMemo(
    () => skills.map((g) => ({ ...g, items: g.items.filter((i) => i.toLowerCase().includes(needle)) })),
    [needle],
  );
  const total = skills.reduce((n, g) => n + g.items.length, 0);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <InView>
      <section id="skills" aria-labelledby="skills-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <div className="grid content-start gap-3">
          <h2 id="skills-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="6">skills</h2>
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter skills"
            aria-label="Filter skills"
            className="max-w-[18rem]"
          />
          <p className="flex items-center gap-2 font-mono text-xs text-ink-2">
            <span className="inline-flex items-center rounded-[6px] bg-track px-2 py-1 text-xs text-ink-2 tabular-nums">{shown} of {total}</span> shown
          </p>
        </div>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.group} className="grid content-start gap-3">
              <h3 className="text-sm font-medium text-ink">{g.group}</h3>
              {g.items.length ? (
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li key={i}>
                      <span className="inline-flex items-center rounded-[6px] bg-track px-2 py-1 text-sm text-ink-2">{i}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-2">No skill in this group matches “{q.trim()}”.</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </InView>
  );
}
