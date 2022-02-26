
export enum MessageTypes {
  start,// = "start",
  stop,// = "stop",
  frequencyDataAvailable,// = "frequency-data-available",
  byteFrequencyDataAvailable,// = "byte-frequency-data-available",

  getFloatFrequencyData,// = "get-float-frequency-data",
  requestedFloatFrequencyDataAvailable,// = "float-frequency-data-available",


  getByteFrequencyData,// = "get-byte-frequency-data",
  requestedByteFrequencyDataAvailable,// = "byte-frequency-data-available",


  floatTimeDomainData,// = "float-time-domain-data",
  byteTimeDomainData,// = "byte-time-domain-data",

  startedListeningTo,// = 'started-listening-to',
  stoppedListeningTo,// = 'stopped-listening-to',
} 

interface BasicMessage<T, P = unknown> {
  type: T,
  payload?: P
}

interface IdentifiedMessage<T, P = unknown> extends BasicMessage<T, P> {
  id: number,
}

type FloatFrequencyDataAvailableMessage = BasicMessage<MessageTypes.frequencyDataAvailable, Float32Array>
type ByteFrequencyDataAvailableMessage = BasicMessage<MessageTypes.byteFrequencyDataAvailable, Uint8Array>

type GetFloatFrequencyDataMessage = IdentifiedMessage<MessageTypes.getFloatFrequencyData>
type RequestedFloatFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedFloatFrequencyDataAvailable, ArrayBuffer>

type GetByteFrequencyDataMessage = IdentifiedMessage<MessageTypes.getByteFrequencyData,Uint8Array>
type RequestedByteFrequencyDataAvailableMessage = IdentifiedMessage<MessageTypes.requestedByteFrequencyDataAvailable, ArrayBuffer>

type StartedListeningToMessage = BasicMessage<MessageTypes.startedListeningTo, EventListenerTypes>
type StoppedListeningToMessage = BasicMessage<MessageTypes.stoppedListeningTo, EventListenerTypes>

export type Message =  
  FloatFrequencyDataAvailableMessage  
  | ByteFrequencyDataAvailableMessage
  | GetFloatFrequencyDataMessage
  | RequestedFloatFrequencyDataAvailableMessage
  | GetByteFrequencyDataMessage
  | RequestedByteFrequencyDataAvailableMessage
  | StartedListeningToMessage
  | StoppedListeningToMessage

export enum ProcessorParameters {
  fftSize = 'fftSize',
  samplesBetweenTransforms = 'samplesBetweenTransforms',
  dataAsByteArray = 'dataAsByteArray',
  windowFunction = 'windowFunction',
}  

export enum EventListenerTypes {
  frequencydata = 'frequencydata',
  bytefrequencydata = 'bytefrequencydata',
}

export enum WindowingFunctionTypes {
  none = 'none',
  blackmanWindow = "blackmanWindow" 
}