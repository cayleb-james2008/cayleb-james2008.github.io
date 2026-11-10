import { Button } from "@/components/ui/button";
import { colophon, identity, PDF } from "@/content";

export function Footer() {
  return (
    <footer className="grid gap-4 border-t border-hairline py-10 grid-cols-1 md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-1">
        <p className="text-sm text-ink-2">{colophon.line}</p>
        <p className="font-mono text-xs text-ink-2">
          {identity.email} · github.com/cayleb-james2008
        </p>
      </div>
      <Button variant="outline" size="sm" className="max-sm:h-11" render={<a href={PDF.href} download={PDF.name} />}>
        Download PDF
      </Button>
    </footer>
  );
}
