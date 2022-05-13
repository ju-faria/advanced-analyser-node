(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.shared = {}));
})(this, (function (exports) { 'use strict';

  const lerp = (from, to, rel) => {
      return (1 - rel) * from + rel * to;
  };
  const inverseLerp = (from, to, rel) => {
      return (rel - from) / (to - from);
  };
  const lerpLog = (from, to, rel) => {
      return Math.pow(Math.E, lerp(Math.log(from), Math.log(to), rel));
  };
  const inverseLerpLog = (from, to, rel) => {
      return inverseLerp(Math.log(from), Math.log(to), Math.log(rel));
  };
  const remap = (origFrom, origTo, targetFrom, targetTo, rel) => {
      return lerp(targetFrom, targetTo, inverseLerp(origFrom, origTo, rel));
  };

  const clamp = (value, min, max) => {
      return Math.min(Math.max(value, min), max);
  };

  var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    lerp: lerp,
    inverseLerp: inverseLerp,
    lerpLog: lerpLog,
    inverseLerpLog: inverseLerpLog,
    remap: remap,
    clamp: clamp
  });

  var FrequencyScale;
  (function (FrequencyScale) {
      FrequencyScale["linear"] = "linear";
      FrequencyScale["logarithmic"] = "logarithmic";
  })(FrequencyScale || (FrequencyScale = {}));

  const DEFAULT_MIN_FREQUENCY = 20;
  const DEFAULT_MAX_FREQUENCY = 44100;
  const DEFAULT_MIN_DECIBELS = -100;
  const DEFAULT_MAX_DECIBELS = -10;
  const DEFAULT_TIME_WINDOW = 10_000;
  const DEFAULT_MIN_TIME_WINDOW = 1000;
  const DEFAULT_MAX_TIME_WINDOW = 3600_000;
  const DEFAULT_DYNAMIC_RANGE = 70;
  const DEFAULT_DYNAMIC_RANGE_TOP = -30;
  const DEFAULT_FREQUENCY_SCALE = FrequencyScale.logarithmic;

  const MAX_FFT_SIZE = 32768;
  const MIN_FFT_SIZE = 32;
  const MIN_FREQUENCY = 20;
  const MAX_FREQUENCY = 44100;

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEFAULT_MIN_FREQUENCY: DEFAULT_MIN_FREQUENCY,
    DEFAULT_MAX_FREQUENCY: DEFAULT_MAX_FREQUENCY,
    DEFAULT_MIN_DECIBELS: DEFAULT_MIN_DECIBELS,
    DEFAULT_MAX_DECIBELS: DEFAULT_MAX_DECIBELS,
    DEFAULT_TIME_WINDOW: DEFAULT_TIME_WINDOW,
    DEFAULT_MIN_TIME_WINDOW: DEFAULT_MIN_TIME_WINDOW,
    DEFAULT_MAX_TIME_WINDOW: DEFAULT_MAX_TIME_WINDOW,
    DEFAULT_DYNAMIC_RANGE: DEFAULT_DYNAMIC_RANGE,
    DEFAULT_DYNAMIC_RANGE_TOP: DEFAULT_DYNAMIC_RANGE_TOP,
    DEFAULT_FREQUENCY_SCALE: DEFAULT_FREQUENCY_SCALE,
    MAX_FFT_SIZE: MAX_FFT_SIZE,
    MIN_FFT_SIZE: MIN_FFT_SIZE,
    MIN_FREQUENCY: MIN_FREQUENCY,
    MAX_FREQUENCY: MAX_FREQUENCY,
    get FrequencyScale () { return FrequencyScale; }
  });

  exports.constants = index;
  exports.utils = index$1;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
