import { AdvancedAnalyserNode } from '@soundui/advanced-analyser-node';
import React, {Ref, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { FrequencyRuler } from './components/frequency-ruler';
import { TimeRuler } from './components/time-ruler';
import { useGestures } from './hooks/useGestures';
import { useKey } from './hooks/useKey';
import { SpectrogramRenderer, SpectrogramRendererProperties } from './spectrogram-renderer';
import { clamp, generateLogLabels, getRenderPointFromTime, getTimeFromRender, inverseLerp, inverseLerpLog, lerpLog } from './utils';

type SpectrogramTypes = {
  audioSource: AudioNode,
  width: number,
  height: number,
  minFrequency: number,
  maxFrequency: number,
  timeWindow: number,
  currentTime: number,
  dynamicRange: number,
  dynamicRangeTop: number,
  modifierKeyCode?: string,
  onDynamicRangeChange: (value: number) => void,
  onDynamicRangeTopChange: (value: number) => void,
  onMaxFrequencyChange: (maxFrequency: number) => void,
  onMinFrequencyChange: (minFrequency: number) => void,
  onTimeWindowChange: (timeWindow: number) => void,
  onCurrentTimeChange: (currentTime: number) => void,
}
export type SpectrogramRendererHookProperties = {
  canvas: React.MutableRefObject<HTMLCanvasElement>,
  audioSource: AudioNode,
  isDataHandledExternally?:boolean
  advancedAnalyserNode?: AdvancedAnalyserNode         
  data?: Uint8Array[] 
  currentTime?: number
}

const useAnimationFrame = (callback: (deltaTime: number ) => void) => {
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>(performance.now());

  const animate = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - previousTimeRef.current;
    previousTimeRef.current = currentTime;
    requestRef.current = requestAnimationFrame(animate);
    callback(
      deltaTime / 1000
    );
  };

  const cancel = () => {
    cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return cancel;
  }, [callback]);
};


const useSpectrogramRenderer = ({
  canvas,
  audioSource,
  isDataHandledExternally,
  advancedAnalyserNode,
  data,
  currentTime,
}:SpectrogramRendererHookProperties) => {

  const [spectrogramRenderer, setSpectrogramRenderer] = useState<SpectrogramRenderer>(null);
  useEffect(() => {
    if (canvas.current && audioSource) {

      const spectogramRenderer = new SpectrogramRenderer({ canvas: canvas.current, audioSource: audioSource, isDataHandledExternally });
      setSpectrogramRenderer(spectogramRenderer);
      return () => {
        // stop spectrogram events
      };
    }
  }, [canvas.current, audioSource]);

  useAnimationFrame(() => {
    if(spectrogramRenderer) spectrogramRenderer.draw();
  });

  return { 
    spectrogramRenderer,
    setMinFrequency: (minFrequency: number) => {
      if (spectrogramRenderer) spectrogramRenderer.minFrequency = minFrequency;
    },
    setMaxFrequency: (maxFrequency: number) => {
      if (spectrogramRenderer) spectrogramRenderer.maxFrequency = maxFrequency;
    },
    setTimeWindow: (timeWindow: number) => {
      if (spectrogramRenderer) spectrogramRenderer.timeWindow = timeWindow;
    },
    setCurrentTime: (currentTime: number) => {
      if (spectrogramRenderer) spectrogramRenderer.currentTime = currentTime;
    },
    setDynamicRange: (dynamicRange: number) => {
      if (spectrogramRenderer) spectrogramRenderer.dynamicRange = dynamicRange;
    },
    setDynamicRangeTop: (dynamicRangeTop: number) => {
      if (spectrogramRenderer) spectrogramRenderer.dynamicRangeTop = dynamicRangeTop;
    },
  };
};
const drag = (
  timeWindow: number, 
  startTime: number,
  timeAxisSize: number, 
  frequencyAxisSize: number,
  minFrequency: number, 
  maxFrequency: number, 
  deltaX: number, 
  deltaY: number,
) => {
  const timePerPixel = (timeWindow / timeAxisSize);

  let newMinFrequency = lerpLog(
    minFrequency, 
    maxFrequency,
    deltaY / frequencyAxisSize,
  );

  let newMaxFrequency = lerpLog(
    minFrequency, 
    maxFrequency,
    (frequencyAxisSize + deltaY) / frequencyAxisSize,
  );

  if(newMaxFrequency > 44100) {
    newMaxFrequency = 44100;
    const posY = inverseLerpLog(minFrequency, maxFrequency, 44100);
    newMinFrequency = lerpLog(minFrequency, maxFrequency, posY - 1);
  } else if (newMinFrequency < 20) {
    newMinFrequency = 20;
    const posY = inverseLerpLog(minFrequency, maxFrequency, 20);
    newMaxFrequency = lerpLog(minFrequency, maxFrequency, posY + 1);
  }

  return {
    minFrequency: Math.round(newMinFrequency * 100) / 100,
    maxFrequency: Math.round(newMaxFrequency * 100) / 100,
    currentTime: Math.max(startTime - (timePerPixel * deltaX), 0),
  };
};
const scaleTimeWindow = (timeWindow: number, currentTime: number, scaleFactor: number, origin: number) => {
  if (
    (timeWindow <= 1000 && scaleFactor < 1)
    || (timeWindow >= 3600_000 && scaleFactor > 1)
  ) return { timeWindow, currentTime };

  const timePivot = getTimeFromRender(currentTime, timeWindow, origin);

  const newTimeWindow = clamp(timeWindow * scaleFactor, 1000, 3600_000);
  const timeWindowDelta = newTimeWindow - timeWindow;


  return { 
    currentTime: Math.max(timePivot - (newTimeWindow * origin), 0),
    timeWindow: timeWindow + timeWindowDelta,
  };
};

