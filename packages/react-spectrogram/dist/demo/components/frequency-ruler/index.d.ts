import React from "react";
export declare const generateLogLabels: (min: number, max: number) => number[];
export declare const FrequencyRuler: React.ForwardRefExoticComponent<{
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
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
