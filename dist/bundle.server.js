(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.advancedAnalyserNode = {}));
})(this, (function (exports) { 'use strict';

  /*
  * The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
  * The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string,
  * to avoid needing to be manually imported and loaded by this module's consumers
  */
  const createAdvancedAnalyserNode = async (context, options = {}) => {
      {
          throw new Error(`
      AudioWorkletNode does not exist in this environment: 
      This typically happens if you try to run 'createAdvancedAnalyserNode' in the server
    `);
      }
  };

  exports.createAdvancedAnalyserNode = createAdvancedAnalyserNode;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
