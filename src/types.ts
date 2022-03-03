export enum MessageTypes {
  start,
  stop,
  updateProcessorOptions,
  
  frequencyDataAvailable,
  byteFrequencyDataAvailable,

  timeDomainDataAvailable,
  byteTimeDomainDataAvailable,

  getFloatFrequencyData,
  requestedFloatFrequencyDataAvailable,


  getByteFrequencyData,
  requestedByteFrequencyDataAvailable,


  getFloatTimeDomainData,
  requestedFloatTimeDomainDataAvailable,

  getByteTimeDomainData,
  requestedByteTimeDomainDataAvailable,


  startedListeningTo,
  stoppedListeningTo,
} 
/**
 * BasicMessage
 */
interface BasicMessage<T, P = unknown> {
  type: T,
  payload?: P
}

interface IdentifiedMessage<T, P = unknown> extends BasicMessage<T, P> {
  id: number,
}

export type UpdateProcessorOptionsPayload = {
  [ProcessorParameters.fftSize]?: number,
  [ProcessorParameters.samplesBetweenTransforms]?: number,
  [ProcessorParameters.timeDomainSamplesCount]?: number,
  [ProcessorParameters.minDecibels]?: number,
  [ProcessorParameters.maxDecibels]?: number,
  [ProcessorParameters.smoothingTimeConstant]?: number,
  [ProcessorParameters.windowFunction]?: WindowFunctionTypes,
}
type UpdateProcessorOptionsMessage = BasicMessage<MessageTypes.updateProcessorOptions, UpdateProcessorOptionsPayload>

type FloatFrequencyDataAvailableMessage = BasicMessage<MessageTypes.frequencyDataAvailable, ArrayBuffer>
type ByteFrequencyDataAvailableMessage = BasicMessage<MessageTypes.byteFrequencyDataAvailable, ArrayBuffer>

type FloatTimeDomainDataAvailableMessage = BasicMessage<MessageTypes.timeDomainDataAvailable, ArrayBuffer>
type ByteTimeDomainDataAvailableMessage = BasicMessage<MessageTypes.byteTimeDomainDataAvailable, ArrayBuffer>

type GetFloatFrequencyDataMessage = IdentifiedMessage<MessageTypes.getFloatFrequencyData>
type RequestedFloatFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatFrequencyDataAvailable, ArrayBuffer>

type GetByteFrequencyDataMessage = IdentifiedMessage<MessageTypes.getByteFrequencyData,ArrayBuffer>
type RequestedByteFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteFrequencyDataAvailable, ArrayBuffer>

type GetFloatTimeDomainDataMessage = IdentifiedMessage<MessageTypes.getFloatTimeDomainData>
type RequestedFloatTimeDomainDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatTimeDomainDataAvailable, ArrayBuffer>

type GetByteTimeDomainDataMessage = IdentifiedMessage<MessageTypes.getByteTimeDomainData,ArrayBuffer>
type RequestedByteTimeDomainDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteTimeDomainDataAvailable, ArrayBuffer>


type StartedListeningToMessage = BasicMessage<MessageTypes.startedListeningTo, EventListenerTypes>
type StoppedListeningToMessage = BasicMessage<MessageTypes.stoppedListeningTo, EventListenerTypes>

export type Message =  
  FloatFrequencyDataAvailableMessage  
  | ByteFrequencyDataAvailableMessage
  | FloatTimeDomainDataAvailableMessage
  | ByteTimeDomainDataAvailableMessage
  | GetFloatFrequencyDataMessage
  | RequestedFloatFrequencyDataAvailableMessage
  | GetByteFrequencyDataMessage
  | RequestedByteFrequencyDataAvailableMessage
  | GetFloatTimeDomainDataMessage
  | RequestedFloatTimeDomainDataAvailableMessage
  | GetByteTimeDomainDataMessage
  | RequestedByteTimeDomainDataAvailableMessage
  | StartedListeningToMessage
  | StoppedListeningToMessage
  | UpdateProcessorOptionsMessage


export enum ProcessorParameters {
  fftSize = 'fftSize',
  samplesBetweenTransforms = 'samplesBetweenTransforms',
  timeDomainSamplesCount = 'timeDomainSamplesCount',
  windowFunction = 'windowFunction',
  minDecibels = 'minDecibels',
  maxDecibels = 'maxDecibels',
  smoothingTimeConstant = 'smoothingTimeConstant',
}  

export enum EventListenerTypes {
  /**
   * Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
   * Returns a Float32Array with half the `fftSize`, with the current frequency data.
   */
  frequencydata = 'frequencydata',
  /**
   * Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
   * The data is represented in bytes
   * Returns a Uint8Array with half the `fftSize`, with the current frequency data.
   */
  bytefrequencydata = 'bytefrequencydata',
  /**
   * Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
   * Returns a Float32Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.
   */
  timedomaindata = 'timedomaindata',
  /**
   * Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
   * Returns a Uint8Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.
   */
  bytetimedomaindata = 'bytetimedomaindata',
}


export enum WindowFunctionTypes {
  /**
   * Retangular window - Doesn't change the signal
   */
  rectangular = 'rectangular',
  /**
   * [Blackmann window](https://en.wikipedia.org/wiki/Window_function#Blackman_window)
   */
  blackman = 'blackman',
  /**
   * [Nuttall window](https://en.wikipedia.org/wiki/Window_function#Nuttall_window,_continuous_first_derivative)
   */
  nuttall = 'nuttall',
  /**
   * [Blackman-Nutall window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Nuttall_window)
   */
  blackmanNuttall = 'blackman-nuttall',
  /**
   * [Blackman-Harris window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Harris_window)
   */
  blackmanHarris = 'blackman-harris',
  /**
   * [Hann window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
   */
  hann = 'hann',
  /**
   * [Hamming window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
   */
  hamming = 'hamming',
  /**
   * Bartlett window
   */
  bartlett = 'bartlett',
}

export type AdvancedAnalyserNodeProperties = {
  /**
   * The size of the FFT used for frequency-domain analysis (in sample-frames). 
   * This MUST be a power of two in the range 32 to 32768. 
   * The default value is 2048. Note that large FFT sizes can be costly to compute.
   */
  fftSize?: number, 

  /**
   * The interval in number of samples between transforms. Note that if this number is higher than the fftSize, 
   * some samples will be skipped, and if it's lower, samples will be overlapped.
   */
  samplesBetweenTransforms?: number,
  
  /**
   * The number of samples that will be returned in the time-domain events callback
   */
  timeDomainSamplesCount?: number,

  /**
   * The [Window Function](https://en.wikipedia.org/wiki/Window_function) to be applied applied to the samples before each transform.
   */
  windowFunction?: WindowFunctionTypes,
  
  /**
   * Value representing the maximum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event.
   */
  maxDecibels?: number,
  
  /**
   * Value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event.
   */
  minDecibels?: number,
  
  /**
   * Represents the averaging constant with the last analysis frame. 
   * It's basically an average between the current buffer and the last buffer the AnalyserNode processed, 
   * and results in a much smoother set of value changes over time.
   */
  smoothingTimeConstant?: number
}


export type Listener<T> = (prop: { detail: T}) => void