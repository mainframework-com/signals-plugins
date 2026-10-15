# mainframework-dom-signals-core (internal)

Private compile source for Workflow A DOM wiring. **Not published to npm.**

- `pnpm build` — compile to `dist/`
- `pnpm test` — `compile` behavior tests

Apps install `@mainframework/signals` plus one dom-signals bundler plugin (`dom-signals-metro`, `dom-signals-turbopack`, `dom-signals-unplugin`, or `parcel-transformer-dom-signals`).

Plugins vendor `dist/` at prebuild via `scripts/copy-dist.mjs`.
