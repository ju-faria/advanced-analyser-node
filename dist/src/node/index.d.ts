import { EventListenerTypes, Message, MessageTypes, WindowingFunctionTypes } from "../types";
declare type AdvancedAnalyserNodeProperties = {
    dataAsByteArray: boolean;
    fftSize?: number;
    samplesBetweenTransforms?: number;
    timeDomainSamplesCount?: number;
    windowFunction?: WindowingFunctionTypes;
};
export declare class AdvancedAnalyserNode extends AudioWorkletNode {
    _portMapId: number;
    _portMap: Map<any, any>;
    _eventListenersCount: Record<EventListenerTypes, EventListenerOrEventListenerObject[]>;
    constructor(context: BaseAudioContext, { fftSize, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction }: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties);
    _uniqId(): number;
    _postMessage(message: Message, transfer?: Transferable[]): void;
    onprocessorerror: (err: Event) => void;
    private _onmessage;
    _postIdentifiedDataRequest(requestType: MessageTypes.getByteFrequencyData | MessageTypes.getByteTimeDomainData | MessageTypes.getFloatFrequencyData | MessageTypes.getFloatTimeDomainData): Promise<unknown>;
    getFloatFrequencyData(): Promise<unknown>;
    getByteFrequencyData(): Promise<unknown>;
    getFloatTimeDomainData(): Promise<unknown>;
    getByteTimeDomainData(): Promise<unknown>;
    start(): void;
    _pushEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject): void;
    _removeEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject): void;
    addEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export declare const createAdvancedAnalyserNode: (context: BaseAudioContext, options: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties) => Promise<AdvancedAnalyserNode>;
export {};
