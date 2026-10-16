import { describe, it, expect, vi } from "vitest";

import domCompilerParcelTransformer from "./src/index.js";

const fixture = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;

const parcelConfig = (
  domCompilerParcelTransformer as unknown as Record<
    symbol,
    { transform: (opts: { asset: unknown }) => Promise<unknown[]> }
  >
)[Symbol.for("parcel-plugin-config")];

describe("dom-compiler-parcel", () => {
  it("transformer compiles asset code", async () => {
    const setCode = vi.fn();
    const asset = {
      type: "tsx",
      filePath: "/app/Page.tsx",
      getCode: async () => fixture,
      setCode,
      setMap: vi.fn(),
    };

    const result = await parcelConfig.transform({ asset });

    expect(setCode).toHaveBeenCalledOnce();
    expect(setCode.mock.calls[0][0]).toContain("markDomDirty");
    expect(result).toEqual([asset]);
  });

  it("returns the asset unchanged for non-js/ts types", async () => {
    const setCode = vi.fn();
    const asset = {
      type: "css",
      filePath: "/app/styles.css",
      getCode: async () => "body {}",
      setCode,
      setMap: vi.fn(),
    };

    const result = await parcelConfig.transform({ asset });

    expect(setCode).not.toHaveBeenCalled();
    expect(result).toEqual([asset]);
  });
});
