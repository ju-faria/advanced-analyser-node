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
        expect(processor._indexOffset).toEqual(fftSize - samplesBetweenTransforms) 
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
        describe('adds values to the correct position in the buffer', () => {
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
                expect(Array.from(processor._buffer)).toEqual([0, 0, 1, 0])
            
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([0, 0, 1, 1])
                
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([1, 0, 1, 1])
                            

                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([1, 1, 1, 1])
                

                processor._appendToBuffer(2)
                expect(Array.from(processor._buffer)).toEqual([1, 1, 2, 1])
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
                const initialIndex = processor._samplesCount - 1
                processor._flush = jest.fn()
                
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([0, 1, 0, 0])
    
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([0, 1, 1, 0])
            

                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([0, 1, 1, 1])

                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([1, 1, 1, 1])
                doNTimes(3, () => {
                    processor._appendToBuffer(2)
                })
            
                expect(Array.from(processor._buffer)).toEqual([1, 2, 2, 2])
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
                const initialIndex = processor._samplesCount - 1
                processor._flush = jest.fn()
                
                processor._appendToBuffer(1)


                expect(Array.from(processor._buffer)).toEqual([1, 0, 0, 0])
                doNTimes(3, () => processor._appendToBuffer(1))

                expect(Array.from(processor._buffer)).toEqual([1, 1, 1, 1])
                processor._appendToBuffer(2)


                processor._appendToBuffer(2)
                expect(Array.from(processor._buffer)).toEqual([2, 2, 1, 1])
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
                const initialIndex = processor._samplesCount - 1
                processor._flush = jest.fn()
                
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([0, 1, 0, 0])

                processor._appendToBuffer(1)
                processor._appendToBuffer(1)
                processor._appendToBuffer(1)
                expect(Array.from(processor._buffer)).toEqual([1, 1, 1, 1])
                processor._appendToBuffer(2)
                

                processor._appendToBuffer(2)
                expect(Array.from(processor._buffer)).toEqual([1, 2, 2, 1])
            })
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

        it('remaps _buffer to _fftInput sequentially', () => {
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
            doNTimes(5, (i) => processor._appendToBuffer(i))
            console.log(processor._buffer)
            expect(Array.from(processor._buffer)).toEqual([ 4, 0, 0, 0, 0, 1, 2, 3])
            processor._updateFftInput()
            expect(Array.from(processor._fftInput)).toEqual([ 0, 0, 0, 0, 1, 2, 3, 4])


            processor = new AdvancedAnalyserProcessor({ 
                processorOptions:{ 
                    fftSize, 
                    samplesBetweenTransforms
                }
            })

            // ignores flushing
            processor._flush = () => {}
            doNTimes(15, (i) => processor._appendToBuffer(i))

            expect(Array.from(processor._buffer)).toEqual([12, 13, 14,  7, 8,  9, 10, 11])
            processor._updateFftInput()
            expect(Array.from(processor._fftInput)).toEqual([ 7, 8,  9, 10, 11, 12, 13, 14])
        })
    })
})