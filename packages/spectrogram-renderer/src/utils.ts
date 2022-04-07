export const getFirstVisibleTransform = (currentTime:number, samplesBetweenTransforms: number, sampleRate: number) => 
  Math.max(((sampleRate * (currentTime / 1000)) - 1) / samplesBetweenTransforms, 0);
