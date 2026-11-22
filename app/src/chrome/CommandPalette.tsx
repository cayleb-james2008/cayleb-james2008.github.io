import { useEffect } from "react";
import { ArrowUpRight, Copy, FileDown, FileText, FolderKanban, Moon, Play, Sun, Terminal } from "lucide-react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/chrome/theme";
import { identity, liveDemos, NAV, PDF } from "@/content";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDemo: (key: string) => void;
};

const PROJECT_PAGES = [
  { label: "Ergon — Employee Agent Desk", href: "/projects/ergon.html", meta: "flagship" },
  { label: "Open-Ro Studio — Roblox Studio AI IDE", href: "/projects/openro.html", meta: "flagship" },
  { label: "Fleet — Parallel Coding Agents", href: "/projects/fleet.html", meta: "flagship" },
  { label: "Industry AI Suite — 10 Review Tools", href: "/projects/industry-ai-suite.html", meta: "suite" },
  { label: "Sophos — Coding-Agent Desktop App", href: "/projects/sophos.html", meta: "desktop" },
  { label: "dotz — Multi-Agent Harness Desktop", href: "/projects/dotz.html", meta: "desktop" },
  { label: "Asmodeus — Chronological Backtesting", href: "/projects/asmodeus.html", meta: "research" },
  { label: "All 17 Project Pages", href: "/projects/", meta: "index" },
];

export function CommandPalette({ open, onOpenChange, onOpenDemo }: Props) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      toast.success(`Copied ${identity.email} to the clipboard.`, { id: "copy-email" });
    } catch {
      toast(`Could not reach the clipboard. The address is ${identity.email}.`, { id: "copy-email" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-hairline bg-surface p-0 text-ink shadow-lift sm:max-w-[540px] sm:rounded-[16px]">
        <DialogTitle className="sr-only">Quick jump</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to résumé sections, live browser apps, the Industry AI Suite workbench, project pages, or actions.
        </DialogDescription>
        <Command className="bg-surface text-ink [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ink-2 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]]:border-hairline [&_[cmdk-input-wrapper]_svg]:size-4 [&_[cmdk-input-wrapper]_svg]:text-ink-2 [&_[cmdk-input]]:h-12 [&_[cmdk-input]]:text-sm [&_[cmdk-input]]:text-ink [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:rounded-[9px] [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:text-sm [&_[cmdk-item]]:text-ink [&_[cmdk-item][data-selected='true']]:bg-board [&_[cmdk-item][data-selected='true']]:text-ink">
          <CommandInput placeholder="Jump to a section, live app, product page, or action…" />
          <CommandList className="max-h-[360px] pb-2">
            <CommandEmpty className="py-8 text-center text-sm text-ink-2">No matching page or action.</CommandEmpty>

            <CommandGroup heading="Live web apps">
              {liveDemos.map((d) => (
                <CommandItem
                  key={d.key}
                  value={`live app ${d.key} ${d.title}`}
                  onSelect={() => run(() => onOpenDemo(d.key))}
                >
                  <Play className="size-4 text-blue" strokeWidth={1.6} aria-hidden />
                  <span className="truncate">{d.key} — launch in frame</span>
                  <CommandShortcut className="font-mono text-xs tracking-normal text-ink-2">{d.tag}</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem
                value="Industry AI Suite lab workbench 10 review tools"
                onSelect={() => run(() => { window.location.assign("/lab/"); })}
              >
                <Terminal className="size-4 text-blue" strokeWidth={1.6} aria-hidden />
                <span className="truncate">Industry AI Suite /lab/ — 10-tool review workbench</span>
                <CommandShortcut className="font-mono text-xs tracking-normal text-ink-2">/lab/</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="my-1 bg-hairline" />

            <CommandGroup heading="Product & case-study pages">
              {PROJECT_PAGES.map((p) => (
                <CommandItem
                  key={p.href}
                  value={`project page ${p.label} ${p.meta}`}
                  onSelect={() => run(() => { window.location.assign(p.href); })}
                >
                  <FolderKanban className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                  <span className="truncate">{p.label}</span>
                  <CommandShortcut className="font-mono text-xs tracking-normal text-ink-2">{p.meta}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1 bg-hairline" />

            <CommandGroup heading="Résumé sections">
              {NAV.map((n) => (
                <CommandItem
                  key={n.id}
                  value={`section ${n.label} ${n.id}`}
                  onSelect={() => run(() => { document.getElementById(n.id)?.scrollIntoView({ block: "start" }); })}
                >
                  <FileText className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                  <span className="capitalize">{n.label}</span>
                  <CommandShortcut className="font-mono text-xs tracking-normal text-ink-2">#{n.id}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1 bg-hairline" />

            <CommandGroup heading="Actions">
              <CommandItem
                value="download resume pdf submission copy"
                onSelect={() => run(() => {
                  const a = document.createElement("a");
                  a.href = PDF.href;
                  a.download = PDF.name;
                  a.click();
                })}
              >
                <FileDown className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                <span>Download Résumé PDF ({PDF.size})</span>
              </CommandItem>
              <CommandItem value={`copy email ${identity.email}`} onSelect={() => run(copyEmail)}>
                <Copy className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                <span>Copy email address</span>
              </CommandItem>
              {liveDemos.map((d) => (
                <CommandItem
                  key={`fs-${d.key}`}
                  value={`open full screen ${d.key} ${d.url}`}
                  onSelect={() => run(() => { window.location.assign(d.url); })}
                >
                  <ArrowUpRight className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                  <span>Open {d.key} full-screen ({d.url})</span>
                </CommandItem>
              ))}
              <CommandItem
                value={theme === "dark" ? "switch appearance light theme" : "switch appearance dark theme"}
                onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? (
                  <Sun className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Moon className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden />
                )}
                <span>Switch appearance to {theme === "dark" ? "Light" : "Dark"}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
