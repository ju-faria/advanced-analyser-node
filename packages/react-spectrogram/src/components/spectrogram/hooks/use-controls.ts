import { FrequencyScale } from "@soundui/shared/constants/types";
import { DEFAULT_FREQUENCY_SCALE } from "@soundui/shared/dist/constants/defaults";
import { Nullable } from "@soundui/shared/utils/types";
import { useCallback, useState } from "react";
import { transformFn, composeTransforms, TransformProperties } from "src/components/spectrogram/hooks/transformations";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import { useGestures } from "src/hooks/useGestures";
import { useKey } from "src/hooks/useKey";


type ControlsProperties = {
  modifierKeyCode?: Nullable<string>,
  lockFrequencyPanning?: boolean,
  lockTimePanning?: boolean,
  lockFrequencyScaling?: boolean,
  lockTimeWindowScaling?: boolean,

  onMaxFrequencyChange: (maxFrequency: number) => void,
  onMinFrequencyChange: (minFrequency: number) => void,
  onTimeWindowChange: (timeWindow: number) => void,
  onCurrentTimeChange: (currentTime: number) => void,
  width: number,
  height: number,
  canvas: HTMLElement,
  minFrequency: number,
  maxFrequency: number,
  timeWindow: number,
  currentTime: number,
  frequencyScale?: FrequencyScale,
}

export const useControls = ({
  modifierKeyCode = 'ShiftLeft',
  lockFrequencyPanning = false,
  lockTimePanning = false,
  lockFrequencyScaling = false,
  lockTimeWindowScaling = false,

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
  frequencyScale = DEFAULT_FREQUENCY_SCALE,
}:ControlsProperties) => {
  const {
    translateFrequency,
    translateCurrentTime,
    scaleFrequencies,
    scaleTimeWindow,
  } = transformFn[frequencyScale];

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

  const updateChanges = useCallback((updated: TransformProperties) => {
    if(updated.currentTime !== currentTime) onCurrentTimeChange(updated.currentTime);
    if(updated.minFrequency !== minFrequency) onMinFrequencyChange(updated.minFrequency);
    if(updated.maxFrequency !== maxFrequency) onMaxFrequencyChange(updated.maxFrequency);
    if(updated.timeWindow !== timeWindow) onTimeWindowChange(updated.timeWindow);
  }, []);

  const modifierIsPressed = useKey(modifierKeyCode);


  useGestures(canvas, {
    onPinchStart: () => {
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
      if (!activePinchEvent) return;
      const { startFrequencies, startTime, startTimeWindow } = activePinchEvent;
      const { min, max } = startFrequencies;
      const transformed = composeTransforms(
        translateCurrentTime(width, e.deltaX),
        translateFrequency(height, e.deltaY),
        scaleTimeWindow(
          Math.abs(
            Math.max(e.pinchStartMagnitudeX, 40)
            /
            Math.max(e.pinchMagnitudeX, 40)
          ),
          e.relativeX / width
        ),
        scaleFrequencies(
          Math.abs(
            Math.max(e.pinchStartMagnitudeY, 40)
            /
            Math.max(e.pinchMagnitudeY, 40)
          ),
          e.relativeY/height,
        ),
      )({
        minFrequency: min,
        maxFrequency: max,
        currentTime: startTime,
        timeWindow: startTimeWindow,
      });
      updateChanges(transformed);
    },
    onPinchEnd: () => {
      setActivePinchEvent(null);
    },
    onPanStart: () => {
      if (lockFrequencyPanning && lockTimePanning) return;
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
        const { max, min } = startFrequencies;
        let transformed = {
          minFrequency: min,
          maxFrequency: max,
          currentTime: startTime,
          timeWindow,
        };
        if(!lockFrequencyPanning) {
          transformed = composeTransforms(
            translateFrequency(height, e.y - e.startY),
          )(transformed);
        }
        if (!lockTimePanning) {
          transformed = composeTransforms(
            translateCurrentTime(width, e.x - e.startX),
          )(transformed);
        }
        updateChanges(transformed);
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
      let transformed = {
        minFrequency,
        maxFrequency,
        currentTime,
        timeWindow,
      };

      if (
        (modifierKeyCode === null || modifierIsPressed)
        &&
        !lockFrequencyScaling
      ) {
        const delta = (height + (e.deltaWheel * -1)) / height;

        transformed = composeTransforms(
          scaleFrequencies(delta, e.relativeY / height),
        )(transformed);
      }

      if (
        (modifierKeyCode === null || !modifierIsPressed)
        &&
        !lockTimeWindowScaling
      ) {
        const delta = (width + (e.deltaWheel * -1)) / width;

        transformed = composeTransforms(
          scaleTimeWindow(delta, e.relativeX / width),
        )(transformed);
      }
      updateChanges(transformed);
    },
    onTrackpadPinch: (e) => {
      if (activePanEvent) setActivePanEvent(null);
      let transformed = {
        minFrequency,
        maxFrequency,
        currentTime,
        timeWindow,
      };
      const delta = ((height + (e.deltaWheel * 3)) / height);
      if (!lockFrequencyScaling) {
        transformed = composeTransforms(
          scaleFrequencies(delta, e.relativeY / height),
        )(transformed);
      }

      if (!lockTimeWindowScaling) {
        transformed = composeTransforms(
          scaleTimeWindow(delta, e.relativeX / width),
        )(transformed);
      }
      updateChanges(transformed);
    },
  });

  useAnimationFrame(() => {
    if (!activePanEvent || !activePanEvent.releaseTime) return;
    const { releaseVelocity, releaseDeltaPosition, releaseTime, startTime, startFrequencies} = activePanEvent;

    const deltaTime = (Date.now() - releaseTime) / 1000;
    const damping = 0.1;

    const finalVelocity = {
      x: releaseVelocity.x * Math.pow(damping, deltaTime),
      y: releaseVelocity.y * Math.pow(damping, deltaTime),
    };

    const newDeltaPosition = {
      x: (finalVelocity.x - releaseVelocity.x) / -damping,
      y: (finalVelocity.y - releaseVelocity.y) / -damping,
    };

    if (Math.abs(finalVelocity.x) < 1) {
      finalVelocity.x = 0;
    }
    if (Math.abs(finalVelocity.y) < 1) {
      finalVelocity.y = 0;
    }

    let transformed = {
      minFrequency: startFrequencies.min,
      maxFrequency: startFrequencies.max,
      currentTime: startTime,
      timeWindow,
    };

    if (!lockTimePanning) {
      transformed = composeTransforms(
        translateCurrentTime(width, releaseDeltaPosition.x + newDeltaPosition.x,),
      )(transformed);
    }
    if (!lockFrequencyPanning) {
      transformed = composeTransforms(
        translateFrequency(height, releaseDeltaPosition.y + newDeltaPosition.y),
      )(transformed);
    }

    updateChanges(transformed);

    if (finalVelocity.x === 0 && finalVelocity.y === 0) {
      setActivePanEvent(null);
      return;
    }
  });
};