import { 
  AdvancedAnalyserNodeProperties,
  EventListenerTypes,
  Listener,
  Message,
  MessageTypes,
  ProcessorParameters,
  UpdateProcessorOptionsPayload,
  WindowFunctionTypes
} from "../types";


import { PROCESSOR_NAME } from "../constants";
import { 
  validateFftSize,
  validateMaxAndMinDecibels,
  validateSamplesBetweenTransforms,
  validateSmoothingTimeConstant,
  validateTimeDomainSamplesCount,
  validateWindowFunction
} from "./validation";

/**
 * The Audio Node class. Do not instantiate this class directly.
 * Use the `createAdvancedAnalyserNode` method instead.
 */
export class AdvancedAnalyserNode extends AudioWorkletNode  {
  private _portMapId = 0;

  private _portMap = new Map();

  private _fftSize = 2048;

  private _samplesBetweenTransforms?: number;
  
  private _timeDomainSamplesCount?: number;
 
  private _windowFunction: WindowFunctionTypes;
  
  private _minDecibels: number;

  private _maxDecibels: number;

  private _smoothingTimeConstant: number;

  readonly channelCount: number;

  readonly numberOfInputs: number;
  
  readonly numberOfOutputs: number;

  readonly channelCountMode: ChannelCountMode;
  
  readonly channelInterpretation: ChannelInterpretation;

  /**
   * The size of the FFT used for frequency-domain analysis (in sample-frames). 
   * This MUST be a power of two in the range 32 to 32768. The default value is 2048.
   * Note that large FFT sizes can be costly to compute.
   * 
   * @defaultValue 2048
   */
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
        /*
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

  /**
   * Represents the minimum power value in the scaling range for the FFT analysis data,
   * for conversion to unsigned byte values.
   * Basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` 
   * or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of minDecibels
   * or lower will be returned as 0.
   * 
   * An exception will be thrown if set to more than or equal to maxDecibels.
   * @defaultValue -100 dB
   */
  get minDecibels() {
    return this._minDecibels;
  }

  set minDecibels(value: number) {
    validateMaxAndMinDecibels(value, this._maxDecibels);
    this._minDecibels = value;
    this._updateProcessorOptions({        
      minDecibels: value,
    });
  }

  /**
   * Represents the maximum power value in the scaling range for the FFT analysis data,
   * for conversion to unsigned byte values.
   * Basically, this specifies the maximum value for the range of results when using `getByteFrequencyData()` 
   * or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of maxDecibels
   * or higher will be returned as 255.
   * 
   * An exception will be thrown if set to less than or equal to maxDecibels.
   * @defaultValue -30 dB
   */
  get maxDecibels() {
    return this._maxDecibels;
  }

  set maxDecibels(value: number) {
    validateMaxAndMinDecibels(this._minDecibels, value);
    this._maxDecibels = value;
    this._updateProcessorOptions({        
      maxDecibels: value,
    });
  }

  /** 
   * Represents the averaging constant with the last analysis frame. 
   * It's basically an average between the current buffer and the last buffer the AnalyserNode processed, 
   * and results in a much smoother set of value changes over time.
   * 
   * @defaultValue 0. No averaging is applied.
   */
  get smoothingTimeConstant() {
    return this._smoothingTimeConstant;
  }

  set smoothingTimeConstant(value: number) {
    validateSmoothingTimeConstant(value);
    this._smoothingTimeConstant = value;
    this._updateProcessorOptions({        
      smoothingTimeConstant: value,
    });
  }


  private _eventListenersCount:Record<EventListenerTypes, (EventListenerOrEventListenerObject| Listener<ArrayBuffer>)[]> = {
    [EventListenerTypes.frequencydata]: [],
    [EventListenerTypes.bytefrequencydata]: [],
    [EventListenerTypes.timedomaindata]: [],
    [EventListenerTypes.bytetimedomaindata]: [],
  };
  

