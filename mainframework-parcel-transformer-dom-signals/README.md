# @mainframework/parcel-transformer-dom-signals

**npm:** https://www.npmjs.com/package/@mainframework/parcel-transformer-dom-signals

Parcel 2 bundler integration for **Workflow A** DOM wiring when your app uses [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals). Register **exactly once** per app.

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-parcel-transformer-dom-signals`)

**Requires:** `@mainframework/signals` in the app — https://www.npmjs.com/package/@mainframework/signals

Runtime DOM (Workflow B/C, `domSignal`, `useDomSignal`): [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

```bash
pnpm add @mainframework/signals @mainframework/parcel-transformer-dom-signals
pnpm add -D @parcel/plugin parcel
```

Install **Parcel 2** as usual. Example `package.json`:

```json
{
  "devDependencies": {
    "@mainframework/parcel-transformer-dom-signals": "4.0.1",
    "@parcel/plugin": "^2.16.0",
    "parcel": "^2.16.0"
  },
  "dependencies": {
    "@mainframework/signals": "4.0.1"
  }
}
```

### Cross-bundler rules

- Register dom compile **once** per app (no Babel dom-compile duplicate on the same files).
- **Parcel 2:** this package — not `@mainframework/dom-signals-unplugin`.
- Run this transformer **before** Parcel’s default JS/TS pipeline (`"..."` in `.parcelrc`).
- Do **not** add a global Babel dom-compile plugin on the same files.

---

## `.parcelrc`

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{js,jsx,ts,tsx}": [
      "@mainframework/parcel-transformer-dom-signals",
      "..."
    ]
  }
}
```

## Asset types

`js`, `jsx`, `ts`, `tsx` (see transformer implementation).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite | Transformer after TS strip | Put `@mainframework/parcel-transformer-dom-signals` **before** `"..."` in the pipeline array |
| Parcel ignores plugin | Missing `engines.parcel` | Package declares `"parcel": "^2.0.0"` — use Parcel 2 |
| Double compile | Babel + this transformer | Remove duplicate compile hook |

See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).
