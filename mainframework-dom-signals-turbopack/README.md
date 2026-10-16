# @mainframework/dom-signals-turbopack

**npm:** https://www.npmjs.com/package/@mainframework/dom-signals-turbopack

Turbopack bundler integration for **Workflow A** DOM wiring when your app uses [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals). Register **exactly once** per app.

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-dom-signals-turbopack`)

**Requires:** `@mainframework/signals` in the app — https://www.npmjs.com/package/@mainframework/signals

Runtime DOM (Workflow B/C, `domSignal`, `useDomSignal`): [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

```bash
pnpm add @mainframework/signals @mainframework/dom-signals-turbopack
pnpm add next
```

Install **Next.js** with Turbopack rules support. **Target:** Next.js 14+ (verify against your Next version — https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack).

### Cross-bundler rules

- Register dom compile **once** per app (no Babel dom-compile duplicate on the same files).
- **Next.js with Turbopack** (`next dev --turbopack`, etc.): this package (`/loader`).
- **Next.js Webpack** or **Vite / Rollup / Rspack / …:** [`@mainframework/dom-signals-unplugin`](https://www.npmjs.com/package/@mainframework/dom-signals-unplugin) instead.
- Do **not** register this loader and unplugin on the same files.

| Setup | Use |
|-------|-----|
| Next.js dev/build with **Turbopack** | `@mainframework/dom-signals-turbopack/loader` |
| Next.js **Webpack** or Vite/Rollup app | `@mainframework/dom-signals-unplugin` |

---

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

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite | Using Webpack pipeline | Switch to unplugin or enable Turbopack rules |
| No rewrite | Rules do not match files | Adjust `*.tsx` / paths |
| API error on older Next | `turbopack.rules` unavailable | Upgrade Next or use Webpack + unplugin |

See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).
