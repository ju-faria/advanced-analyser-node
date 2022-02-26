import { EventListenerTypes, Message } from "../types";
declare type AdvancedAnalyserNodeProperties = {
    dataAsByteArray: boolean;
    fftSize?: number;
    samplesBetweenTransforms?: number;
};
export declare class AdvancedAnalyserNode extends AudioWorkletNode {
    fftSize: number;
    samplesBetweenTransforms?: number;
    _portMapId: number;
    _portMap: Map<any, any>;
    _eventListenersCount: Record<EventListenerTypes, EventListenerOrEventListenerObject[]>;
    constructor(context: BaseAudioContext, { fftSize, samplesBetweenTransforms, }: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties);
    _uniqId(): number;
    _postMessage(message: Message, transfer?: Transferable[]): void;
    onprocessorerror: (err: Event) => void;
    private _onmessage;
    getFloatFrequencyData(): Promise<unknown>;
    start(): void;
    _pushEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject): void;
    _removeEventListener(type: EventListenerTypes, listener: EventListenerOrEventListenerObject): void;
    addEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: EventListenerTypes | "processorerror", listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export declare const createAdvancedAnalyserNode: (context: BaseAudioContext, options: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties) => Promise<AdvancedAnalyserNode>;
export {};
