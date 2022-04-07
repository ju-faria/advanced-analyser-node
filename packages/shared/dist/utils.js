(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.utils = {}));
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

  exports.clamp = clamp;
  exports.inverseLerp = inverseLerp;
  exports.inverseLerpLog = inverseLerpLog;
  exports.lerp = lerp;
  exports.lerpLog = lerpLog;
  exports.remap = remap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
