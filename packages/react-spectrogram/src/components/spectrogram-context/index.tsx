import { Nullable } from "@soundui/shared/utils";
import { FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import { noop } from "lodash";
import React from "react";

type SpectrogramContextTypes = {
  spectrogramRenderer: Nullable<SpectrogramRenderer>,
  onMaxFrequencyChange: (maxFrequency: number) => void,
  onMinFrequencyChange: (minFrequency: number) => void,
  onTimeWindowChange: (timeWindow: number) => void,
  onCurrentTimeChange: (currentTime: number) => void,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  minFrequency: number,
  maxFrequency: number,
  timeWindow: number,
  currentTime: number,
  dynamicRange: number,
  dynamicRangeTop: number,
  dataResolver: FrequencyDataResolver,
}

export const SpectrogramContext = React.createContext<SpectrogramContextTypes>({
  spectrogramRenderer: null,
  onMaxFrequencyChange: noop,
  onMinFrequencyChange: noop,
  onTimeWindowChange: noop,
  onCurrentTimeChange: noop,
  width: 1024,
  height: 512,
  canvas: null,
  minFrequency: 20,
  maxFrequency: 44100,
  timeWindow: 10_000,
  currentTime: 0,
  dynamicRange: 70,
  dynamicRangeTop: -30,
  dataResolver: null,
});
