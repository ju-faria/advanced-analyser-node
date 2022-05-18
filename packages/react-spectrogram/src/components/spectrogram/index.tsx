import React, { useEffect, useLayoutEffect } from 'react';
import { FrequencyDataResolver } from '@soundui/spectrogram-renderer';
import { useSpectrogramRenderer } from '../../hooks/useSpectrogramRenderer';
import { useImmutableRef } from 'src/hooks/useImmutableRef';
import { SpectrogramContext } from '../spectrogram-context';
import { FrequencyRuler } from '../frequency-ruler';
import { TimeRuler } from '../time-ruler';
import { useControls } from './hooks/use-controls';
import { DEFAULT_FREQUENCY_SCALE, FrequencyScale } from '@soundui/shared/constants';
import { Nullable } from '@soundui/shared/utils/types';
import { SpectrogramTransforms } from './types';

type SpectrogramProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  width: number,
  height: number,
  frequencyScale?: FrequencyScale,
  dynamicRange: number,
  dynamicRangeTop: number,
  modifierKeyCode?: string,
  dataResolver: FrequencyDataResolver,
  transforms: SpectrogramTransforms,
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
  onChange: (properties: SpectrogramTransforms) => void,
}

// const useControllableState = <T = any>(controlledValue: Nullable<T>, defaultValue: T) => {
//   const [value, setValue] = React.useState<T>(defaultValue);
//   useEffect(() => {

//   }, [controlledValue]);
// }

export const Spectrogram = ({
  width,
  height,
  frequencyScale = DEFAULT_FREQUENCY_SCALE,
  dynamicRange,
  dynamicRangeTop,
  modifierKeyCode = 'ShiftLeft',
  dataResolver,
  transforms,

  displayFrequencyRuler = true,
  frequencyRulerAsOverlay = true,
  frequencyRulerPosition = 'start',
  frequencyRulerSize = 50,

  displayTimeRuler = true,
  timeRulerAsOverlay = true,
  timeRulerPosition = 'end',
  timeRulerSize = 30,
  onChange,
  children,
  ...props
}:SpectrogramProps) => {
  const [canvasRef, canvas] = useImmutableRef<HTMLCanvasElement>(null);
  const [frequencyRulerRef, frequencyRuler] = useImmutableRef<HTMLElement>(null);
  const [timeRulerRef, timeRuler] = useImmutableRef<HTMLElement>(null);

  const canvasWidth = frequencyRulerAsOverlay ? width : width - frequencyRulerSize;
  const canvasHeight = timeRulerAsOverlay ? height : height - timeRulerSize;
  const controlProps = {
    onChange,
    width: canvasWidth,
    height: canvasHeight,
    transforms,
    frequencyScale,
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
    setDynamicRange,
    setDynamicRangeTop,
    setFrequencyScale,
    updateProperties,
  } = useSpectrogramRenderer({
    canvas,
    dataResolver,
    frequencyScale,
  }, [width, height]);

  useLayoutEffect(() => {
    updateProperties(transforms);
  }, [transforms, spectrogramRenderer]);

  useLayoutEffect(() => {
    setDynamicRange(dynamicRange);
  }, [dynamicRange, spectrogramRenderer]);

  useLayoutEffect(() => {
    setDynamicRangeTop(dynamicRangeTop);
  }, [dynamicRangeTop, spectrogramRenderer]);

  useLayoutEffect(() => {
    setFrequencyScale(frequencyScale);
  }, [frequencyScale, spectrogramRenderer]);

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
        width={canvasWidth}
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
          width={frequencyRulerSize}
          height={canvasHeight}
          minFrequency={transforms.minFrequency}
          maxFrequency={transforms.maxFrequency}
          position={frequencyRulerPosition === 'start' ? 'inset' : 'offset'}
          frequencyScale={frequencyScale}
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
          height={timeRulerSize}
          timeWindow={transforms.timeWindow}
          currentTime={transforms.currentTime}
          position={timeRulerPosition === 'start' ? 'inset' : 'offset'}
          style={{
            position: 'absolute',
            bottom: 0,
            left: canvasLeftOffset,
            [timeRulerPosition === 'start' ? 'top' : 'bottom']: 0,
          }}
        />
      )}

      {children && (
        <SpectrogramContext.Provider
          value={{
            spectrogramRenderer,
            onChange,
            transforms,
            width,
            height,
            canvas,
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

