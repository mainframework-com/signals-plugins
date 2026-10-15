import { compile } from "../vendor/dom-signals-core/index.js";
import { Transformer } from "@parcel/plugin";

const domCompilerParcelTransformer = new Transformer({
  async transform({ asset }) {
    const type = asset.type;

    if (type !== "js" && type !== "jsx" && type !== "ts" && type !== "tsx") {
      return [asset];
    }

    const code = await asset.getCode();
    const result = compile(code, { filename: asset.filePath });

    asset.setCode(result.code);

    if (result.map !== undefined) {
      asset.setMap(result.map as Parameters<typeof asset.setMap>[0]);
    }

    return [asset];
  },
});

export default domCompilerParcelTransformer;