  /**
   * The Audiio Node class. Do not instantiate this class directly.
   * Use the `createAdvancedAnalyserNode` method, which registers this Worklet before instantiating it
   */
  constructor(
    context: BaseAudioContext,
    properties: AdvancedAnalyserNodeProperties,
  ) {
    const {
      fftSize = 2048, 
      samplesBetweenTransforms,
      timeDomainSamplesCount,
      windowFunction = WindowFunctionTypes.blackman,
      minDecibels = -100,
      maxDecibels = -30,
      smoothingTimeConstant = 0,
    } = properties;
    const processorOptions =  {
      [ProcessorParameters.fftSize]: fftSize,
      [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
      [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
      [ProcessorParameters.windowFunction]: windowFunction,
      [ProcessorParameters.minDecibels]: minDecibels,
      [ProcessorParameters.maxDecibels]: maxDecibels,
      [ProcessorParameters.smoothingTimeConstant]: smoothingTimeConstant,
    };

    super(context, PROCESSOR_NAME, {
      processorOptions,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: "max",
      channelInterpretation: "speakers",
    });
    
    this.fftSize = fftSize;
    if (typeof samplesBetweenTransforms !== 'undefined') this.samplesBetweenTransforms = samplesBetweenTransforms;
    if (typeof timeDomainSamplesCount !== 'undefined') this.timeDomainSamplesCount = timeDomainSamplesCount;
    this.windowFunction = windowFunction;
    this.minDecibels = minDecibels;
    this.maxDecibels = maxDecibels;
    this.smoothingTimeConstant = smoothingTimeConstant;

    this.port.onmessage = (event) => this._onmessage(event.data);
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
    | MessageTypes.getFloatTimeDomainData,
  
  ): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      const id = this._uniqId();
      this._portMap.set(id, (buffer: ArrayBuffer) => resolve(buffer));
      this._postMessage({
        id, 
        type: requestType
      });
    });
  }

  async getFloatFrequencyData(): Promise<Float32Array> {
    return new Float32Array(await this._postIdentifiedDataRequest(MessageTypes.getFloatFrequencyData));
  }

  async getByteFrequencyData(): Promise<Uint8Array> {
    return new Uint8Array(await this._postIdentifiedDataRequest(MessageTypes.getByteFrequencyData));
  }

  async getFloatTimeDomainData(): Promise<Float32Array> {
    return new Float32Array(await this._postIdentifiedDataRequest(MessageTypes.getFloatTimeDomainData));
  }

  async getByteTimeDomainData(): Promise<Uint8Array> {
    return new Uint8Array(await this._postIdentifiedDataRequest(MessageTypes.getByteTimeDomainData));
  }


  private _pushEventListener(type: EventListenerTypes, listener:  EventListenerOrEventListenerObject| Listener<ArrayBuffer>) {
    const listeners = this._eventListenersCount[type];

    listeners.push(listener);
    if (listeners.length === 1) {
      this._postMessage({
        type: MessageTypes.startedListeningTo,
        payload: type
      });
    }
  }

  private _removeEventListener(type: EventListenerTypes, listener:  EventListenerOrEventListenerObject| Listener<ArrayBuffer>) {
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

  addEventListener(type: EventListenerTypes.bytefrequencydata | EventListenerTypes.bytetimedomaindata, listener: Listener<Uint8Array>): void;

  addEventListener(type: EventListenerTypes.frequencydata | EventListenerTypes.timedomaindata, listener: Listener<Float32Array>): void;

  
  addEventListener(type: "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void ;
  
  addEventListener(type: "processorerror" | EventListenerTypes, listener: EventListenerOrEventListenerObject | Listener<Float32Array | Uint8Array>, options?: boolean | AddEventListenerOptions): void { 
    super.addEventListener(type, listener as EventListenerOrEventListenerObject, options);
    if (type !== 'processorerror') this._pushEventListener(type, listener);
  }

  removeEventListener(type:  "processorerror" | EventListenerTypes, listener: EventListenerOrEventListenerObject | Listener<ArrayBuffer>, options?: boolean | EventListenerOptions): void {
    super.removeEventListener(type, listener as EventListenerOrEventListenerObject, options);
    if (type !== 'processorerror') this._removeEventListener(type, listener);
  }
}

