import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The page is the root of the GitHub Pages site served from `..`. After Vite builds `dist/`:
// 1. Sync `dist/index.html` -> `../index.html` and `dist/assets/index-*` -> `../assets/` (removing stale `../assets/index-*`),
//    so `cd app && npm run build` deterministically updates the repo root in one command.
// 2. Stage the rest of the root static site (`projects/`, `demos/`, `lab/`, `site/`, `fonts/`, `assets/`, PDF, etc.) into `dist/`,
//    so `node app/scripts/render-check.mjs` opens `dist/` as the complete site.
const stageAndPublishSite = (): Plugin => ({
  name: "stage-and-publish-site",
  apply: "build",
  closeBundle() {
    const root = path.resolve(import.meta.dirname, "..");
    const dist = path.resolve(import.meta.dirname, "dist");
    const rootAssets = path.join(root, "assets");
    const distAssets = path.join(dist, "assets");

    fs.mkdirSync(rootAssets, { recursive: true });
    for (const f of fs.readdirSync(rootAssets)) {
      if (/^index-[^/]+\.(js|css|map)$/.test(f)) {
        fs.rmSync(path.join(rootAssets, f), { force: true });
      }
    }
    fs.copyFileSync(path.join(dist, "index.html"), path.join(root, "index.html"));
    if (fs.existsSync(distAssets)) {
      for (const f of fs.readdirSync(distAssets)) {
        if (/^index-[^/]+$/.test(f)) {
          fs.copyFileSync(path.join(distAssets, f), path.join(rootAssets, f));
        }
      }
    }

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
  plugins: [react(), tailwindcss(), stageAndPublishSite()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: { fs: { allow: [path.resolve(import.meta.dirname, "..")] } },
});
