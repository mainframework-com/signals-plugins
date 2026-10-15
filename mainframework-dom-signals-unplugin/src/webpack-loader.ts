import { compile } from "../vendor/dom-signals-core/index.js";

type WebpackLoaderContext = {
  resourcePath: string;
  async: () => (error: Error | null, content?: string, map?: object) => void;
};

const domCompilerWebpackLoader = function domCompilerWebpackLoader(this: WebpackLoaderContext, source: string) {
  const callback = this.async();
  const result = compile(source, { filename: this.resourcePath });
  callback(null, result.code, result.map);
};

export default domCompilerWebpackLoader;
