import FFT from 'fft.js';
import { EventListenerTypes, Message } from '../types';
export declare class AdvancedAnalyserProcessor extends AudioWorkletProcessor {
    _samplesCount: number;
    _count: number;
    _first: boolean;
    _fftAnalyser: FFT;
    _fftSize: number;
    _fftInput: Float32Array;
    _fftOutput: number[];
    _lastTransform: Float32Array;
    _samplesBetweenTransforms: number;
    _isListeningTo: Record<EventListenerTypes, boolean>;
    /**
     * The W3C spec for the analyser node states that:
     * "...increasing fftSize does mean that the current time-domain data must be expanded to include past frames that it previously did not.
     * This means that the AnalyserNode effectively MUST keep around the last 32768 sample-frames and the current time-domain data
     * is the most recent fftSize sample-frames out of that."
     * - https://webaudio.github.io/web-audio-api/#AnalyserNode-attributes
     *
     * We're trying to match the W3C spec for the analyser node as close as possible, for that reason we do the same here.
     */
    _buffer: Float32Array;
    _minDecibels: number;
    _maxDecibels: number;
    _smoothingTimeConstant: number;
    _portMap: Map<any, any>;
    static get parameterDescriptors(): {
        name: string;
        defaultValue: number;
    }[];
    constructor(options: {
        processorOptions: {
            fftSize: number;
            samplesBetweenTransforms: number;
        };
    });
    _onmessage(message: Message): void;
    _postMessage(message: Message, transfer?: Transferable[]): void;
    _shouldFlush(): boolean;
    _appendToBuffer(value: number): void;
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
    _updateFftInput(): void;
    _convertFloatToDb(destinationArray: Float32Array): void;
    _convertToByteData(destinationArray: Uint8Array): void;
    _doFft(): void;
    get _fftBinSize(): number;
    _flush(): void;
    _getFloatFrequencyData(requestId: number): void;
    _getByteFrequencyData(requestId: number): void;
    process(inputs: Float32Array[][], _: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
