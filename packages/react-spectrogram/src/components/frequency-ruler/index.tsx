import React, { useMemo } from "react";
import { getRenderPointFromTime, inverseLerpLog } from "src/utils";


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

type FrequencyRulerProps = {
  width: number,
  height: number,
  minFrequency: number,
  maxFrequency: number,
  color?: string,
  backgroundColor?: string,
  dividers?: boolean,
  orientation?: 'horizontal' | 'vertical',
  position?: 'inset' | 'offset',
  direction?: 'ascending' | 'descending',
  x: number,
  y: number,
  selfContained: boolean,
}

export const FrequencyRuler = ({
  width,
  height,
  minFrequency,
  maxFrequency,
  color = "#000",
  backgroundColor,
  dividers = true,
  orientation = 'vertical',
  position = 'inset',
  direction = 'descending',
  x,
  y,
  selfContained = true,
}:FrequencyRulerProps) => {
  const rulerSize = orientation === 'horizontal' ? width : height;
  const labels = useMemo(() => {
    let lastVisibleFreqPosition = 0;
    return generateLogLabels(1, 44100).map((label, i) => {
      
      const position = rulerSize - rulerSize * inverseLerpLog(minFrequency, maxFrequency, label);
      const labelIsVisible = i === 0 || lastVisibleFreqPosition  - position > 25;
      if (labelIsVisible) {
        lastVisibleFreqPosition = position;
      }
      
      return {
        position: direction === 'ascending' ? rulerSize - position : position,
        label: String(label).replace(/000$/, 'k'),
        labelIsVisible,
      };
    });
  }, [minFrequency, maxFrequency, height, width, orientation]);
  
  const WrapperComponent = selfContained ? 'svg' : 'g';
  const marksLength = orientation === 'horizontal' ? height * 0.2 : width * 0.2;
  return (
    <WrapperComponent transform={`translate(${x}, ${y})`} width={width}>
      {dividers && orientation === 'horizontal' && (
        <>
          <line x1={0} y1={0} x2={width} y2={0} stroke={color} strokeWidth={1} />
          <line x1={0} y1={height} x2={width} y2={height} stroke={color} strokeWidth={1} />
        </>
      )}
      {dividers && orientation === 'vertical' && (
        <>
          <line x1={0} y1={0} x2={0} y2={height} stroke={color} strokeWidth={1} />
          <line x1={width} y1={0} x2={width} y2={height} stroke={color} strokeWidth={1} />
        </>
      )}
          

      {backgroundColor && (
        <rect x={0} y={0} width={width} height={height} fill={backgroundColor} />
      )}
      {labels.map(({label, position: freqPosition , labelIsVisible}, i) =>  (
        <g 
          key={label} 
          transform={orientation === 'vertical' ? `translate(0, ${freqPosition})` :  `translate(${freqPosition}, 0)`}
        >
          {labelIsVisible && ( 
            <text 
              fill="#fff" 

              fontSize={12}

              fontFamily="sans-serif"
              {...(orientation === 'vertical' ? {
                x: position === 'inset' ? width - marksLength - 5 : marksLength + 5,
                textAnchor: position === 'inset' ? "end" : "start",
                alignmentBaseline: 'central'
              } : {
                y: position === 'inset' ? height - marksLength - 5:  marksLength + 5 ,
                textAnchor: "middle",
                alignmentBaseline: position === 'inset' ? 'baseline' : 'hanging'
              })}
            >
              {String(label).replace(/000$/, 'k')}
            </text>
          )}
          {orientation === 'vertical' && (<line x1={position === 'inset' ? width - marksLength : 0} x2={position === 'inset' ? width : marksLength} y1={0} y2={0}  stroke={'#fff'} />)}
          {orientation === 'horizontal' && (<line x1={0} x2={0} y1={position === 'inset' ? height - marksLength : 0} y2={position === 'inset' ? height : marksLength}  stroke={'#fff'} />)}
          
        </g>
      ))}
    </WrapperComponent>
  );

};