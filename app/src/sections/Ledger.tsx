import { BarList } from "@/components/BarList/BarList";
import { InView } from "@/components/ui/in-view";
import { ledger, projects } from "@/content";

// Region B2: the defining object. The résumé's own stated test counts, drawn as bars, full width.
// Bar length is the stated count; the label is the stated figure. Nothing is derived or rounded.
const display = new Map(ledger.bars.map((b) => [b.value, b.display]));
const data = ledger.bars.map((b) => ({ name: b.name, value: b.value }));
// A bar leads to its own project card (a bar is named for its project); the section top when no card matches.
const toProject = (barName: string) => {
  const p = projects.find((x) => barName.startsWith(x.name));
  const target = (p && document.querySelector(`[data-project="${p.name}"]`)) || document.getElementById("projects");
  target?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

export function Ledger() {
  return (
    <InView>
      <section aria-labelledby="ledger-label" className="rounded-[24px] border border-hairline bg-surface p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <h2 id="ledger-label" className="text-ui font-medium text-ink" data-answers="3">
            the numbers <span className="font-normal text-ink-2">· as stated in the résumé</span>
          </h2>
          <p className="font-mono text-xs text-ink-2">{ledger.caption}</p>
        </div>
        <div className="mt-6 grid gap-8 grid-cols-1 md:grid-cols-[1fr_16rem]">
          <BarList
            data={data}
            valueFormatter={(v) => display.get(v) ?? String(v)}
            onValueChange={(b) => toProject(b.name)}
            className="ledger-chart hidden md:flex"
            role="group"
            aria-label="Stated test counts: 4,000+ automated tests across five shipped systems; Ergon 622 tests; Sophos 1,224 interface tests; Asmodeus 1,111 Rust tests; dotz 828+ core tests; Industry AI Suite 382 Python tests. GitHub contributions in the last year: 1,200+, shown beside the chart because they are not tests."
          />
          <ul className="grid gap-2 md:hidden" aria-label="Stated test counts">
            {ledger.bars.map((b) => (
              <li key={b.name} className="flex items-center justify-between gap-4 border-b border-hairline pb-2 text-sm">
                <span className="text-ink">{b.name}</span>
                <span className="font-mono tabular-nums text-ink">{b.display}</span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-5 border-hairline md:border-l md:pl-8">
            <div>
              <dt className="text-sm text-ink-2">{ledger.total.label}</dt>
              <dd className="font-mono text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none tabular-nums text-ink">{ledger.total.display}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-2">{ledger.contributions.label}</dt>
              <dd className="font-mono text-2xl font-medium tabular-nums text-ink">{ledger.contributions.display}</dd>
              <dd className="sr-only">{ledger.contributions.label}: {ledger.contributions.display}</dd>
              <dd className="mt-1 text-xs text-ink-2">{ledger.beside}</dd>
            </div>
          </dl>
        </div>
      </section>
    </InView>
  );
}
