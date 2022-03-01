import { WindowFunctionTypes } from "../types";


export const hann = (n: number, points: number) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (points - 1));

export const hamming = (n: number, points: number) => 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (points - 1));

export const blackman = (n: number, points: number) => {
  return (
    0.42 -
      0.5 * Math.cos((2 * Math.PI * n) / (points - 1)) +
      0.08 * Math.cos((4 * Math.PI * n) / (points - 1))
  );
};

export const nuttall = (n: number, points: number) => {
  return (
    0.355768 -
      0.487396 * Math.cos((2 * Math.PI * n) / (points - 1)) +
      0.144232 * Math.cos((4 * Math.PI * n) / (points - 1)) -
      0.012604 * Math.cos((6 * Math.PI * n) / (points - 1))
  );
};

export const blackmanHarris = (n: number, points: number) => {
  return (
    0.35875 -
      0.48829 * Math.cos((2 * Math.PI * n) / (points - 1)) +
      0.14128 * Math.cos((4 * Math.PI * n) / (points - 1)) -
      0.01168 * Math.cos((6 * Math.PI * n) / (points - 1))
  );
};

export const blackmanNuttall = (n: number, points: number) => {
  return (
    0.3635819 -
      0.4891775 * Math.cos((2 * Math.PI * n) / (points - 1)) +
      0.1365995 * Math.cos((4 * Math.PI * n) / (points - 1)) -
      0.0106411 * Math.cos((6 * Math.PI * n) / (points - 1))
  );
};

export const barlett = (n: number, points: number) => {
  return 1 - Math.abs( 2 * (n - 0.5*(points-1)) / (points-1) );
};

export const applyWindowFunction = (
  data: Float32Array,
  windowingFunction: (n:number, points: number, alpha?: number) => number,
  alpha?: number
) => {
  const datapoints = data.length;
  for (let n = 0; n < datapoints; ++n) {
    data[n] = data[n] * windowingFunction(n, datapoints, alpha);
  }
};

export const windowFunctionsMap:Record<WindowFunctionTypes, (samples: Float32Array, alpha?: number) => void> = {
  [WindowFunctionTypes.rectangular]: () => { /* does nothing */ },
  [WindowFunctionTypes.hann]: (data: Float32Array) => applyWindowFunction(data, hann),
  [WindowFunctionTypes.hamming]: (data: Float32Array) => applyWindowFunction(data, hamming),
  [WindowFunctionTypes.blackman]: (data: Float32Array) => applyWindowFunction(data, blackman),
  [WindowFunctionTypes.blackmanNuttall]: (data: Float32Array) => applyWindowFunction(data, blackmanNuttall),
  [WindowFunctionTypes.blackmanHarris]: (data: Float32Array) => applyWindowFunction(data, blackmanHarris),
  [WindowFunctionTypes.nuttall]: (data: Float32Array) => applyWindowFunction(data, nuttall),
  [WindowFunctionTypes.bartlett]: (data: Float32Array) => applyWindowFunction(data, barlett),
};