import { useContext } from "react";
import { SpectrogramContext } from "src/components/spectrogram-context";

export const useSpectrogramContext = () => {
  return useContext(SpectrogramContext);
};