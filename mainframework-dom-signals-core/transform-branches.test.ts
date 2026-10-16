import { describe, it, expect } from "vitest";

import { compile } from "./src/index";

const DEFAULT_DIRTY = "@mainframework/signals/dom/internal";

const run = (code: string, options?: Parameters<typeof compile>[1]) =>
  compile(code, { markDomDirtyImport: DEFAULT_DIRTY, ...options }).code;

describe("dom-compiler branches", () => {
  it("rewrites arrow expression bodies", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => (dom.textContent = "x"));
`;
    expect(run(input)).toContain("markDomDirty(dom)");
    expect(run(input)).toContain("try {");
  });

  it("rewrites useDomSignal bindings", () => {
    const input = `import { effect } from "@mainframework/signals";
import { useDomSignal } from "@mainframework/signals/dom";
const dom = useDomSignal("x", null);
effect(() => { dom.textContent = "hi"; });
`;
    expect(run(input)).toContain("markDomDirty(dom)");
  });

  it("rewrites attr: assignments including null removal", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => {
  dom["attr:data-id"] = "1";
  dom["attr:role"] = null;
});
`;
    const out = run(input);
    expect(out).toContain("setAttribute");
    expect(out).toContain("removeAttribute");
  });

  it("skips unsupported assignments and effect forms", () => {
    const input = `import { effect, createSignal } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
const count = createSignal("c", 0);
effect(() => { dom.textContent += "x"; });
effect(() => {}, 1);
effect();
effect("nope");
effect(() => { dom.unknownProp = 1; });
`;
    expect(run(input)).toBe(input);
  });

  it("adds markDomDirty to an existing import declaration", () => {
    const input = `import { other } from "${DEFAULT_DIRTY}";
import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;
    const out = run(input);
    expect(out).toContain(`import { other, markDomDirty } from "${DEFAULT_DIRTY}"`);
  });

  it("inserts markDomDirty import after prologue directives", () => {
    const input = `"use client";
import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;
    const out = run(input);
    expect(out.startsWith('"use client";')).toBe(true);
    expect(out).toContain(`import { markDomDirty } from "${DEFAULT_DIRTY}"`);
  });

  it("covers additional rewrite guards", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
const node = document.createElement("div");
effect(() => node.textContent = "x");
effect(() => { dom["innerHTML"] = "<i/>"; dom.textContent += "a"; });
effect(() => { dom.element.textContent = "nested"; });
effect(() => { if (false) dom.textContent = "a"; });
`;
    const out = run(input);
    expect(out).toContain("innerHTML");
    expect(out).toContain('node.textContent = "x"');
    expect(out).toContain('dom.textContent += "a"');
    expect(out).toContain("dom.element.textContent");
    expect(out).toContain("if (false) dom.textContent = \"a\"");
  });

  it("preserves trailing newline and extra blank line after dirty import", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";

const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;
    const out = run(input);
    expect(out.endsWith("\n")).toBe(true);
    expect(out).toMatch(/import \{ markDomDirty \}[^\n]+\n\nconst/);
  });

  it("skips declarators without init and invalid attr keys", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
let dom;
dom = domSignal("x", null);
effect(() => {
  dom["attr:"] = "x";
  dom["unknown"] = "y";
});
`;
    expect(run(input)).toBe(input);
  });

  it("skips empty attr keys and non-literal computed properties", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
const key = "role";
effect(() => {
  dom["attr:"] = "x";
  dom[key] = "y";
  dom = "z";
});
`;
    expect(run(input)).toBe(input);
  });

  it("skips effect callbacks without rewritable assignments", () => {
    const input = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => {
  console.log(dom);
});
`;
    expect(run(input)).toBe(input);
  });

  it("uses a type-only effect specifier alongside a value import", () => {
    const input = `import { type effect, effect as runEffect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
runEffect(() => { dom.textContent = "a"; });
`;
    expect(run(input)).toContain("markDomDirty");
  });

  it("ignores type-only effect imports and default effect imports", () => {
    const input = `import type { effect } from "@mainframework/signals";
import fx from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
fx(() => { dom.textContent = "a"; });
`;
    expect(run(input)).toBe(input);
  });
});
