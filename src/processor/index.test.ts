/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fill, noop } from "lodash";
import { MessageTypes, WindowFunctionTypes } from "../types";
import { doNTimes } from "../../tests/utils";
import "jest-extended";

const createProcessor = ({
  fftSize,
  samplesBetweenTransforms,
  timeDomainSamplesCount,
  windowFunction = WindowFunctionTypes.blackman,
} : { 
  fftSize: number,
  samplesBetweenTransforms?: number,
  timeDomainSamplesCount?: number,
  windowFunction?: WindowFunctionTypes
}) => {
  return new AdvancedAnalyserProcessor({ 
    processorOptions:{ 
      fftSize, 
      samplesBetweenTransforms: samplesBetweenTransforms || fftSize,
      timeDomainSamplesCount: timeDomainSamplesCount || fftSize,
      windowFunction: windowFunction,
      minDecibels: -100,
      maxDecibels: -30,
      smoothingTimeConstant: 0,
    }
  });
};



const portPostMessageSpy = jest.fn();
// @ts-ignore
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

const registerProcessorSpy = jest.fn();

global.registerProcessor = (name, processorCtor) => registerProcessorSpy(name, processorCtor);

import { MAX_FFT_SIZE, PROCESSOR_NAME } from "../constants";
import { AdvancedAnalyserProcessor } from "./";
import { windowFunctionsMap } from "./window-functions";

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

jest.mock("fft.js", () =>( {
  default: FFT,
  __esModule: true,
}));

jest.mock("../constants", () =>( {
  //  Smaller max fft size to make it more manageable for testing purposes
  MAX_FFT_SIZE: 32,
  PROCESSOR_NAME: "processorName",
  __esModule: true,
}));

