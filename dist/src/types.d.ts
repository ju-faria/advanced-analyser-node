export declare enum MessageTypes {
    start = 0,
    stop = 1,
    frequencyDataAvailable = 2,
    byteFrequencyDataAvailable = 3,
    timeDomainDataAvailable = 4,
    byteTimeDomainDataAvailable = 5,
    getFloatFrequencyData = 6,
    requestedFloatFrequencyDataAvailable = 7,
    getByteFrequencyData = 8,
    requestedByteFrequencyDataAvailable = 9,
    getFloatTimeDomainData = 10,
    requestedFloatTimeDomainDataAvailable = 11,
    getByteTimeDomainData = 12,
    requestedByteTimeDomainDataAvailable = 13,
    startedListeningTo = 14,
    stoppedListeningTo = 15
}
interface BasicMessage<T, P = unknown> {
    type: T;
    payload?: P;
}
interface IdentifiedMessage<T, P = unknown> extends BasicMessage<T, P> {
    id: number;
}
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
export declare type Message = FloatFrequencyDataAvailableMessage | ByteFrequencyDataAvailableMessage | FloatTimeDomainDataAvailableMessage | ByteTimeDomainDataAvailableMessage | GetFloatFrequencyDataMessage | RequestedFloatFrequencyDataAvailableMessage | GetByteFrequencyDataMessage | RequestedByteFrequencyDataAvailableMessage | GetFloatTimeDomainDataMessage | RequestedFloatTimeDomainDataAvailableMessage | GetByteTimeDomainDataMessage | RequestedByteTimeDomainDataAvailableMessage | StartedListeningToMessage | StoppedListeningToMessage;
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
export declare enum WindowingFunctionTypes {
    rectangular = "rectangular",
    blackman = "blackman",
    nuttall = "nuttall",
    blackmanNuttall = "blackman-nuttall",
    blackmanHarris = "blackman-harris",
    hann = "hann",
    hamming = "hamming",
    bartlett = "bartlett"
}
export {};
