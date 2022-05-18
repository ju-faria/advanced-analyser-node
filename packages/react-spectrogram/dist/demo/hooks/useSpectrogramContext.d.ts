export declare const useSpectrogramContext: () => {
    spectrogramRenderer: import("@soundui/spectrogram-renderer").SpectrogramRenderer;
    onChange: (properties: import("../components/spectrogram/types").SpectrogramTransforms) => void;
    transforms: import("../components/spectrogram/types").SpectrogramTransforms;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    dynamicRange: number;
    dynamicRangeTop: number;
    dataResolver: import("@soundui/spectrogram-renderer").FrequencyDataResolver;
};
