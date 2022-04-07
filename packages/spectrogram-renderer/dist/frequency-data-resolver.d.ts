import { FrequencyDataResolver, NumberList } from "./types";
import { Nullable } from '@soundui/shared/utils';
export declare class DefaultFrequencyDataResolver implements FrequencyDataResolver {
    sampleRate: number;
    frequencyBinCount: number;
    samplesBetweenTransforms: number;
    maxDecibels: number;
    minDecibels: number;
    private _eventListeners;
    private _data;
    constructor({ sampleRate, frequencyBinCount, samplesBetweenTransforms, maxDecibels, minDecibels, }: {
        sampleRate: number;
        frequencyBinCount: number;
        samplesBetweenTransforms: number;
        maxDecibels: number;
        minDecibels: number;
    });
    getFrequencyBin(frequencyBinIndex: number): Nullable<NumberList>;
    getFrequency(frequencyBinIndex: number, sampleIndex: number): number;
    push(data: NumberList, frequencyBinIndex?: number): void;
    dispatchEvent(event: Event): boolean;
    addEventListener(type: string, listener: (...args: any[]) => void): void;
    removeEventListener(type: string, listener: (...args: any[]) => void): void;
}
