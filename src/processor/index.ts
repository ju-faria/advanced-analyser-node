import FFT from 'fft.js';
import { Message, MessageTypes } from 'src/types';

const linearToDb = (x: number) => {
  return 20.0 * Math.log10(x);
};

const dbToBytes = (x:number) => {
  const minDecibels = -100.0;
  const maxDecibels = -30.0;
  const rangeScaleFactor =  1.0 / (maxDecibels - minDecibels);
  const result = 255.0 * (x - minDecibels) * rangeScaleFactor;
  return Math.max(result | 0, 0);
};

class AdvancedAnalyserProcessor extends AudioWorkletProcessor {
  _samplesCount = 0;
  _count = 0;
  _first = true;
  private _fftAnalyser: FFT;
  private _fftSize: number;
  private _fftOutput: number[];
  private _lastTransform: Float32Array;
  private _lastTransformAsBytes: Uint8Array;
  _samplesBetweenTransforms: number;
  _buffer: Float32Array;
  static get parameterDescriptors() {
    return [
      {
        name: "isRecording",
        defaultValue: 1
      }
    ];
  }
  constructor () {
    super();
    
    this.port.onmessage = (event) => this.onmessage(event.data);
  }
  onmessage(event:Message) {
    if (event.type === MessageTypes.initFftAnalyser) {
      const { fftSize, samplesBetweenTransforms } = event;

      this._fftAnalyser = new FFT(fftSize);
      this._fftOutput = this._fftAnalyser.createComplexArray();
      this._lastTransform = new Float32Array(fftSize / 2);
      this._lastTransformAsBytes = new Uint8Array(fftSize / 2);
      this._fftSize = fftSize;
      this._samplesBetweenTransforms = samplesBetweenTransforms;
      this._buffer = new Float32Array(this._fftSize);

      this._initBuffer();
    }
  }
  _initBuffer() {
    for (let i = this._samplesBetweenTransforms; i < this._fftSize; i++) {
      this._buffer[i - this._samplesBetweenTransforms] = this._buffer[i];
    }
    this._samplesCount = 0;
  }
  _isBufferEmpty() {
    return this._samplesCount === 0;
  }
  
  _shouldTransformSamples() {
    return this._samplesCount === this._samplesBetweenTransforms;
  }
  
  _appendToBuffer(value:number) {
    if (this._shouldTransformSamples()) {
      this._flush();
    }
    this._buffer[this._fftSize - this._samplesBetweenTransforms + this._samplesCount] = value;
    this._samplesCount += 1;
  }
  _doFft() {
    let buffer = this._buffer;
    if (this._samplesCount < this._samplesBetweenTransforms) {
      buffer = buffer.slice(0, this._fftSize - this._samplesBetweenTransforms + this._samplesCount);
    }

    this._fftAnalyser.realTransform(this._fftOutput, buffer);
    const magnitude_scale = 1.0 / this._fftSize;

    for (let i = 0; i < this._lastTransform.length; i++) {
      const value = linearToDb(
        Math.abs(
          Math.hypot(this._fftOutput[i * 2], this._fftOutput[i * 2 + 1]) // normalize
        ) * magnitude_scale
      );
      this._lastTransform[i] = value;
      this._lastTransformAsBytes[i] = dbToBytes(value);
    }
  }

  _flush() {
    this._doFft();
    this.port.postMessage({
      type: MessageTypes.dataAvailable,
      currentTime: currentTime,
      data: this._lastTransformAsBytes 
    });

    this._initBuffer();
  }
  
  _recordingStopped() {
    this.port.postMessage({
      type: MessageTypes.stop
    });
  }
  
  process(
    inputs: Float32Array[][],
    _: Float32Array[][],
    parameters: Record<string, Float32Array>
  ) {
    if (!this._buffer) return true;
    const isRecordingValues = parameters.isRecording;
    for (let dataIndex = 0; dataIndex < inputs.length; dataIndex++) {
      const shouldRecord = isRecordingValues[dataIndex] === 1 && inputs[0][0];
      
      if (!shouldRecord && !this._isBufferEmpty()) {
        this._flush();
        this._recordingStopped();
      }
      
      if (shouldRecord) {
        for (
          let sampleIndex = 0;
          sampleIndex < inputs[0][0].length;
          sampleIndex++
        ) {
          this._appendToBuffer(inputs[0][0][sampleIndex]);
        }
      }
    } 
    return true;
  }
}
    

registerProcessor('AdvancedAnalyserProcessor',AdvancedAnalyserProcessor);