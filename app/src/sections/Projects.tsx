import { Pill, PillIndicator, PillStatus } from "@/components/kibo-ui/pill";
import { BarList } from "@/components/BarList/BarList";
import {
  MorphingDialog, MorphingDialogClose, MorphingDialogContainer, MorphingDialogContent,
  MorphingDialogDescription, MorphingDialogTitle, MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog";
import { InView } from "@/components/ui/in-view";
import { captureTitle, chartHead, openDemoLabel, productPageLink, productPages, productPagesHead, projects, stepsHead, type Capture, type Chart, type ProductPage, type Project } from "@/content";
import { cn, tapTarget } from "@/lib/utils";
import { open } from "@/motion";

// Region F: selected projects. The three flagship projects lead with a still of the real capture; the others with their stated
// numbers. Every bullet stays on the page; the steps open as a morphing detail on a press.
const DSH_REPO = "github.com/cayleb-james2008/dsh-fleet-genesis";

function CaptureFigure({ c, onOpenDemo }: { c: Capture; onOpenDemo: () => void }) {
  return (
    <figure className="grid overflow-hidden rounded-[14px] border border-hairline bg-board">
      <a
        href={c.src}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${captureTitle}: ${c.alt}`}
        title={captureTitle}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue"
      >
        <img src={c.src} alt={c.alt} width={1280} height={800} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
      </a>
      <figcaption className="grid gap-1 border-t border-hairline p-3 font-mono text-xs text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 shrink-0 rounded-full bg-ink-3" aria-hidden />
          {c.label}
        </span>
        <span className="text-pretty">{c.spec}</span>
        <a
          href="#live-demos"
          onClick={(e) => { e.preventDefault(); onOpenDemo(); }}
          className={`${tapTarget} w-fit whitespace-nowrap rounded-[4px] text-ink-2 underline-offset-4 outline-none hover:text-ink hover:underline active:text-blue focus-visible:ring-2 focus-visible:ring-blue`}
        >
          {openDemoLabel}
        </a>
      </figcaption>
    </figure>
  );
}

function StatedNumbers({ chart }: { chart: Chart }) {
  const value = (v: number) => (chart.sqrt ? Math.sqrt(v) : v);
  const display = new Map(chart.rows.map((r) => [value(r.value), r.display]));
  return (
    <div className="grid gap-3 rounded-[14px] border border-hairline bg-board p-4">
      <p className="flex items-baseline justify-between gap-3 font-mono text-xs text-ink-2">
        <span>{chartHead.left}</span>
        <span>{chartHead.right}</span>
      </p>
      <BarList
        data={chart.rows.map((r) => ({ name: r.name, value: value(r.value) }))}
        valueFormatter={(v) => display.get(v) ?? String(v)}
        role="group"
        aria-label={chart.label}
      />
      <p className="text-pretty font-mono text-xs text-ink-2">{chart.caption}</p>
    </div>
  );
}

function ProjectCard({ p, onOpenDemo }: { p: Project; onOpenDemo: (key: string) => void }) {
  const flagship = Boolean(p.capture);
  return (
    <article data-project={p.name} className={cn("scroll-mt-6 grid content-start gap-x-8 gap-y-4 rounded-[9px] border border-hairline bg-surface p-5", flagship && "md:col-span-2 md:flow-root")}>
      <div className="flex flex-col gap-3">
        <div className="grid gap-1">
          <h3 className="text-ui font-medium text-ink">
            {p.name}
            <span className="font-normal text-ink-2"> · {p.kind}</span>
          </h3>
          <p className="font-mono text-xs text-ink-2">{p.stack}</p>
        </div>
        {p.status ? (
          <Pill className="w-fit bg-track py-1.5 text-xs text-ink">
            <PillStatus className="border-r-0 pr-0">
              <PillIndicator variant="success" />
              {p.status}
            </PillStatus>
          </Pill>
        ) : null}
        {p.figure ? <span className="w-fit max-w-full rounded-[6px] bg-track px-2 py-1 font-mono text-xs text-ink-2">{p.figure}</span> : null}
        {p.repo ? (
          p.repo === DSH_REPO ? (
            <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-2">
              <span>{p.repo}</span>
              <span className="text-ink-2">private repository</span>
              <a className={`${tapTarget} underline-offset-4 hover:underline active:text-blue`} href="https://github.com/cayleb-james2008" target="_blank" rel="noreferrer noopener">
                public profile ↗
              </a>
            </p>
          ) : (
            <a className={`${tapTarget} w-fit font-mono text-xs text-ink-2 underline-offset-4 hover:text-ink hover:underline active:text-blue`} href={`https://${p.repo}`} target="_blank" rel="noreferrer noopener">
              {p.repo}
            </a>
          )
        ) : null}
      </div>
      {p.capture ? (
        <div className="md:float-right md:mb-4 md:ml-8 md:mt-4 md:w-[376px]">
          <CaptureFigure c={p.capture} onOpenDemo={() => p.demo && onOpenDemo(p.demo)} />
        </div>
      ) : p.chart ? (
        <StatedNumbers chart={p.chart} />
      ) : null}
      <div className={cn("flex flex-col gap-3", flagship && "md:mt-4 md:block md:space-y-3")}>
        <ul className={cn("flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink-2 marker:text-ink-2", flagship && "md:block md:max-w-[68ch] md:space-y-2")}>
          {p.bullets.map((b) => (
            <li key={b.slice(0, 40)}>{b}</li>
          ))}
        </ul>
        <MorphingDialog transition={open}>
          <MorphingDialogTrigger className="mt-auto flex w-fit items-center max-sm:min-h-11 rounded-[10px] border border-hairline bg-surface px-3 py-2 text-sm text-ink-2 hover:bg-board hover:text-ink active:bg-track focus-visible:ring-2 focus-visible:ring-blue">
            how it works <span className="ml-2 font-mono text-xs text-ink-2">{p.steps.length} steps</span>
          </MorphingDialogTrigger>
          <MorphingDialogContainer>
            <MorphingDialogContent className="relative w-[min(560px,calc(100vw-32px))] rounded-[20px] border border-hairline bg-surface p-6 text-ink shadow-lift">
              <MorphingDialogClose aria-label="Close" className="absolute right-3 top-3 grid size-9 place-items-center rounded-[9px] text-lg text-icon hover:bg-board focus-visible:ring-2 focus-visible:ring-blue">
                ×
              </MorphingDialogClose>
              <MorphingDialogTitle className="pr-10 text-ui font-medium">{p.name}</MorphingDialogTitle>
              <MorphingDialogDescription className="mt-1 flex items-baseline justify-between gap-3 font-mono text-xs text-ink-2">
                <span>{stepsHead.left}</span>
                <span>{stepsHead.right}</span>
              </MorphingDialogDescription>
              <ol aria-label={`${p.name}, how it works`} className="mt-4 grid gap-3">
                {p.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2">
                    <span className="font-mono text-xs text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                    <span className="grid gap-0.5">
                      <span className="text-sm font-medium text-ink">{s.title}</span>
                      {s.sub ? <span className="font-mono text-xs text-ink-2">{s.sub}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-ink">{p.lead}</p>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      </div>
    </article>
  );
}

