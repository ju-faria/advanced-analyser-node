import { 
  EventListenerTypes,
  Message,
  MessageTypes,
  ProcessorParameters,
  UpdateProcessorOptionsPayload,
  WindowFunctionTypes
} from "../types";

/**
* The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
* The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string, 
* to avoid needing to be manually imported and loaded by this module's consumers
*/
import processor from 'processor';
import { PROCESSOR_NAME } from "../constants";
import { 
  validateFftSize,
  validateSamplesBetweenTransforms,
  validateTimeDomainSamplesCount,
  validateWindowFunction
} from "./validation";

type AdvancedAnalyserNodeProperties = {
  fftSize?: number, 
  samplesBetweenTransforms?: number,
  timeDomainSamplesCount?: number,
  windowFunction?: WindowFunctionTypes,
}

export class AdvancedAnalyserNode extends AudioWorkletNode implements AdvancedAnalyserNode {
  private _portMapId = 0;

  private _portMap = new Map();

  private _fftSize = 1024;

  private _samplesBetweenTransforms?: number;
  
  private _timeDomainSamplesCount?: number;
 
  private _windowFunction: WindowFunctionTypes;

  get fftSize() {
    return this._fftSize;
  }

  set fftSize(value: number) {
    validateFftSize(value);
    this._fftSize = value;
    this._postMessage({
      type: MessageTypes.updateProcessorOptions,
      payload: {
        fftSize: value,
        /**
         * If either _samplesBetweenTransforms or _timeDomainSamplesCount are undefined (meaning it wasn't manually assigned a value)
         * also update these values with the fftSize.
         */
        ...(this._samplesBetweenTransforms ? {} : { samplesBetweenTransforms: value }),
        ...(this._timeDomainSamplesCount ? {} : { timeDomainSamplesCount: value }),
      },
    });
  }

  
  set samplesBetweenTransforms(value: number) {
    validateSamplesBetweenTransforms(value);
    this._samplesBetweenTransforms = value;
    this._updateProcessorOptions({        
      samplesBetweenTransforms: value,
    });
  }

  get samplesBetweenTransforms() {
    return this._samplesBetweenTransforms || this.fftSize;
  }

  get frequencyBinCount() {
    return this.fftSize / 2;
  }

  set timeDomainSamplesCount(value: number) {
    validateTimeDomainSamplesCount(value);
    this._timeDomainSamplesCount = value;
    this._updateProcessorOptions({        
      timeDomainSamplesCount: value,
    });
  }

  get timeDomainSamplesCount() {
    return this._timeDomainSamplesCount || this.fftSize;
  }

  set windowFunction(value: WindowFunctionTypes) {
    validateWindowFunction(value);
    this._windowFunction = value;
    this._updateProcessorOptions({        
      windowFunction: value,
    });
  }

  get windowFunction() {
    return this._windowFunction;
  }

  
  private _eventListenersCount:Record<EventListenerTypes, (EventListenerOrEventListenerObject| CustomEvent<ArrayBuffer>)[]> = {
    [EventListenerTypes.frequencydata]: [],
    [EventListenerTypes.bytefrequencydata]: [],
    [EventListenerTypes.timedomaindata]: [],
    [EventListenerTypes.bytetimedomaindata]: [],
  };

