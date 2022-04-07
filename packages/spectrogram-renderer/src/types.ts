import { Nullable } from "@soundui/shared/utils";

export type NumberList = Array<number> | Float32Array | Uint8Array; 

export type DataUpdateEvent = { 
  frequencyBinIndex: number,
  data: NumberList,
}

export interface FrequencyDataResolver {
  sampleRate: number;
  frequencyBinCount: number;
  samplesBetweenTransforms: number;
  maxDecibels: number;
  minDecibels: number;
  getFrequencyBin(frequencyBinIndex: number): Nullable<NumberList>;
  getFrequency(frequencyBinIndex: number, sampleIndex: number): Nullable<number>;
  
  addEventListener(event: string, listener: (...args: any[]) => void): void;
  addEventListener(event: "dataupdate", listener: (event: CustomEventInit<DataUpdateEvent>) => void): void;
  removeEventListener(event: string, listener: (...args: any[]) => void): void;

}
