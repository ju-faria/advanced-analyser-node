import { DataUpdateEvent, FrequencyDataResolver, NumberList } from "./types";
import { Nullable } from '@soundui/shared/utils';

export class DefaultFrequencyDataResolver implements FrequencyDataResolver {
  sampleRate: number;

  frequencyBinCount: number;

  samplesBetweenTransforms: number;

  maxDecibels: number;

  minDecibels: number;

  private _eventListeners: {
    [event: string]: ((...args: any[]) => void)[];
    dataupdate: ((event: CustomEventInit<DataUpdateEvent>) => void)[];
  } = {
    dataupdate: []
  };

  private _data: NumberList[] = [];

  constructor({
    sampleRate,
    frequencyBinCount,
    samplesBetweenTransforms,
    maxDecibels,
    minDecibels,
  }: {
    sampleRate: number;
    frequencyBinCount: number;
    samplesBetweenTransforms: number;
    maxDecibels: number;
    minDecibels: number;
  }) {
    this.sampleRate = sampleRate;
    this.frequencyBinCount = frequencyBinCount;
    this.samplesBetweenTransforms = samplesBetweenTransforms;
    this.maxDecibels = maxDecibels;
    this.minDecibels = minDecibels;
  }

  getFrequencyBin(frequencyBinIndex: number): Nullable<NumberList> {
    return this._data[frequencyBinIndex] || null;
  }
  
  getFrequency(frequencyBinIndex: number, sampleIndex: number): number {
    return this.getFrequencyBin(frequencyBinIndex)?.[sampleIndex] ?? 0;
  }

  push(data: NumberList, frequencyBinIndex?: number): void {
    const index = frequencyBinIndex || this._data.length;
    this._data[index] = data;
    const event = new CustomEvent<DataUpdateEvent>('dataupdate', {
      detail: {
        frequencyBinIndex: index,
        data,
      }
    });

    this.dispatchEvent(event);
  }

  dispatchEvent(event: Event): boolean {
    this._eventListeners[event.type]?.forEach(l => l(event));
    return true;
  }
  
  addEventListener(type: string, listener: (...args: any[]) => void): void {
    this._eventListeners[type] = this._eventListeners[type] ?? [];
    this._eventListeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (...args: any[]) => void): void {
    if (!this._eventListeners[type]) return;
    this._eventListeners[type] = this._eventListeners[type]?.filter(l => l !== listener);
  }
}