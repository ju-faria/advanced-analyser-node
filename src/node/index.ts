import { Message, MessageTypes, ProcessorParameters } from "../types";
/**
* The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
* The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string, 
* to avoid needing to be manually imported and loaded by this module's consumers
*/
import processor from 'processor';

type AdvancedAnalyserNodeProperties = {
  onData: (data: Uint8Array) => void,
  fftSize?: number, 
  samplesBetweenTransforms?: number
}

export class AdvancedAnalyserNode extends AudioWorkletNode {
  onData: (data: Uint8Array) => void;
  fftSize: number;
  samplesBetweenTransforms?: number;
  
  constructor(
    context: BaseAudioContext,
    {
      onData, 
      fftSize = 1024, 
      samplesBetweenTransforms,
    }:AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties
  ) {
    super(context, 'AdvancedAnalyserProcessor', {
      processorOptions: {
        [ProcessorParameters.fftSize]: fftSize,
        [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize
      }
    });
    this.port.onmessage = (event) => this.onmessage(event.data);
    this.onData = onData;
  }
  
  onprocessorerror = (err: Event)  => {
    console.log(`An error from AudioWorkletProcessor.process() occurred: ${err}`);
  };
  
  onmessage(event: Message) {
    if (event.type === MessageTypes.dataAvailable) {
      this.onData(event.data);
    }
  }
  
  start() {
    this.parameters.get('isRecording').setValueAtTime(1, this.context.currentTime);
  }
}

export const createAdvancedAnalyserNode = async (context: BaseAudioContext, options:AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties) => {
  const processorUrl = 'data:application/javascript;base64,' + processor;
  await context.audioWorklet.addModule(processorUrl);
  const advancedAnalyser = new AdvancedAnalyserNode(context, {
    ...options,
  });
  return advancedAnalyser;
};
  
