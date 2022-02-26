import { WindowingFunctionTypes } from "src/types";
export declare const applyBlackmanWindow: (samples: Float32Array) => void;
export declare const windowFunctionsMap: Record<WindowingFunctionTypes, (samples: Float32Array) => void>;
