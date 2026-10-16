import { describe, it, expect, vi, beforeEach } from "vitest";

const { compileMock } = vi.hoisted(() => ({
  compileMock: vi.fn(),
}));

vi.mock("./vendor/dom-signals-core/index.js", () => ({
  compile: compileMock,
}));

import domCompilerParcelTransformer from "./src/index.js";

const parcelConfig = (
  domCompilerParcelTransformer as unknown as Record<
    symbol,
    { transform: (opts: { asset: unknown }) => Promise<unknown[]> }
  >
)[Symbol.for("parcel-plugin-config")];

describe("dom-compiler-parcel mocked compile", () => {
  beforeEach(() => {
    compileMock.mockReset();
  });

  it("calls setMap when compile returns a map", async () => {
    const map = { version: 3, sources: [] };
    compileMock.mockReturnValue({ code: "out", map });
    const setCode = vi.fn();
    const setMap = vi.fn();
    const asset = {
      type: "ts",
      filePath: "/app/Page.ts",
      getCode: async () => "in",
      setCode,
      setMap,
    };

    await parcelConfig.transform({ asset });

    expect(setCode).toHaveBeenCalledWith("out");
    expect(setMap).toHaveBeenCalledWith(map);
  });
});
