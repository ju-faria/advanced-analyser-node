import { WindowingFunctionTypes } from "src/types";

export const applyBlackmanWindow = (samples: Float32Array) => {
  const alpha = 0.16;
  const a0 = 0.5 * (1.0 - alpha);
  const a1 = 0.5;
  const a2 = 0.5 * alpha;
  const n = samples.length;
  for (let i = 0; i < n; i++) {
    const x = i / n;
    const window = a0 - a1 * Math.cos(Math.PI * 2.0 * x) + a2 * Math.cos( Math.PI * 2.0 * 2.0 * x);
    samples[i] *= Math.abs(window);
  }
};


export const windowFunctionsMap:Record<WindowingFunctionTypes, (samples: Float32Array) => void> = {
  none: () => { /* do nothing */},
  blackmanWindow: applyBlackmanWindow,
};