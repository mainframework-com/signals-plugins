import { describe, it, expect, vi, beforeEach } from "vitest";

const { upstreamTransform } = vi.hoisted(() => ({
  upstreamTransform: vi.fn().mockResolvedValue({ code: "upstream" }),
}));

vi.mock("metro-react-native-babel-transformer", () => ({
  default: { transform: upstreamTransform },
}));

import { transform } from "./src/index.js";

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
    const passed = upstreamTransform.mock.calls[0][0] as { src: string };
    expect(passed.src).toContain("markDomDirty");
  });
});
