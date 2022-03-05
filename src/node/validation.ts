import { WindowFunctionTypes } from "../types";
import { MAX_FFT_SIZE, MIN_FFT_SIZE } from "../constants";

export const validateFftSize = (value: number) => {
  if (value && (value & (value - 1)) !== 0) {
    throw(new Error(`${value} is not a valid fftSize. fftSize has to be a power of 2`));
  }
  if (value > MAX_FFT_SIZE) {
    throw new Error(`${value} is above the maximum fftSize. Maximum fftSize is ${MAX_FFT_SIZE}`);
  }
  if (value < MIN_FFT_SIZE) {
    throw new Error(`${value} is below the minimum fftSize. Maximum fftSize is ${MIN_FFT_SIZE}`);
  }
};


export const validateSamplesBetweenTransforms = (value: number) => {
  /**
   * TODO: should a minimum be stablished to avoid too many calls per second?
   */
  if (value <= 0) {
    throw new Error(`${value} is not a valid samplesBetweenTransform. samplesBetweenTransform needs to be above 0`);
  }
};


export const validateTimeDomainSamplesCount = (value: number) => {
  /**
   * TODO: should a minimum be stablished to avoid too many calls per second?
   */
  if (value <= 0) {
    throw new Error(`${value} is not a valid timeDomainSamplesCount. timeDomainSamplesCount needs to be above 0`);
  }
};



export const validateWindowFunction = (value: WindowFunctionTypes) => {
  /**
   * TODO: should a minimum be stablished to avoid too many calls per second?
   */
  if (!Object.values(WindowFunctionTypes).includes(value)) {
    throw new Error(
      `${value} is not a valid windowFunction. Possible window functions are ${
        Object.values(WindowFunctionTypes)
          .map((windowFunction) => `'${windowFunction}'`)
          .join(", ")}`);
  }
};


export const validateMaxAndMinDecibels = (minDecibels: number, maxDecibels: number) => {
  if (maxDecibels <= minDecibels) {
    throw new Error(
      `Values ${minDecibels} for minDecibels and ${maxDecibels} for maxDecibels are invalid: maxDecibels value cannot be equal or lower than minDecibels.`
    );
  }
};


export const validateSmoothingTimeConstant = (value: number) => {
  if (value < 0 && value > 1) {
    throw new Error(
      "smoothingTimeConstant value must be between 0 and 1"
    );
  }
};
