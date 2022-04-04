/// <reference types="react" />
export declare const generateLogLabels: (min: number, max: number) => number[];
declare type FrequencyRulerProps = {
    width: number;
    height: number;
    minFrequency: number;
    maxFrequency: number;
    color?: string;
    backgroundColor?: string;
    dividers?: boolean;
    orientation?: 'horizontal' | 'vertical';
    position?: 'inset' | 'offset';
    direction?: 'ascending' | 'descending';
    x: number;
    y: number;
    selfContained: boolean;
};
export declare const FrequencyRuler: ({ width, height, minFrequency, maxFrequency, color, backgroundColor, dividers, orientation, position, direction, x, y, selfContained, }: FrequencyRulerProps) => JSX.Element;
export {};
