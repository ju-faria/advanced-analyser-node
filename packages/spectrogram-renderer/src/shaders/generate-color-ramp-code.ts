const getLetter = (offset: number) => String.fromCharCode(65 + offset);

export const generateColorRampCode = (colorRamp: [number, number, number][]) => {
  const colorCount = colorRamp.length;
  const colorVars = colorRamp
    .map((rgb) => rgb.map((value) => (value / 255).toFixed(4)))
    .map((rgb, i) => `vec3 ${getLetter(i)} = vec3(${rgb.join(',')});`);
  const colorRampBody = colorRamp
    .map((_, i)=> {
      if (i === colorCount - 1) return '';
      return [
        `if (value <= ${((i+1) / (colorCount-1)).toFixed(4)}){`,
        `return mix(`,
        `${getLetter(i)},`,
        `${getLetter(i + 1)},`, 
        `remap(${(i / (colorCount - 1)).toFixed(4)}, ${((i+1)/(colorCount-1)).toFixed(4)}, 0., 1., value)`, 
        `);};`
      ].join('');
    });
  return `vec3 color_ramp(float value) {${[...colorVars, ...colorRampBody].join('')}}`;
};