// The Fleet card carries a drawn model of the card board, labelled as a model — the same treatment as the
// Fleet product page. No current-board capture exists on this machine (the board lives inside the owner's
// desktop app), and a stale capture is never presented as the current front end.
function FleetBoardMiniature({ alt }: { alt: string }) {
  const lanes: { name: string; cards: string[] }[] = [
    { name: "Queued", cards: ["Ticket — goal, context, and the check, written before work starts"] },
    { name: "Building", cards: ["Lead — splits the ticket, hands out the pieces", "Builders — work in parallel, never the same file at once"] },
    { name: "Checking", cards: ["Checker — fresh eyes; runs the output against the check · PASS"] },
    { name: "Done", cards: ["One outcome per ticket, evidence attached"] },
  ];
  return (
    <div role="img" aria-label={alt} className="grid w-full content-start gap-2 border-b border-hairline bg-board p-3">
      <p className="flex items-baseline justify-between gap-2 font-mono text-xs uppercase tracking-wider text-ink-2">
        <span>DSH Fleet — card board</span>
        <span>a small model</span>
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {lanes.map((l) => (
          <div key={l.name} className="grid content-start gap-1.5">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-2">{l.name}</p>
            {l.cards.map((c) => (
              <p key={c} className="rounded-[6px] border border-hairline bg-surface p-1.5 text-xs leading-snug text-ink-2">{c}</p>
            ))}
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-ink-2">a small model of the fleet&rsquo;s card board — not a screenshot</p>
    </div>
  );
}

function ProductPageCard({ p }: { p: ProductPage }) {
  return (
    <a
      href={p.href}
      className="group grid content-start overflow-hidden rounded-[14px] border border-hairline bg-surface outline-none hover:bg-board focus-visible:ring-2 focus-visible:ring-blue active:bg-track"
    >
      {p.miniature ? (
        <FleetBoardMiniature alt={p.alt} />
      ) : (
        <img src={p.img} alt={p.alt} width={1280} height={800} loading="lazy" className="aspect-[16/10] w-full border-b border-hairline object-cover object-top" />
      )}
      <span className="grid gap-1.5 p-4">
        <span className="text-ui font-medium text-ink">{p.name}</span>
        <span className="text-pretty text-sm leading-relaxed text-ink-2">{p.pitch}</span>
        <span className="mt-1 font-mono text-xs text-ink-2 underline-offset-4 group-hover:text-ink group-hover:underline">{productPageLink}</span>
      </span>
    </a>
  );
}

export function Projects({ onOpenDemo }: { onOpenDemo: (key: string) => void }) {
  return (
    <InView>
      <section id="projects" aria-labelledby="projects-label" className="scroll-mt-6 grid gap-6 border-t border-hairline py-12 grid-cols-1 md:grid-cols-[12rem_1fr] md:gap-10">
        <h2 id="projects-label" className="font-mono text-xs uppercase tracking-wider text-ink-2" data-answers="3">selected projects</h2>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="grid gap-4 md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-2">{productPagesHead}</p>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              {productPages.map((p) => (
                <ProductPageCard key={p.name} p={p} />
              ))}
            </div>
          </div>
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} onOpenDemo={onOpenDemo} />
          ))}
        </div>
      </section>
    </InView>
  );
}
