import { FrequencyScale } from "@soundui/shared/constants/types";
import React from "react";
export declare const generateLogLabels: (min: number, max: number, rulerSize: number) => {
    label: string;
    position: number;
    isLabelVisible: boolean;
}[];
export declare const FrequencyRuler: React.ForwardRefExoticComponent<{
    width: number;
    height: number;
    minFrequency: number;
    maxFrequency: number;
    frequencyScale?: FrequencyScale;
    color?: string;
    orientation?: 'horizontal' | 'vertical';
    position?: 'inset' | 'offset';
    direction?: 'ascending' | 'descending';
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
