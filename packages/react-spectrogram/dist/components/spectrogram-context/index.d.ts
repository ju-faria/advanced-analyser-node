import { Nullable } from "@soundui/shared/utils";
import { FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import React from "react";
import { SpectrogramTransforms } from "../spectrogram/types";
declare type SpectrogramContextTypes = {
    spectrogramRenderer: Nullable<SpectrogramRenderer>;
    onChange: (properties: SpectrogramTransforms) => void;
    transforms: SpectrogramTransforms;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    dynamicRange: number;
    dynamicRangeTop: number;
    dataResolver: FrequencyDataResolver;
};
export declare const SpectrogramContext: React.Context<SpectrogramContextTypes>;
export {};
