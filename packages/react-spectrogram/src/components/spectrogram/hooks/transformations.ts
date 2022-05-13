import { clamp } from "lodash";
import { FrequencyScale, MAX_FREQUENCY, MIN_FREQUENCY } from '@soundui/shared/constants';
import { getTimeFromRender } from "src/utils";
import { lerpLog, inverseLerpLog, lerp, inverseLerp } from '@soundui/shared/utils';

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


export const translateFrequencyLog = (
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

  if(newMaxFrequency > MAX_FREQUENCY) {
    newMaxFrequency = MAX_FREQUENCY;
    const pos = inverseLerpLog(minFrequency, maxFrequency, MAX_FREQUENCY);
    newMinFrequency = lerpLog(minFrequency, maxFrequency, pos - 1);
  } else if (newMinFrequency < MIN_FREQUENCY) {
    newMinFrequency = MIN_FREQUENCY;
    const pos = inverseLerpLog(minFrequency, maxFrequency, MIN_FREQUENCY);
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

export const scaleFrequenciesLog = (
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
    minFrequency: clamp(newMinFrequency, MIN_FREQUENCY, MAX_FREQUENCY),
    maxFrequency: clamp(newMaxFrequency, MIN_FREQUENCY, MAX_FREQUENCY),
  };
};



export const translateFrequencyLin = (
  frequencyAxisSize: number,
  delta: number,
) => (properties:TransformProperties) => {
  const { minFrequency, maxFrequency } = properties;
  let newMinFrequency = lerp(
    minFrequency,
    maxFrequency,
    delta / frequencyAxisSize,
  );

  let newMaxFrequency = lerp(
    minFrequency,
    maxFrequency,
    (frequencyAxisSize + delta) / frequencyAxisSize,
  );

  if(newMaxFrequency > MAX_FREQUENCY) {
    newMaxFrequency = MAX_FREQUENCY;
    const pos = inverseLerp(minFrequency, maxFrequency, MAX_FREQUENCY);
    newMinFrequency = lerp(minFrequency, maxFrequency, pos - 1);
  } else if (newMinFrequency < MIN_FREQUENCY) {
    newMinFrequency = MIN_FREQUENCY;
    const pos = inverseLerp(minFrequency, maxFrequency, MIN_FREQUENCY);
    newMaxFrequency = lerp(minFrequency, maxFrequency, pos + 1);
  }

  return {
    ...properties,
    minFrequency: Math.round(newMinFrequency * 100) / 100,
    maxFrequency: Math.round(newMaxFrequency * 100) / 100,
  };
};


export const scaleFrequenciesLin = (
  scaleFactor: number,
  origin: number,
) => (properties: TransformProperties) => {
  const { minFrequency, maxFrequency } = properties;
  const inverseOrigin = (1 - origin);
  const newMinFrequency = lerp(
    minFrequency,
    maxFrequency,
    -((inverseOrigin*scaleFactor + origin)-1)
  );

  const newMaxFrequency = lerp(
    minFrequency,
    maxFrequency,
    origin * scaleFactor + inverseOrigin
  );
  return {
    ...properties,
    minFrequency: clamp(newMinFrequency, MIN_FREQUENCY, MAX_FREQUENCY),
    maxFrequency: clamp(newMaxFrequency, MIN_FREQUENCY, MAX_FREQUENCY),
  };
};

export const transformFn:Record<FrequencyScale, TranslationFunctions> = {
  logarithmic: {
    translateFrequency: translateFrequencyLog,
    scaleFrequencies: scaleFrequenciesLog,
    translateCurrentTime,
    scaleTimeWindow,
  },
  linear: {
    translateFrequency: translateFrequencyLin,
    scaleFrequencies: scaleFrequenciesLin,
    translateCurrentTime,
    scaleTimeWindow,
  }
};

