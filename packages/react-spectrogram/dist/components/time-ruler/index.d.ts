/// <reference types="react" />
declare type TimeRulerProps = {
    width: number;
    height: number;
    timeWindow: number;
    currentTime: number;
    color?: string;
    backgroundColor?: string;
    dividers?: boolean;
    measuredBy?: 'BPM' | 'Time';
    orientation?: 'horizontal' | 'vertical';
    position?: 'inset' | 'offset';
    x: number;
    y: number;
    selfContained: boolean;
};
export declare const TimeRuler: ({ width, height, timeWindow, currentTime, color, backgroundColor, dividers, measuredBy, orientation, position, x, y, selfContained, }: TimeRulerProps) => JSX.Element;
export {};
