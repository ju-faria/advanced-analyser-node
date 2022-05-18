import { DEFAULT_MAX_FREQUENCY, DEFAULT_MAX_TIME_WINDOW, DEFAULT_MIN_FREQUENCY, DEFAULT_TIME_WINDOW } from "@soundui/shared/constants";
import { Nullable } from "@soundui/shared/utils";
import { FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import { noop } from "lodash";
import React from "react";
import { SpectrogramTransforms } from "../spectrogram/types";

type SpectrogramContextTypes = {
  spectrogramRenderer: Nullable<SpectrogramRenderer>,
  onChange: (properties: SpectrogramTransforms) => void,
  transforms: SpectrogramTransforms,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  dynamicRange: number,
  dynamicRangeTop: number,
  dataResolver: FrequencyDataResolver,
}

export const SpectrogramContext = React.createContext<SpectrogramContextTypes>({
  spectrogramRenderer: null,
  onChange: noop,
  transforms: {
    minFrequency: DEFAULT_MIN_FREQUENCY,
    maxFrequency: DEFAULT_MAX_FREQUENCY,
    timeWindow: DEFAULT_TIME_WINDOW,
    currentTime: 0,
  },
  width: 1024,
  height: 512,
  canvas: null,
  dynamicRange: 70,
  dynamicRangeTop: -30,
  dataResolver: null,
});
