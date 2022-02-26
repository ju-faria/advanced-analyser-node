export declare enum MessageTypes {
    start = 0,
    stop = 1,
    frequencyDataAvailable = 2,
    byteFrequencyDataAvailable = 3,
    getFloatFrequencyData = 4,
    requestedFloatFrequencyDataAvailable = 5,
    getByteFrequencyData = 6,
    requestedByteFrequencyDataAvailable = 7,
    floatTimeDomainData = 8,
    byteTimeDomainData = 9,
    startedListeningTo = 10,
    stoppedListeningTo = 11
}
interface BasicMessage<T, P = unknown> {
    type: T;
    payload?: P;
}
interface IdentifiedMessage<T, P = unknown> extends BasicMessage<T, P> {
    id: number;
}
declare type FloatFrequencyDataAvailableMessage = BasicMessage<MessageTypes.frequencyDataAvailable, Float32Array>;
declare type ByteFrequencyDataAvailableMessage = BasicMessage<MessageTypes.byteFrequencyDataAvailable, Uint8Array>;
declare type GetFloatFrequencyDataMessage = IdentifiedMessage<MessageTypes.getFloatFrequencyData>;
declare type RequestedFloatFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatFrequencyDataAvailable, ArrayBuffer>;
declare type GetByteFrequencyDataMessage = IdentifiedMessage<MessageTypes.getByteFrequencyData, Uint8Array>;
declare type RequestedByteFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteFrequencyDataAvailable, ArrayBuffer>;
declare type StartedListeningToMessage = BasicMessage<MessageTypes.startedListeningTo, EventListenerTypes>;
declare type StoppedListeningToMessage = BasicMessage<MessageTypes.stoppedListeningTo, EventListenerTypes>;
export declare type Message = FloatFrequencyDataAvailableMessage | ByteFrequencyDataAvailableMessage | GetFloatFrequencyDataMessage | RequestedFloatFrequencyDataAvailableMessage | GetByteFrequencyDataMessage | RequestedByteFrequencyDataAvailableMessage | StartedListeningToMessage | StoppedListeningToMessage;
export declare enum ProcessorParameters {
    fftSize = "fftSize",
    samplesBetweenTransforms = "samplesBetweenTransforms",
    dataAsByteArray = "dataAsByteArray"
}
export declare enum EventListenerTypes {
    frequencydata = "frequencydata",
    bytefrequencydata = "bytefrequencydata"
}
export {};
