import { describe, it, expect } from "vitest";

import { compile } from "./vendor/dom-signals-core/index.js";

import { domCompilerUnplugin } from "./src/index.js";

const DEFAULT_DIRTY = "@mainframework/signals/dom/internal";

const fixture = `import { effect, createSignal } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";

const count = createSignal("c", 0);
const dom = domSignal("x", null);
effect(() => {
  dom.textContent = String(count());
});
`;

const unchanged = `export const value = 1;\n`;

describe("dom-compiler-unplugin", () => {
  it("transform hook matches compile", () => {
    const plugin = domCompilerUnplugin.vite();
    const id = "/app/Page.tsx";
    const fromCompile = compile(fixture, { markDomDirtyImport: DEFAULT_DIRTY, filename: id });
    const fromPlugin = plugin.transform?.(fixture, id);

    expect(fromPlugin).not.toBeNull();
    expect(fromPlugin?.code).toBe(fromCompile.code);
  });

  it("returns null when compile output is unchanged", () => {
    const plugin = domCompilerUnplugin.vite();
    expect(plugin.transform?.(unchanged, "/app/unchanged.ts")).toBeNull();
  });

  it("transformInclude respects include and exclude options", () => {
    const plugin = domCompilerUnplugin.vite({
      include: ["/app/src/"],
      exclude: /\.test\.tsx$/,
    });

    expect(plugin.transformInclude?.("/app/src/Page.tsx")).toBe(true);
    expect(plugin.transformInclude?.("/app/src/Page.test.tsx")).toBe(false);
    expect(plugin.transformInclude?.("/node_modules/pkg/index.js")).toBe(false);
  });

  it("transformInclude supports string patterns and regex include", () => {
    const plugin = domCompilerUnplugin.vite({
      include: /\.custom\.js$/,
      exclude: "vendor",
    });

    expect(plugin.transformInclude?.("/app/file.custom.js")).toBe(true);
    expect(plugin.transformInclude?.("/app/vendor/file.custom.js")).toBe(false);
  });

  it("propagates compile errors from transform", () => {
    const plugin = domCompilerUnplugin.vite();
    expect(() => plugin.transform?.("{", "/app/Broken.tsx")).toThrow();
  });
});
