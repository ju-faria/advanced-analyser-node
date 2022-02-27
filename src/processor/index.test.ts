import { fill } from 'lodash';
import { WindowingFunctionTypes } from '../types';

const noop = () => {
  // do nothing
};
const notImplemented = (name?: string) => {
  it(`🚨 NO IMPLEMENTATION YET 🚨${name ? ` - ${name}`: ''}`, noop);
};

const portPostMessageSpy = jest.fn();
global.AudioWorkletProcessor = class AudioWorkletProcessor {
  port = {
    onmessage: noop,
    onmessageerror: noop,
    close: noop,
    postMessage: (message: unknown) => portPostMessageSpy(message),
    start: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
  };

  process() {
    return true;
  }
};
global.currentTime = 0;

const registerProcessorSpy = jest.fn();

global.registerProcessor = (name, processorCtor) => registerProcessorSpy(name, processorCtor);

import { MAX_FFT_SIZE } from '../constants';
import { AdvancedAnalyserProcessor } from './';

const doNTimes = (n:number, fn: (iterator: number) => void) => {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
};

const fftConstructorSpy = jest.fn();
const fftRealTransformSpy = jest.fn();
function FFT(fftSize: number) {
  fftConstructorSpy(fftSize);
  return {
    createComplexArray: () => new Float32Array(fftSize * 2),
    realTransform: fftRealTransformSpy.mockImplementation((output: Float32Array, input: Float32Array)   => {
      for(let i = 0; i< input.length; i++ ) {
        output[i * 2] = input[i];
        output[i * 2 + 1] = input[0];
      }
    })
  };
}

jest.mock('fft.js', () =>( {
  default: FFT,
  __esModule: true,
}));

