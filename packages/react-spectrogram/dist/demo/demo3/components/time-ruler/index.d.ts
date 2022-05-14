import React from 'react';
export declare const TimeRuler: React.ForwardRefExoticComponent<{
    width: number;
    height: number;
    timeWindow: number;
    currentTime: number;
    color?: string;
    backgroundColor?: string;
    dividers?: boolean;
    position?: 'inset' | 'offset';
    selfContained?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
