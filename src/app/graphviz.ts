import { instance, type RenderOptions } from "@viz-js/viz";

export type Engine =
  | "dot"
  | "circo"
  | "fdp"
  | "sfdp"
  | "neato"
  | "osage"
  | "patchwork"
  | "twopi"
  | "nop"
  | "nop2";

let _graphvizInstance = null as Awaited<ReturnType<typeof instance>> | null;

export const graphviz = async () => {
  if (!_graphvizInstance) {
    _graphvizInstance = await instance();
  }
  return _graphvizInstance;
};

export const graphvizRender = async (code: string, options?: RenderOptions) => {
  const instance = await graphviz();
  return instance.renderString(code, options);
};
