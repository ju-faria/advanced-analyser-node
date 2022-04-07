import { clamp } from "lodash";
import { FrequencyScale } from '@soundui/shared/constants';
import { lerpLog, inverseLerpLog, getTimeFromRender } from "src/utils";

export type TransformProperties = {
  minFrequency: number,
  maxFrequency: number,
  currentTime: number,
  timeWindow: number,
}

type TransformFn = (properties: TransformProperties) => TransformProperties;

export const composeTransforms = (...transformFns: TransformFn[]): TransformFn =>
  (properties) => {
    return transformFns.reduce((acc, fn) => fn(acc), properties);
  };


export type TranslationFunctions = {
  translateFrequency: (frequencyAxisSize: number, delta: number) => TransformFn
  translateCurrentTime: (timeAxisSize: number, delta: number) => TransformFn
  scaleFrequencies: (scaleFactor: number, origin: number) => TransformFn,
  scaleTimeWindow: (scaleFactor: number, origin: number) => TransformFn,
}


export const translateFrequency = (
  frequencyAxisSize: number,
  delta: number,
) => (properties:TransformProperties) => {
  const { minFrequency, maxFrequency } = properties;
  let newMinFrequency = lerpLog(
    minFrequency,
    maxFrequency,
    delta / frequencyAxisSize,
  );

  let newMaxFrequency = lerpLog(
    minFrequency,
    maxFrequency,
    (frequencyAxisSize + delta) / frequencyAxisSize,
  );

  if(newMaxFrequency > 44100) {
    newMaxFrequency = 44100;
    const pos = inverseLerpLog(minFrequency, maxFrequency, 44100);
    newMinFrequency = lerpLog(minFrequency, maxFrequency, pos - 1);
  } else if (newMinFrequency < 20) {
    newMinFrequency = 20;
    const pos = inverseLerpLog(minFrequency, maxFrequency, 20);
    newMaxFrequency = lerpLog(minFrequency, maxFrequency, pos + 1);
  }

  return {
    ...properties,
    minFrequency: Math.round(newMinFrequency * 100) / 100,
    maxFrequency: Math.round(newMaxFrequency * 100) / 100,
  };
};

export const translateCurrentTime = (
  timeAxisSize: number,
  delta: number,
) => (properties:TransformProperties) => {
  const {
    timeWindow,
    currentTime,
  } = properties;
  const timePerPixel = (timeWindow / timeAxisSize);
  return { ...properties, currentTime: Math.max(currentTime - (timePerPixel * delta), 0)} ;
};

export const scaleTimeWindow = (
  scaleFactor: number,
  origin: number
) => (properties: TransformProperties) => {
  const { currentTime, timeWindow } = properties;
  if (
    (timeWindow <= 1000 && scaleFactor < 1)
    || (timeWindow >= 3600_000 && scaleFactor > 1)
  ) return { ...properties, timeWindow, currentTime };

  const timePivot = getTimeFromRender(currentTime, timeWindow, origin);

  const newTimeWindow = clamp(timeWindow * scaleFactor, 1000, 3600_000);
  const timeWindowDelta = newTimeWindow - timeWindow;


  return {
    ...properties,
    currentTime: Math.max(timePivot - (newTimeWindow * origin), 0),
    timeWindow: timeWindow + timeWindowDelta,
  };
};

export const scaleFrequencies = (
  scaleFactor: number,
  origin: number,
) => (properties: TransformProperties) => {
  const { minFrequency, maxFrequency } = properties;
  const inverseOrigin = (1 - origin);
  const newMinFrequency = lerpLog(
    minFrequency,
    maxFrequency,
    -((inverseOrigin*scaleFactor + origin)-1)
  );

  const newMaxFrequency = lerpLog(
    minFrequency,
    maxFrequency,
    origin * scaleFactor + inverseOrigin
  );
  return {
    ...properties,
    minFrequency: clamp(newMinFrequency, 20, 44100),
    maxFrequency: clamp(newMaxFrequency, 20, 44100),
  };
};


export const transformFn:Record<FrequencyScale, TranslationFunctions> = {
  logarithmic: {
    translateFrequency: translateFrequency,
    translateCurrentTime: translateCurrentTime,
    scaleFrequencies: scaleFrequencies,
    scaleTimeWindow: scaleTimeWindow,
  },
  linear: {
    translateFrequency: function (): TransformFn {
      throw new Error("Function not implemented.");
    },
    translateCurrentTime: function (): TransformFn {
      throw new Error("Function not implemented.");
    },
    scaleFrequencies: function (): TransformFn {
      throw new Error("Function not implemented.");
    },
    scaleTimeWindow: function (): TransformFn {
      throw new Error("Function not implemented.");
    }
  }
};

