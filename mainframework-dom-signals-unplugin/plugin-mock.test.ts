import { describe, it, expect, vi, beforeEach } from "vitest";

const { compileMock } = vi.hoisted(() => ({
  compileMock: vi.fn(),
}));

vi.mock("./vendor/dom-signals-core/index.js", () => ({
  compile: compileMock,
}));

import { domCompilerUnplugin } from "./src/index.js";

describe("dom-compiler-unplugin mocked compile", () => {
  beforeEach(() => {
    compileMock.mockReset();
  });

  it("returns code only when map is absent", () => {
    compileMock.mockReturnValue({ code: "out" });
    const plugin = domCompilerUnplugin.vite();
    expect(plugin.transform?.("in", "/app/Page.tsx")).toEqual({ code: "out" });
  });

  it("returns code and map when map is present", () => {
    const map = { version: 3, sources: [] };
    compileMock.mockReturnValue({ code: "out", map });
    const plugin = domCompilerUnplugin.vite();
    expect(plugin.transform?.("in", "/app/Page.tsx")).toEqual({ code: "out", map });
  });
});
