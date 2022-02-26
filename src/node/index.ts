import { EventListenerTypes, Message, MessageTypes, ProcessorParameters, WindowingFunctionTypes } from "../types";
/**
* The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
* The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string, 
* to avoid needing to be manually imported and loaded by this module's consumers
*/
import processor from 'processor';

type AdvancedAnalyserNodeProperties = {
  dataAsByteArray: boolean,
  fftSize?: number, 
  samplesBetweenTransforms?: number,
  windowFunction?: WindowingFunctionTypes,
}

export class AdvancedAnalyserNode extends AudioWorkletNode {
  fftSize: number;
  samplesBetweenTransforms?: number;
  _portMapId = 0;
  _portMap = new Map();
  _eventListenersCount:Record<EventListenerTypes, EventListenerOrEventListenerObject[]> = {
    [EventListenerTypes.frequencydata]: [],
    [EventListenerTypes.bytefrequencydata]: [],
  };
  // _onDataAvailable = new CustomEvent('ondataavailable', { value: })
  constructor(
    context: BaseAudioContext,
    {
      fftSize = 1024, 
      samplesBetweenTransforms,
      windowFunction = WindowingFunctionTypes.blackmanWindow
    }:AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties
  ) {
    super(context, 'AdvancedAnalyserProcessor', {
      processorOptions: {
        [ProcessorParameters.fftSize]: fftSize,
        [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
        [ProcessorParameters.windowFunction]: windowFunction,
      }
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
        this.dispatchEvent(new CustomEvent<Float32Array>(EventListenerTypes.frequencydata, { detail: event.payload }));
        break;
      }
      case MessageTypes.byteFrequencyDataAvailable: {
        this.dispatchEvent(new CustomEvent<Uint8Array>(EventListenerTypes.bytefrequencydata, { detail: event.payload }));
        break;
      }
      case MessageTypes.requestedFloatFrequencyDataAvailable: {
        const {id, payload} = event;
        const resolve = this._portMap.get(id);
        this._portMap.delete(id);
        resolve(payload);
        break;
      }
    }

  }
  
  getFloatFrequencyData() {
    return new Promise(resolve => {
      const id = this._uniqId();
      this._portMap.set(id, (buffer:ArrayBuffer) => resolve(new Float32Array(buffer)));
      this._postMessage({
        id, 
        type: MessageTypes.getFloatFrequencyData,
      });
    });
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
  
