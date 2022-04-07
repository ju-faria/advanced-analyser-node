import { useEffect, useRef } from "react";


type GestureEvent = {
  startX: number,
  startY: number,
  x: number,
  y: number,
  relativeX: number,
  relativeY: number,

  deltaX: number,
  deltaY: number,

  deltaWheel: number,
  wheelDeltaX: number,
  wheelDeltaY: number,

  pinchStartMagnitudeX: number,
  pinchStartMagnitudeY: number,


  pinchMagnitudeX: number,
  pinchMagnitudeY: number,


  pinchMagnitudeMovementX: number,
  pinchMagnitudeMovementY: number,



  movementX: number,
  movementY: number,
  pointerIds: number[],
  // event: any
}
type Pointer = {
  x: number,
  y: number,
  relativeX: number,
  relativeY: number,

  startX: number,
  startY: number,
  deltaX: number,
  deltaY: number,
  movementX: number,
  movementY: number,
}

const pointersToGestureEvent = (pointers: { [key: number]: Pointer}): GestureEvent => {
  const pointerIds = Object.keys(pointers).map(key => parseInt(key));
  let x = 0;
  let y = 0;
  let relativeX = 0;
  let relativeY = 0;
  let startX = 0;
  let startY = 0;
  let movementX = 0;
  let movementY = 0;
  let pinchStartMagnitudeX = 0;
  let pinchStartMagnitudeY = 0;
  let pinchMagnitudeX = 0;
  let pinchMagnitudeY = 0;
  let pinchMagnitudeMovementX = 0;
  let pinchMagnitudeMovementY = 0;
  for (const pointerId in pointers) {
    const pointer = pointers[pointerId];
    x += pointer.x;
    y += pointer.y;
    startX += pointer.startX;
    startY += pointer.startY;
    relativeX += pointer.relativeX;
    relativeY += pointer.relativeY;
    movementX += pointer.movementX;
    movementY += pointer.movementY;
  }
  if (pointerIds.length === 2) {
    const pointer0 = pointers[pointerIds[0]];
    const pointer1 = pointers[pointerIds[1]];

    pinchStartMagnitudeX = Math.abs(pointer0.startX - pointer1.startX);
    pinchStartMagnitudeY = Math.abs(pointer0.startY - pointer1.startY);
    pinchMagnitudeX = Math.abs(pointer0.x - pointer1.x);
    pinchMagnitudeY = Math.abs(pointer0.y - pointer1.y);
    pinchMagnitudeMovementX = pointer0.movementX - pointer1.movementX;
    pinchMagnitudeMovementY = pointer0.movementY - pointer1.movementY;
  }

  x /= pointerIds.length;
  y /= pointerIds.length;
  startX /= pointerIds.length;
  startY /= pointerIds.length;
  movementX /= pointerIds.length;
  movementY /= pointerIds.length;
  relativeX /= pointerIds.length;
  relativeY /= pointerIds.length;

  return {
    startX,
    startY,
    x,
    y,
    relativeX,
    relativeY,

    movementX,
    movementY,

    pinchStartMagnitudeX,
    pinchStartMagnitudeY,
    pinchMagnitudeX,
    pinchMagnitudeY,
    pinchMagnitudeMovementX,
    pinchMagnitudeMovementY,

    deltaX: x - startX,
    deltaY: y - startY,
    deltaWheel: 0,
    wheelDeltaX: 0,
    wheelDeltaY: 0,

    pointerIds,
  };
};

