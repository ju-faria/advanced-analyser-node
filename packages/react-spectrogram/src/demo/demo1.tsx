import { createAdvancedAnalyserNode } from '@soundui/advanced-analyser-node';
import { DefaultFrequencyDataResolver } from '@soundui/spectrogram-renderer';
import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncMemo } from '../hooks/useAsyncMemo';
import { Spectrogram } from '../';
import { useAnimationFrame } from 'src/hooks/useAnimationFrame';
import { DEFAULT_FREQUENCY_SCALE } from '@soundui/shared/constants';
import { FrequencyScale } from '@soundui/shared/constants';
import { SpectrogramTransforms } from 'src/components/spectrogram/types';

export const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [dynamicRange, setDynamicRange] = React.useState(70);
  const [dynamicRangeTop, setDynamicRangeTop] = React.useState(-30);
  const [playheadPosition, setPlayheadPosition] = React.useState(0);
  const [frequencyScale, setFrequencyScale] = React.useState(DEFAULT_FREQUENCY_SCALE);
  const [spectrogramTransforms, setSpectrogramTransforms] = React.useState<SpectrogramTransforms>({
    minFrequency: 20,
    maxFrequency: 44100,
    timeWindow: 10_000,
    currentTime: 0,
  });
  const offlineCtx = useMemo(() => new OfflineAudioContext(2, 44100*30, 44100), []);
  const aaNode = useAsyncMemo(() => {
    if (!offlineCtx) return null;
    return createAdvancedAnalyserNode(offlineCtx, {
      samplesBetweenTransforms: offlineCtx.sampleRate / 12
    });
  }, [offlineCtx]);

  const dataResolver = useMemo(() => {
    if (!aaNode) return null;
    return new DefaultFrequencyDataResolver({
      sampleRate: offlineCtx.sampleRate,
      frequencyBinCount: aaNode.frequencyBinCount,
      samplesBetweenTransforms: aaNode.samplesBetweenTransforms,
      maxDecibels: aaNode.maxDecibels,
      minDecibels: aaNode.minDecibels,
    });
  }, [aaNode]);

  useEffect(() => {
    if(!aaNode || !dataResolver) return;
    aaNode.addEventListener("bytefrequencydata", ({ detail }) => {
      dataResolver.push(detail);
    });
    (async () => {
      /*
      * Fetch audio, decode it, creates a buffer source node, and start rendering
      */
      const audioData = await fetch('./niccolo-paganini_24-caprices-for-solo-violin_no2-in-B-minor.mp3').then(res => res.arrayBuffer());
      const buffer = await offlineCtx.decodeAudioData(audioData);
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(aaNode);
      aaNode.connect(offlineCtx.destination);
      setSpectrogramTransforms({
        ...spectrogramTransforms,
        timeWindow: buffer.duration * 1000
      });
      source.start(0);
      await offlineCtx.startRendering();
    })();
  }, [aaNode, dataResolver]);


  useAnimationFrame(() => {
    if (audioRef.current) {
      setPlayheadPosition(audioRef.current.currentTime * 1000);
    }
  });
  return (
    <div>
      {dataResolver && (<Spectrogram
        width={1024}
        height={512}
        transforms={spectrogramTransforms}
        onChange={setSpectrogramTransforms}
        dynamicRange={dynamicRange}
        dynamicRangeTop={dynamicRangeTop}
        onDynamicRangeChange={setDynamicRange}
        onDynamicRangeTopChange={setDynamicRangeTop}
        dataResolver={dataResolver}
        frequencyScale={frequencyScale}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: -1,
            width: 2,
            height: '100%',
            backgroundColor: 'red',
            display: 'block',

            transform: `translateX(${1024 * (playheadPosition / spectrogramTransforms.timeWindow)}px)`,
          }}
        />
      </Spectrogram>)}
      <audio
        ref={audioRef}
        src="./niccolo-paganini_24-caprices-for-solo-violin_no2-in-B-minor.mp3"
        controls
        style={{ width: 1024 }}
      />
      <br/>
      <label>Dynamic Range:</label>
      <input
        type="range"
        value={dynamicRange}
        min={5}
        max={200}
        onChange={(e) => {
          setDynamicRange(parseInt(e.target.value));
        }}
      />
      <span>{dynamicRange}</span>
      <br />
      <label>Dynamic Range Top: </label>
      <input
        type="range"
        value={dynamicRangeTop}
        min={-50}
        max={0}

        onChange={(e) => {
          setDynamicRangeTop(parseInt(e.target.value));
        }}
      />
      <span>{dynamicRangeTop}</span>
      <br />
      <select
        value={frequencyScale}
        onChange={(e) => {
          const value = e.target.value as FrequencyScale;
          setFrequencyScale(value);
        }}
      >
        {Object.values(FrequencyScale).map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
      <hr />
      <a
        href="https://archive.org/details/cd_paganini-24-caprices_julia-fischer-niccol-paganini/disc1/02.+Niccol%C3%B2+Paganini+-+24+Caprices+for+Solo+Violin+-+No.+2+in+B+minor.flac"
        target="_blank"
      >Niccolò Paganini - 24 Caprices for Solo Violin: No. 2 in B minor</a>
    </div>
  );
};
const domContainer = document.querySelector('#root');

ReactDOM.render(<App />, domContainer);