describe("AdvancedAnalyserProcessor", () => {

  beforeAll(() => {
    fftConstructorSpy.mockClear();
    fftRealTransformSpy.mockClear();
    portPostMessageSpy.mockClear();
  });

  it("sets up initial properties correctly", () => {
    const fftSize = 16;
    const samplesBetweenTransforms = 8;
    const fftBinSize = fftSize / 2;
    const processor = createProcessor({
      fftSize,
      samplesBetweenTransforms,
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

  describe("_onmessage", () => {
    it("calls the expected methods according to the MessageType", () => {
      const fftSize = 16;
      const samplesBetweenTransforms = 8;

      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });

      processor._getFloatFrequencyData = jest.fn();
      processor._getByteFrequencyData = jest.fn();
      processor._getFloatTimeDomainData = jest.fn();
      processor._getByteTimeDomainData = jest.fn();
      [
        [MessageTypes.getFloatFrequencyData, processor._getFloatFrequencyData as jest.Mock<unknown, never>],
        [MessageTypes.getByteFrequencyData, processor._getByteFrequencyData as jest.Mock<unknown, never>],
        [MessageTypes.getFloatTimeDomainData, processor._getFloatTimeDomainData as jest.Mock<unknown, never>],
        [MessageTypes.getByteTimeDomainData, processor._getByteTimeDomainData as jest.Mock<unknown, never>]
      ].forEach(([type, spy]:[MessageTypes, jest.Mock<unknown, never>]) => {
        expect(spy).not.toHaveBeenCalled();
        // @ts-ignore
        processor._onmessage({ type });
        expect(spy).toHaveBeenCalled();
      });
    });
  });
  describe("_shouldFlushFrequencies", () => {
    it("returns true whenever _samplesCount is a multiple of samplesBetweenTransforms", () => {
      const fftSize = 16;
      const samplesBetweenTransforms = 8;
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
  it("only flushes if there are active event listeners", () => {
    const fftSize = 16;
    const samplesBetweenTransforms = 8;
    const processor = createProcessor({
      fftSize,
      samplesBetweenTransforms,
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
  describe("_appendToBuffer", () => {
    it("adds values to the correct position in the buffer", () => {
      
      const fftSize = 4;
      const samplesBetweenTransforms = 2;
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
    describe("calls _flushFrequencies at the correct time", () => {
      it("when samplesBetweenTransforms is multiple of fftSize", () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 2;
        const processor = createProcessor({
          fftSize,
          samplesBetweenTransforms,
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
      it("when samplesBetweenTransforms is NOT multiple of fftSize", () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 3;
        const processor = createProcessor({
          fftSize,
          samplesBetweenTransforms,
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
      
      it("when samplesBetweenTransforms is bigger than the fftSize", () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 8;
        const processor = createProcessor({
          fftSize,
          samplesBetweenTransforms,
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
      it("when samplesBetweenTransforms is bigger than and is not multiple of the fftSize", () => {
        const fftSize = 4;
        const samplesBetweenTransforms = 7;
        const processor = createProcessor({
          fftSize,
          samplesBetweenTransforms,
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
  describe("_updateFftInput", () => {


    it("cherry pick the correct values from _fftInput from _buffer", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
        windowFunction: WindowFunctionTypes.rectangular,
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

    
    it("gets the correct values on the buffer overflows", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
        windowFunction: WindowFunctionTypes.rectangular,
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
  describe("_convertFrequenciesToDb", () => {
    it("transform _lastTransform values to db and populate the array passed as argument", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
    

    it("calls the correct windowing function", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      const blackmanFunctionSpy = jest.fn();
      const noFunctionSpy = jest.fn();
      windowFunctionsMap.blackman = blackmanFunctionSpy; 
      windowFunctionsMap.rectangular = noFunctionSpy; 
      processor._updateFftInput();
      expect(blackmanFunctionSpy).toHaveBeenCalled();

      processor._windowFunction = WindowFunctionTypes.rectangular;
      processor._updateFftInput();

      expect(noFunctionSpy).toHaveBeenCalled();
    });
  });
  
  describe("_convertFrequenciesToByteData", () => {
    it("converts _lastTransform to a Uint8Array with 0 being equal to _minDecibels and 255 being equal to _maxDecibels", () => {
      const fftSize = 32;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
  describe("_convertTimeDomainDataToByteData", () => {
    it("converts time domain data to byte data", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });

      const destinationArray = new Uint8Array(3);
      const dataArray = Float32Array.from([0, -1, 1]);
      processor._convertTimeDomainDataToByteData(dataArray, destinationArray);
      expect(Array.from(destinationArray)).toEqual([128, 0, 255]);
    });
  });
  describe("_doFft", () => {
    it("calls _updateFftInput", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
    it("calls realTransform", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });

      processor._doFft();
      expect(fftRealTransformSpy).toHaveBeenCalledWith(processor._fftOutput, processor._fftInput);
    });
    it("normalizes and updates _lastTransform", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
    it("smoothes transforms over time based on the smoothingTimeConstant", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
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
  describe("_flushFrequencies", () => {
    it ("calls _updateFftInput", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      processor._isListeningTo.bytefrequencydata = true;
      processor._updateFftInput = jest.fn();
      processor._flushFrequencies();
      expect(processor._updateFftInput).toHaveBeenCalled();

    });
    
    it("calls doFft", ()=> {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      processor._isListeningTo.bytefrequencydata = true;
      processor._doFft = jest.fn();
      processor._flushFrequencies();
      expect(processor._doFft).toHaveBeenCalled();
    });

    it("calls _updateFftInput", ()=> {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });

      processor._updateFftInput = jest.fn();
      processor._flushFrequencies();
      expect(processor._updateFftInput).toHaveBeenCalled();
    });
    it("returns the last N samples", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      processor._isListeningTo.frequencydata = true;
      processor._isListeningTo.bytefrequencydata = true;

      doNTimes(fftSize, () => {
        processor._appendToBuffer(0.00125);

      });

      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;
      processor._flushFrequencies();
      const floatCall = postMessageSpy.mock.calls[0][0];
      const byteCall = postMessageSpy.mock.calls[1][0];

      expect(floatCall.type).toEqual(MessageTypes.frequencyDataAvailable);
      expect(new Float32Array(floatCall.payload)).toEqual(Float32Array.from( [-73.11329650878906, -73.11329650878906, -73.11329650878906, -73.11329650878906]));


      expect(byteCall.type).toEqual(MessageTypes.byteFrequencyDataAvailable);
      expect(Array.from(new Uint8Array(byteCall.payload))).toEqual([97, 97, 97, 97]);
    });
  });
  describe("_flushTimeDomainSamples", () => {
    it("returns the last N samples", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      processor._isListeningTo.timedomaindata = true;
      processor._isListeningTo.bytetimedomaindata = true;
      const expectedSamples = new Float32Array(fftSize);
      doNTimes(fftSize, (i) => {
        processor._appendToBuffer(i / 100);
        expectedSamples[i] = i / 100;
      });

      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;
      processor._flushTimeDomainSamples();
      const floatCall = postMessageSpy.mock.calls[0][0];
      const byteCall = postMessageSpy.mock.calls[1][0];

      expect(floatCall.type).toEqual(MessageTypes.timeDomainDataAvailable);
      expect(new Float32Array(floatCall.payload)).toEqual(expectedSamples);


      expect(byteCall.type).toEqual(MessageTypes.byteTimeDomainDataAvailable);
      expect(Array.from(new Uint8Array(byteCall.payload))).toEqual([128, 129, 130, 131, 133, 134, 135, 136]);
    });
  });

  describe("_getFloatFrequencyData", () => {
    it("calls methods in the correct order", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
        windowFunction: WindowFunctionTypes.rectangular
      });

      processor._updateFftInput = jest.fn();
      processor._doFft = jest.fn();
      processor._convertFrequenciesToDb = jest.fn();
      processor._postMessage = jest.fn();

      processor._getFloatFrequencyData(1);
      expect(processor._updateFftInput).toHaveBeenCalledBefore(processor._doFft as jest.Mock<unknown, never>);
      expect(processor._doFft).toHaveBeenCalledBefore(processor._convertFrequenciesToDb as jest.Mock<unknown, never>);
      expect(processor._convertFrequenciesToDb).toHaveBeenCalledBefore(processor._postMessage as jest.Mock<unknown, never>);

    });
    it("posts an identified message with the fft data", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      
      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;


      processor._doFft = jest.fn(()  => {
        processor._lastTransform = processor._lastTransform.map(() => 0.001);
      });

      processor._getFloatFrequencyData(123);
      const { id, type, payload } = postMessageSpy.mock.calls[0][0];
      expect(id).toEqual(123);
      expect(type).toEqual(MessageTypes.requestedFloatFrequencyDataAvailable);

      expect(Array.from(new Float32Array(payload))).toEqual([-60, -60, -60, -60]);
    });

  });
  describe("_getByteFrequencyData", () => {
    it("calls methods in the correct order", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
    
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
        windowFunction: WindowFunctionTypes.rectangular
      });

      processor._updateFftInput = jest.fn();
      processor._doFft = jest.fn();
      processor._fillArrayWithLastNSamples = jest.fn();
      processor._convertFrequenciesToByteData = jest.fn();
      processor._postMessage = jest.fn();

      processor._getByteFrequencyData(1);
      expect(processor._updateFftInput).toHaveBeenCalledBefore(processor._doFft as jest.Mock<unknown, never>);
      expect(processor._doFft).toHaveBeenCalledBefore(processor._fillArrayWithLastNSamples as jest.Mock<unknown, never>);
      expect(processor._fillArrayWithLastNSamples).toHaveBeenCalledBefore(processor._convertFrequenciesToByteData as jest.Mock<unknown, never>);
      expect(processor._convertFrequenciesToByteData).toHaveBeenCalledBefore(processor._postMessage as jest.Mock<unknown, never>);

    });
    it("posts an identified message with the fft data", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      
      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;


      processor._doFft = jest.fn(()  => {
        processor._lastTransform = processor._lastTransform.map(() => 0.001);
      });

      processor._getByteFrequencyData(123);
      const { id, type, payload } = postMessageSpy.mock.calls[0][0];

      expect(id).toEqual(123);
      expect(type).toEqual(MessageTypes.requestedByteFrequencyDataAvailable);


      expect(Array.from(new Uint8Array(payload))).toEqual([145, 145, 145, 145]);
    });
  });
  describe("_getFloatTimeDomainData", () => {
    it("returns the last N samples", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      doNTimes(fftSize, (i) => {
        processor._appendToBuffer(i);
      });

      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;
      processor._getFloatTimeDomainData(123);
      const { id, type, payload } = postMessageSpy.mock.calls[0][0];
      expect(id).toEqual(123);
      expect(type).toEqual(MessageTypes.requestedFloatTimeDomainDataAvailable);
      expect(Array.from(new Float32Array(payload))).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
  });
  describe("_getByteTimeDomainData", () => {
    it("returns the last N samples as bytes", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      doNTimes(fftSize, (i) => {
        processor._appendToBuffer(i / 100);
      });

      const postMessageSpy = jest.fn();
      processor._postMessage = postMessageSpy;
      processor._getByteTimeDomainData(123);
      const { id, type, payload } = postMessageSpy.mock.calls[0][0];
      expect(id).toEqual(123);
      expect(type).toEqual(MessageTypes.requestedByteTimeDomainDataAvailable);
      expect(Array.from(new Uint8Array(payload))).toEqual([128, 129, 130, 131, 133, 134, 135, 136]);
    });
  });
  describe("process", () => {
    it("calls _appendToBuffer for every input sample", () => {
      const fftSize = 8;
      const samplesBetweenTransforms = 4;
      
      const processor = createProcessor({
        fftSize,
        samplesBetweenTransforms,
      });
      const appendToBufferSpy = jest.fn();
      processor._appendToBuffer = appendToBufferSpy;

      processor.process(
        [[
          Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        ]], 
        [[]],
        { isRecording: Float32Array.from([1]) }
      );

      expect(appendToBufferSpy.mock.calls.map(([n]) => n)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    });
  });
  describe("registerProcessor", () => {
    expect(registerProcessorSpy).toHaveBeenCalledWith(PROCESSOR_NAME, AdvancedAnalyserProcessor);
  });
});