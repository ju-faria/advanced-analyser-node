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


declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[];
  }
): undefined;