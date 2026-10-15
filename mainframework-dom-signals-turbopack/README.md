# @mainframework/dom-signals-turbopack

**npm:** https://www.npmjs.com/package/@mainframework/dom-signals-turbopack

Turbopack loader for **Workflow A** DOM wiring with [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals).

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-dom-signals-turbopack`)

**Requires:** `@mainframework/signals` — https://www.npmjs.com/package/@mainframework/signals

Runtime DOM: [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

## When to use

| Setup | Use |
|-------|-----|
| Next.js dev/build with **Turbopack** (`next dev --turbopack`, etc.) | This package (`/loader`) |
| Next.js **Webpack** or Vite/Rollup app | [`@mainframework/dom-signals-unplugin`](https://www.npmjs.com/package/@mainframework/dom-signals-unplugin) instead |

Do **not** register both on the same files. Register dom compile **once** per app.

## Install

```bash
pnpm add @mainframework/signals @mainframework/dom-signals-turbopack
pnpm add next
```

**Target:** Next.js 14+ with Turbopack rules API (verify against your Next version — https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack).

## `next.config.ts`

Loader runs on **source** before SWC/TSX handling for matched rules:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.tsx": {
        loaders: ["@mainframework/dom-signals-turbopack/loader"],
      },
      "*.ts": {
        loaders: ["@mainframework/dom-signals-turbopack/loader"],
      },
    },
  },
};

export default nextConfig;
```

Export path: `@mainframework/dom-signals-turbopack/loader` (see package `exports`).

## Single registration

One loader rule set per app for dom compile. No `@mainframework/dom-signals-unplugin` on the same globs.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite | Using Webpack pipeline | Switch to unplugin or enable Turbopack rules |
| No rewrite | Rules do not match files | Adjust `*.tsx` / paths |
| API error on older Next | `turbopack.rules` unavailable | Upgrade Next or use Webpack + unplugin |

See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme) and this package’s npm page for Workflow A behavior.
