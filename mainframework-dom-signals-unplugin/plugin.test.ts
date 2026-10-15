import { describe, it, expect } from "vitest";

import { compile } from "./vendor/dom-signals-core/index.js";

import { domCompilerUnplugin } from "./src/plugin.js";

const DEFAULT_DIRTY = "@mainframework/signals/dom/internal";

const fixture = `import { effect, createSignal } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";

const count = createSignal("c", 0);
const dom = domSignal("x", null);
effect(() => {
  dom.textContent = String(count());
});
`;

describe("dom-compiler-unplugin", () => {
  it("transform hook matches compile", () => {
    const plugin = domCompilerUnplugin.vite();
    const id = "/app/Page.tsx";
    const fromCompile = compile(fixture, { markDomDirtyImport: DEFAULT_DIRTY, filename: id });
    const fromPlugin = plugin.transform?.(fixture, id);

    expect(fromPlugin).not.toBeNull();
    expect(fromPlugin?.code).toBe(fromCompile.code);
  });
});
