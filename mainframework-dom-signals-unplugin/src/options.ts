import type { TransformOptions } from "../vendor/dom-signals-core/index.js";

export type DomCompilerUnpluginOptions = TransformOptions & {
  include?: RegExp | Array<RegExp | string>;
  exclude?: RegExp | Array<RegExp | string>;
};

const defaultInclude = /\.[mc]?[jt]sx?$/;

const matchesPattern = (id: string, pattern: RegExp | string): boolean => {
  if (typeof pattern === "string") {
    return id.includes(pattern);
  }

  return pattern.test(id);
};

const matchesSome = (id: string, patterns: RegExp | Array<RegExp | string>): boolean => {
  if (Array.isArray(patterns)) {
    return patterns.some((pattern) => matchesPattern(id, pattern));
  }

  return matchesPattern(id, patterns);
};

export const shouldTransformId = (
  id: string,
  options: Pick<DomCompilerUnpluginOptions, "include" | "exclude">,
): boolean => {
  const include = options.include ?? defaultInclude;
  const exclude = options.exclude ?? /node_modules/;

  if (matchesSome(id, exclude)) {
    return false;
  }

  return matchesSome(id, include);
};
