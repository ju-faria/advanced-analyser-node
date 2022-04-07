import React from "react";
import { FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import { Nullable } from '@soundui/shared/utils';
export declare type SpectrogramRendererHookProperties = {
    canvas: Nullable<HTMLCanvasElement>;
    dataResolver: FrequencyDataResolver;
};
export declare const useSpectrogramRenderer: ({ canvas, dataResolver, }: SpectrogramRendererHookProperties, deps: React.DependencyList) => {
    spectrogramRenderer: SpectrogramRenderer;
    draw: () => void;
    setMinFrequency: (minFrequency: number) => void;
    setMaxFrequency: (maxFrequency: number) => void;
    setTimeWindow: (timeWindow: number) => void;
    setCurrentTime: (currentTime: number) => void;
    setDynamicRange: (dynamicRange: number) => void;
    setDynamicRangeTop: (dynamicRangeTop: number) => void;
};
