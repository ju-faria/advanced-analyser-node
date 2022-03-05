/* eslint-disable @typescript-eslint/ban-ts-comment */

import { noop } from "lodash";
import { MessageTypes, WindowFunctionTypes } from "../types";
import { MAX_FFT_SIZE, MIN_FFT_SIZE, PROCESSOR_NAME } from "../constants";

jest.mock('processor', () => ({
  default: 'abc',
  __esModule: true,
}), { virtual: true });
const portPostMessageSpy = jest.fn();

const context = {
  currentTime: 0,
} as BaseAudioContext;

const audioWorkletNodeConstructorSpy = jest.fn();
const addEventListenerSpy = jest.fn();
const removeEventListenerSpy = jest.fn();
const dispatchEventSpy = jest.fn();
class AudioWorkletNodeMock {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) {
    audioWorkletNodeConstructorSpy(context, name, options);
  }

  onprocessorerror() {
    return;
  }

  addEventListener(...args: unknown[]) {
    addEventListenerSpy(...args);
  }

  removeEventListener(...args: unknown[]) {
    removeEventListenerSpy(...args);
    return;
  }

  connect() {
    return;
  }

  disconnect() {
    return;
  } 
  
  dispatchEvent(...args: unknown[]) {
    dispatchEventSpy(...args);
  }

  parameters = new Map();

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
  
  channelCount = 1;

  channelCountMode = "max";

  channelInterpretation = "speakers";

  context = context;

  numberOfInputs = 1;

  numberOfOutputs = 1;

  prototype = {};
}


global.AudioWorkletNode = AudioWorkletNodeMock as unknown as typeof global.AudioWorkletNode;
const customEventSpy = jest.fn();

