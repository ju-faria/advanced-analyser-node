import FFT from 'fft.js';
import { MAX_FFT_SIZE } from '../constants';
import { MessageTypes } from '../types';


const linearToDb = (x: number) => {
  return 20.0 * Math.log10(x);
};


const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};

// const hasDebugged = false;
// const hasBeenCalledTimes = 0;

// const debugOnce = (skip: number, fn: () => void) =>{
//   if (hasDebugged) return;
//   if (hasBeenCalledTimes >= skip) {
//     fn();
//     hasDebugged = true;
//     return;
//   }
//   hasBeenCalledTimes ++;
// };
export class AdvancedAnalyserProcessor extends AudioWorkletProcessor {
  _samplesCount = 0;
  _count = 0;
  _first = true;
  _fftAnalyser: FFT;
  _fftSize: number;
  _fftInput: Float32Array;
  _fftOutput: number[];
  _lastTransform: Float32Array;
  _samplesBetweenTransforms: number;
  /**
   * The W3C spec for the analyser node states that:
   * "...increasing fftSize does mean that the current time-domain data must be expanded to include past frames that it previously did not.
   * This means that the AnalyserNode effectively MUST keep around the last 32768 sample-frames and the current time-domain data 
   * is the most recent fftSize sample-frames out of that."
   * - https://webaudio.github.io/web-audio-api/#AnalyserNode-attributes
   * 
   * We're trying to match the W3C spec for the analyser node as close as possible, for that reason we do the same here.
   */
  _buffer: Float32Array = new Float32Array(MAX_FFT_SIZE);
  _minDecibels = -100.0;
  _maxDecibels = -30.0;
  _smoothingTimeConstant = 0;

  static get parameterDescriptors() {
    return [
      {
        name: "isRecording",
        defaultValue: 1
      },
      
    ];
  }
  constructor (options: { processorOptions: { fftSize: number, samplesBetweenTransforms: number } }) {
    super();
    const { fftSize, samplesBetweenTransforms } = options.processorOptions;

    this._fftAnalyser = new FFT(fftSize);
    this._fftInput = new Float32Array(fftSize);
    this._fftOutput = this._fftAnalyser.createComplexArray();
    this._lastTransform = new Float32Array(fftSize / 2);
    this._fftSize = fftSize;
    this._samplesBetweenTransforms = samplesBetweenTransforms;
    
    this._samplesCount = 0;
  }
  
  // _isBufferEmpty() {
  //   return this._samplesCount === 0;
  // }
  _isTimeToFLush(){
    return this._samplesCount % this._samplesBetweenTransforms === 0;
  }
  
  
  _appendToBuffer(value:number) {
    this._buffer[this._samplesCount % this._buffer.length] = value;
    this._samplesCount = this._samplesCount + 1;

    if (this._isTimeToFLush()) {
      this._flush();
    }
  }

  /** 
   * to clarify this as it could be a little confusing:
   * to save memory, _buffer has length equal to the fftSize, and appendToBuffer add the new value always after the last value.
   * that means that the order of the values may not be ordered sequentially. For example:
   * consider that the value in the list is the order it has been added
   * after appending 4 values in an array with fftSize of 4, it will look something like this:
   * [1,2,3,4]
   * 
   * Consider we add 2 more values, the next position will be the index 0 so it will overwrite the first two positions
   * [5, 6, 3, 4]
   * 
   * Now consider we want to calculate a transform, for an fftSize of 4, we want the last 4 values. For that we remap the _buffer to the _fftInput like this:
   * [5, 6, 3, 4] => [3, 4, 5, 6]
   */
  _updateFftInput() {
    /**
     * TODO: pad the fftInput end if the analyser stops in the middle of the samplesBetweenTransforms interval
     */
    const startingIndex = (this._samplesCount  - this._fftSize) % this._buffer.length; 
    for (let i = 0; i < this._fftInput.length; i++) {
      this._fftInput[i] = startingIndex+ i < 0 ? 0 :this._buffer[(startingIndex+ i) % this._buffer.length];
    }
  }
  _convertFloatToDb(destinationArray: Float32Array) {
    const len = Math.min(this._lastTransform.length, destinationArray.length);
    if (len > 0) {
      const source = this._lastTransform;
      for (let i = 0; i < len; ++i) {
        destinationArray[i] =  linearToDb(source[i]);
      }
    }
  }
  _convertToByteData(destinationArray: Uint8Array) {
    const len = Math.min(this._lastTransform.length, destinationArray.length);
    if (len > 0) {
      const source = this._lastTransform;
      const rangeScaleFactor =  1.0 / (this._maxDecibels - this._minDecibels);

      for (let i = 0; i < len; ++i) {
        const linear_value = source[i];
        const dbMag = linearToDb(linear_value);
        const result = 255 * (dbMag - this._minDecibels) * rangeScaleFactor;
        destinationArray[i] = clamp(result | 0, 0, 255);
      }
    }
  }
  _doFft() {
    // tries to adhere as close as possible the W3C spec
    this._updateFftInput();

    this._fftAnalyser.realTransform(this._fftOutput, this._fftInput);
    // Normalize so than an input sine wave at 0dBfs registers as 0dBfs (undo FFT
    // scaling factor).
    const magnitudeScale = 1.0 / this._fftSize;
    // A value of 0 does no averaging with the previous result.  Larger values
    // produce slower, but smoother changes.
    const k = clamp(this._smoothingTimeConstant, 0, 1);

    for (let i = 0; i < this._lastTransform.length; i++) {
      const scalarMagnitude = Math.abs(
        Math.hypot(this._fftOutput[i * 2], this._fftOutput[i * 2 + 1]) // normalize
      ) * magnitudeScale;
      
      this._lastTransform[i] =  k * this._lastTransform[i] + (1 - k) * scalarMagnitude;
    }
  }

  _flush() {
    this._doFft();
    const destinationArray = new Uint8Array(this._fftSize / 2);
    if(destinationArray instanceof Float32Array) {
      this._convertFloatToDb(destinationArray);
    } else {
      this._convertToByteData(destinationArray);
    }
    this.port.postMessage({
      type: MessageTypes.dataAvailable,
      currentTime: currentTime,
      data: destinationArray
    });
  }

  process(
    inputs: Float32Array[][],
    _: Float32Array[][],
    parameters: Record<string, Float32Array>
  ) {
    const isRecordingValues = parameters.isRecording;
    for (let dataIndex = 0; dataIndex < inputs.length; dataIndex++) {
      const shouldRecord = isRecordingValues[dataIndex] === 1 && inputs[0][0];
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

