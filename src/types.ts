
export enum MessageTypes {
  start,
  stop,
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

export enum WindowingFunctionTypes {
  none = 'none',
  blackmanWindow = "blackmanWindow" 
}