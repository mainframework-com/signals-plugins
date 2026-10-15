declare module "metro-react-native-babel-transformer" {
  type TransformParams = {
    src: string;
    filename: string;
    options: Record<string, unknown>;
    plugins?: unknown;
  };

  export const transform: (params: TransformParams) => Promise<unknown>;

  const defaultExport: { transform: typeof transform };

  export default defaultExport;
}
