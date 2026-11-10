import { useState } from "react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { NAV } from "@/content";
import { glide } from "@/motion";

// Region C: the index. Real anchors to the sections; the highlight glides between them (one Motion layoutId).
export function Index() {
  const [current, setCurrent] = useState("summary");
  return (
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
  );
}
