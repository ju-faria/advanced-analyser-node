export declare enum MessageTypes {
    start = "start",
    stop = "stop",
    dataAvailable = "data-available"
}
interface BasicMessage {
    type: MessageTypes.start | MessageTypes.stop;
}
interface DataAvailableMessage {
    type: MessageTypes.dataAvailable;
    data: Uint8Array;
    currentTime: number;
}
export declare type Message = DataAvailableMessage | BasicMessage;
export declare enum ProcessorParameters {
    fftSize = "fftSize",
    samplesBetweenTransforms = "samplesBetweenTransforms"
}
export {};
