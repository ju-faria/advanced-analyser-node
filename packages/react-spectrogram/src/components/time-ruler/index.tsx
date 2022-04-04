import React, { useMemo } from 'react';
import { getRenderPointFromTime } from 'src/utils';

type TimeRulerProps = {
  width: number,
  height: number,
  timeWindow: number,
  currentTime: number,
  color?: string,
  backgroundColor?: string,
  dividers?: boolean,
  measuredBy?: 'BPM' | 'Time',
  orientation?: 'horizontal' | 'vertical',
  position?: 'inset' | 'offset',
  x: number,
  y: number,
  selfContained: boolean,
}

const generateTimeRuler = (timeWindow: number, width:number) => {
  const timeRuler = [];
  const minimumStepInPixels = 100;

  const maxLabelsCount = Math.floor(width / minimumStepInPixels);

  const timeStep = Math.pow(2, Math.ceil(Math.log2((timeWindow / maxLabelsCount)/1000))) * 1000;
  for (let i = 0; i < timeWindow + timeStep; i += timeStep) {
    timeRuler.push(i);
  }
  return timeRuler;
};

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = (time % 60).toFixed(1);
  return `${hours}:${minutes}:${seconds}`;
};


export const TimeRuler = ({
  width,
  height,
  timeWindow,
  currentTime,
  color = "#000",
  backgroundColor,
  dividers = true,
  measuredBy = 'Time',
  orientation = 'horizontal',
  position = 'inset',
  x,
  y,
  selfContained = true,
}:TimeRulerProps) => {
  const labels = useMemo(() => {
    return generateTimeRuler(timeWindow, orientation === 'horizontal' ? width : height);
  }, [timeWindow, width, height]);

  const rulerStep = labels[1];
  
  const WrapperComponent = selfContained ? 'svg' : 'g';

  const rulerPath = (new Array(9)).fill('').map((_, i) =>{
    const timeAxis = i * ((orientation === 'horizontal' ? width : height) / (timeWindow/rulerStep) / 9);
    let length = i === 0? 0.4 : 0.2;
    if(i === 5) {
      length = 0.3;
    }
    if (position === 'inset' && orientation === 'horizontal') return `M ${timeAxis} ${height}  L ${timeAxis} ${height - height * length }`;
    if (position === 'offset' && orientation === 'horizontal') return `M ${timeAxis} 0  L ${timeAxis} ${height * length }`;

    if (position === 'offset' && orientation === 'vertical') return `M 0 ${timeAxis}  L ${width * length } ${timeAxis}`;
    if (position === 'inset' && orientation === 'vertical') return `M ${width} ${timeAxis}  L  ${width - width * length} ${timeAxis}`;
  }).join(' ');

  const startTime = Math.floor(currentTime / rulerStep) * rulerStep;

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
      {orientation === 'horizontal' && labels.map((timeStep, i) => (
        <g key={timeStep} transform={`translate(${width * getRenderPointFromTime(currentTime, timeWindow, startTime + timeStep)}, 0)`}>
          {(<text 
            x={0} 
            y={(position === 'inset') ? height * 0.2 : height - height * 0.2}
            fill={color} 
            text-anchor="middle"
            fontSize={12}
            alignmentBaseline={(position === 'inset') ? 'hanging' :  'baseline' }
            fontFamily="sans-serif"
          >{formatTime((startTime + timeStep) / 1000)}</text>)}
          <path 
            d={rulerPath}
            stroke={color}
          />
        </g>
      ))}
      {orientation === 'vertical' && labels.map((timeStep, i) => (
        <g key={timeStep} transform={`translate(0, ${height * getRenderPointFromTime(currentTime, timeWindow, startTime + timeStep)})`}>
          {(<text 
            y={0} 
            x={(position === 'inset') ? width * 0.2 : width - width * 0.2}
            fill={color} 
            text-anchor="middle"
            fontSize={12}
            alignmentBaseline={'hanging'}
            fontFamily="sans-serif"
            transform={`rotate(${position === 'inset' ? -90 : 90}, ${position === 'inset' ? width * 0.2 : width - width * 0.2}, 0)`}
          >{formatTime((startTime + timeStep) / 1000)}</text>)}
          <path 
            d={rulerPath}
            stroke={color}
          />
        </g>
      ))}
    </WrapperComponent>
  );

};