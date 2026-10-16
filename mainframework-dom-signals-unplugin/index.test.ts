import { describe, it, expect } from "vitest";

import domCompilerUnpluginDefault, { domCompilerUnplugin } from "./src/index.js";

describe("dom-compiler-unplugin entry", () => {
  it("re-exports default and named plugin", () => {
    expect(domCompilerUnpluginDefault).toBe(domCompilerUnplugin);
    expect(domCompilerUnplugin.vite).toBeTypeOf("function");
  });
});
