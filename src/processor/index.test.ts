import { fill } from 'lodash'

global.AudioWorkletProcessor = class AudioWorkletProcessor {
  port: {
    onmessage: () => {}
    onmessageerror: () => {}
    close: () => {}
    postMessage: () => {}
    start: () => {}
    addEventListener: () => {}
    removeEventListener: () => {}
    dispatchEvent: () => true
  }
  process() {
    return true
  }
}
global.registerProcessor = (name, processorCtor) => undefined

import { MAX_FFT_SIZE } from '../constants'
import { AdvancedAnalyserProcessor } from './'

const doNTimes = (n:number, fn: (iterator: number) => void) => {
  for (let i = 0; i < n; i++) {
    fn(i)
  }
}

const fftConstructorSpy = jest.fn()

function FFT(fftSize: number) {
  fftConstructorSpy(fftSize)
  return {
    createComplexArray: () => new Float32Array(fftSize * 2),
    realTransform: (output: Float32Array, input: Float32Array)   => {
      for(let i = 0; i< input.length; i++ ) {
        output[i * 2] = input[i]
        output[i * 2 + 1] = input[0]
      }
    }
  }
}
jest.mock('fft.js', () =>( {
  default: FFT,
  __esModule: true,
}))

jest.mock('../constants', () =>( {
  //  Smaller max fft size to make it more manageable for testing purposes
  MAX_FFT_SIZE: 32,
  __esModule: true,
}))
describe('AdvancedAnalyserProcessor', () => {
  it('sets up initial properties correctly', () => {
    const fftSize = 16
    const samplesBetweenTransforms = 8
    const fftBinSize = fftSize / 2
    const processor = new AdvancedAnalyserProcessor({ 
      processorOptions:{ 
        fftSize, 
        samplesBetweenTransforms
      }
    })
    
    expect(processor._fftSize).toEqual(fftSize)
    expect(processor._fftInput).toHaveLength(fftSize)
    expect(processor._fftAnalyser).toBeDefined()
    expect(fftConstructorSpy).toHaveBeenCalledWith(fftSize)
    expect(processor._fftInput).toHaveLength(fftSize)
    expect(processor._fftOutput).toHaveLength(fftSize * 2) // complex array
    expect(processor._lastTransform).toHaveLength(fftBinSize) 
    expect(processor._samplesBetweenTransforms).toEqual(samplesBetweenTransforms) 
    expect(processor._samplesCount).toEqual(0) 
    
  })
  describe('_isTimeToFLush', () => {
    it('returns true whenever _samplesCount is a multiple of samplesBetweenTransforms', () => {
      const fftSize = 16
      const samplesBetweenTransforms = 8
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      processor._samplesCount = samplesBetweenTransforms
      expect(processor._isTimeToFLush()).toBeTruthy()
      processor._samplesCount = samplesBetweenTransforms * 2
      expect(processor._isTimeToFLush()).toBeTruthy()
      processor._samplesCount = samplesBetweenTransforms * 3
      expect(processor._isTimeToFLush()).toBeTruthy()
      processor._samplesCount = samplesBetweenTransforms * 1234
      expect(processor._isTimeToFLush()).toBeTruthy()
      processor._samplesCount = samplesBetweenTransforms + 1
      expect(processor._isTimeToFLush()).toBeFalsy()
    })
  })
  
  describe('_appendToBuffer', () => {
    it('adds values to the correct position in the buffer', () => {
      
      const fftSize = 4
      const samplesBetweenTransforms = 2
      const fftBinSize = fftSize / 2
      const processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      
      
      processor._flush = () => {} // ignores flushing
      let expectedResult = fill(new Array(MAX_FFT_SIZE), 0)
      expect(Array.from(processor._buffer)).toEqual(expectedResult)
      
      doNTimes(MAX_FFT_SIZE, () => processor._appendToBuffer(1)) 
      expectedResult = fill(new Array(MAX_FFT_SIZE), 1)
      expect(Array.from(processor._buffer)).toEqual(expectedResult)
      doNTimes(3, (i) => {
        processor._appendToBuffer(2)
        expectedResult[i] = 2
      })
      expect(Array.from(processor._buffer)).toEqual(expectedResult)                
      
    })
    describe('calls _flush at the correct time', () => {
      it('when samplesBetweenTransforms is multiple of fftSize', () => {
        const fftSize = 4
        const samplesBetweenTransforms = 2
        const fftBinSize = fftSize / 2
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        })
        processor._flush = jest.fn()
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(0)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(2)
      })
      it('when samplesBetweenTransforms is NOT multiple of fftSize', () => {
        const fftSize = 4
        const samplesBetweenTransforms = 3
        const fftBinSize = fftSize / 2
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        })
        processor._flush = jest.fn()
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(0)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(0)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(2)
      })
      
      it('when samplesBetweenTransforms is bigger than the fftSize', () => {
        const fftSize = 4
        const samplesBetweenTransforms = 8
        const fftBinSize = fftSize / 2
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        })
        processor._flush = jest.fn()
        doNTimes(7, () => processor._appendToBuffer(1))
        
        expect(processor._flush).toHaveBeenCalledTimes(0)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        doNTimes(7, () => processor._appendToBuffer(1))
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(2)
      })
      it('when samplesBetweenTransforms is bigger than and is not multiple of the fftSize', () => {
        const fftSize = 4
        const samplesBetweenTransforms = 7
        const fftBinSize = fftSize / 2
        const processor = new AdvancedAnalyserProcessor({ 
          processorOptions:{ 
            fftSize, 
            samplesBetweenTransforms
          }
        })
        processor._flush = jest.fn()
        doNTimes(6, () => processor._appendToBuffer(1))
        
        expect(processor._flush).toHaveBeenCalledTimes(0)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(1)
        doNTimes(6, () => processor._appendToBuffer(1))
        expect(processor._flush).toHaveBeenCalledTimes(1)
        processor._appendToBuffer(1)
        expect(processor._flush).toHaveBeenCalledTimes(2)
      })
    })
  })
  describe('_updateFftInput', () => {
    it('cherry pick the correct values from _fftInput from _buffer', () => {
      const fftSize = 8
      const samplesBetweenTransforms = 4
      
      let processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      // ignores flushing
      processor._flush = () => {}
      let expectedResult = fill(new Array(fftSize), 0)
      processor._updateFftInput()
      expect(Array.from(processor._fftInput)).toEqual(expectedResult)
      doNTimes(5, (i) => {
        processor._appendToBuffer(i)
        expectedResult[i] = i
      })
      
      
      
      doNTimes(fftSize, () => {
        processor._appendToBuffer(999)
      })
      expectedResult = fill(new Array(fftSize), 999)
      processor._updateFftInput()
      expect(Array.from(processor._fftInput)).toEqual(expectedResult)
      
    })
    it('gets the correct values on the buffer overflows', () => {
      const fftSize = 8
      const samplesBetweenTransforms = 4
      
      let processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      // ignores flushing
      processor._flush = () => {}
      let expectedResult = fill(new Array(fftSize), 0)
      processor._updateFftInput()
      expect(Array.from(processor._fftInput)).toEqual(expectedResult)
      doNTimes(MAX_FFT_SIZE - 4, (i) => {
        processor._appendToBuffer(1)
        
      })
      
      doNTimes(fftSize, (i) => {
        processor._appendToBuffer(2)
      })
      
      expectedResult = fill(new Array(fftSize), 2)
      processor._updateFftInput()
      expect(Array.from(processor._fftInput)).toEqual(expectedResult)
    })
  })
  describe('_convertFloatToDb', () => {
    it('transform _lastTransform values to db and populate the array passed as argument', () => {
      const fftSize = 8
      const samplesBetweenTransforms = 4
      
      let processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      processor._flush = () => {}
      let destinationArray = new Float32Array(fftSize)
      processor._lastTransform = fill(new Float32Array(fftSize), 0.1) as Float32Array
      processor._convertFloatToDb(destinationArray)
      expect(destinationArray).toEqual(fill(new Float32Array(fftSize), -20))
      
      
      processor._lastTransform = fill(new Float32Array(fftSize), 0.2) as Float32Array
      processor._convertFloatToDb(destinationArray)
      
      console.log(destinationArray)
      expect(destinationArray).toEqual(fill(new Float32Array(fftSize),  20.0 * Math.log10(0.2)))
    })
    
  })
  
  describe('_convertToByteData', () => {
    it('converts _lastTransform to a Uint8Array with 0 being equal to _minDecibels and 255 being equal to _maxDecibels', () => {
      const fftSize = 32
      const samplesBetweenTransforms = 4
      
      let processor = new AdvancedAnalyserProcessor({ 
        processorOptions:{ 
          fftSize, 
          samplesBetweenTransforms
        }
      })
      processor._flush = () => {}
      const dbToLinear = (db: number) => Math.pow(10,  Math.log10(db / 20) )
      
      let destinationArray = new Uint8Array(fftSize /2)
      let destinationFloatArray = new Float32Array(fftSize /2)
      
      doNTimes(fftSize / 2, (i) => {
        processor._lastTransform[i] = 0.0000001 + i * 0.003
      })
      processor._convertToByteData(destinationArray)
      processor._convertFloatToDb(destinationFloatArray)
      
      console.log(destinationArray, destinationFloatArray)
      const rangeScaleFactor =  1.0 / (processor._maxDecibels - processor._minDecibels);
      
      destinationArray.forEach((byteValue, i) => {
        const dbValue = destinationFloatArray[i]
        if (dbValue < processor._minDecibels) {
          expect(byteValue).toEqual(0);
          return
        }
        if (dbValue > processor._maxDecibels) {
          expect(byteValue).toEqual(255);
          return
        }
        expect(byteValue).toEqual(( 255 * (dbValue - processor._minDecibels) * rangeScaleFactor) | 0)
      })
    })
  })
  describe('_doFft', () => {})
  describe('_flush', () => {})
  describe('process', () => {})
  describe('Happy path', () => {})
  describe('registerProcessor', () => {})
})