const scaleFrequencies = (minFrequency: number, maxFrequency: number, scaleFactor: number, origin: number) => {
  const inverseOrigin = (1 - origin);
  const newMinFrequency = lerpLog(
    minFrequency, 
    maxFrequency, 
    -((inverseOrigin*scaleFactor + origin)-1)
  );

  const newMaxFrequency = lerpLog(
    minFrequency, 
    maxFrequency, 
    origin * scaleFactor + inverseOrigin
  );
  return {
    minFrequency: clamp(newMinFrequency, 20, 44100),
    maxFrequency: clamp(newMaxFrequency, 20, 44100),
  };
};
export const Spectrogram = ({ 
  width, 
  height, 
  minFrequency,
  maxFrequency,
  timeWindow,
  currentTime,
  audioSource,
  dynamicRange,
  dynamicRangeTop,
  onMaxFrequencyChange,
  onMinFrequencyChange,
  onTimeWindowChange,
  onCurrentTimeChange,
  modifierKeyCode = 'ShiftLeft',

  ...props
}:SpectrogramTypes) => {
  const canvasRef = React.useRef(null);
  const modifierIsPressed = useKey(modifierKeyCode);
  
  const [activePinchEvent, setActivePinchEvent] = useState<{
    startFrequencies: { min: number, max: number },
    startTime: number,
    startTimeWindow: number,
  } | null>(null);
  const [activePanEvent, setActivePanEvent] = useState<{
    startFrequencies: { min: number, max: number },
    startTime: number,
    releaseTime?: number,
    releaseDeltaPosition?: { x: number, y: number },
    releaseVelocity?: { x: number, y: number },
  } | null>(null);
  const {
    setMinFrequency,
    setMaxFrequency,
    setTimeWindow,
    setCurrentTime,
    setDynamicRange,
    setDynamicRangeTop,

  } = useSpectrogramRenderer({
    canvas: canvasRef,
    audioSource,
  });

  useLayoutEffect(() => {
    setMinFrequency(minFrequency);
  }, [minFrequency]);
  
  useLayoutEffect(() => {
    setMaxFrequency(maxFrequency);
  }, [maxFrequency]);
  
  useLayoutEffect(() => {
    setCurrentTime(currentTime);
  }, [currentTime]);

  useLayoutEffect(() => {
    setTimeWindow(timeWindow);
  }, [timeWindow]);

  useLayoutEffect(() => {
    setDynamicRange(dynamicRange);
  }, [dynamicRange]);

  useLayoutEffect(() => {
    setDynamicRangeTop(dynamicRangeTop);
  }, [dynamicRangeTop]);


  useAnimationFrame(() => {
    if (activePanEvent && activePanEvent.releaseTime) {
      const { releaseVelocity, releaseDeltaPosition, releaseTime, startTime, startFrequencies} = activePanEvent;
      const deltaTime = (Date.now() - releaseTime) / 1000;
      const damping = 0.1;

      const finalVelocity = {
        x: releaseVelocity.x * Math.pow(damping, deltaTime),
        y: releaseVelocity.y * Math.pow(damping, deltaTime),
      };
   
      const newDeltaPosition = {
        x: (finalVelocity.x - releaseVelocity.x )/-damping,
        y: (finalVelocity.y - releaseVelocity.y )/-damping,
      };
      if (Math.abs(finalVelocity.x) < 1) {
        finalVelocity.x = 0;
      }
      if (Math.abs(finalVelocity.y) < 1) {
        finalVelocity.y = 0;
      }
      const {minFrequency, maxFrequency, currentTime } = drag(
        timeWindow,
        startTime,
        width,
        height,
        startFrequencies.min,
        startFrequencies.max,
        releaseDeltaPosition.x + newDeltaPosition.x,
        releaseDeltaPosition.y + newDeltaPosition.y,
      );

      onCurrentTimeChange(currentTime);
      onMinFrequencyChange(minFrequency);
      onMaxFrequencyChange(maxFrequency);

      if (finalVelocity.x === 0 && finalVelocity.y === 0) {
        setActivePanEvent(null);
        return;
      }

    }
  });


  useGestures(canvasRef, {
    onPinchStart: (e) => {
      setActivePinchEvent({
        startFrequencies: {
          min: minFrequency,
          max: maxFrequency,
        },
        startTime: currentTime,
        startTimeWindow: timeWindow,
      });
    },
    onPinchMove: (e) => {
      if(!activePinchEvent) return;
      const { startFrequencies, startTime, startTimeWindow } = activePinchEvent;
      const { min, max } = startFrequencies;
     
      const updatedPos = drag(
        startTimeWindow,
        startTime,
        width,
        height,
        min,
        max,
        e.deltaX,
        e.deltaY,
      );
      const updatedTime = scaleTimeWindow(
        startTimeWindow,
        updatedPos.currentTime,
        Math.abs(
          Math.max(e.pinchStartMagnitudeX, 40)
          /
          Math.max(e.pinchMagnitudeX, 40)
        ),
        e.relativeX / width
      );

      const updatedFrequencies = scaleFrequencies(
        updatedPos.minFrequency,
        updatedPos.maxFrequency,
        Math.abs(
          Math.max(e.pinchStartMagnitudeY, 40)
          /
          Math.max(e.pinchMagnitudeY, 40)
        ),
        e.relativeY/height,
      );
      onMinFrequencyChange(updatedFrequencies.minFrequency);
      onMaxFrequencyChange(updatedFrequencies.maxFrequency);
      onCurrentTimeChange(updatedTime.currentTime);
      onTimeWindowChange(updatedTime.timeWindow);
    },
    onPinchEnd: (e) => {
      setActivePinchEvent(null);
    },
    onPanStart: (e) => {
      setActivePanEvent({
        startFrequencies: {
          min: minFrequency,
          max: maxFrequency,
        },
        startTime: currentTime,
        releaseTime: null,
      });
    },
    onPanMove: (e) => {

      if(activePanEvent) {
        const { startFrequencies, startTime } = activePanEvent;
        const {max, min} = startFrequencies;
    
        const updated = drag(
          timeWindow,
          startTime,
          width,
          height,
          min,
          max,
          e.x - e.startX,
          e.y - e.startY,
        );
        onMinFrequencyChange(updated.minFrequency);
        onMaxFrequencyChange(updated.maxFrequency);
        onCurrentTimeChange(updated.currentTime);
      }
    },
    onPanEnd: (e) => {
      setActivePanEvent({
        ...activePanEvent,
        releaseTime: Date.now(),
        releaseVelocity: {
          x: e.movementX,
          y: e.movementY,
        },
        releaseDeltaPosition: {
          x: e.deltaX,
          y: e.deltaY,
        },
      });
    },
    onWheel: (e) => {
      if (activePanEvent) setActivePanEvent(null);
      if (!modifierIsPressed) {
        const delta = (height + (e.deltaWheel * -1)) / height;
        const updatedFrequencies = scaleFrequencies(
          minFrequency,
          maxFrequency,
          delta,
          e.relativeY/height,
        );
        onMinFrequencyChange(updatedFrequencies.minFrequency);
        onMaxFrequencyChange(updatedFrequencies.maxFrequency);

      } else {
        const delta = (height + (e.deltaWheel * -1)) / height;

        const updated = scaleTimeWindow(
          timeWindow,
          currentTime,
          delta,
          e.relativeX / width,
        );
        onTimeWindowChange(updated.timeWindow);
        onCurrentTimeChange(updated.currentTime);
      }
    },

  });

  return (
    <>
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
          width={width} 
          height={height} 
          style={{
            touchAction: 'none'
          }}
        />
        <svg 
          width={width} 
          height={height} 
          style={{ 
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            pointerEvents: 'none' 
          }} 
        >
          <FrequencyRuler 
            width={40}
            height={height}
            minFrequency={minFrequency}
            maxFrequency={maxFrequency}
            x={0}
            y={0}
            color={'#fff'}
            position={'inset'}

            selfContained={false}
          />
          <TimeRuler 
            width={width} 
            height={30} 
            timeWindow={timeWindow} 
            currentTime={currentTime} 
            position={'inset'}
            x={0} 
            y={height - 30} 
            selfContained={false}          
            color="#fff"
          />
        </svg>
        <br />
    
      </div>
      {minFrequency}<br /> 
      {maxFrequency}<br />
      {timeWindow}<br />
      {JSON.stringify(activePanEvent, null, 2)}<br />
      {currentTime}<br />
    </>
  );
};

