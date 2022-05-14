import { generateColorRampCode } from './shaders/generate-color-ramp-code';
import fragmentShaderCode from './shaders/lin/fragment.glsl';
import vertexShaderCode from './shaders/vertex.glsl';
import { FrequencyDataResolver } from './types';
import { clamp } from '@soundui/shared/utils';
import {
  DEFAULT_DYNAMIC_RANGE,
  DEFAULT_DYNAMIC_RANGE_TOP,
  DEFAULT_FREQUENCY_SCALE,
  DEFAULT_MAX_FREQUENCY,
  DEFAULT_MAX_TIME_WINDOW,
  DEFAULT_MIN_FREQUENCY,
  DEFAULT_MIN_TIME_WINDOW,
  DEFAULT_TIME_WINDOW,
  FrequencyScale,
  MAX_FREQUENCY,
  MIN_FREQUENCY
} from '@soundui/shared/constants';
import { getFirstVisibleTransform } from './utils';

export type SpectrogramRendererProperties = {
  canvas: HTMLCanvasElement
  dataResolver: FrequencyDataResolver
  currentTime?: number
  frequencyScale?: FrequencyScale
}

export class SpectrogramRenderer {
  private _canvas: HTMLCanvasElement;

  private _dataResolver: FrequencyDataResolver;

  private _gl: WebGLRenderingContext;

  private _glParams: {
    uVisibleTransformLocation: WebGLUniformLocation;
    uScale: WebGLUniformLocation; // 0: Linear, 1: Logarithmic
    uXTransformOffsetLocation: WebGLUniformLocation;
    uTextureSizeLocation: WebGLUniformLocation;
    uMinFrequencyLocation: WebGLUniformLocation;
    uMaxFrequencyLocation: WebGLUniformLocation;
    uMinDecibelsLocation: WebGLUniformLocation;
    uMaxDecibelsLocation: WebGLUniformLocation;
    uDynamicRangeLocation: WebGLUniformLocation;
    uDynamicRangeTopLocation: WebGLUniformLocation;
    uSampleRateLocation: WebGLUniformLocation;
    uViewportSize: WebGLUniformLocation;
    fftTexture: WebGLTexture;
  };
  
  private _currentTime = 0;
  
  private _textureBuffer: Uint8Array;
  
  private _timeWindow = DEFAULT_TIME_WINDOW;
  
  private _minFrequency = DEFAULT_MIN_FREQUENCY;

  private _maxFrequency = DEFAULT_MAX_FREQUENCY;
  
  private _dynamicRange = DEFAULT_DYNAMIC_RANGE;

  private _dynamicRangeTop = DEFAULT_DYNAMIC_RANGE_TOP;

  private _frequencyScale = DEFAULT_FREQUENCY_SCALE;
  
  private _width:number;

  private _height:number;

