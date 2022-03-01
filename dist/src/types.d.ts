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
    windowFunction = "windowFunction"
}
export declare enum EventListenerTypes {
    frequencydata = "frequencydata",
    bytefrequencydata = "bytefrequencydata",
    timedomaindata = "timedomaindata",
    bytetimedomaindata = "bytetimedomaindata"
}
export declare enum WindowFunctionTypes {
    rectangular = "rectangular",
    blackman = "blackman",
    nuttall = "nuttall",
    blackmanNuttall = "blackman-nuttall",
    blackmanHarris = "blackman-harris",
    hann = "hann",
    hamming = "hamming",
    bartlett = "bartlett"
}
declare type NodeAddEventListener<T, L, O = unknown> = (type: T, listener: () => ({
    detail: L;
}), options?: O) => void;
export declare type NodeEventListener<T = Float32Array | Uint8Array> = (event: {
    detail: T;
}) => void;
export declare type AddEventListenerTypes = NodeAddEventListener<EventListenerTypes.bytefrequencydata, Float32Array>;
export {};
