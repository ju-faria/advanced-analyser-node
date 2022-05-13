(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.spectrogramRenderer = {}));
})(this, (function (exports) { 'use strict';

  const getLetter = (offset) => String.fromCharCode(65 + offset);
  const generateColorRampCode = (colorRamp) => {
      const colorCount = colorRamp.length;
      const colorVars = colorRamp
          .map((rgb) => rgb.map((value) => (value / 255).toFixed(4)))
          .map((rgb, i) => `vec3 ${getLetter(i)} = vec3(${rgb.join(',')});`);
      const colorRampBody = colorRamp
          .map((_, i) => {
          if (i === colorCount - 1)
              return '';
          return [
              `if (value <= ${((i + 1) / (colorCount - 1)).toFixed(4)}){`,
              `return mix(`,
              `${getLetter(i)},`,
              `${getLetter(i + 1)},`,
              `remap(${(i / (colorCount - 1)).toFixed(4)}, ${((i + 1) / (colorCount - 1)).toFixed(4)}, 0., 1., value)`,
              `);};`
          ].join('');
      });
      return `vec3 color_ramp(float value) {${[...colorVars, ...colorRampBody].join('')}}`;
  };

  var fragmentShaderCode = "precision highp float;\n\nuniform sampler2D fft;\nuniform int u_scale;\nuniform float u_visibleTransforms;\nuniform float u_xTransformOffset;\nuniform float u_minFrequency;\nuniform float u_maxFrequency;\nuniform float u_dynamicRange;\nuniform float u_dynamicRangeTop;\nuniform float u_minDecibels;\nuniform float u_maxDecibels;\nuniform float u_sampleRate;\nuniform vec2 u_textureSize;\nuniform vec2 u_viewportSize;\n\n\nfloat lerp(float from, float to, float rel){\n  return ((1. - rel) * from) + (rel * to);\n}\nfloat invLerp(float from, float to, float value){\n  return (value - from) / (to - from);\n}\n\nfloat remap(float origFrom, float origTo, float targetFrom, float targetTo, float value){\n  float rel = invLerp(origFrom, origTo, value);\n  return lerp(targetFrom, targetTo, rel);\n} \n\nfloat getY(float y) {\n  // LIN\n  if (u_scale == 0) {\n    float hz = lerp(u_minFrequency, u_maxFrequency, y);\n    return (hz / u_sampleRate);\n  }\n  // LOG \n  if (u_scale == 1) {\n    float minLog = log2(u_minFrequency);\n    float maxLog = log2(u_maxFrequency);\n\n    float hz = pow(2., lerp(minLog, maxLog, y));\n    return (hz / u_sampleRate ) * 2.;\n  }\n}\n\n{{COLOR_RAMP}}\n\nvoid main() {\n  vec2 normCoord = (gl_FragCoord.xy + vec2(0., 0.))/ u_viewportSize.xy;\n  float xOffset = u_xTransformOffset / u_visibleTransforms;\n  float xScale =  u_visibleTransforms / u_textureSize.x;\n  float x = (normCoord.x + xOffset ) * xScale ;\n\n  float y = getY(normCoord.y);\n\n  float color = texture2D(fft, vec2(x, y )).x;\n\n  gl_FragColor = vec4(color_ramp(\n    clamp(invLerp( u_dynamicRangeTop - u_dynamicRange, u_dynamicRangeTop, lerp(u_minDecibels, u_maxDecibels, color)), 0., 1.)\n  ), 1.);\n}\n";

  var vertexShaderCode = "\n  precision mediump float;\n\n  attribute vec2 vertPosition;\n  attribute vec3 vertColor;\n  varying vec3 fragColor;\n\n  void main()\n  {\n    fragColor = vertColor;\n    gl_Position = vec4(vertPosition, 0.0, 1.0);\n  }";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var utils = {exports: {}};

  (function (module, exports) {
  (function (global, factory) {
    factory(exports) ;
  })(commonjsGlobal, (function (exports) {
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
  }(utils, utils.exports));

  var constants = {exports: {}};

  (function (module, exports) {
  (function (global, factory) {
    factory(exports) ;
  })(commonjsGlobal, (function (exports) {
    exports.FrequencyScale = void 0;
    (function (FrequencyScale) {
        FrequencyScale["linear"] = "linear";
        FrequencyScale["logarithmic"] = "logarithmic";
    })(exports.FrequencyScale || (exports.FrequencyScale = {}));

    const DEFAULT_MIN_FREQUENCY = 20;
    const DEFAULT_MAX_FREQUENCY = 44100;
    const DEFAULT_MIN_DECIBELS = -100;
    const DEFAULT_MAX_DECIBELS = -10;
    const DEFAULT_TIME_WINDOW = 10_000;
    const DEFAULT_MIN_TIME_WINDOW = 1000;
    const DEFAULT_MAX_TIME_WINDOW = 3600_000;
    const DEFAULT_DYNAMIC_RANGE = 70;
    const DEFAULT_DYNAMIC_RANGE_TOP = -30;
    const DEFAULT_FREQUENCY_SCALE = exports.FrequencyScale.logarithmic;

    const MAX_FFT_SIZE = 32768;
    const MIN_FFT_SIZE = 32;
    const MIN_FREQUENCY = 20;
    const MAX_FREQUENCY = 44100;

    exports.DEFAULT_DYNAMIC_RANGE = DEFAULT_DYNAMIC_RANGE;
    exports.DEFAULT_DYNAMIC_RANGE_TOP = DEFAULT_DYNAMIC_RANGE_TOP;
    exports.DEFAULT_FREQUENCY_SCALE = DEFAULT_FREQUENCY_SCALE;
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
  }(constants, constants.exports));

  const getFirstVisibleTransform = (currentTime, samplesBetweenTransforms, sampleRate) => Math.max(((sampleRate * (currentTime / 1000)) - 1) / samplesBetweenTransforms, 0);

  class SpectrogramRenderer {
      _canvas;
      _dataResolver;
      _gl;
      _glParams;
      _currentTime = 0;
      _textureBuffer;
      _timeWindow = constants.exports.DEFAULT_TIME_WINDOW;
      _minFrequency = constants.exports.DEFAULT_MIN_FREQUENCY;
      _maxFrequency = constants.exports.DEFAULT_MAX_FREQUENCY;
      _dynamicRange = constants.exports.DEFAULT_DYNAMIC_RANGE;
      _dynamicRangeTop = constants.exports.DEFAULT_DYNAMIC_RANGE_TOP;
      _frequencyScale = constants.exports.DEFAULT_FREQUENCY_SCALE;
      _colorRamp = [
          [0, 0, 0],
          [0, 0, 200],
          [0, 200, 240],
          [255, 255, 103],
          [210, 115, 95],
          [188, 46, 92]
      ];
      set currentTime(value) {
          this._currentTime = Math.max(0, value);
      }
      get currentTime() {
          return this._currentTime;
      }
      get visibleTransforms() {
          return (this._dataResolver.sampleRate / this._dataResolver.samplesBetweenTransforms) * this.timeWindow / 1000;
      }
      set minFrequency(value) {
          // TODO: VALIDATE
          this._minFrequency = utils.exports.clamp(value, constants.exports.MIN_FREQUENCY, constants.exports.MAX_FREQUENCY);
          this._gl.uniform1f(this._glParams.uMinFrequencyLocation, this._minFrequency);
      }
      set frequencyScale(frequencyScale) {
          this._frequencyScale = frequencyScale;
          this._gl.uniform1i(this._glParams.uScale, frequencyScale === constants.exports.FrequencyScale.logarithmic ? 1 : 0);
      }
      get frequencyScale() {
          return this._frequencyScale;
      }
      get minFrequency() {
          return this._minFrequency;
      }
      set maxFrequency(value) {
          // TODO: VALIDATE
          this._maxFrequency = utils.exports.clamp(value, constants.exports.MIN_FREQUENCY, constants.exports.MAX_FREQUENCY);
          this._gl.uniform1f(this._glParams.uMaxFrequencyLocation, this._maxFrequency);
      }
      get maxFrequency() {
          return this._maxFrequency;
      }
      set dynamicRange(value) {
          this._dynamicRange = value;
          this._gl.uniform1f(this._glParams.uDynamicRangeLocation, value);
      }
      get dynamicRange() {
          return this._dynamicRange;
      }
      set dynamicRangeTop(value) {
          this._dynamicRangeTop = value;
          this._gl.uniform1f(this._glParams.uDynamicRangeTopLocation, value);
      }
      get dynamicRangeTop() {
          return this._dynamicRangeTop;
      }
      set timeWindow(value) {
          // TODO: VALIDATE
          this._timeWindow = utils.exports.clamp(value, constants.exports.DEFAULT_MIN_TIME_WINDOW, constants.exports.DEFAULT_MAX_TIME_WINDOW);
          this._gl.uniform1f(this._glParams.uVisibleTransformLocation, Math.min(this.visibleTransforms, this._canvas.width));
      }
      get timeWindow() {
          return this._timeWindow;
      }
      set colorRamp(value) {
          this._colorRamp = value;
      }
      get colorRamp() {
          return this._colorRamp;
      }
      get fragmentShader() {
          return fragmentShaderCode.replace('{{COLOR_RAMP}}', generateColorRampCode(this.colorRamp));
      }
      constructor({ canvas, dataResolver, currentTime = 0, frequencyScale = constants.exports.DEFAULT_FREQUENCY_SCALE, }) {
          this._canvas = canvas;
          this._gl = canvas.getContext('webgl');
          this._dataResolver = dataResolver;
          this._frequencyScale = frequencyScale;
          this.currentTime = currentTime;
          this.initGl();
      }
      initGl() {
          const gl = this._gl;
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          //
          // Create shaders
          //
          const vertexShader = gl.createShader(gl.VERTEX_SHADER);
          const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(vertexShader, vertexShaderCode);
          gl.shaderSource(fragmentShader, this.fragmentShader);
          gl.compileShader(vertexShader);
          if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
              throw Error(`ERROR compiling vertex shader: ${gl.getShaderInfoLog(vertexShader)}`);
          }
          gl.compileShader(fragmentShader);
          if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
              throw Error(`ERROR compiling vertex shader: ${gl.getShaderInfoLog(fragmentShader)}`);
          }
          const program = gl.createProgram();
          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);
          gl.linkProgram(program);
          /*
           * for debugging shaders
           */
          {
              if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                  console.error("ERROR linking program!", gl.getProgramInfoLog(program));
                  return;
              }
              gl.validateProgram(program);
              if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                  console.error("ERROR validating program!", gl.getProgramInfoLog(program));
                  return;
              }
          }
          /*
           * Creates quad to paint on
           */
          const backgroundVertices = [
              -1, -1,
              -1, 1,
              1, 1,
              1, -1
          ];
          const backgroundVertexBufferObject = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, backgroundVertexBufferObject);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(backgroundVertices), gl.STATIC_DRAW);
          const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
          gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
          gl.enableVertexAttribArray(positionAttribLocation);
          /**
           *
           */
          this._glParams = {
              uVisibleTransformLocation: gl.getUniformLocation(program, "u_visibleTransforms"),
              uScale: gl.getUniformLocation(program, "u_scale"),
              uXTransformOffsetLocation: gl.getUniformLocation(program, "u_xTransformOffset"),
              uTextureSizeLocation: gl.getUniformLocation(program, "u_textureSize"),
              uMinFrequencyLocation: gl.getUniformLocation(program, "u_minFrequency"),
              uMaxFrequencyLocation: gl.getUniformLocation(program, "u_maxFrequency"),
              uMinDecibelsLocation: gl.getUniformLocation(program, "u_minDecibels"),
              uMaxDecibelsLocation: gl.getUniformLocation(program, "u_maxDecibels"),
              uDynamicRangeLocation: gl.getUniformLocation(program, "u_dynamicRange"),
              uDynamicRangeTopLocation: gl.getUniformLocation(program, "u_dynamicRangeTop"),
              uSampleRateLocation: gl.getUniformLocation(program, "u_sampleRate"),
              uViewportSize: gl.getUniformLocation(program, "u_viewportSize"),
              fftTexture: gl.createTexture(),
          };
          gl.useProgram(program);
          const { width, height } = this._canvas;
          const textureWidth = width;
          const textureHeight = this._dataResolver.frequencyBinCount;
          this._textureBuffer = new Uint8Array(textureWidth * textureHeight);
          gl.bindTexture(gl.TEXTURE_2D, this._glParams.fftTexture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.uniform1i(this._glParams.uScale, 1);
          gl.uniform2f(this._glParams.uTextureSizeLocation, textureWidth, textureHeight);
          gl.uniform2f(this._glParams.uViewportSize, width, height);
          gl.uniform1f(this._glParams.uMinFrequencyLocation, this._minFrequency);
          gl.uniform1f(this._glParams.uMaxFrequencyLocation, this._maxFrequency);
          gl.uniform1f(this._glParams.uSampleRateLocation, this._dataResolver.sampleRate);
          gl.uniform1f(this._glParams.uVisibleTransformLocation, this.visibleTransforms);
          gl.uniform1f(this._glParams.uDynamicRangeLocation, this._dataResolver.maxDecibels - this._dataResolver.minDecibels);
          gl.uniform1f(this._glParams.uDynamicRangeTopLocation, this._dataResolver.maxDecibels);
          gl.uniform1f(this._glParams.uMinDecibelsLocation, this._dataResolver.minDecibels);
          gl.uniform1f(this._glParams.uMaxDecibelsLocation, this._dataResolver.maxDecibels);
      }
      updatePlayheadPosition(currentTime) {
          this.currentTime = currentTime;
      }
      draw() {
          const sampleRate = this._dataResolver.sampleRate;
          const frequencyBinCount = this._dataResolver.frequencyBinCount;
          const gl = this._gl;
          const currentTime = this.currentTime;
          const visibleTransforms = this.visibleTransforms;
          const firstVisibleTransform = getFirstVisibleTransform(currentTime, this._dataResolver.samplesBetweenTransforms, sampleRate);
          const timeXOffset = firstVisibleTransform % 1;
          const textureWidth = this._canvas.width;
          let x = 0;
          let y = 0;
          let transformI = 0;
          const roundedVisibleTransforms = Math.ceil(visibleTransforms) + 1;
          const filledTextureWidth = Math.min(roundedVisibleTransforms, this._canvas.width);
          const xStep = Math.max((roundedVisibleTransforms / this._canvas.width), 1);
          for (let i = 0; i < frequencyBinCount * filledTextureWidth; i++) {
              x = i % filledTextureWidth;
              y = (i / filledTextureWidth) | 0;
              transformI = (firstVisibleTransform) + x * xStep | 0;
              this._textureBuffer[y * textureWidth + x] = this._dataResolver.getFrequency(transformI, y) || 0;
          }
          gl.bindTexture(gl.TEXTURE_2D, this._glParams.fftTexture);
          gl.uniform1f(this._glParams.uXTransformOffsetLocation, timeXOffset);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, textureWidth, frequencyBinCount, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, this._textureBuffer);
          gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
          gl.finish();
      }
      isFrequencyBinVisible(frequencyBin) {
          const visibleTransforms = this.visibleTransforms;
          const firstVisibleTransform = getFirstVisibleTransform(this.currentTime, this._dataResolver.samplesBetweenTransforms, this._dataResolver.sampleRate);
          return frequencyBin >= firstVisibleTransform && frequencyBin <= firstVisibleTransform + visibleTransforms;
      }
  }

  class DefaultFrequencyDataResolver {
      sampleRate;
      frequencyBinCount;
      samplesBetweenTransforms;
      maxDecibels;
      minDecibels;
      _eventListeners = {
          dataupdate: []
      };
      _data = [];
      constructor({ sampleRate, frequencyBinCount, samplesBetweenTransforms, maxDecibels, minDecibels, }) {
          this.sampleRate = sampleRate;
          this.frequencyBinCount = frequencyBinCount;
          this.samplesBetweenTransforms = samplesBetweenTransforms;
          this.maxDecibels = maxDecibels;
          this.minDecibels = minDecibels;
      }
      getFrequencyBin(frequencyBinIndex) {
          return this._data[frequencyBinIndex] || null;
      }
      getFrequency(frequencyBinIndex, sampleIndex) {
          return this.getFrequencyBin(frequencyBinIndex)?.[sampleIndex] ?? 0;
      }
      push(data, frequencyBinIndex) {
          const index = frequencyBinIndex || this._data.length;
          this._data[index] = data;
          const event = new CustomEvent('dataupdate', {
              detail: {
                  frequencyBinIndex: index,
                  data,
              }
          });
          this.dispatchEvent(event);
      }
      dispatchEvent(event) {
          this._eventListeners[event.type]?.forEach(l => l(event));
          return true;
      }
      addEventListener(type, listener) {
          this._eventListeners[type] = this._eventListeners[type] ?? [];
          this._eventListeners[type].push(listener);
      }
      removeEventListener(type, listener) {
          if (!this._eventListeners[type])
              return;
          this._eventListeners[type] = this._eventListeners[type]?.filter(l => l !== listener);
      }
  }

  exports.DefaultFrequencyDataResolver = DefaultFrequencyDataResolver;
  exports.SpectrogramRenderer = SpectrogramRenderer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
