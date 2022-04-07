(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.constants = {}));
})(this, (function (exports) { 'use strict';

  const DEFAULT_MIN_FREQUENCY = 20;
  const DEFAULT_MAX_FREQUENCY = 44100;
  const DEFAULT_MIN_DECIBELS = -100;
  const DEFAULT_MAX_DECIBELS = -10;
  const DEFAULT_TIME_WINDOW = 10_000;
  const DEFAULT_MIN_TIME_WINDOW = 1000;
  const DEFAULT_MAX_TIME_WINDOW = 3600_000;
  const DEFAULT_DYNAMIC_RANGE = 70;
  const DEFAULT_DYNAMIC_RANGE_TOP = -30;

  const MAX_FFT_SIZE = 32768;
  const MIN_FFT_SIZE = 32;
  const MIN_FREQUENCY = 20;
  const MAX_FREQUENCY = 44100;

  exports.FrequencyScale = void 0;
  (function (FrequencyScale) {
      FrequencyScale["linear"] = "linear";
      FrequencyScale["logarithmic"] = "logarithmic";
  })(exports.FrequencyScale || (exports.FrequencyScale = {}));

  exports.DEFAULT_DYNAMIC_RANGE = DEFAULT_DYNAMIC_RANGE;
  exports.DEFAULT_DYNAMIC_RANGE_TOP = DEFAULT_DYNAMIC_RANGE_TOP;
  exports.DEFAULT_MAX_DECIBELS = DEFAULT_MAX_DECIBELS;
  exports.DEFAULT_MAX_FREQUENCY = DEFAULT_MAX_FREQUENCY;
  exports.DEFAULT_MAX_TIME_WINDOW = DEFAULT_MAX_TIME_WINDOW;
  exports.DEFAULT_MIN_DECIBELS = DEFAULT_MIN_DECIBELS;
  exports.DEFAULT_MIN_FREQUENCY = DEFAULT_MIN_FREQUENCY;
  exports.DEFAULT_MIN_TIME_WINDOW = DEFAULT_MIN_TIME_WINDOW;
  exports.DEFAULT_TIME_WINDOW = DEFAULT_TIME_WINDOW;
  exports.MAX_FFT_SIZE = MAX_FFT_SIZE;
  exports.MAX_FREQUENCY = MAX_FREQUENCY;
  exports.MIN_FFT_SIZE = MIN_FFT_SIZE;
  exports.MIN_FREQUENCY = MIN_FREQUENCY;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
