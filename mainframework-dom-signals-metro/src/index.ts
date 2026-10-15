import { compile } from "../vendor/dom-signals-core/index.js";
import upstreamTransformer from "metro-react-native-babel-transformer";

type MetroTransformParams = {
  src: string;
  filename: string;
  options: Record<string, unknown>;
  plugins?: unknown;
};

export const transform = async (params: MetroTransformParams) => {
  const { src, filename, ...rest } = params;
  const result = compile(src, { filename });

  return upstreamTransformer.transform({
    ...rest,
    filename,
    src: result.code,
  });
};

export default { transform };
