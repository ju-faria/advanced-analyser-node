import {createAdvancedAnalyserNode, AdvancedAnalyserNode } from '@soundui/advanced-analyser-node';
import fragmentShaderCode from './shaders/fragment.glsl';
import vertexShaderCode from './shaders/vertex.glsl';
import { SVG } from '@svgdotjs/svg.js';
import { lerpLog } from './utils';

const timeOffsetDisplay = document.querySelector('#timeoffsetdisplay');

export type SpectrogramRendererProperties = {
  canvas: HTMLCanvasElement
  audioSource: AudioNode
  isDataHandledExternally?:boolean
  advancedAnalyserNode?: AdvancedAnalyserNode         
  data?: Uint8Array[] 
  currentTime?: number
}

const getFftStartIndexByTime = (sampleRate: number, fftBinSize: number, samplesBetweenTransforms: number, time: number) => {
  return (((sampleRate/samplesBetweenTransforms * (time / 1000)) | 0 )-1)* fftBinSize;
};

const getTimeOffset = (time: number, visibleTransforms: number, timeWindow: number) => {

  return (((((time % timeWindow) / timeWindow) * visibleTransforms) % 1) *  100 | 0)/100;

};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getClosestPowerOfTwo = (value: number) => Math.pow(2, Math.round(Math.log2(value)));

export class SpectrogramRenderer {
  _hasInit = false;

  _canvas: HTMLCanvasElement;

  _audioContext: BaseAudioContext;

  _audioSource: AudioNode;

  _gl: WebGLRenderingContext;

