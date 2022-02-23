
export enum MessageTypes {
  start = "start",
  stop = "stop",
  dataAvailable = "data-available",
}  
interface BasicMessage {
  type: MessageTypes.start | MessageTypes.stop
}

interface DataAvailableMessage {
  type: MessageTypes.dataAvailable,
  data: Uint8Array,
  currentTime: number,
}


export type Message =  DataAvailableMessage | BasicMessage


export enum ProcessorParameters {
  fftSize = 'fftSize',
  samplesBetweenTransforms = 'samplesBetweenTransforms'
}  