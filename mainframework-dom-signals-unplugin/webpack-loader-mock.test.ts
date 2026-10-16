import { describe, it, expect, vi, beforeEach } from "vitest";

const { compileMock } = vi.hoisted(() => ({
  compileMock: vi.fn(),
}));

vi.mock("./vendor/dom-signals-core/index.js", () => ({
  compile: compileMock,
}));

import domCompilerWebpackLoader from "./src/webpack-loader.js";

describe("dom-compiler-unplugin webpack-loader mocked compile", () => {
  beforeEach(() => {
    compileMock.mockReset();
  });

  it("passes map to the webpack callback when provided", () => {
    const map = { version: 3, sources: [] };
    compileMock.mockReturnValue({ code: "out", map });
    const callback = vi.fn();
    domCompilerWebpackLoader.call({ resourcePath: "/app/Page.tsx", async: () => callback }, "in");
    expect(callback).toHaveBeenCalledWith(null, "out", map);
  });
});
