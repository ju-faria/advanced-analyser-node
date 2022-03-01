declare module "processor" {
  const value: string;
  export default value;
}

type AudioParamDescriptor = {
  name: string,
  defaultValue?: number,
  maxValue?: number,
  minValue?: number
}

interface AudioWorkletProcessor {
  readonly port: MessagePort;  
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

interface AdvancedAnalyserNode extends AudioNode {
  onprocessorerror: ((this: AudioWorkletNode, ev: Event) => unknown) | null;
  readonly parameters: AudioParamMap;
  readonly port: MessagePort;
  addEventListener<T>(type: string, listener: EventListenerOrEventListenerObject| CustomEvent<T>, options?: boolean | AddEventListenerOptions): void; 
  removeEventListener<T>(type: string, listener: EventListenerOrEventListenerObject| CustomEvent<T>, options?: boolean | AddEventListenerOptions): void; 
}

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[];
  }
): undefined;



declare module 'fft-windowing-ts' {
  // const blackman:(samples: Float32Array) => void;
  const hann: (array: number[], alpha?: number | undefined) => number[];
  const hamming: (array: number[], alpha?: number | undefined) => number[];
  const cosine: (array: number[], alpha?: number | undefined) => number[];
  const lanczos: (array: number[], alpha?: number | undefined) => number[];
  const gaussian: (array: number[], alpha?: number | undefined) => number[];
  const tukey: (array: number[], alpha?: number | undefined) => number[];
  const blackman: (array: number[], alpha?: number | undefined) => number[];
  const exact_blackman: (array: number[], alpha?: number | undefined) => number[];
  const kaiser: (array: number[], alpha?: number | undefined) => number[];
  const nuttall: (array: number[], alpha?: number | undefined) => number[];
  const blackmanHarris: (array: number[], alpha?: number | undefined) => number[];
  const blackmanNuttall: (array: number[], alpha?: number | undefined) => number[];
  const flat_top: (array: number[], alpha?: number | undefined) => number[];
}