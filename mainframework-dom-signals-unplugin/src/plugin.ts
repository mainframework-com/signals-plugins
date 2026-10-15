import { compile } from "../vendor/dom-signals-core/index.js";
import { createUnplugin } from "unplugin";

import type { DomCompilerUnpluginOptions } from "./options.js";
import { shouldTransformId } from "./options.js";

export const domCompilerUnplugin = createUnplugin((options: DomCompilerUnpluginOptions = {}) => {
  const { include, exclude, ...compileOptions } = options;

  return {
    name: "mainframework-dom-signals-unplugin",
    enforce: "pre" as const,
    transformInclude(id) {
      return shouldTransformId(id, { include, exclude });
    },
    transform(code, id) {
      const result = compile(code, { ...compileOptions, filename: id });

      if (result.code === code && result.map === undefined) {
        return null;
      }

      if (result.map === undefined) {
        return { code: result.code };
      }

      return {
        code: result.code,
        map: result.map as import("rollup").SourceMapInput,
      };
    },
  };
});
