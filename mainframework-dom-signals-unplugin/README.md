# @mainframework/dom-signals-unplugin

**npm:** https://www.npmjs.com/package/@mainframework/dom-signals-unplugin

Unplugin integration for **Workflow A** DOM wiring with [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals). Register **exactly once** per app.

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-dom-signals-unplugin`)

**Requires:** `@mainframework/signals` in the app — https://www.npmjs.com/package/@mainframework/signals

Runtime DOM (Workflow B/C, `domSignal`, `useDomSignal`): [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

```bash
pnpm add @mainframework/signals @mainframework/dom-signals-unplugin
```

Install your bundler (Vite, Webpack, etc.) as usual. Optional peers are listed per section.

### Cross-bundler rules

- Register dom compile **once** per app (no Babel dom-compile duplicate on the same files).
- **Vite / Rollup / Rspack / …:** this unplugin uses **`enforce: 'pre'`** (see bundler sections below).
- **Webpack:** **either** `domCompiler.webpack()` **or** `@mainframework/dom-signals-unplugin/webpack-loader` **last** in `rule.use` (runs first on the file), not both.

---

## Vite

```bash
pnpm add -D vite
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import domCompiler from "@mainframework/dom-signals-unplugin";

export default defineConfig({
  plugins: [domCompiler.vite(), react()],
});
```

**Order:** factory sets **`enforce: 'pre'`** — do not rely on array position.

---

## Rollup

```bash
pnpm add -D rollup @rollup/plugin-node-resolve @rollup/plugin-typescript
```

`rollup.config.js`:

```js
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import domCompiler from "@mainframework/dom-signals-unplugin";

export default {
  input: "src/main.ts",
  output: { file: "dist/bundle.js", format: "es" },
  plugins: [domCompiler.rollup(), resolve(), typescript()],
};
```

**Order:** **`enforce: 'pre'`**.

---

## Webpack (unplugin)

```bash
pnpm add -D webpack webpack-cli
```

`webpack.config.mjs`:

```js
import domCompiler from "@mainframework/dom-signals-unplugin";

export default {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [domCompiler.webpack()],
};
```

**Order:** **`enforce: 'pre'`**. Do **not** also use [webpack-loader](#webpack-ruleuse-loader--choose-one-path) on the same files.

---

## Webpack (`rule.use` loader — choose one path)

`webpack.config.mjs`:

```js
export default {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          "babel-loader",
          "@mainframework/dom-signals-unplugin/webpack-loader",
        ],
      },
    ],
  },
};
```

Loader is **last** in `use` so it runs **first** on the file. Do **not** add `domCompiler.webpack()`.

---

## esbuild

```bash
pnpm add -D esbuild
```

`build.mjs`:

```js
import * as esbuild from "esbuild";
import domCompiler from "@mainframework/dom-signals-unplugin";

await esbuild.build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  outfile: "dist/out.js",
  plugins: [domCompiler.esbuild()],
});
```

Register dom compile before other transforms that strip TS/JSX.

---

## Bun

```bash
pnpm add -D bun
```

`build.ts`:

```ts
import domCompiler from "@mainframework/dom-signals-unplugin";

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./dist",
  plugins: [domCompiler.bun()],
});
```

---

## Rspack

```bash
pnpm add -D @rspack/core @rspack/cli
```

`rspack.config.mjs`:

```js
import domCompiler from "@mainframework/dom-signals-unplugin";

export default {
  entry: { main: "./src/index.tsx" },
  plugins: [domCompiler.rspack()],
};
```

**Order:** **`enforce: 'pre'`**.

---

## Rsbuild

```bash
pnpm add -D @rsbuild/core
```

`rsbuild.config.ts`:

```ts
import { defineConfig } from "@rsbuild/core";
import domCompiler from "@mainframework/dom-signals-unplugin";

export default defineConfig({
  plugins: [
    {
      name: "dom-compiler",
      setup(api) {
        api.modifyRspackConfig((config) => {
          config.plugins = config.plugins ?? [];
          config.plugins.push(domCompiler.rspack());
          return config;
        });
      },
    },
  ],
});
```

Verify against your Rsbuild version if the hook name differs. Underlying adapter uses **`enforce: 'pre'`**.

---

## Rolldown

Use the Rolldown adapter from the same package:

```ts
import domCompiler from "@mainframework/dom-signals-unplugin";

export default {
  input: "src/index.ts",
  plugins: [domCompiler.rolldown()],
};
```

**Order:** **`enforce: 'pre'`**.

---

## Farm

```bash
pnpm add -D @farmfe/core @farmfe/cli
```

`farm.config.ts`:

```ts
import domCompiler from "@mainframework/dom-signals-unplugin";

export default {
  compilation: {
    input: { index: "./src/index.tsx" },
  },
  plugins: [domCompiler.farm()],
};
```

**Order:** **`enforce: 'pre'`**.

---

## Options

Pass to `domCompiler.vite({ ... })` (same for other adapters):

| Option | Default | Description |
|--------|---------|-------------|
| `markDomDirtyImport` | `@mainframework/signals/dom/internal` | See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme) |
| `effectImportSources` | `["@mainframework/signals"]` | |
| `bindings` | `[]` | |
| `include` | `/\.[mc]?[jt]sx?$/` | Module ids to transform |
| `exclude` | `/node_modules/` | Skipped ids |

TSX without matching compile patterns: **no-op**; downstream TS/JSX still runs once.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite in output | Wrong pipeline order | Use **`pre`** or webpack loader-last; compile must see raw TSX |
| Rewrite twice / broken AST | Double registration | One of: unplugin, webpack-loader, or Babel plugin — not several |
| No rewrite | `effect` not from `effectImportSources` | Add module or rename import |
| No rewrite | File under `node_modules` | Adjust `exclude` / `include` |
| No source map | Missing id | Plugin passes `id` as `filename` automatically |

See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).
