import { FrequencyScale } from '@soundui/shared/constants';
export declare type TransformProperties = {
    minFrequency: number;
    maxFrequency: number;
    currentTime: number;
    timeWindow: number;
};
declare type TransformFn = (properties: TransformProperties) => TransformProperties;
export declare const composeTransforms: (...transformFns: TransformFn[]) => TransformFn;
export declare type TranslationFunctions = {
    translateFrequency: (frequencyAxisSize: number, delta: number) => TransformFn;
    translateCurrentTime: (timeAxisSize: number, delta: number) => TransformFn;
    scaleFrequencies: (scaleFactor: number, origin: number) => TransformFn;
    scaleTimeWindow: (scaleFactor: number, origin: number) => TransformFn;
};
export declare const translateFrequencyLog: (frequencyAxisSize: number, delta: number) => (properties: TransformProperties) => {
    minFrequency: number;
    maxFrequency: number;
    currentTime: number;
    timeWindow: number;
};
export declare const translateCurrentTime: (timeAxisSize: number, delta: number) => (properties: TransformProperties) => {
    currentTime: number;
    minFrequency: number;
    maxFrequency: number;
    timeWindow: number;
};
export declare const scaleTimeWindow: (scaleFactor: number, origin: number) => (properties: TransformProperties) => {
    timeWindow: number;
    currentTime: number;
    minFrequency: number;
    maxFrequency: number;
};
export declare const scaleFrequenciesLog: (scaleFactor: number, origin: number) => (properties: TransformProperties) => {
    minFrequency: number;
    maxFrequency: number;
    currentTime: number;
    timeWindow: number;
};
export declare const translateFrequencyLin: (frequencyAxisSize: number, delta: number) => (properties: TransformProperties) => {
    minFrequency: number;
    maxFrequency: number;
    currentTime: number;
    timeWindow: number;
};
export declare const scaleFrequenciesLin: (scaleFactor: number, origin: number) => (properties: TransformProperties) => {
    minFrequency: number;
    maxFrequency: number;
    currentTime: number;
    timeWindow: number;
};
export declare const transformFn: Record<FrequencyScale, TranslationFunctions>;
export {};
