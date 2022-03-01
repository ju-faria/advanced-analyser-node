
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
  [ProcessorParameters.windowFunction]?: WindowFunctionTypes,
}
type UpdateProcessorOptionsMessage = BasicMessage<MessageTypes.updateProcessorOptions,UpdateProcessorOptionsPayload>

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
}  

export enum EventListenerTypes {
  frequencydata = 'frequencydata',
  bytefrequencydata = 'bytefrequencydata',
  timedomaindata = 'timedomaindata',
  bytetimedomaindata = 'bytetimedomaindata',
}

export enum WindowFunctionTypes {
  rectangular = 'rectangular',
  blackman = 'blackman',
  nuttall = 'nuttall',
  blackmanNuttall = 'blackman-nuttall',
  blackmanHarris = 'blackman-harris',
  hann = 'hann',
  hamming = 'hamming',
  bartlett = 'bartlett',
}

type NodeAddEventListener<T, L, O = unknown> = (type: T, listener: () => ({ detail: L }), options?: O ) => void;

export type NodeEventListener<T = Float32Array | Uint8Array> = (event:{ detail: T }) => void
export type AddEventListenerTypes = NodeAddEventListener<EventListenerTypes.bytefrequencydata, Float32Array>

// export interface AdvancedAnalyserNode {
//   addEventListener: AddEventListenerTypes
// }