jest.mock('../constants', () =>( {
  //  Smaller max fft size to make it more manageable for testing purposes
  MAX_FFT_SIZE: 32,
  __esModule: true,
}));
describe('AdvancedAnalyserProcessor', () => {

  beforeAll(() => {
    fftConstructorSpy.mockClear();
    fftRealTransformSpy.mockClear();
    portPostMessageSpy.mockClear();
  });

  it('sets up initial properties correctly', () => {
    const fftSize = 16;
    const samplesBetweenTransforms = 8;
    const fftBinSize = fftSize / 2;
    const processor = new AdvancedAnalyserProcessor({ 
      processorOptions:{ 
        fftSize, 
        samplesBetweenTransforms
      }
    });
    
    expect(processor._fftSize).toEqual(fftSize);
    expect(processor._fftInput).toHaveLength(fftSize);
    expect(processor._fftAnalyser).toBeDefined();
    expect(fftConstructorSpy).toHaveBeenCalledWith(fftSize);
    expect(processor._fftInput).toHaveLength(fftSize);
    expect(processor._fftOutput).toHaveLength(fftSize * 2); // complex array
    expect(processor._lastTransform).toHaveLength(fftBinSize); 
    expect(processor._samplesBetweenTransforms).toEqual(samplesBetweenTransforms); 
    expect(processor._samplesCount).toEqual(0); 
    
  });
  describe('_shouldFlushFrequencies', () => {
    it('returns true whenever _samplesCount is a multiple of samplesBetweenTransforms', () => {
      const fftSize = 16;
      const samplesBetweenTransforms = 8;
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._isListeningTo.frequencydata = true;

      processor._samplesCount = samplesBetweenTransforms;
      expect(processor._shouldFlushFrequencies()).toBeTruthy();
      processor._samplesCount = samplesBetweenTransforms * 2;
      expect(processor._shouldFlushFrequencies()).toBeTruthy();
      processor._samplesCount = samplesBetweenTransforms * 3;
      expect(processor._shouldFlushFrequencies()).toBeTruthy();
      processor._samplesCount = samplesBetweenTransforms * 1234;
      expect(processor._shouldFlushFrequencies()).toBeTruthy();
      processor._samplesCount = samplesBetweenTransforms + 1;
      expect(processor._shouldFlushFrequencies()).toBeFalsy();
    });
  });
  it('only flushes if there are active event listeners', () => {
    const fftSize = 16;
    const samplesBetweenTransforms = 8;
    const processor = new AdvancedAnalyserProcessor({ 
      processorOptions:{ 
        fftSize, 
        samplesBetweenTransforms
      }
    });
    processor._isListeningTo.frequencydata = true;
    expect(processor._shouldFlushFrequencies()).toBeTruthy();

    processor._isListeningTo.frequencydata = false;
    expect(processor._shouldFlushFrequencies()).toBeFalsy();
    
    processor._isListeningTo.bytefrequencydata = true;
    expect(processor._shouldFlushFrequencies()).toBeTruthy();

    processor._isListeningTo.bytefrequencydata = false;
    expect(processor._shouldFlushFrequencies()).toBeFalsy();
  });
  describe('_appendToBuffer', () => {
    it('adds values to the correct position in the buffer', () => {
      
      const fftSize = 4;
      const samplesBetweenTransforms = 2;
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      
      
      processor._flushFrequencies = noop; // ignores flushing
      let expectedResult = fill(new Array(MAX_FFT_SIZE), 0);
      expect(Array.from(processor._buffer)).toEqual(expectedResult);
      
      doNTimes(MAX_FFT_SIZE, () => processor._appendToBuffer(1)); 
      expectedResult = fill(new Array(MAX_FFT_SIZE), 1);
      expect(Array.from(processor._buffer)).toEqual(expectedResult);
      doNTimes(3, (i) => {
        processor._appendToBuffer(2);
        expectedResult[i] = 2;
      });
      expect(Array.from(processor._buffer)).toEqual(expectedResult);                
      
    });
    describe('calls _flushFrequencies at the correct time', () => {
      it('when samplesBetweenTransforms is multiple of fftSize', () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 2;
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        });
        processor._isListeningTo.frequencydata = true;
        processor._flushFrequencies = jest.fn();
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(0);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(2);
      });
      it('when samplesBetweenTransforms is NOT multiple of fftSize', () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 3;
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        });
        processor._isListeningTo.frequencydata = true;
        processor._flushFrequencies = jest.fn();
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(0);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(0);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(2);
      });
      
      it('when samplesBetweenTransforms is bigger than the fftSize', () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 8;
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        });
        processor._isListeningTo.frequencydata = true;

        processor._flushFrequencies = jest.fn();
        doNTimes(7, () => processor._appendToBuffer(1));
        
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(0);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        doNTimes(7, () => processor._appendToBuffer(1));
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(2);
      });
      it('when samplesBetweenTransforms is bigger than and is not multiple of the fftSize', () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 7;
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        });
        processor._isListeningTo.frequencydata = true;
        processor._flushFrequencies = jest.fn();
        doNTimes(6, () => processor._appendToBuffer(1));
        
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(0);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        doNTimes(6, () => processor._appendToBuffer(1));
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(1);
        processor._appendToBuffer(1);
        expect(processor._flushFrequencies).toHaveBeenCalledTimes(2);
      });
    });
  });
  describe('_updateFftInput', () => {


    it('cherry pick the correct values from _fftInput from _buffer', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms,
          windowFunction: WindowingFunctionTypes.none,
        }
      });
      // ignores flushing
      processor._flushFrequencies = noop;
      let expectedResult = fill(new Array(fftSize), 0);
      processor._updateFftInput();
      expect(Array.from(processor._fftInput)).toEqual(expectedResult);
      doNTimes(5, (i) => {
        processor._appendToBuffer(i);
        expectedResult[i] = i;
      });
      
      
      doNTimes(fftSize, () => {
        processor._appendToBuffer(999);
      });
      expectedResult = fill(new Array(fftSize), 999);
      processor._updateFftInput();
      expect(Array.from(processor._fftInput)).toEqual(expectedResult);
      
    });

    
    it('gets the correct values on the buffer overflows', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms,
          windowFunction: WindowingFunctionTypes.none
        }
      });
      // ignores flushing
      processor._flushFrequencies = noop;
      let expectedResult = fill(new Array(fftSize), 0);
      processor._updateFftInput();
      expect(Array.from(processor._fftInput)).toEqual(expectedResult);
      doNTimes(MAX_FFT_SIZE - 4, () => {
        processor._appendToBuffer(1);
        
      });
      
      doNTimes(fftSize, () => {
        processor._appendToBuffer(2);
      });
      
      expectedResult = fill(new Array(fftSize), 2);
      processor._updateFftInput();
      expect(Array.from(processor._fftInput)).toEqual(expectedResult);
    });
  });
  describe('_convertFrequenciesToDb', () => {
    it('transform _lastTransform values to db and populate the array passed as argument', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._flushFrequencies = noop;
      const destinationArray = new Float32Array(fftSize);
      processor._lastTransform = fill(new Float32Array(fftSize), 0.1) as Float32Array;
      processor._convertFrequenciesToDb(destinationArray);
      expect(destinationArray).toEqual(fill(new Float32Array(fftSize), -20));
      
      
      processor._lastTransform = fill(new Float32Array(fftSize), 0.2) as Float32Array;
      processor._convertFrequenciesToDb(destinationArray);
      

      expect(destinationArray).toEqual(fill(new Float32Array(fftSize),  20.0 * Math.log10(0.2)));
    });
    

    notImplemented('calls the correct windowing function');
  });
  
  describe('_convertFrequenciesToByteData', () => {
    it('converts _lastTransform to a Uint8Array with 0 being equal to _minDecibels and 255 being equal to _maxDecibels', () => {
      const fftSize = 32;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._flushFrequencies = noop;
      
      const destinationArray = new Uint8Array(fftSize /2);
      const destinationFloatArray = new Float32Array(fftSize /2);
      
      doNTimes(fftSize / 2, (i) => {
        processor._lastTransform[i] = 0.0000001 + i * 0.003;
      });
      processor._convertFrequenciesToByteData(destinationArray);
      processor._convertFrequenciesToDb(destinationFloatArray);
      

      const rangeScaleFactor =  1.0 / (processor._maxDecibels - processor._minDecibels);
      
      destinationArray.forEach((byteValue, i) => {
        const dbValue = destinationFloatArray[i];
        if (dbValue < processor._minDecibels) {
          expect(byteValue).toEqual(0);
          return;
        }
        if (dbValue > processor._maxDecibels) {
          expect(byteValue).toEqual(255);
          return;
        }
        expect(byteValue).toEqual(( 255 * (dbValue - processor._minDecibels) * rangeScaleFactor) | 0);
      });
    });
  });
  describe('_convertTimeDomainDataToByteData', notImplemented);
  describe('_doFft', () => {
    it('calls _updateFftInput', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._flushFrequencies = noop;

      processor._updateFftInput = noop;


      fftRealTransformSpy.mockImplementationOnce((fftOutput:number[]) => {
        fftOutput.forEach((_, i:number) => {
          fftOutput[i] = ((i + 1) % 2) ? 1 : 0;
        });
      });
      processor._updateFftInput();


      processor._doFft();
      expect(fftRealTransformSpy).toHaveBeenCalledWith(processor._fftOutput, processor._fftInput);

      expect(new Array(...processor._lastTransform)).toEqual([ 0.125, 0.125, 0.125, 0.125 ]);

      //  all values in lastTransform will equal to 0
      fftRealTransformSpy.mockImplementationOnce((fftOutput:number[]) => {
        fftOutput.forEach((_, i:number) => {
          fftOutput[i] = 0;
        });
      });
      // if we apply 0.5 smoothing, we should get the intersection between the two values 0.125 and 0, which is equal to 0.125/2
      processor._smoothingTimeConstant = 0.5; 
      processor._doFft();

      expect(new Array(...processor._lastTransform)).toEqual([ 0.0625, 0.0625, 0.0625, 0.0625 ]);
    });
    it('calls realTransform', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });

      processor._doFft();
      expect(fftRealTransformSpy).toHaveBeenCalledWith(processor._fftOutput, processor._fftInput);
    });
    it('normalizes and updates _lastTransform', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._flushFrequencies = noop;
      processor._updateFftInput = noop;

      fftRealTransformSpy.mockImplementationOnce((fftOutput:number[]) => {
        fftOutput.forEach((_, i:number) => {
          fftOutput[i] = ((i + 1) % 2) ? 1 : 0;
        });
      });

      processor._doFft();
      expect(new Array(...processor._lastTransform)).toEqual([ 0.125, 0.125, 0.125, 0.125 ]);
    });
    it('smoothes transforms over time based on the smoothingTimeConstant', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._flushFrequencies = noop;

      processor._updateFftInput = noop;


      fftRealTransformSpy.mockImplementationOnce((fftOutput:number[]) => {
        fftOutput.forEach((_, i:number) => {
          fftOutput[i] = ((i + 1) % 2) ? 1 : 0;
        });
      });
      processor._doFft();

      expect(new Array(...processor._lastTransform)).toEqual([ 0.125, 0.125, 0.125, 0.125 ]);

      //  all values in lastTransform will equal to 0
      fftRealTransformSpy.mockImplementationOnce((fftOutput:number[]) => {
        fftOutput.forEach((_, i:number) => {
          fftOutput[i] = 0;
        });
      });
      // if we apply 0.5 smoothing, we should get the intersection between the two values 0.125 and 0, which is equal to 0.125/2
      processor._smoothingTimeConstant = 0.5; 
      processor._doFft();

      expect(new Array(...processor._lastTransform)).toEqual([ 0.0625, 0.0625, 0.0625, 0.0625 ]);
    });
  });
  describe('_flushFrequencies', () => {
    it ('calls _updateFftInput', () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._isListeningTo.bytefrequencydata = true;
      processor._updateFftInput = jest.fn();
      processor._flushFrequencies();
      expect(processor._updateFftInput).toHaveBeenCalled();

    });
    
    it('calls doFft', ()=> {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });
      processor._isListeningTo.bytefrequencydata = true;
      processor._doFft = jest.fn();
      processor._flushFrequencies();
      expect(processor._doFft).toHaveBeenCalled();
    });

    it('calls _updateFftInput', ()=> {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      });

      processor._updateFftInput = jest.fn();
      processor._flushFrequencies();
      expect(processor._updateFftInput).toHaveBeenCalled();
    });
  });
  describe('_getFloatFrequencyData', notImplemented);
  describe('_getByteFrequencyData', notImplemented);
  describe('_getFloatTimeDomainData', notImplemented);
  describe('_getByteTimeDomainData', notImplemented);
  describe('process', notImplemented);
  describe('registerProcessor', notImplemented);
  describe('Happy path', notImplemented);
});