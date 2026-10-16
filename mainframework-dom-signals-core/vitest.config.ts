import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/*.test.ts"],
      thresholds: {
        lines: 97,
        functions: 100,
        branches: 93,
        statements: 97,
      },
    },
  },
});