global.CustomEvent = class CustomEvent<T> {
  detail?: T;

  constructor(type: string, eventInitDict?: CustomEventInit<T>) {
    customEventSpy(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }
} as unknown as typeof CustomEvent;
import { AdvancedAnalyserNode } from "./advanced-analyser-node";

describe('AdvancedAnalyserNode', () => {
  beforeEach(() => {
    portPostMessageSpy.mockClear();
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
    dispatchEventSpy.mockClear();
  });
  it('called \'super\' with the expected arguments', () => {
    new AdvancedAnalyserNode(context, {
      fftSize: 1024,
      samplesBetweenTransforms: 2048,
      timeDomainSamplesCount: 4096,
      windowFunction: WindowFunctionTypes.blackmanNuttall,
    });
    const [receivedContext, processorName, options] = audioWorkletNodeConstructorSpy.mock.calls[0];
    expect(receivedContext).toEqual(context);
    expect(processorName).toEqual(PROCESSOR_NAME);
    expect(options).toEqual({
      processorOptions: {
        fftSize: 1024,
        samplesBetweenTransforms: 2048,
        timeDomainSamplesCount: 4096,
        windowFunction: WindowFunctionTypes.blackmanNuttall,
        maxDecibels: -30,
        minDecibels: -100,
        smoothingTimeConstant: 0,
      },
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'max',
      channelInterpretation: 'speakers'
    });
  });
  describe('validates inputs', () => {
    describe('fftSize', () => {
      it('throws if fftSize is not power of 2', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: 1024,
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: 1024 + 1,
          });
        }).toThrow();
      });

      it('throws if fftSize is above MAX_FFT_SIZE', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: MAX_FFT_SIZE,
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: MAX_FFT_SIZE + 1,
          });
        }).toThrow();
      });
      it('throws if fftSize is below MIN_FFT_SIZE', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: MIN_FFT_SIZE,
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            fftSize: MIN_FFT_SIZE - 1,
          });
        }).toThrow();
      });
    });
    describe('samplesBetweenTransforms', () => {
      it('throw if it\'s below or equal to zero', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            samplesBetweenTransforms: 1,
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            samplesBetweenTransforms: 0,
          });
        }).toThrow();      
      });
    });
    describe('timeDomainSamplesCount', () => {
      it('throw if it\'s below or equal to zero', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            timeDomainSamplesCount: 1,
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            timeDomainSamplesCount: 0,
          });
        }).toThrow();      
      });
    });
    describe('windowFunction', () => {
      it('throw if windowFunction is not valid', () => {
        expect(() => {
          new AdvancedAnalyserNode(context, {
            windowFunction: WindowFunctionTypes.bartlett
          });
        }).not.toThrow();
        expect(() => {
          new AdvancedAnalyserNode(context, {
            // @ts-ignore
            windowFunction: 'invalid'
          });
        }).toThrow();      
      });
    });
  });

  describe('updating properties', () => {
    describe('fftSize', () => {
      it('post a message to update processor properties', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });

        node.fftSize = 2048;

        expect(portPostMessageSpy).toHaveBeenCalledWith( {
          type: MessageTypes.updateProcessorOptions,
          payload: {
            fftSize: 2048,
            samplesBetweenTransforms: 2048,
            timeDomainSamplesCount: 2048
          }
        });
      });
      it('calls validation', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(() => {
          node.fftSize = 2048 + 1;
        }).toThrowError();
      });
    });
    
    describe('samplesBetweenTransforms', () => {
      it('post a message to update processor properties', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        node.samplesBetweenTransforms = 2048;
        expect(portPostMessageSpy).toHaveBeenCalledWith( {
          type: MessageTypes.updateProcessorOptions,
          payload: {
            samplesBetweenTransforms: 2048,
          }
        });
        expect(node.samplesBetweenTransforms).toEqual(2048);
      });
      it('returns fftSize if it is undefined', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(node.samplesBetweenTransforms).toEqual(1024);
        
        node.fftSize = 2048;
        expect(node.samplesBetweenTransforms).toEqual(2048);
      });
      it('calls validation', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(() => {
          node.samplesBetweenTransforms = 0;
        }).toThrowError();
      });
    });
    
    describe('timeDomainSamplesCount', () => {
      it('post a message to update processor properties', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        node.timeDomainSamplesCount = 2048;
        expect(portPostMessageSpy).toHaveBeenCalledWith( {
          type: MessageTypes.updateProcessorOptions,
          payload: {
            timeDomainSamplesCount: 2048,
          }
        });
        expect(node.timeDomainSamplesCount).toEqual(2048);
      });
      it('returns fftSize if it is undefined', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(node.timeDomainSamplesCount).toEqual(1024);
        
        node.fftSize = 2048;
        expect(node.timeDomainSamplesCount).toEqual(2048);
      });
      it('calls validation', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(() => {
          node.timeDomainSamplesCount = 0;
        }).toThrowError();
      });
    });

    describe('windowFunction', () => {
      it('post a message to update processor properties', () =>  {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        node.windowFunction = WindowFunctionTypes.hann;
        expect(portPostMessageSpy).toHaveBeenCalledWith( {
          type: MessageTypes.updateProcessorOptions,
          payload: {
            windowFunction: WindowFunctionTypes.hann,
          }
        });
        expect(node.windowFunction).toEqual(WindowFunctionTypes.hann);
      });

      it('calls validation', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(() => {
          //@ts-ignore
          node.windowFunction = 'invalid';
        }).toThrowError();
      });
    });
    describe('frequencyBinCount', () => {
      it('returns half the fftSize', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024
        });
        expect(node.frequencyBinCount).toEqual(512);
        node.fftSize = 2048;
        expect(node.frequencyBinCount).toEqual(1024);
      });
    });
  });
  it('assigns fftSize, samplesBetweenTransforms, timeDomainSamplesCount and windowFunction', () => {
    const node = new AdvancedAnalyserNode(context, {
      fftSize: 1024,
      samplesBetweenTransforms: 2048,
      timeDomainSamplesCount: 4096,
      windowFunction: WindowFunctionTypes.hamming,
    });
    expect(node.fftSize).toEqual(1024);
    expect(node.samplesBetweenTransforms).toEqual(2048);
    expect(node.timeDomainSamplesCount).toEqual(4096);
    expect(node.windowFunction).toEqual(WindowFunctionTypes.hamming);
  });

  it('assigns fftSize, samplesBetweenTransforms, timeDomainSamplesCount and windowFunction', () => {
    const node = new AdvancedAnalyserNode(context, {
      fftSize: 1024,
      samplesBetweenTransforms: 2048,
      timeDomainSamplesCount: 4096,
      windowFunction: WindowFunctionTypes.hamming,
    });
    expect(node.fftSize).toEqual(1024);
    expect(node.samplesBetweenTransforms).toEqual(2048);
    expect(node.timeDomainSamplesCount).toEqual(4096);
    expect(node.windowFunction).toEqual(WindowFunctionTypes.hamming);
  });

  describe('getFloatFrequencyData', () => {
    it('returns a promise', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      expect(node.getFloatFrequencyData()).toBeInstanceOf(Promise);
    });
    it('posts message requesting float frequency data', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      node.getFloatFrequencyData();

      expect(portPostMessageSpy).toHaveBeenLastCalledWith({
        id: 0,
        type: MessageTypes.getFloatFrequencyData,
      });
      
    });
    it('resolves to float frequency data', async () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      const promise = node.getFloatFrequencyData();
      const payload =  Float32Array.from([0, 1, 2, 3]);
      node.port.onmessage({
        data: {
          id: 0,
          type: MessageTypes.requestedFloatFrequencyDataAvailable,
          payload,
        } 
      } as MessageEvent<unknown>);
      const response = await promise;
      expect(response).toEqual(payload);
    });
  });


  describe('getByteFrequencyData', () => {
    it('returns a promise', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      expect(node.getByteFrequencyData()).toBeInstanceOf(Promise);
    });
    it('posts message requesting float frequency data', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      node.getByteFrequencyData();

      expect(portPostMessageSpy).toHaveBeenLastCalledWith({
        id: 0,
        type: MessageTypes.getByteFrequencyData,
      });
      
    });
    it('resolves to float frequency data', async () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      const promise = node.getByteFrequencyData();
      const payload =  Uint8Array.from([0, 1, 2, 3]);
      node.port.onmessage({
        data: {
          id: 0,
          type: MessageTypes.requestedByteFrequencyDataAvailable,
          payload,
        } 
      } as MessageEvent<unknown>);
      const response = await promise;
      expect(response).toEqual(payload);
    });
  });

  describe('getFloatTimeDomainData', () => {
    it('returns a promise', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      expect(node.getFloatTimeDomainData()).toBeInstanceOf(Promise);
    });
    it('posts message requesting float frequency data', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      node.getFloatTimeDomainData();

      expect(portPostMessageSpy).toHaveBeenLastCalledWith({
        id: 0,
        type: MessageTypes.getFloatTimeDomainData,
      });
      
    });
    it('resolves to float frequency data', async () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      const promise = node.getFloatTimeDomainData();
      const payload =  Float32Array.from([0, 1, 2, 3]);
      node.port.onmessage({
        data: {
          id: 0,
          type: MessageTypes.requestedFloatTimeDomainDataAvailable,
          payload,
        } 
      } as MessageEvent<unknown>);
      const response = await promise;
      expect(response).toEqual(payload);
    });
  });


  describe('getByteTimeDomainData', () => {
    it('returns a promise', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      expect(node.getByteTimeDomainData()).toBeInstanceOf(Promise);
    });
    it('posts message requesting float frequency data', () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      node.getByteTimeDomainData();

      expect(portPostMessageSpy).toHaveBeenLastCalledWith({
        id: 0,
        type: MessageTypes.getByteTimeDomainData,
      });
      
    });
    it('resolves to float frequency data', async () => {
      const node = new AdvancedAnalyserNode(context, {
        fftSize: 1024,
      });
      portPostMessageSpy.mockClear();
      const promise = node.getByteTimeDomainData();
      const payload =  Uint8Array.from([0, 1, 2, 3]);
      node.port.onmessage({
        data: {
          id: 0,
          type: MessageTypes.requestedByteFrequencyDataAvailable,
          payload,
        } 
      } as MessageEvent<unknown>);
      const response = await promise;
      expect(response).toEqual(payload);
    });
  });

  describe('Events', () => {
    describe('frequencydata', () => {
      it(`register event`, () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });


        node.addEventListener('frequencydata', ({ detail }) => {
          console.log(detail);
        });

        expect(addEventListenerSpy.mock.calls[0][0]).toEqual('frequencydata');

      });

      it(`dispatches event`, () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });

        node.addEventListener('frequencydata', ({ detail }:CustomEvent<Float32Array>) => {
          console.log(detail);
        });
        const payload =  Float32Array.from([0, 1, 2, 3]);

        node.port.onmessage({
          data: {
            type: MessageTypes.frequencyDataAvailable,
            payload,
          } 
        } as MessageEvent<unknown>);
        const event:CustomEvent<Float32Array> = dispatchEventSpy.mock.calls[0][0];
        expect(event.detail).toEqual(payload);
      });

      it('removes event listener', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
        const listener =  ({ detail }:CustomEvent<Float32Array>) => {
          console.log(detail);
        };
        node.removeEventListener('frequencydata', listener);
        expect(removeEventListenerSpy).toHaveBeenLastCalledWith('frequencydata', listener, undefined);
      });
    });


    describe('bytefrequencydata', () => {
      it('register event', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
  
        node.addEventListener('bytefrequencydata', ({ detail }:CustomEvent<Uint8Array>) => {
          console.log(detail);
        });
  
        expect(addEventListenerSpy.mock.calls[0][0]).toEqual('bytefrequencydata');
  
      });
  
      it('dispatches event', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });

        node.addEventListener('bytefrequencydata', ({ detail }:CustomEvent<Uint8Array>) => {
          console.log(detail);
        });
        const payload = Uint8Array.from([0, 1, 2, 3]);
  
        node.port.onmessage({
          data: {
            type: MessageTypes.byteFrequencyDataAvailable,
            payload,
          } 
        } as MessageEvent<unknown>);
        const event:CustomEvent<Uint8Array> = dispatchEventSpy.mock.calls[0][0];
        expect(event.detail).toEqual(payload);
      });


      it('removes event listener', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
        const listener =  ({ detail }:CustomEvent<Uint8Array>) => {
          console.log(detail);
        };
        node.removeEventListener('bytefrequencydata', listener);
        expect(removeEventListenerSpy).toHaveBeenLastCalledWith('bytefrequencydata', listener, undefined);
      });
    });
    describe('timedomaindata', () => {
      it(`register event`, () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });

        node.addEventListener('timedomaindata', ({ detail }:CustomEvent<Float32Array>) => {
          console.log(detail);
        });

        expect(addEventListenerSpy.mock.calls[0][0]).toEqual('timedomaindata');

      });

      it(`dispatches event`, () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });

        node.addEventListener('timedomaindata', ({ detail }:CustomEvent<Float32Array>) => {
          console.log(detail);
        });

        const payload = Float32Array.from([0, 1, 2, 3]);

        node.port.onmessage({
          data: {
            type: MessageTypes.timeDomainDataAvailable,
            payload,
          } 
        } as MessageEvent<unknown>);
        const event:CustomEvent<Float32Array> = dispatchEventSpy.mock.calls[0][0];
        expect(event.detail).toEqual(payload);
      });

      it('removes event listener', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
        const listener =  ({ detail }:CustomEvent<Float32Array>) => {
          console.log(detail);
        };
        node.removeEventListener('timedomaindata', listener);
        expect(removeEventListenerSpy).toHaveBeenLastCalledWith('timedomaindata', listener, undefined);
      });
    });


    describe('bytetimedomaindata', () => {
      it('register event', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
  
        addEventListenerSpy.mockClear();
        node.addEventListener('bytetimedomaindata', ({ detail }) => {
          console.log(detail);
        });
  
        expect(addEventListenerSpy.mock.calls[0][0]).toEqual('bytetimedomaindata');
  
      });
  
      it('dispatches event', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
        dispatchEventSpy.mockClear();
        addEventListenerSpy.mockClear();
        node.addEventListener('bytetimedomaindata', ({ detail }) => {
          console.log(detail);
        });
        const payload = Uint8Array.from([0, 1, 2, 3]);
  
        node.port.onmessage({
          data: {
            type: MessageTypes.byteTimeDomainDataAvailable,
            payload,
          } 
        } as MessageEvent<unknown>);
        const event:CustomEvent<Uint8Array> = dispatchEventSpy.mock.calls[0][0];
        expect(event.detail).toEqual(payload);
      });

      it('removes event listener', () => {
        const node = new AdvancedAnalyserNode(context, {
          fftSize: 1024,
        });
        const listener =  ({ detail }:CustomEvent<Uint8Array>) => {
          console.log(detail);
        };
        node.removeEventListener('bytetimedomaindata', listener);
        expect(removeEventListenerSpy).toHaveBeenLastCalledWith('bytetimedomaindata', listener, undefined);
      });
    });
  });
});
