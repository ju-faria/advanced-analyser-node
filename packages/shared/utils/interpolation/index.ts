export const lerp = (from: number, to: number, rel: number) => {
  return (1 - rel) * from + rel * to;
};
    
export const inverseLerp = (from: number, to: number, rel: number) => {
  return (rel - from) / (to - from);
};
    
export const lerpLog = (from: number, to: number, rel: number) => {
  return Math.pow(Math.E, lerp(Math.log(from), Math.log(to), rel));
};
export const inverseLerpLog = (from: number, to: number, rel: number) => {
  return inverseLerp(Math.log(from), Math.log(to), Math.log(rel));
};
    
export const remap = ( origFrom: number,  origTo: number,  targetFrom: number,  targetTo: number,  rel: number) => {
  return lerp(targetFrom, targetTo, inverseLerp(origFrom, origTo, rel));
};
      