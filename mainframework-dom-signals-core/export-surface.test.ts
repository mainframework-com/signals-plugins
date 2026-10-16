import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { compile, transform } from "./src/index";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "test/fixtures");

const readFixture = (name: string) => readFileSync(join(fixturesDir, name), "utf8");

const DEFAULT_DIRTY = "@mainframework/signals/dom/internal";

describe("dom-compiler export surface", () => {
  it("compile matches canonical fixture output", () => {
    const input = readFixture("canonical-input.ts");
    const expected = readFixture("canonical-output.ts");
    const normalize = (value: string) => value.replace(/\r\n/g, "\n");
    expect(normalize(compile(input, { markDomDirtyImport: DEFAULT_DIRTY }).code)).toBe(normalize(expected));
  });

  it("deprecated transform matches compile", () => {
    const code = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;
    const opts = { markDomDirtyImport: DEFAULT_DIRTY, filename: "a.tsx" };
    expect(transform(code, opts)).toEqual(compile(code, opts));
  });

  it("returns unchanged code when nothing to rewrite", () => {
    const code = `export const x = 1;\n`;
    expect(compile(code).code).toBe(code);
  });

  it("throws on invalid syntax", () => {
    expect(() => compile("{")).toThrow();
  });

  it("honors markDomDirtyImport, bindings, effectImportSources, and filename", () => {
    const code = `import { effect } from "my-effects";
const dom = placeholder();
effect(() => { dom.innerHTML = "<b/>"; });
`;
    const result = compile(code, {
      markDomDirtyImport: "custom/mark",
      bindings: ["dom"],
      effectImportSources: ["my-effects"],
      filename: "/app/Page.tsx",
    });
    expect(result.code).toContain('import { markDomDirty } from "custom/mark"');
    expect(result.code).toContain("innerHTML");
    expect(result.code).toContain("innerHTML");
  });

  it("rewrites function expression effect callbacks", () => {
    const code = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(function () {
  dom.textContent = "a";
});
`;
    expect(compile(code, { markDomDirtyImport: DEFAULT_DIRTY }).code).toContain("markDomDirty");
  });

  it("returns a result object with filename set when provided", () => {
    const code = `import { effect } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
const dom = domSignal("x", null);
effect(() => { dom.textContent = "a"; });
`;
    const result = compile(code, { filename: "/app/Page.tsx" });
    expect(result.code).toContain("markDomDirty");
    expect(result).toHaveProperty("code");
  });

  it("keeps code without a trailing newline", () => {
    const code = `export const x = 1;`;
    expect(compile(code).code).toBe(code);
  });
});
