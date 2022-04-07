import React, { useState } from 'react';
import { Spectrogram } from './spectrogram';

const useAsyncMemo = <T,>(asyncFn: () => Promise<T>, deps: unknown[]): T | null => {
  const [result, setResult] = React.useState<T|null>(null);
  React.useEffect(() => {
    asyncFn().then(setResult);
  }, deps);
  return result;
};


export const App = () => {
  const [minFrequency, setMinFrequency] = React.useState(20);
  const [maxFrequency, setMaxFrequency] = React.useState(44100);
  const [timeWindow, setTimeWindow] = React.useState(10_000);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [dynamicRange, setDynamicRange] = React.useState(70);
  const [dynamicRangeTop, setDynamicRangeTop] = React.useState(-30);

  const [audioContext, setAudioContext] = useState<AudioContext>(null);
  const audioSource = useAsyncMemo<AudioNode>(async () => {
    if (!audioContext) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    return audioContext.createMediaStreamSource(stream);
  }, [audioContext]);

  return (
    <div>
      {audioSource && (<Spectrogram
        width={512}
        height={512}
        minFrequency={minFrequency}
        maxFrequency={maxFrequency}
        timeWindow={timeWindow}
        currentTime={currentTime}
        onMaxFrequencyChange={setMaxFrequency}
        onMinFrequencyChange={setMinFrequency}
        onTimeWindowChange={setTimeWindow}
        onCurrentTimeChange={setCurrentTime}
        audioSource={audioSource}
        dynamicRange={dynamicRange}
        dynamicRangeTop={dynamicRangeTop}
        onDynamicRangeChange={setDynamicRange}
        onDynamicRangeTopChange={setDynamicRangeTop}
      />)}
      <div>
        <p>minFrequency: {minFrequency}</p>
        <p>maxFrequency: {maxFrequency}</p>
      </div>
      <button onClick={() => {
        setAudioContext(new AudioContext());
      }}>
        Start
      </button>
      <br />
      <input
        type="range"
        value={dynamicRange}
        min={5}
        max={200}
        onChange={(e) => {
          setDynamicRange(parseInt(e.target.value));
        }}
      />
      <p>dynamicRange: {dynamicRange}</p>

      <input
        type="range"
        value={dynamicRangeTop}
        min={-50}
        max={0}

        onChange={(e) => {
          setDynamicRangeTop(parseInt(e.target.value));
        }}
      />
      <p>dynamicRangeTop: {dynamicRangeTop}</p>


    </div>
  );
};