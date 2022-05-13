import React, { useEffect, useMemo } from "react";
import { DataUpdateEvent, FrequencyDataResolver, SpectrogramRenderer } from "@soundui/spectrogram-renderer";
import { Nullable } from '@soundui/shared/utils';
import { FrequencyScale } from "@soundui/shared/constants";

export type SpectrogramRendererHookProperties = {
  canvas: Nullable<HTMLCanvasElement>,
  dataResolver: FrequencyDataResolver,
  frequencyScale?: FrequencyScale,
}

export const useSpectrogramRenderer = (
  {
    canvas,
    dataResolver,
    frequencyScale = FrequencyScale.logarithmic,
  }:SpectrogramRendererHookProperties,
  deps: React.DependencyList
) => {
  const spectrogramRenderer = useMemo<Nullable<SpectrogramRenderer>>(() => {
    if (!canvas) return null;
    return new SpectrogramRenderer({
      canvas,
      dataResolver,
      frequencyScale,
    });
  }, [canvas, dataResolver]);
  useEffect(() => {
    /*
     *  first draw and redraw in dependency list check
     */
    if (!spectrogramRenderer) return;
    spectrogramRenderer.draw();
  }, [spectrogramRenderer, ...deps]);

  useEffect(() => {
    /*
     * Redraws when data is updated
     */
    const dataUpdateHandler = (event: CustomEventInit<DataUpdateEvent>) => {
      if (!spectrogramRenderer) return;
      if (!spectrogramRenderer.isFrequencyBinVisible(event.detail.frequencyBinIndex)) return;
      spectrogramRenderer.draw();
    };

    dataResolver.addEventListener("dataupdate", dataUpdateHandler);

    return () => {
      dataResolver.removeEventListener("dataupdate", dataUpdateHandler);
    };
  }, [dataResolver, spectrogramRenderer]);

  return {
    spectrogramRenderer,
    draw: () => {
      if(spectrogramRenderer) spectrogramRenderer.draw();
    },
    setMinFrequency: (minFrequency: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.minFrequency = minFrequency;
      spectrogramRenderer.draw();
    },
    setMaxFrequency: (maxFrequency: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.maxFrequency = maxFrequency;
      spectrogramRenderer.draw();
    },
    setTimeWindow: (timeWindow: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.timeWindow = timeWindow;
      spectrogramRenderer.draw();
    },
    setCurrentTime: (currentTime: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.currentTime = currentTime;
      spectrogramRenderer.draw();
    },
    setDynamicRange: (dynamicRange: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.dynamicRange = dynamicRange;
      spectrogramRenderer.draw();
    },
    setDynamicRangeTop: (dynamicRangeTop: number) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.dynamicRangeTop = dynamicRangeTop;
      spectrogramRenderer.draw();
    },
    setFrequencyScale: (frequencyScale: FrequencyScale) => {
      if (!spectrogramRenderer) return;
      spectrogramRenderer.frequencyScale = frequencyScale;
      spectrogramRenderer.draw();
    },
  };
};