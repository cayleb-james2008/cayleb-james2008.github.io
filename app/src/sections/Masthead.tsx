import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { TextureButton } from "@/components/ui/texture-button";
import { useTheme } from "@/chrome/theme";
import { identity, PDF } from "@/content";

// Region B1: the name row. Who he is, how to reach him, the PDF. Nothing else sits here.
export function Masthead() {
  const { theme, toggle } = useTheme();
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      toast.success(`Copied ${identity.email} to the clipboard.`);
    } catch {
      toast(`Could not reach the clipboard. The address is ${identity.email}.`);
    }
  };
  return (
    <header className="flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0" data-answers="1">
        <h1 className="font-semibold text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-tight text-ink">
          {identity.name}
        </h1>
        <p className="mt-3 max-w-[60ch] text-ui text-ink-2">{identity.role}</p>
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-2">
          <li className="font-mono text-xs text-ink-2">{identity.location}</li>
          <li className="flex items-center gap-1.5">
            <a className="font-mono text-xs text-ink-2 underline-offset-4 hover:text-ink hover:underline active:text-blue" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
            <Button variant="outline" size="icon-sm" onClick={copyEmail} aria-label={`Copy email address ${identity.email}`}>
              <Copy className="size-3.5" strokeWidth={1.5} aria-hidden />
            </Button>
          </li>
          {identity.links.map((l) => (
            <li key={l.href}>
              <a className="font-mono text-xs text-ink-2 underline-offset-4 hover:text-ink hover:underline active:text-blue" href={l.href} target="_blank" rel="noreferrer noopener">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <TextureButton asChild variant="primary" data-answers="2" className="min-h-11">
          {/* The link fills the whole slab (the part's own padding is cancelled), so the press target is the button, not the word. */}
          <a
            href={PDF.href}
            download={PDF.name}
            className="-mx-4 -my-2 flex flex-1 items-center justify-center self-stretch rounded-[10px] px-4 py-2 outline-none transition-[background-color,transform] duration-(--dur-press) ease-(--ease-house) hover:bg-surface/12 active:bg-black/25 motion-safe:active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            Download PDF
          </a>
        </TextureButton>
        <span className="font-mono text-xs text-ink-2">
          {PDF.size} · {PDF.note}
        </span>
        <Button variant="outline" size="sm" onClick={toggle} aria-label={theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme"}>
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <Button variant="outline" size="sm" className="sm:hidden">
              Contact
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="bg-ink/20" style={{ position: "fixed", inset: 0 }} />
            <Drawer.Content className="inset-x-0 bottom-0 rounded-t-[20px] bg-surface p-5 text-ink" style={{ position: "fixed" }}>
              <Drawer.Title className="text-ui font-medium">Contact</Drawer.Title>
              <ul className="mt-3 flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2">
                  <a className="font-mono text-xs text-ink-2 underline-offset-4 hover:underline" href={`mailto:${identity.email}`}>
                    {identity.email}
                  </a>
                  <Button variant="outline" size="icon-sm" onClick={copyEmail} aria-label={`Copy email address ${identity.email}`}>
                    <Copy className="size-3.5" strokeWidth={1.5} aria-hidden />
                  </Button>
                </li>
                {identity.links.map((l) => (
                  <li key={l.href}>
                    <a className="font-mono text-xs text-ink-2" href={l.href} target="_blank" rel="noreferrer noopener">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </header>
  );
}