  private _colorRamp: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, 200],
    [0, 200, 240],
    [255, 255, 103],
    [210, 115, 95],
    [188, 46, 92]
  ];

  set currentTime(value: number) {
    this._currentTime = Math.max(0, value);
  }

  get currentTime() {
    return this._currentTime;
  }

  get visibleTransforms () {
    return (this._dataResolver.sampleRate / this._dataResolver.samplesBetweenTransforms ) * this.timeWindow / 1000;
  }

  set minFrequency(value: number) {
    // TODO: VALIDATE
    this._minFrequency = clamp(value, MIN_FREQUENCY, MAX_FREQUENCY);

    this._gl.uniform1f(this._glParams.uMinFrequencyLocation, this._minFrequency);                
  }

  set frequencyScale(frequencyScale: FrequencyScale) {
    this._frequencyScale = frequencyScale;
    this._gl.uniform1i(this._glParams.uScale, frequencyScale === FrequencyScale.logarithmic ? 1 : 0);                
  }

  get frequencyScale() {
    return this._frequencyScale;
  }

  get minFrequency() {
    return this._minFrequency;
  }

  set maxFrequency(value: number) {
    // TODO: VALIDATE

    this._maxFrequency = clamp(value, MIN_FREQUENCY, MAX_FREQUENCY);
    this._gl.uniform1f (this._glParams.uMaxFrequencyLocation, this._maxFrequency);                
  }
  
  get maxFrequency() {
    return this._maxFrequency;
  }

  set dynamicRange(value: number) {
    this._dynamicRange = value;
    this._gl.uniform1f (this._glParams.uDynamicRangeLocation, value);                
  }

  get dynamicRange() {
    return this._dynamicRange;
  }

  set dynamicRangeTop(value: number) {
    this._dynamicRangeTop = value;
    this._gl.uniform1f (this._glParams.uDynamicRangeTopLocation, value);
  }

  get dynamicRangeTop() {
    return this._dynamicRangeTop;
  }

  set timeWindow(value: number) {
    // TODO: VALIDATE
    this._timeWindow = clamp(value, DEFAULT_MIN_TIME_WINDOW, DEFAULT_MAX_TIME_WINDOW);
    this._gl.uniform1f(
      this._glParams.uVisibleTransformLocation,
      Math.min(this.visibleTransforms, this._canvas.width)
    );                
  }

  get timeWindow() {
    return this._timeWindow;
  }

  set colorRamp(value: [number, number, number][]) {
    this._colorRamp = value;
  }
  
  get colorRamp() {
    return this._colorRamp;
  }

  get fragmentShader() {
    return fragmentShaderCode.replace('{{COLOR_RAMP}}', generateColorRampCode(this.colorRamp));
  }

  constructor({
    canvas,
    dataResolver,
    currentTime = 0,
    frequencyScale = DEFAULT_FREQUENCY_SCALE,
  }:SpectrogramRendererProperties) {
    this._canvas = canvas;
    this._gl = canvas.getContext('webgl');
    this._dataResolver = dataResolver;
    this._frequencyScale = frequencyScale;
    this._width = canvas.width;
    this._height = canvas.height;
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
      throw Error(
        `ERROR compiling vertex shader: ${gl.getShaderInfoLog(vertexShader)}`,
      );
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw Error(
        `ERROR compiling vertex shader: ${gl.getShaderInfoLog(fragmentShader)}`,
      );
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    /*
     * for debugging shaders
     */
    if (!IS_PROD) {
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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(backgroundVertices),
      gl.STATIC_DRAW
    );

    const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");

    gl.vertexAttribPointer(
      positionAttribLocation,
      2,
      gl.FLOAT,
      false,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0
    );

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

    gl.uniform1f (this._glParams.uVisibleTransformLocation, this.visibleTransforms);                

    gl.uniform1f(this._glParams.uDynamicRangeLocation, this._dataResolver.maxDecibels - this._dataResolver.minDecibels);

    gl.uniform1f(this._glParams.uDynamicRangeTopLocation, this._dataResolver.maxDecibels);
    
    gl.uniform1f(this._glParams.uMinDecibelsLocation, this._dataResolver.minDecibels);
    gl.uniform1f(this._glParams.uMaxDecibelsLocation, this._dataResolver.maxDecibels);

  }

  updatePlayheadPosition(currentTime: number) {
    this.currentTime = currentTime;
  }

  private _resize(width: number, height: number) {
    const gl = this._gl;
    const textureWidth = width;
    this._width = width;
    this._height = height;

    const textureHeight = this._dataResolver.frequencyBinCount;

    this._textureBuffer = new Uint8Array(textureWidth * textureHeight);
    gl.viewport(0, 0, width, height);

    gl.uniform2f(this._glParams.uTextureSizeLocation, textureWidth, textureHeight);    
    gl.uniform2f(this._glParams.uViewportSize, width, height);    
  }

  draw() {
    if (this._width === this._canvas.width || this._height === this._canvas.height) {
      this._resize(this._canvas.width, this._canvas.height);
    }
    const sampleRate = this._dataResolver.sampleRate;
    const frequencyBinCount = this._dataResolver.frequencyBinCount;
    const gl = this._gl;

    const currentTime = this.currentTime;
    const visibleTransforms =  this.visibleTransforms;

    const firstVisibleTransform = getFirstVisibleTransform(currentTime, this._dataResolver.samplesBetweenTransforms, sampleRate);

    const timeXOffset = firstVisibleTransform % 1;
    const textureWidth = this._width;

    let x = 0;
    let y = 0;
    let transformI = 0;
    const roundedVisibleTransforms = Math.ceil(visibleTransforms) + 1;

    const filledTextureWidth = Math.min(roundedVisibleTransforms, this._canvas.width);
    const xStep =  Math.max((roundedVisibleTransforms/this._canvas.width), 1);
    for (let i = 0; i < frequencyBinCount * filledTextureWidth ; i++) {
      x =  i % filledTextureWidth;
      y = (i / filledTextureWidth) | 0;
      transformI = (firstVisibleTransform) + x * xStep|0;
      
      this._textureBuffer[y * textureWidth + x] = this._dataResolver.getFrequency(transformI, y) || 0;
    }

    gl.bindTexture(gl.TEXTURE_2D, this._glParams.fftTexture);
    gl.uniform1f (this._glParams.uXTransformOffsetLocation, timeXOffset);     
    gl.pixelStorei( gl.UNPACK_ALIGNMENT, 1 );

    gl.texImage2D( 
      gl.TEXTURE_2D, 
      0, 
      gl.LUMINANCE, 
      textureWidth,
      frequencyBinCount,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      this._textureBuffer
    );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.finish();
  }
  
  isFrequencyBinVisible(frequencyBin: number) {
    const visibleTransforms =  this.visibleTransforms;
    const firstVisibleTransform = getFirstVisibleTransform(this.currentTime, this._dataResolver.samplesBetweenTransforms, this._dataResolver.sampleRate);

    return frequencyBin >= firstVisibleTransform && frequencyBin <= firstVisibleTransform + visibleTransforms;
  }
}   
