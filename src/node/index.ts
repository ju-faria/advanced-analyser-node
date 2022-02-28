import { EventListenerTypes, Message, MessageTypes, ProcessorParameters, WindowingFunctionTypes } from "../types";

/**
* The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
* The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string, 
* to avoid needing to be manually imported and loaded by this module's consumers
*/
import processor from 'processor';
import { PROCESSOR_NAME } from "src/constants";

type AdvancedAnalyserNodeProperties = {
  dataAsByteArray: boolean,
  fftSize?: number, 
  samplesBetweenTransforms?: number,
  timeDomainSamplesCount?: number,
  windowFunction?: WindowingFunctionTypes,
}

export class AdvancedAnalyserNode extends AudioWorkletNode {
  _portMapId = 0;

  _portMap = new Map();

  _eventListenersCount:Record<EventListenerTypes, EventListenerOrEventListenerObject[]> = {
    [EventListenerTypes.frequencydata]: [],
    [EventListenerTypes.bytefrequencydata]: [],
    [EventListenerTypes.timedomaindata]: [],
    [EventListenerTypes.bytetimedomaindata]: [],
  };

  constructor(
    context: BaseAudioContext,
    {
      fftSize = 1024, 
      samplesBetweenTransforms,
      timeDomainSamplesCount,
      windowFunction = WindowingFunctionTypes.blackman
    }:AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties
  ) {
    super(context, PROCESSOR_NAME, {
      processorOptions: {
        [ProcessorParameters.fftSize]: fftSize,
        [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
        [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
        [ProcessorParameters.windowFunction]: windowFunction,
      },
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: "max",
      channelInterpretation: "speakers",
    });
    this.port.onmessage = (event) => this._onmessage(event.data);
  }
  
  _uniqId(){
    return this._portMapId++;
  }

  _postMessage(message: Message, transfer?: Transferable[]) {
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

  _postIdentifiedDataRequest(
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

  start() {
    this.parameters.get('isRecording').setValueAtTime(1, this.context.currentTime);
  }

  _pushEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject) {
    const listeners = this._eventListenersCount[type];

    listeners.push(listener);
    if (listeners.length === 1) {
      this._postMessage({
        type: MessageTypes.startedListeningTo,
        payload: type
      });
    }
  }

  _removeEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject) {
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

  addEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void { 
    super.addEventListener(type, listener, options);
    if (type !== 'processorerror' && typeof this._eventListenersCount[type] !== 'undefined' ) this._pushEventListener(type, listener);
  }

  removeEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    super.removeEventListener(type, listener, options);
    if (type !== 'processorerror' && typeof this._eventListenersCount[type] !== 'undefined') this._removeEventListener(type, listener);
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
  
