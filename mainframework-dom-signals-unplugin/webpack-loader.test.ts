import { describe, it, expect, vi } from "vitest";

import { compile } from "./vendor/dom-signals-core/index.js";

import domCompilerWebpackLoader from "./src/webpack-loader.js";

const fixture = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;

describe("dom-compiler-unplugin webpack-loader", () => {
  it("loader matches compile", () => {
    const callback = vi.fn();
    const async = () => callback;

    domCompilerWebpackLoader.call({ resourcePath: "/app/Page.tsx", async }, fixture);

    expect(callback).toHaveBeenCalledOnce();
    const expected = compile(fixture, { filename: "/app/Page.tsx" });
    expect(callback.mock.calls[0][1]).toBe(expected.code);
  });
});
