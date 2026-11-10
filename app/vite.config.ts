import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The page is one file of the site GitHub Pages serves from the repo root. After the build, copy the rest of that site next to it
// (not app/, .git or the old build), so that dist/ opens as the whole site: the demos, the PDF, the fonts, the project pages.
const stageSite = (): Plugin => ({
  name: "stage-site",
  apply: "build",
  closeBundle() {
    const root = path.resolve(import.meta.dirname, "..");
    const dist = path.resolve(import.meta.dirname, "dist");
    for (const name of fs.readdirSync(root)) {
      if (/^(app|\.git|node_modules|index\.html)$/.test(name)) continue;
      fs.cpSync(path.join(root, name), path.join(dist, name), {
        recursive: true,
        filter: (src) => !/^assets\/index-[^/]+$/.test(path.relative(root, src)),
      });
    }
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), stageSite()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // tokens.css lives in ../references (the skill folder) and is imported by src/index.css
  server: { fs: { allow: [path.resolve(import.meta.dirname, "..")] } },
});
