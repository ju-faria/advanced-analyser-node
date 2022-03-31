export declare enum MessageTypes {
    start = 0,
    stop = 1,
    updateProcessorOptions = 2,
    frequencyDataAvailable = 3,
    byteFrequencyDataAvailable = 4,
    timeDomainDataAvailable = 5,
    byteTimeDomainDataAvailable = 6,
    getFloatFrequencyData = 7,
    requestedFloatFrequencyDataAvailable = 8,
    getByteFrequencyData = 9,
    requestedByteFrequencyDataAvailable = 10,
    getFloatTimeDomainData = 11,
    requestedFloatTimeDomainDataAvailable = 12,
    getByteTimeDomainData = 13,
    requestedByteTimeDomainDataAvailable = 14,
    startedListeningTo = 15,
    stoppedListeningTo = 16
}
/**
 * BasicMessage
 */
interface BasicMessage<T, P = unknown> {
    type: T;
    payload?: P;
}
interface IdentifiedMessage<T, P = unknown> extends BasicMessage<T, P> {
    id: number;
}
export declare type UpdateProcessorOptionsPayload = {
    [ProcessorParameters.fftSize]?: number;
    [ProcessorParameters.samplesBetweenTransforms]?: number;
    [ProcessorParameters.timeDomainSamplesCount]?: number;
    [ProcessorParameters.minDecibels]?: number;
    [ProcessorParameters.maxDecibels]?: number;
    [ProcessorParameters.smoothingTimeConstant]?: number;
    [ProcessorParameters.windowFunction]?: WindowFunctionTypes;
};
declare type UpdateProcessorOptionsMessage = BasicMessage<MessageTypes.updateProcessorOptions, UpdateProcessorOptionsPayload>;
declare type FloatFrequencyDataAvailableMessage = BasicMessage<MessageTypes.frequencyDataAvailable, ArrayBuffer>;
declare type ByteFrequencyDataAvailableMessage = BasicMessage<MessageTypes.byteFrequencyDataAvailable, ArrayBuffer>;
declare type FloatTimeDomainDataAvailableMessage = BasicMessage<MessageTypes.timeDomainDataAvailable, ArrayBuffer>;
declare type ByteTimeDomainDataAvailableMessage = BasicMessage<MessageTypes.byteTimeDomainDataAvailable, ArrayBuffer>;
declare type GetFloatFrequencyDataMessage = IdentifiedMessage<MessageTypes.getFloatFrequencyData>;
declare type RequestedFloatFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatFrequencyDataAvailable, ArrayBuffer>;
declare type GetByteFrequencyDataMessage = IdentifiedMessage<MessageTypes.getByteFrequencyData, ArrayBuffer>;
declare type RequestedByteFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteFrequencyDataAvailable, ArrayBuffer>;
declare type GetFloatTimeDomainDataMessage = IdentifiedMessage<MessageTypes.getFloatTimeDomainData>;
declare type RequestedFloatTimeDomainDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatTimeDomainDataAvailable, ArrayBuffer>;
declare type GetByteTimeDomainDataMessage = IdentifiedMessage<MessageTypes.getByteTimeDomainData, ArrayBuffer>;
declare type RequestedByteTimeDomainDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteTimeDomainDataAvailable, ArrayBuffer>;
declare type StartedListeningToMessage = BasicMessage<MessageTypes.startedListeningTo, EventListenerTypes>;
declare type StoppedListeningToMessage = BasicMessage<MessageTypes.stoppedListeningTo, EventListenerTypes>;
export declare type Message = FloatFrequencyDataAvailableMessage | ByteFrequencyDataAvailableMessage | FloatTimeDomainDataAvailableMessage | ByteTimeDomainDataAvailableMessage | GetFloatFrequencyDataMessage | RequestedFloatFrequencyDataAvailableMessage | GetByteFrequencyDataMessage | RequestedByteFrequencyDataAvailableMessage | GetFloatTimeDomainDataMessage | RequestedFloatTimeDomainDataAvailableMessage | GetByteTimeDomainDataMessage | RequestedByteTimeDomainDataAvailableMessage | StartedListeningToMessage | StoppedListeningToMessage | UpdateProcessorOptionsMessage;
export declare enum ProcessorParameters {
    fftSize = "fftSize",
    samplesBetweenTransforms = "samplesBetweenTransforms",
    timeDomainSamplesCount = "timeDomainSamplesCount",
    windowFunction = "windowFunction",
    minDecibels = "minDecibels",
    maxDecibels = "maxDecibels",
    smoothingTimeConstant = "smoothingTimeConstant"
}
export declare type EventListenerTypes = "frequencydata" | "bytefrequencydata" | "timedomaindata" | "bytetimedomaindata";
export declare enum WindowFunctionTypes {
    /**
     * Retangular window - Doesn't change the signal
     */
    rectangular = "rectangular",
    /**
     * [Blackmann window](https://en.wikipedia.org/wiki/Window_function#Blackman_window)
     */
    blackman = "blackman",
    /**
     * [Nuttall window](https://en.wikipedia.org/wiki/Window_function#Nuttall_window,_continuous_first_derivative)
     */
    nuttall = "nuttall",
    /**
     * [Blackman-Nutall window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Nuttall_window)
     */
    blackmanNuttall = "blackman-nuttall",
    /**
     * [Blackman-Harris window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Harris_window)
     */
    blackmanHarris = "blackman-harris",
    /**
     * [Hann window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
     */
    hann = "hann",
    /**
     * [Hamming window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
     */
    hamming = "hamming",
    /**
     * Bartlett window
     */
    bartlett = "bartlett"
}
export declare type AdvancedAnalyserNodeProperties = {
    /**
     * The size of the FFT used for frequency-domain analysis (in sample-frames).
     * This MUST be a power of two in the range 32 to 32768.
     * The default value is 2048. Note that large FFT sizes can be costly to compute.
     */
    fftSize?: number;
    /**
     * The interval in number of samples between transforms. Note that if this number is higher than the fftSize,
     * some samples will be skipped, and if it's lower, samples will be overlapped.
     */
    samplesBetweenTransforms?: number;
    /**
     * The number of samples that will be returned in the time-domain events callback
     */
    timeDomainSamplesCount?: number;
    /**
     * The [Window Function](https://en.wikipedia.org/wiki/Window_function) to be applied applied to the samples before each transform.
     */
    windowFunction?: WindowFunctionTypes;
    /**
     * Value representing the maximum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event.
     */
    maxDecibels?: number;
    /**
     * Value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event.
     */
    minDecibels?: number;
    /**
     * Represents the averaging constant with the last analysis frame.
     * It's basically an average between the current buffer and the last buffer the AnalyserNode processed,
     * and results in a much smoother set of value changes over time.
     */
    smoothingTimeConstant?: number;
};
export declare type Listener<T> = (prop: {
    detail: T;
}) => void;
export {};
