import { Message } from "../types";
declare type AdvancedAnalyserNodeProperties = {
    onData: (data: Uint8Array) => void;
    fftSize?: number;
    samplesBetweenTransforms?: number;
};
export declare class AdvancedAnalyserNode extends AudioWorkletNode {
    onData: (data: Uint8Array) => void;
    fftSize: number;
    samplesBetweenTransforms?: number;
    constructor(context: BaseAudioContext, { onData, fftSize, samplesBetweenTransforms, }: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties);
    onprocessorerror: (err: Event) => void;
    onmessage(event: Message): void;
    start(): void;
}
export declare const createAdvancedAnalyserNode: (context: BaseAudioContext, options: AudioWorkletNodeOptions & AdvancedAnalyserNodeProperties) => Promise<AdvancedAnalyserNode>;
export {};
