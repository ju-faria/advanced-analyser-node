import { FrequencyScale } from "@soundui/shared/constants/types";
import { DEFAULT_FREQUENCY_SCALE } from "@soundui/shared/constants";
import React, { forwardRef, useMemo } from "react";

import { inverseLerp, inverseLerpLog } from "@soundui/shared/utils";

export const generateLogLabels = (min: number, max: number, rulerSize: number) => {
  const labels:{ label: string, position: number, isLabelVisible: boolean }[] = [];
  let lastVisibleFreqPosition = 0;

  for (let freq = 100000, step = 10000; freq >= 1; freq = freq-step) {
    if (freq <= 10000) step = 1000;
    if (freq <= 1000) step = 100;
    if (freq <= 100) step = 10;
    if (freq <= 10) step = 1;
    // if (freq < 100000) step = 10000;
    // if (freq < 1000000) step = 100000;
    const position = rulerSize - rulerSize * inverseLerpLog(min, max, freq);
    const distance = Math.abs(position - lastVisibleFreqPosition);
    const isLabelVisible = freq === 100000 ? true : distance > 25;
    if (isLabelVisible) {
      lastVisibleFreqPosition = position;
    }
    labels.push({
      label: String(freq).replace(/000$/, 'k'),
      position,
      isLabelVisible,
    });
  }
  return labels;
};


const generateLinLabels = (min: number, max:number, rulerSize: number) => {
  const labels:{ label: string, position: number, isLabelVisible: boolean }[] = [];
  const minDistance = 25;
  const freqDistance = ((max - min) / (rulerSize / minDistance));
  let freqStep = 10;
  if (freqDistance >= 10) freqStep = 50;
  if (freqDistance >= 50) freqStep = 100;
  if (freqDistance >= 100) freqStep = 500;
  if (freqDistance >= 500) freqStep = 1000;
  if (freqDistance >= 1000) freqStep = 5000;
  if (freqDistance >= 5000) freqStep = 10000;

  for (let freq = Math.floor(min / freqStep) * freqStep; freq <= Math.ceil(max/freqStep) * freqStep; freq = freq+freqStep) {
    labels.push({
      label: String(freq),//.replace(/000$/, 'k'),
      position: rulerSize - rulerSize * inverseLerp(min, max, freq),
      isLabelVisible: true,
    });
  }
  return labels;
};

const generateLabels:Record<FrequencyScale, (min: number, max: number, rulerSize: number) => { label: string, position: number, isLabelVisible: boolean }[]> = {
  logarithmic: generateLogLabels,
  linear: generateLinLabels,
};

type FrequencyRulerProps = {
  width: number,
  height: number,
  minFrequency: number,
  maxFrequency: number,
  frequencyScale?: FrequencyScale,
  color?: string,
  orientation?: 'horizontal' | 'vertical',
  position?: 'inset' | 'offset',
  direction?: 'ascending' | 'descending',
} & React.HTMLAttributes<HTMLDivElement>;

export const FrequencyRuler = forwardRef<HTMLDivElement, FrequencyRulerProps>(({
  width,
  height,
  minFrequency,
  maxFrequency,
  frequencyScale = DEFAULT_FREQUENCY_SCALE,
  color = "#000",
  orientation = 'vertical',
  position = 'inset',
  direction = 'descending',
  style = {},
  ...rest
}, ref) => {
  const rulerSize = orientation === 'horizontal' ? width : height;
  const labels = useMemo(
    () => generateLabels[frequencyScale](minFrequency, maxFrequency, rulerSize),
    [minFrequency, maxFrequency, height, width, orientation, frequencyScale]
  );

  const marksLength = 4;
  return (
    <div
      className="frequency-ruler"
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
        {/* {backgroundColor && (
          <rect x={0} y={0} width={width} height={height} fill={backgroundColor} />
        )}
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
        )} */}
        {labels.map(({label, position: freqPosition, isLabelVisible}, i) =>  (
          <g
            key={label}
            transform={orientation === 'vertical' ? `translate(0, ${freqPosition})` :  `translate(${freqPosition}, 0)`}
          >
            {label && isLabelVisible && (
              <text
                className="frequency-ruler-label"

                fill={color}
                fontSize={11}
                fontFamily="sans-serif"
                {...(orientation === 'vertical' ? {
                  x: position === 'inset' ? width - marksLength - 1 : marksLength + 1,
                  textAnchor: position === 'inset' ? "end" : "start",
                  alignmentBaseline: 'central'
                } : {
                  y: position === 'inset' ? height - marksLength - 1:  marksLength + 1 ,
                  textAnchor: "middle",
                  alignmentBaseline: position === 'inset' ? 'baseline' : 'hanging'
                })}
              >
                {String(label)}
              </text>
            )}
            {orientation === 'vertical' && (<line className="frequency-ruler-label-marks" x1={position === 'inset' ? width - marksLength : 0} x2={position === 'inset' ? width : marksLength} y1={0} y2={0}  stroke={color} />)}
            {orientation === 'horizontal' && (<line className="frequency-ruler-label-marks" x1={0} x2={0} y1={position === 'inset' ? height - marksLength : 0} y2={position === 'inset' ? height : marksLength}  stroke={color} />)}
          </g>
        ))}
      </svg>
    </div>
  );
});