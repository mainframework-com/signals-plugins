import { describe, it, expect, vi, beforeEach } from "vitest";

const { compileMock } = vi.hoisted(() => ({
  compileMock: vi.fn(),
}));

vi.mock("./vendor/dom-signals-core/index.js", () => ({
  compile: compileMock,
}));

import { domCompilerTurbopackLoader } from "./src/index.js";

describe("dom-compiler-turbopack mocked compile", () => {
  beforeEach(() => {
    compileMock.mockReset();
  });

  it("stringifies map for the turbopack callback", () => {
    const map = { version: 3, sources: [] };
    compileMock.mockReturnValue({ code: "out", map });
    const callback = vi.fn();
    domCompilerTurbopackLoader.call({ resourcePath: "/app/Page.tsx", async: () => callback }, "in");
    expect(callback).toHaveBeenCalledWith(null, "out", JSON.stringify(map));
  });
});
