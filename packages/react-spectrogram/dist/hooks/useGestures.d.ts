declare type GestureEvent = {
    startX: number;
    startY: number;
    x: number;
    y: number;
    relativeX: number;
    relativeY: number;
    deltaX: number;
    deltaY: number;
    deltaWheel: number;
    pinchStartMagnitudeX: number;
    pinchStartMagnitudeY: number;
    pinchMagnitudeX: number;
    pinchMagnitudeY: number;
    pinchMagnitudeMovementX: number;
    pinchMagnitudeMovementY: number;
    movementX: number;
    movementY: number;
    pointerIds: number[];
};
export declare const useGestures: (ref: React.RefObject<HTMLElement>, { onPanMove, onPanStart, onPanEnd, onPinchMove, onPinchStart, onPinchEnd, onWheel, }: {
    onPanMove?: (event: GestureEvent) => void;
    onPanStart?: (event: GestureEvent) => void;
    onPanEnd?: (event: GestureEvent) => void;
    onPinchMove?: (event: GestureEvent) => void;
    onPinchStart?: (event: GestureEvent) => void;
    onPinchEnd?: (event: GestureEvent) => void;
    onWheel?: (event: GestureEvent) => void;
}) => void;
export {};
