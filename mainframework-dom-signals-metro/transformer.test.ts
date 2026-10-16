import { describe, it, expect, vi, beforeEach } from "vitest";

const { upstreamTransform } = vi.hoisted(() => ({
  upstreamTransform: vi.fn().mockResolvedValue({ code: "upstream" }),
}));

vi.mock("metro-react-native-babel-transformer", () => ({
  default: { transform: upstreamTransform },
}));

import domCompilerMetro, { transform } from "./src/index.js";

const fixture = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;

describe("dom-compiler-metro", () => {
  beforeEach(() => {
    upstreamTransform.mockClear();
  });

  it("transform compiles before metro handoff", async () => {
    await transform({ src: fixture, filename: "/app/Page.tsx", options: {} });

    expect(upstreamTransform).toHaveBeenCalledOnce();
    const passed = upstreamTransform.mock.calls[0][0] as { src: string; filename: string };
    expect(passed.src).toContain("markDomDirty");
    expect(passed.filename).toBe("/app/Page.tsx");
  });

  it("default export exposes transform", async () => {
    await domCompilerMetro.transform({ src: fixture, filename: "/app/Page.tsx", options: {} });
    expect(upstreamTransform).toHaveBeenCalledOnce();
  });

  it("propagates compile errors", async () => {
    await expect(transform({ src: "{", filename: "/app/Broken.tsx", options: {} })).rejects.toThrow();
    expect(upstreamTransform).not.toHaveBeenCalled();
  });
});
