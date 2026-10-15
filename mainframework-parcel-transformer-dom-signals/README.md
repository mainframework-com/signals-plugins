# @mainframework/parcel-transformer-dom-signals

**npm:** https://www.npmjs.com/package/@mainframework/parcel-transformer-dom-signals

Parcel 2 transformer for **Workflow A** DOM wiring with [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals). Use this package for Parcel 2 — not `@mainframework/dom-signals-unplugin`.

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-parcel-transformer-dom-signals`)

Runtime DOM: [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

Register dom compile **once** per app.

## Install

```bash
pnpm add @mainframework/signals
pnpm add -D @mainframework/parcel-transformer-dom-signals @parcel/plugin
```

Example `package.json`:

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

**npm links:**

- https://www.npmjs.com/package/@mainframework/signals

## `.parcelrc`

Run this transformer **before** Parcel’s default JS/TS pipeline (`"..."` keeps defaults after compile):

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

## Single registration

Use only this transformer for dom compile — do not add a global Babel dom-compile plugin on the same files.

## Asset types

`js`, `jsx`, `ts`, `tsx` (see transformer implementation).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite | Transformer after TS strip | Put `@mainframework/parcel-transformer-dom-signals` **before** `"..."` in the pipeline array |
| Parcel ignores plugin | Missing `engines.parcel` | Package declares `"parcel": "^2.0.0"` — use Parcel 2 |
| Double compile | Babel + this transformer | Remove duplicate compile hook |

See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).
