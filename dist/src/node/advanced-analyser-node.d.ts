import { AdvancedAnalyserNodeProperties, EventListenerTypes, Listener, WindowFunctionTypes } from "../types";
/**
 * The Audio Node class. Do not instantiate this class directly.
 * Use the `createAdvancedAnalyserNode` method instead.
 */
export declare class AdvancedAnalyserNode extends AudioWorkletNode {
    private _portMapId;
    private _portMap;
    private _fftSize;
    private _samplesBetweenTransforms?;
    private _timeDomainSamplesCount?;
    private _windowFunction;
    private _minDecibels;
    private _maxDecibels;
    private _smoothingTimeConstant;
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
    get fftSize(): number;
    set fftSize(value: number);
    set samplesBetweenTransforms(value: number);
    get samplesBetweenTransforms(): number;
    get frequencyBinCount(): number;
    set timeDomainSamplesCount(value: number);
    get timeDomainSamplesCount(): number;
    set windowFunction(value: WindowFunctionTypes);
    get windowFunction(): WindowFunctionTypes;
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
    get minDecibels(): number;
    set minDecibels(value: number);
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
    get maxDecibels(): number;
    set maxDecibels(value: number);
    /**
     * Represents the averaging constant with the last analysis frame.
     * It's basically an average between the current buffer and the last buffer the AnalyserNode processed,
     * and results in a much smoother set of value changes over time.
     *
     * @defaultValue 0. No averaging is applied.
     */
    get smoothingTimeConstant(): number;
    set smoothingTimeConstant(value: number);
    private _eventListenersCount;
    /**
     * The Audiio Node class. Do not instantiate this class directly.
     * Use the `createAdvancedAnalyserNode` method, which registers this Worklet before instantiating it
     */
    constructor(context: BaseAudioContext, properties: AdvancedAnalyserNodeProperties);
    private _uniqId;
    private _postMessage;
    onprocessorerror: (err: Event) => void;
    private _onmessage;
    private _updateProcessorOptions;
    private _postIdentifiedDataRequest;
    getFloatFrequencyData(): Promise<Float32Array>;
    getByteFrequencyData(): Promise<Uint8Array>;
    getFloatTimeDomainData(): Promise<Float32Array>;
    getByteTimeDomainData(): Promise<Uint8Array>;
    private _pushEventListener;
    private _removeEventListener;
    addEventListener(type: EventListenerTypes.bytefrequencydata | EventListenerTypes.bytetimedomaindata, listener: Listener<Uint8Array>): void;
    addEventListener(type: EventListenerTypes.frequencydata | EventListenerTypes.timedomaindata, listener: Listener<Float32Array>): void;
    addEventListener(type: "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: "processorerror" | EventListenerTypes, listener: EventListenerOrEventListenerObject | Listener<ArrayBuffer>, options?: boolean | EventListenerOptions): void;
}
