import React from "react";
import { FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import { Nullable } from '@soundui/shared/utils';
import { FrequencyScale } from "@soundui/shared/constants";
import { SpectrogramTransforms } from "src/components/spectrogram/types";
export declare type SpectrogramRendererHookProperties = {
    canvas: Nullable<HTMLCanvasElement>;
    dataResolver: FrequencyDataResolver;
    frequencyScale?: FrequencyScale;
};
export declare const useSpectrogramRenderer: ({ canvas, dataResolver, frequencyScale, }: SpectrogramRendererHookProperties, deps: React.DependencyList) => {
    spectrogramRenderer: SpectrogramRenderer;
    draw: () => void;
    updateProperties: ({ maxFrequency, minFrequency, currentTime, timeWindow }: SpectrogramTransforms) => void;
    setDynamicRange: (dynamicRange: number) => void;
    setDynamicRangeTop: (dynamicRangeTop: number) => void;
    setFrequencyScale: (frequencyScale: FrequencyScale) => void;
};