export const useGestures = (
  ref: HTMLElement,
  {
    onPanMove,
    onPanStart,
    onPanEnd,
    onPinchMove,
    onPinchStart,
    onPinchEnd,
    onWheel,
    onTrackpadPinch,
  }: {

  onPanMove?: (event: GestureEvent) => void,
  onPanStart?: (event: GestureEvent) => void,
  onPanEnd?: (event: GestureEvent) => void,

  onPinchMove?: (event: GestureEvent) => void,
  onPinchStart?: (event: GestureEvent) => void,
  onPinchEnd?: (event: GestureEvent) => void,

  onWheel?: (event: GestureEvent) => void,

  onTrackpadPinch?: (event: GestureEvent) => void,
}) => {
  const pointersRef = useRef<{[key: number]: Pointer}>({});

  useEffect(() => {
    if (!ref) return;
    const element = ref;
    const handlePointDown = (event: PointerEvent) => {
      element.setPointerCapture(event.pointerId);
      const pointers = pointersRef.current;

      const newPointers: typeof pointers = {};
      const pointerIds = Object.keys(pointers);


      // end pan
      if (pointerIds.length === 1) {
        const pointerId = Number(pointerIds[0]);
        const pointerEvent = pointers[pointerId];
        onPanEnd && onPanEnd(pointersToGestureEvent({
          [pointerId]: {
            ...pointerEvent,
            movementX: 0,
            movementY: 0,
          }
        }));
      }
      // Resets all pointers
      for (const pointerId in pointers) {
        const pointer = pointers[pointerId];
        newPointers[pointerId] = {
          ...pointer,
          startX: pointer.x,
          startY: pointer.y,
          deltaX: 0,
          deltaY: 0,
          movementX: 0,
          movementY: 0,
        };
      }
      // adds new pointer
      newPointers[event.pointerId] = {
        x: event.clientX,
        y: event.clientY,
        relativeX: event.clientX - element.offsetLeft,
        relativeY: event.clientY - element.offsetTop,

        startX: event.clientX,
        startY: event.clientY,
        deltaX: 0,
        deltaY: 0,
        movementX: 0,
        movementY: 0,
      };
      // start eventd
      if (pointerIds.length === 0) {
        onPanStart && onPanStart(pointersToGestureEvent(newPointers));
      } else if (pointerIds.length === 1) {
        onPinchStart && onPinchStart(pointersToGestureEvent(newPointers));
      }
      // update state
      // setPointers(newPointers);
      pointersRef.current = newPointers;
    };

    const handlePointMove = (event: PointerEvent) => {
      event.preventDefault();

      const pointers = pointersRef.current;


      if (!pointers[event.pointerId]) return;
      const newPointers = {
        ...pointers,
        [event.pointerId]: {
          ...pointers[event.pointerId],
          x: event.clientX,
          y: event.clientY,
          deltaX: event.clientX - pointers[event.pointerId].startX,
          deltaY: event.clientY - pointers[event.pointerId].startY,
          movementX: event.clientX - pointers[event.pointerId].x,
          movementY: event.clientY - pointers[event.pointerId].y,
        }
      };
      pointersRef.current = newPointers;
      if (Object.keys(pointers).length === 1) {
        onPanMove && onPanMove(pointersToGestureEvent(newPointers));
      } else if (Object.keys(pointers).length > 1) {
        onPinchMove && onPinchMove(pointersToGestureEvent(newPointers));
      }
    };

    const handlePointUp = (event: PointerEvent) => {
      element.setPointerCapture(event.pointerId);
      const pointers = pointersRef.current;
      const newPointers = {
        ...pointers,
      };
      delete newPointers[event.pointerId];

      if (Object.keys(pointers).length === 1) {
        onPanEnd && onPanEnd(pointersToGestureEvent(pointers));
      } else if (Object.keys(pointers).length > 1) {
        onPinchEnd && onPinchEnd(pointersToGestureEvent(pointers));
        onPanStart && onPanStart(pointersToGestureEvent(newPointers));
      }

      pointersRef.current = newPointers;
    };
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const eventData:GestureEvent = {
        deltaX: 0,
        deltaY: 0,
        deltaWheel: Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY,
        wheelDeltaX: event.deltaX,
        wheelDeltaY: event.deltaY,
        x: event.clientX,
        y: event.clientY,
        relativeX: event.clientX - element.offsetLeft,
        relativeY: event.clientY - element.offsetTop,

        movementX: 0,
        movementY: 0,
        startX: 0,
        startY: 0,
        pinchStartMagnitudeX: 0,
        pinchStartMagnitudeY: 0,
        pinchMagnitudeX: 0,
        pinchMagnitudeY: 0,
        pinchMagnitudeMovementX: 0,
        pinchMagnitudeMovementY: 0,
        pointerIds: []
      };

      if (event.ctrlKey) {
        onTrackpadPinch && onTrackpadPinch(eventData);
      } else {
        onWheel && onWheel(eventData);
      }
    };

    element.addEventListener('pointerdown', handlePointDown);
    element.addEventListener('pointermove', handlePointMove);
    element.addEventListener('pointerup', handlePointUp);
    element.addEventListener('pointercancel', handlePointUp);
    element.addEventListener('wheel', handleWheel);
    return () => {
      element.removeEventListener('pointerdown', handlePointDown);
      element.removeEventListener('pointermove', handlePointMove);
      element.removeEventListener('pointerup', handlePointUp);
      element.removeEventListener('pointercancel', handlePointUp);
      element.removeEventListener('wheel', handleWheel);
    };

  }, [ref, onPanMove, onPanStart, onPanEnd, onPinchMove, onPinchStart, onPinchEnd]);

};