  _glParams: {
    uVisibleTransformLocation: WebGLUniformLocation;
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
  
  _aaNode: AdvancedAnalyserNode;

  _isDataHandledExternally: boolean;
  
  _data: Uint8Array[];
  
  _currentTime: number;
  
  _textureBuffer: Uint8Array;
  
  _timeWindow = 10_000;
  
  _minFrequency = 20;

  _maxFrequency = 40000;
  
  _dynamicRange = 70;

  _dynamicRangeTop = -30;

  _colorMap: [number, number, number][] = [
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
    return (this._audioContext.sampleRate / this._aaNode.samplesBetweenTransforms ) * this.timeWindow/1000;
  }

  set minFrequency(value: number) {
    // TODO: VALIDATE

    this._minFrequency =  clamp(value, 20, 44100);

    this._gl.uniform1f (this._glParams.uMinFrequencyLocation, this._minFrequency );                
  }

  get minFrequency() {
    return this._minFrequency;
  }

  set maxFrequency(value: number) {
    // TODO: VALIDATE

    this._maxFrequency = clamp(value, 20, 44100);
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
    this._timeWindow = clamp(value, 1000, 3600_000);
    this._gl.uniform1f (this._glParams.uVisibleTransformLocation, Math.min(this.visibleTransforms, this._canvas.width));                

  }

  get timeWindow() {
    return this._timeWindow;
  }

  set colorMap(value: [number, number, number][]) {
    this._colorMap = value;
  }
  
  get colorMap() {
    return this._colorMap;
  }

  get fragmentShader() {
    const colorCount = this.colorMap.length;

    const colorVars = this.colorMap.map((rgb) => rgb.map((value) => (value / 255).toFixed(4)))
      .map((rgb, i) => `vec3 ${String.fromCharCode(65 + i)} = vec3(${rgb.join(',')});`);

    const colorRampBody = this.colorMap
      .map((_, i)=> {
        if (i === colorCount - 1) return '';
        return [
          `if (value <= ${((i+1) / (colorCount-1)).toFixed(4)}){`,
          `return mix(`,
          `${String.fromCharCode(65 + i)},`,
          `${String.fromCharCode(66 + i)},`, 
          `remap(${(i / (colorCount-1)).toFixed(4)}, ${((i+1)/(colorCount-1)).toFixed(4)}, 0., 1., value)`, 
          `);};`
        ].join('');
      });

    return fragmentShaderCode.replace('{{COLOR_RAMP}}', `vec3 color_ramp(float value) {${[...colorVars, ...colorRampBody].join('')}}`);

  }

  constructor({
    canvas,
    advancedAnalyserNode,
    // audioContext,
    audioSource,
    data,
    isDataHandledExternally = false,
    currentTime = 0,
  }:SpectrogramRendererProperties) {
    const audioContext = audioSource.context;
    this._canvas = canvas;
    this._gl = canvas.getContext('webgl');
    this._data = data || [];
    this.currentTime = currentTime;
    this._aaNode = advancedAnalyserNode;
    this._audioContext = audioContext;
    this._isDataHandledExternally = isDataHandledExternally;
    this._audioSource = audioSource;
    this.initAaNode();
  }

  async initAaNode() {
    this._aaNode = this._aaNode || await createAdvancedAnalyserNode(this._audioContext, { 
      // fftSize: 1024, 
      samplesBetweenTransforms: 44100 / 12

    });
    if (!this._isDataHandledExternally) {

      this._aaNode.addEventListener("bytefrequencydata", ({ detail }) => {

        this._data.push(detail);
      });
    }

    this._audioSource.connect(this._aaNode);
    this.initGl();
    this._hasInit = true;
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
     * for debugging (disable that in prod)
     */
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ERROR linking program!", gl.getProgramInfoLog(program));
      return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error("ERROR validating program!", gl.getProgramInfoLog(program));
      return;
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
    const textureHeight = this._aaNode.frequencyBinCount;

    this._textureBuffer = new Uint8Array(textureWidth * textureHeight);
  

    gl.bindTexture(gl.TEXTURE_2D, this._glParams.fftTexture);
  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
    gl.uniform2f(this._glParams.uTextureSizeLocation, textureWidth, textureHeight);    
    gl.uniform2f(this._glParams.uViewportSize, width, height);    
  
    gl.uniform1f(this._glParams.uMinFrequencyLocation, this._minFrequency);                
    gl.uniform1f(this._glParams.uMaxFrequencyLocation, this._maxFrequency);                
    gl.uniform1f(this._glParams.uSampleRateLocation, this._audioContext.sampleRate);   

    gl.uniform1f (this._glParams.uVisibleTransformLocation, this.visibleTransforms);                

    gl.uniform1f(this._glParams.uDynamicRangeLocation, this._aaNode.maxDecibels - this._aaNode.minDecibels);

    gl.uniform1f(this._glParams.uDynamicRangeTopLocation, this._aaNode.maxDecibels);
    
    gl.uniform1f(this._glParams.uMinDecibelsLocation, this._aaNode.minDecibels);
    gl.uniform1f(this._glParams.uMaxDecibelsLocation, this._aaNode.maxDecibels);

  }

  updatePlayheadPosition(currentTime: number) {
    this.currentTime = currentTime;
  }

  draw() {
    if (!this._hasInit) return;
    const sampleRate = this._audioContext.sampleRate;
    const frequencyBinCount = this._aaNode.frequencyBinCount;
    const gl = this._gl;

    const currentTime = this.currentTime;
    const visibleTransforms =  this.visibleTransforms;

    const firstVisibleTransform = Math.max(((((sampleRate * ((currentTime)/1000))) - 1)/  this._aaNode.samplesBetweenTransforms), 0);
    const timeXOffset = firstVisibleTransform % 1;
    const textureWidth = this._canvas.width;

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
      
      this._textureBuffer[y * textureWidth + x] = this._data[transformI] ? this._data[transformI][y] : 0;
    }


    gl.bindTexture(gl.TEXTURE_2D, this._glParams.fftTexture);
    gl.uniform1f (this._glParams.uXTransformOffsetLocation, timeXOffset);     

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
}


class Spectrogram {
  readonly renderer:SpectrogramRenderer;

}

(async () => {

  const rangeInput:HTMLInputElement = document.querySelector('#timeWindowInput');
  const playheadInput:HTMLInputElement = document.querySelector('#playheadInput');
  const timeWindowDisplay = document.querySelector('#timewindowdisplay');
  
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  const context = new AudioContext();
  const audioSource = context.createMediaStreamSource(stream);

  const canvas = document.querySelector('canvas');

  // [
  //   20000,

  // ].map((hz) =>  {
  const oscillator = context.createOscillator();
  // @ts-ignore
  window.osc = oscillator;
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(2000, 0); // value in hertz

  oscillator.start();


  //   return oscillator
  // })

  const spectogramRenderer = new SpectrogramRenderer({ canvas, audioSource: audioSource });
  rangeInput.value = `${spectogramRenderer.timeWindow/ 1000}`;
  // timeWindowDisplay.innerHTML = rangeInput.value;
  rangeInput.oninput = () => {
    spectogramRenderer.timeWindow = Number(rangeInput.value) * 1000;
    // timeWindowDisplay.innerHTML = rangeInput.value;
  };
  playheadInput.oninput = () => {
    spectogramRenderer._currentTime =  Number(playheadInput.value) * 1000;
  };
  //75.6
  const update = () => {
    requestAnimationFrame(update);
    // spectogramRenderer._currentTime = Math.max(context.currentTime * 1000 - spectogramRenderer.timeWindow, 0);
    spectogramRenderer.draw();
  };

  update();


  const scaleTimeWindowAroundTimePoint = (delta: number, timeScalingPoint: number, timeWindow: number, currentTime: number) => {
    const timeWindowDelta = timeWindow * delta;
    return {
      timeWindow: timeWindow + timeWindowDelta,
      newTimePosition: currentTime - (timeWindowDelta * ((timeScalingPoint - currentTime) / timeWindow))
    };
    
  };

  function beginSliding(pointerDownE:PointerEvent) {

    const startTimeAxisScrollPosition =  spectogramRenderer.currentTime;
    const startMinFreq =  spectogramRenderer.minFrequency;
    const startMaxFreq =  spectogramRenderer.maxFrequency;
    canvas.onpointermove = (e) => slide(e, pointerDownE, startTimeAxisScrollPosition, startMinFreq, startMaxFreq);

    canvas.setPointerCapture(pointerDownE.pointerId);
  }
  
  function stopSliding(e:PointerEvent) {
    canvas.onpointermove = null;
    canvas.releasePointerCapture(e.pointerId);
  }

  function slide(e:PointerEvent, pointerDownE: PointerEvent, startTimeAxisScrollPosition:number, minFrequency:number, maxFrequency:number) {
    const timePixelsMoved = ( e.clientX - pointerDownE.clientX);
    const timePerPixel = (spectogramRenderer.timeWindow / canvas.width);
    spectogramRenderer.currentTime = startTimeAxisScrollPosition - (timePerPixel * timePixelsMoved);

    const pixelsMoved = (e.clientY - pointerDownE.clientY);

    const newMinFrequency = lerpLog(
      minFrequency, 
      maxFrequency,
      pixelsMoved / canvas.height,
    );

    const newMaxFrequency = lerpLog(
      minFrequency, 
      maxFrequency,
      (canvas.height + pixelsMoved) / canvas.height,
    );

    if (newMinFrequency >= 20 && newMaxFrequency <= 44100 ) {
      spectogramRenderer.minFrequency = newMinFrequency;
      spectogramRenderer.maxFrequency = newMaxFrequency ;
    }
  }
  

  
  canvas.onpointerdown = beginSliding;
  canvas.onpointerup = stopSliding;


  const getTimeFromRender = ( currentTime: number, timeWindow: number, renderPoint: number) => {
    return currentTime + timeWindow * renderPoint;
  };

  const getRenderPointFromTime = ( currentTime: number, timeWindow: number, time: number) => {
    return (time - currentTime) / timeWindow;
  };




  canvas.onwheel = (e) => {
    if (e.shiftKey) {

      const delta = e.deltaX * -1 / 1000;
      const positionOnCanvas =  (e.offsetX / canvas.width);
      const timeWindow = spectogramRenderer.timeWindow;
      const currentTime = spectogramRenderer.currentTime;
  
      const scaledTimeWindow = scaleTimeWindowAroundTimePoint(
        delta,
        getTimeFromRender(currentTime, timeWindow, positionOnCanvas),
        timeWindow,
        spectogramRenderer._currentTime
      );

      spectogramRenderer.timeWindow = scaledTimeWindow.timeWindow;
      spectogramRenderer.currentTime = scaledTimeWindow.newTimePosition;
    } else {
      const delta = e.deltaY * -1;
      const positionOnCanvas =  (e.offsetY / canvas.height);

      const { minFrequency, maxFrequency } = spectogramRenderer;
      const newMinFrequency = lerpLog(
        minFrequency, 
        maxFrequency, 
        -(delta * (positionOnCanvas - 1) * -1) / canvas.height,
      );

      const newMaxFrequency = lerpLog(
        minFrequency, 
        maxFrequency, 
        (canvas.height + delta * positionOnCanvas) / (canvas.height),
      );

  
      spectogramRenderer.minFrequency = newMinFrequency;
      spectogramRenderer.maxFrequency = newMaxFrequency;
    }

  };
});