  constructor(
    context: BaseAudioContext,
    inputs: AdvancedAnalyserNodeProperties,
  ) {
    const {
      fftSize = 1024, 
      samplesBetweenTransforms,
      timeDomainSamplesCount,
      windowFunction = WindowFunctionTypes.blackman
    } = inputs;
    const processorOptions =  {
      [ProcessorParameters.fftSize]: fftSize,
      [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
      [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
      [ProcessorParameters.windowFunction]: windowFunction,
    };

    super(context, PROCESSOR_NAME, {
      processorOptions,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: "max",
      channelInterpretation: "speakers",
    });
    
    this._validateInputs(inputs);
    
    this._fftSize = fftSize;
    this._samplesBetweenTransforms = samplesBetweenTransforms;
    this._timeDomainSamplesCount = timeDomainSamplesCount;
    this._windowFunction = windowFunction;
    
    this.port.onmessage = (event) => this._onmessage(event.data);
  }

  private _validateInputs({
    fftSize,
    samplesBetweenTransforms,
    timeDomainSamplesCount,
    windowFunction,
  }:AdvancedAnalyserNodeProperties) {
    validateFftSize(fftSize);
    if (typeof samplesBetweenTransforms !== 'undefined') validateSamplesBetweenTransforms(samplesBetweenTransforms);
    if (typeof timeDomainSamplesCount !== 'undefined') validateTimeDomainSamplesCount(timeDomainSamplesCount);
    if (typeof windowFunction !== 'undefined') validateWindowFunction(windowFunction);
  } 
  
  private _uniqId(){
    return this._portMapId++;
  }

  private _postMessage(message: Message, transfer?: Transferable[]) {
    this.port.postMessage(message, transfer);
  }

  onprocessorerror = (err: Event)  => {
    console.log(`An error from AudioWorkletProcessor.process() occurred: ${err}`);
  };
  
  private _onmessage(event: Message) {
    switch(event.type) {
      case MessageTypes.frequencyDataAvailable: {
        this.dispatchEvent(new CustomEvent<Float32Array>(EventListenerTypes.frequencydata, { detail: new Float32Array(event.payload) }));
        break;
      }
      case MessageTypes.byteFrequencyDataAvailable: {
        this.dispatchEvent(new CustomEvent<Uint8Array>(EventListenerTypes.bytefrequencydata, { detail: new Uint8Array(event.payload) }));
        break;
      }
      case MessageTypes.timeDomainDataAvailable: {
        this.dispatchEvent(new CustomEvent<Float32Array>(EventListenerTypes.timedomaindata, { detail: new Float32Array(event.payload) }));
        break;
      }
      case MessageTypes.byteTimeDomainDataAvailable: {
        this.dispatchEvent(new CustomEvent<Uint8Array>(EventListenerTypes.bytetimedomaindata, { detail: new Uint8Array(event.payload) }));
        break;
      }
      case MessageTypes.requestedFloatFrequencyDataAvailable:
      case MessageTypes.requestedByteFrequencyDataAvailable:
      case MessageTypes.requestedFloatTimeDomainDataAvailable:
      case MessageTypes.requestedByteTimeDomainDataAvailable: {
        const {id, payload} = event;
        const resolve = this._portMap.get(id);
        this._portMap.delete(id);
        resolve(payload);
        break;
      }
    }
  }

  private _updateProcessorOptions(payload: UpdateProcessorOptionsPayload) {
    this._postMessage({
      type: MessageTypes.updateProcessorOptions,
      payload
    });
  }

  private _postIdentifiedDataRequest(
    requestType: MessageTypes.getByteFrequencyData 
    | MessageTypes.getByteTimeDomainData
    | MessageTypes.getFloatFrequencyData 
    | MessageTypes.getFloatTimeDomainData
  ) {
    return new Promise(resolve => {
      const id = this._uniqId();
      this._portMap.set(id, (buffer:ArrayBuffer) => {
        if (
          requestType === MessageTypes.getByteFrequencyData 
          || requestType ===  MessageTypes.getByteTimeDomainData
        ) {
          resolve(new Uint8Array(buffer));

        } else {
          resolve(new Float32Array(buffer));
        }
      });
      this._postMessage({
        id, 
        type: requestType
      });
    });
  }

  getFloatFrequencyData() {
    return this._postIdentifiedDataRequest(MessageTypes.getFloatFrequencyData);
  }

  getByteFrequencyData() {
    return this._postIdentifiedDataRequest(MessageTypes.getByteFrequencyData);
  }

  getFloatTimeDomainData() {
    return this._postIdentifiedDataRequest(MessageTypes.getFloatTimeDomainData);
  }

  getByteTimeDomainData() {
    return this._postIdentifiedDataRequest(MessageTypes.getByteTimeDomainData);
  }


  private _pushEventListener(type: EventListenerTypes, listener:  EventListenerOrEventListenerObject| CustomEvent<ArrayBuffer>) {
    const listeners = this._eventListenersCount[type];

    listeners.push(listener);
    if (listeners.length === 1) {
      this._postMessage({
        type: MessageTypes.startedListeningTo,
        payload: type
      });
    }
  }

  private _removeEventListener(type: EventListenerTypes, listener:  EventListenerOrEventListenerObject| CustomEvent<ArrayBuffer>) {
    const listeners = this._eventListenersCount[type];
    const index = listeners.indexOf(listener);
    if (index === -1) return;
    listeners.splice(index, 1);
    if (listeners.length === 0) {
      this._postMessage({
        type: MessageTypes.stoppedListeningTo,
        payload: type
      });
    }
  }

  addEventListener(type: "processorerror" | EventListenerTypes, listener: EventListenerOrEventListenerObject | CustomEvent<ArrayBuffer>, options?: boolean | AddEventListenerOptions): void { 
    super.addEventListener(type, listener as EventListenerOrEventListenerObject, options);
    if (type !== 'processorerror') this._pushEventListener(type, listener);
  }

  removeEventListener(type:  "processorerror" | EventListenerTypes, listener: EventListenerOrEventListenerObject | CustomEvent<ArrayBuffer>, options?: boolean | EventListenerOptions): void {
    super.removeEventListener(type, listener as EventListenerOrEventListenerObject, options);
    if (type !== 'processorerror') this._removeEventListener(type, listener);
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
  