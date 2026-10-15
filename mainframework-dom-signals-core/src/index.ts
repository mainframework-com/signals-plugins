import { transform } from "./transform.js";

export const compile = transform;

/** @deprecated Use `compile`. */
export { transform };

export type { TransformOptions, TransformResult } from "./types.js";
