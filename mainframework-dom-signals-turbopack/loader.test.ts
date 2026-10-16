import { describe, it, expect, vi } from "vitest";

import { compile } from "./vendor/dom-signals-core/index.js";

import { domCompilerTurbopackLoader } from "./src/index.js";

const fixture = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;

describe("dom-compiler-turbopack", () => {
  it("loader matches compile output", () => {
    const callback = vi.fn();
    const async = () => callback;

    domCompilerTurbopackLoader.call({ resourcePath: "/app/Page.tsx", async }, fixture);

    expect(callback).toHaveBeenCalledOnce();
    const expected = compile(fixture, { filename: "/app/Page.tsx" });
    expect(callback.mock.calls[0][0]).toBeNull();
    expect(callback.mock.calls[0][1]).toBe(expected.code);
    const mapArg = callback.mock.calls[0][2] as string | undefined;
    if (expected.map !== undefined) {
      expect(mapArg).toBe(JSON.stringify(expected.map));
    } else {
      expect(mapArg).toBeUndefined();
    }
  });

  it("propagates compile errors", () => {
    const callback = vi.fn();
    expect(() =>
      domCompilerTurbopackLoader.call({ resourcePath: "/app/Broken.tsx", async: () => callback }, "{"),
    ).toThrow();
    expect(callback).not.toHaveBeenCalled();
  });
});
