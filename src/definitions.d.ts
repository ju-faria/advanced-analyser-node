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

declare class AudioWorkletProcessor {
  prototype: AudioWorkletProcessor;

  constructor (options?: AudioWorkletNodeOptions);
}

interface AdvancedAnalyserNode extends AudioNode {
  onprocessorerror: ((this: AudioWorkletNode, ev: Event) => unknown) | null;
  readonly channelCount: number;
  readonly channelCountMode: ChannelCountMode;
  readonly channelInterpretation: ChannelInterpretation;
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



