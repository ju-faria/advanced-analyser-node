
export enum MessageTypes {
  sendWasmModule = "send-wasm-module",
  wasmModuleLoaded = "wasm-module-loaded",
  initFftAnalyser = "init-fft-analyser",
  start = "start",
  stop = "stop",
  dataAvailable = "data-available",
}  
interface BasicMessage {
  type: MessageTypes.start | MessageTypes.stop
}

interface SendWasmModuleMessage {
  type: MessageTypes.sendWasmModule,
  wasmBytes: BufferSource,
}
interface WasmModuleLoadedMessage {
  type: MessageTypes.wasmModuleLoaded,
  wasmBytes: BufferSource,
}
interface DataAvailableMessage {
  type: MessageTypes.dataAvailable,
  data: Uint8Array,
  currentTime: number,
}

interface InitFftAnalyserMessage {
  type: MessageTypes.initFftAnalyser,
  fftSize: number,
  samplesBetweenTransforms: number,
  sampleRate: number,
}

export type Message = SendWasmModuleMessage | InitFftAnalyserMessage | DataAvailableMessage | WasmModuleLoadedMessage | BasicMessage