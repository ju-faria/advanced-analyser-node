import React, { forwardRef, useMemo } from 'react';
import { getRenderPointFromTime } from 'src/utils';
import classnames from 'classnames';
type TimeRulerProps = {
  width: number,
  height: number,
  timeWindow: number,
  currentTime: number,
  color?: string,
  backgroundColor?: string,
  dividers?: boolean,
  position?: 'inset' | 'offset',
  selfContained?: boolean,
} & React.HTMLAttributes<HTMLDivElement>;

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


export const TimeRuler = forwardRef<HTMLDivElement, TimeRulerProps>(({
  className,
  width,
  height,
  timeWindow,
  currentTime,
  dividers = true,

  position = 'inset',
  style = {},
  color = '#000',
  ...rest
}, ref) => {
  const labels = useMemo(() =>
    generateTimeRuler(timeWindow, width),
  [timeWindow, width, height]
  );

  const rulerStep = labels[1];

  const startTime = Math.floor(currentTime / rulerStep) * rulerStep;
  const marksLength = 4;
  const fontSize = 12;

  return (
    <div
      className={classnames("time-ruler", className)}
      ref={ref}
      style={{
        width,
        height,
        ...style,
      }}
      {...rest}
    >
      <svg
        width={width}
        height={height}
      >
        {labels.map((timeStep) => (
          <g
            key={timeStep}
            transform={`translate(${width * getRenderPointFromTime(currentTime, timeWindow, startTime + timeStep)}, 0)`}
          >
            {(
              <text
                className="time-ruler-label"
                x={0}
                y={(position === 'inset') ? height - marksLength - 2 - fontSize : height - marksLength - 2}
                text-anchor="middle"
                fontSize={fontSize}
                alignmentBaseline={(position === 'inset') ? 'hanging' :  'baseline'}
                fontFamily="sans-serif"
                color={color}
              >
                {formatTime((startTime + timeStep) / 1000)}
              </text>
            )}
            {(new Array(9)).fill('').map((_, i) =>{
              const timeAxis = i * (width / (timeWindow/rulerStep) / 9);
              let length = i === 0? marksLength : marksLength * 0.5;
              if(i === 5) {
                length = marksLength * 0.7;
              }
              return (
                <line
                  className={classnames('time-ruler-label-marks', {
                    'time-ruler-label-marks-main': i === 0,
                    'time-ruler-label-marks-short': i !== 0 && i !== 5,
                    'time-ruler-label-marks-middle': i === 5,
                  })}
                  stroke={color}
                  {...(position === 'inset' ? {
                    x1: timeAxis,
                    y1: height,
                    x2: timeAxis,
                    y2: height - length,
                  } : {
                    x1: timeAxis,
                    y1: 0,
                    x2: timeAxis,
                    y2: length,
                  })}
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
});