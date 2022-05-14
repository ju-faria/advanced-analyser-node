export declare const useSpectrogramContext: () => {
    spectrogramRenderer: import("@soundui/spectrogram-renderer").SpectrogramRenderer;
    onMaxFrequencyChange: (maxFrequency: number) => void;
    onMinFrequencyChange: (minFrequency: number) => void;
    onTimeWindowChange: (timeWindow: number) => void;
    onCurrentTimeChange: (currentTime: number) => void;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    minFrequency: number;
    maxFrequency: number;
    timeWindow: number;
    currentTime: number;
    dynamicRange: number;
    dynamicRangeTop: number;
    dataResolver: import("@soundui/spectrogram-renderer").FrequencyDataResolver;
};
