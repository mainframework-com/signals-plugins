import { compile } from "../vendor/dom-signals-core/index.js";

type TurbopackLoaderContext = {
  resourcePath: string;
  async: () => (error: Error | null, content?: string, map?: string) => void;
};

const domCompilerTurbopackLoader = function domCompilerTurbopackLoader(this: TurbopackLoaderContext, source: string) {
  const callback = this.async();
  const result = compile(source, { filename: this.resourcePath });
  const map = result.map !== undefined ? JSON.stringify(result.map) : undefined;
  callback(null, result.code, map);
};

export default domCompilerTurbopackLoader;
