export const generateLogLabels = (min: number, max: number) => {
  const labels = [];
  for (let i = min, step = 1; i <= max; i = i+step) {
    if (i >= 10) step = 10;
    if (i >= 100) step = 100;
    if (i >= 1000) step = 1000;
    if (i >= 10000) step = 10000;
    if (i >= 100000) step = 100000;
    labels.push(i);
  }
  return labels;
};

export const lerpLog = (from: number, to: number, rel: number) => {
  return Math.pow(Math.E, lerp(Math.log(from), Math.log(to), rel));
};
export const inverseLerpLog = (from: number, to: number, rel: number) => {
  return inverseLerp(Math.log(from), Math.log(to), Math.log(rel));
};
// export const inverseLerpLog = (from: number, to: number, rel: number) => {
//   return Math.log(lerp(from, to, rel));
// };

// export const inverseLerpLog = (from: number, to: number, rel: number) => {
//   return lerp(Math.log(from), Math.log(to), rel);
// };
export const lerp = (from: number, to: number, rel: number) => {
  return (1 - rel) * from + rel * to;
};

export const inverseLerp = (from: number, to: number, rel: number) => {
  return (rel - from) / (to - from);
};


// export const remap = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
//   const fromRange = fromMax - fromMin;
//   const toRange = toMax - toMin;
//   const rel = (value - fromMin) / fromRange;
//   return toMin + rel * toRange;
// };


export const remap = ( origFrom: number,  origTo: number,  targetFrom: number,  targetTo: number,  rel: number) => {
  return lerp(targetFrom, targetTo, inverseLerp(origFrom, origTo, rel));
};

export const getTimeFromRender = ( currentTime: number, timeWindow: number, renderPoint: number) => {
  return currentTime + timeWindow * renderPoint;
};

export const getRenderPointFromTime = ( currentTime: number, timeWindow: number, time: number) => {
  return (time - currentTime) / timeWindow;
};
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};