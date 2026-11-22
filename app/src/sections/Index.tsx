import { useState } from "react";
import { Search } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { NAV } from "@/content";
import { glide } from "@/motion";

// Region C: the index. Real anchors to the sections; the highlight glides between them (one Motion layoutId),
// paired with a quiet Cmd+K Quick Jump trigger for instant cross-site navigation.
export function Index({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [current, setCurrent] = useState("summary");
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Contents" className="flex flex-wrap justify-start gap-0.5">
        <AnimatedBackground
          defaultValue="summary"
          onValueChange={(id) => id && setCurrent(id)}
          className="rounded-[10px] bg-surface shadow-raised"
          transition={glide}
        >
          {NAV.map((n) => (
            <a
              key={n.id}
              data-id={n.id}
              href={`#${n.id}`}
              aria-current={current === n.id ? "location" : undefined}
              // A press scrolls to the section and leaves the address as it was, so a reload starts at the top; the href stays
              // for open-in-new-tab and for the project pages' own links. AnimatedBackground's click moves the highlight.
              onClickCapture={(e) => { e.preventDefault(); document.getElementById(n.id)?.scrollIntoView({ block: "start" }); }}
              data-answers-via={n.via}
              className="inline-flex h-11 items-center rounded-[10px] px-3 text-sm sm:h-10 font-medium text-ink-2 outline-none transition-colors duration-(--dur-press) hover:text-ink active:bg-track focus-visible:ring-2 focus-visible:ring-blue data-[checked=true]:text-ink"
            >
              {n.label}
            </a>
          ))}
        </AnimatedBackground>
      </nav>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenPalette}
        aria-label="Quick jump (Ctrl+K)"
        className="h-11 gap-2 px-3 text-sm text-ink-2 hover:text-ink sm:h-10"
      >
        <Search className="size-3.5" strokeWidth={1.6} aria-hidden />
        <span>Quick jump</span>
        <Kbd className="bg-track px-1.5 font-mono text-xs text-ink-2">⌘K</Kbd>
      </Button>
    </div>
  );
}
