import { FrequencyScale } from "@soundui/shared/constants/types";
import { Nullable } from "@soundui/shared/utils/types";
import { SpectrogramTransforms } from "../types";
declare type ControlsProperties = {
    modifierKeyCode?: Nullable<string>;
    lockFrequencyPanning?: boolean;
    lockTimePanning?: boolean;
    lockFrequencyScaling?: boolean;
    lockTimeWindowScaling?: boolean;
    onChange: (properties: SpectrogramTransforms) => void;
    width: number;
    height: number;
    canvas: HTMLElement;
    transforms: SpectrogramTransforms;
    frequencyScale?: FrequencyScale;
};
export declare const useControls: ({ modifierKeyCode, lockFrequencyPanning, lockTimePanning, lockFrequencyScaling, lockTimeWindowScaling, onChange, width, height, canvas, transforms, frequencyScale, }: ControlsProperties) => void;
export {};
