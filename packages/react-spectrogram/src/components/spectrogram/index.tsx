import React, { useLayoutEffect } from 'react';
import { FrequencyDataResolver } from '@soundui/spectrogram-renderer';
import { useSpectrogramRenderer } from '../../hooks/useSpectrogramRenderer';
import { useImmutableRef } from 'src/hooks/useImmutableRef';
import { SpectrogramContext } from '../spectrogram-context';
import { FrequencyRuler } from '../frequency-ruler';
import { TimeRuler } from '../time-ruler';
import { useControls } from './hooks/use-controls';

type SpectrogramProps = React.HTMLAttributes<HTMLDivElement> & {
  width: number,
  height: number,
  minFrequency: number,
  maxFrequency: number,
  timeWindow: number,
  currentTime: number,
  dynamicRange: number,
  dynamicRangeTop: number,
  modifierKeyCode?: string,
  dataResolver: FrequencyDataResolver,

  displayFrequencyRuler?: boolean,
  frequencyRulerAsOverlay?: boolean,
  frequencyRulerPosition?: 'start' | 'end',
  frequencyRulerSize?: number,

  displayTimeRuler?: boolean,
  timeRulerAsOverlay?: boolean,
  timeRulerPosition?: 'start' | 'end',
  timeRulerSize?: number,

  onDynamicRangeChange: (value: number) => void,
  onDynamicRangeTopChange: (value: number) => void,
  onMaxFrequencyChange: (maxFrequency: number) => void,
  onMinFrequencyChange: (minFrequency: number) => void,
  onTimeWindowChange: (timeWindow: number) => void,
  onCurrentTimeChange: (currentTime: number) => void,
}

export const Spectrogram = ({
  width,
  height,
  minFrequency,
  maxFrequency,
  timeWindow,
  currentTime,
  dynamicRange,
  dynamicRangeTop,
  modifierKeyCode = 'ShiftLeft',
  dataResolver,

  displayFrequencyRuler = true,
  frequencyRulerAsOverlay = true,
  frequencyRulerPosition = 'start',
  frequencyRulerSize = 40,

  displayTimeRuler = true,
  timeRulerAsOverlay = true,
  timeRulerPosition = 'end',
  timeRulerSize = 30,
  onMaxFrequencyChange,
  onMinFrequencyChange,
  onTimeWindowChange,
  onCurrentTimeChange,
  children,
  ...props
}:SpectrogramProps) => {
  const [canvasRef, canvas] = useImmutableRef<HTMLCanvasElement>(null);
  const [frequencyRulerRef, frequencyRuler] = useImmutableRef<HTMLElement>(null);
  const [timeRulerRef, timeRuler] = useImmutableRef<HTMLElement>(null);
  const canvasWidth = frequencyRulerAsOverlay ? width : width - frequencyRulerSize;
  const canvasHeight = timeRulerAsOverlay ? height : height - timeRulerSize;
  const controlProps = {
    onMaxFrequencyChange,
    onMinFrequencyChange,
    onTimeWindowChange,
    onCurrentTimeChange,

    width: canvasWidth,
    height: canvasHeight,
    minFrequency,
    maxFrequency,
    timeWindow,
    currentTime,
    modifierKeyCode,
  };
  useControls({
    canvas,
    ...controlProps
  });

  useControls({
    ...controlProps,
    width: 40,
    canvas: frequencyRuler,

    lockTimeWindowScaling: true,
    lockTimePanning: true,
    modifierKeyCode: null,
  });

  useControls({
    ...controlProps,
    height: 40,
    canvas: timeRuler,

    lockFrequencyScaling: true,
    lockFrequencyPanning: true,
    modifierKeyCode: null,
  });

  const {
    spectrogramRenderer,
    setMinFrequency,
    setMaxFrequency,
    setTimeWindow,
    setCurrentTime,
    setDynamicRange,
    setDynamicRangeTop,
  } = useSpectrogramRenderer({
    canvas,
    dataResolver,
  }, []);

  useLayoutEffect(() => {
    setMinFrequency(minFrequency);
  }, [minFrequency, spectrogramRenderer]);

  useLayoutEffect(() => {
    setMaxFrequency(maxFrequency);
  }, [maxFrequency, spectrogramRenderer]);

  useLayoutEffect(() => {
    setCurrentTime(currentTime);
  }, [currentTime, spectrogramRenderer]);

  useLayoutEffect(() => {
    setTimeWindow(timeWindow);
  }, [timeWindow, spectrogramRenderer]);

  useLayoutEffect(() => {
    setDynamicRange(dynamicRange);
  }, [dynamicRange, spectrogramRenderer]);

  useLayoutEffect(() => {
    setDynamicRangeTop(dynamicRangeTop);
  }, [dynamicRangeTop, spectrogramRenderer]);

  const canvasTopOffset = displayTimeRuler && !timeRulerAsOverlay && timeRulerPosition === 'start' ? timeRulerSize : 0;
  const canvasLeftOffset = displayFrequencyRuler && !frequencyRulerAsOverlay && frequencyRulerPosition === 'start' ? frequencyRulerSize : 0;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth }
        height={canvasHeight}
        style={{
          touchAction: 'none',
          marginTop: canvasTopOffset,
          marginLeft: canvasLeftOffset,
        }}
      />
      {displayFrequencyRuler && (
        <FrequencyRuler
          ref={frequencyRulerRef}
          width={40}
          height={canvasHeight}
          minFrequency={minFrequency}
          maxFrequency={maxFrequency}
          color={'#fff'}
          backgroundColor={'rgba(0, 0, 0, 0.5)'}
          position={'offset'}
          style={{
            position: 'absolute',
            top: canvasTopOffset,
            [frequencyRulerPosition === 'start' ? 'left' : 'right']: 0,
          }}
        />
      )}
      {displayTimeRuler && (
        <TimeRuler
          ref={timeRulerRef}
          width={canvasWidth}
          height={30}
          timeWindow={timeWindow}
          currentTime={currentTime}
          position={'inset'}
          backgroundColor={'rgba(0, 0, 0, 0.5)'}
          color="#fff"
          style={{
            position: 'absolute',
            bottom: 0,
            left: canvasLeftOffset,
            [timeRulerPosition === 'start' ? 'top' : 'bottom']: 0,
          }}
        />
      )}
      {!timeRulerAsOverlay && !frequencyRulerAsOverlay && displayFrequencyRuler && displayTimeRuler && (
        <svg
          height={timeRulerSize}
          width={frequencyRulerSize}
          style={{
            position: 'absolute',
            [timeRulerPosition === 'start' ? 'top' : 'bottom']: 0,
            [frequencyRulerPosition === 'start' ? 'left' : 'right']: 0,
          }}
        >
          <rect
            height={timeRulerSize}
            width={frequencyRulerSize}
            style={{
              fill: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </svg>
      )}

      {children && (
        <SpectrogramContext.Provider
          value={{
            spectrogramRenderer,
            onMaxFrequencyChange,
            onMinFrequencyChange,
            onTimeWindowChange,
            onCurrentTimeChange,
            width,
            height,
            canvas,
            minFrequency,
            maxFrequency,
            timeWindow,
            currentTime,
            dynamicRange,
            dynamicRangeTop,
            dataResolver,
          }}
          children={children}
        />
      )}
    </div>
  );
};

