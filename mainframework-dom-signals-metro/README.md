# @mainframework/dom-signals-metro

**npm:** https://www.npmjs.com/package/@mainframework/dom-signals-metro

Metro transformer for **Workflow A** DOM wiring with [`@mainframework/signals`](https://www.npmjs.com/package/@mainframework/signals). Use this package for Metro — not `@mainframework/dom-signals-unplugin`.

**Source:** [mainframework-com/signals-plugins](https://github.com/mainframework-com/signals-plugins) (`mainframework-dom-signals-metro`)

Runs **`compile` on source first**, then `metro-react-native-babel-transformer`.

**Requires:** `@mainframework/signals` — https://www.npmjs.com/package/@mainframework/signals

Runtime DOM: [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme).

Register dom compile **once** per app.

## Install

```bash
pnpm add @mainframework/signals @mainframework/dom-signals-metro
pnpm add -D metro metro-react-native-babel-transformer
```

| Peer | Range (see package.json) |
|------|---------------------------|
| `metro` | `>=0.80.0` |
| `metro-react-native-babel-transformer` | `>=0.77.0` |

## `metro.config.js` (CommonJS)

```js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("@mainframework/dom-signals-metro"),
};

module.exports = config;
```

(Replace `getDefaultConfig` with your Metro base config if not using Expo.)

## `metro.config.js` (ESM, `"type": "module"`)

```js
import { getDefaultConfig } from "expo/metro-config";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: join(
    import.meta.resolve("@mainframework/dom-signals-metro"),
    "..",
  ),
};

export default config;
```

Prefer `require.resolve("@mainframework/dom-signals-metro")` when your Metro setup supports it in ESM.

## Single registration

Do **not** add a separate Babel plugin for dom compile on the same files.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No rewrite | Wrong `babelTransformerPath` | Point at this package only |
| Double compile | Babel plugin + this transformer | Remove duplicate |
| No rewrite | No Workflow A pattern in file | See [`@mainframework/signals` README](https://github.com/TerrySlack/mainframework-signals#readme) |
