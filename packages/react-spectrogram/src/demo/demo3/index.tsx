import { createAdvancedAnalyserNode } from '@soundui/advanced-analyser-node';
import { DefaultFrequencyDataResolver } from '@soundui/spectrogram-renderer';
import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncMemo } from '../../hooks/useAsyncMemo';
import { Spectrogram } from '../../';
import { DEFAULT_FREQUENCY_SCALE, FrequencyScale } from '@soundui/shared/constants';
import { clamp } from 'lodash';
import classNames from 'classnames';
import { useAnimationFrame } from 'src/hooks/useAnimationFrame';
import { SpectrogramTransforms } from 'src/components/spectrogram/types';

export const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const [dynamicRange, setDynamicRange] = React.useState(70);
  const [dynamicRangeTop, setDynamicRangeTop] = React.useState(-30);
  const [frequencyRulerPosition, setFrequencyRulerPosition] = React.useState<'start' | 'end'>('start');
  const [timeRulerPosition, setTimeRulerPosition] = React.useState<'start' | 'end'>('start');
  const [frequencyScale, setFrequencyScale] = React.useState(DEFAULT_FREQUENCY_SCALE);
  const [displaySettings, setDisplaySettings] = React.useState(true);
  const [playheadPosition, setPlayheadPosition] = React.useState(0);
  const [spectrogramTransforms, setSpectrogramTransforms] = React.useState<SpectrogramTransforms>({
    minFrequency: 20,
    maxFrequency: 44100,
    timeWindow: 10_000,
    currentTime: 0,
  });
  const offlineCtx = useMemo(() => new OfflineAudioContext(2, 44100*30, 44100), []);

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
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
      {dataResolver && (
        <Spectrogram
          width={width}
          height={height - 20}
          transforms={spectrogramTransforms}
          onChange={setSpectrogramTransforms}
          dynamicRange={dynamicRange}
          dynamicRangeTop={dynamicRangeTop}
          onDynamicRangeChange={setDynamicRange}
          onDynamicRangeTopChange={setDynamicRangeTop}
          dataResolver={dataResolver}
          timeRulerAsOverlay={false}
          frequencyRulerAsOverlay={false}
          frequencyRulerPosition={frequencyRulerPosition}
          timeRulerPosition={timeRulerPosition}
          frequencyScale={frequencyScale}
        >
          <span
            className="playhead"
            style={{
              display: playheadPosition  > spectrogramTransforms.currentTime
                && playheadPosition < spectrogramTransforms.timeWindow + spectrogramTransforms.currentTime
                ? 'block' : 'none',
              transform: `translateX(${
                (width - 50) * ((playheadPosition - spectrogramTransforms.currentTime) / spectrogramTransforms.timeWindow) + (frequencyRulerPosition === 'start' ? 50 : 0)
              }px)`,
            }}
          />
        </Spectrogram>
      )}
      <div
        className={classNames("settings", {
          "settings-is-visible": displaySettings
        })}
      >
        <header
          className={"settings-header"}
          onClick={() => setDisplaySettings(!displaySettings)}
        >
          <h1>Settings</h1>
        </header>
        {displaySettings && (

          <div className="settings-content">
            <label>Frequency Ruler Position:</label>
            <select
              value={frequencyRulerPosition}
              onChange={(e) => {
                const value = e.currentTarget.value as 'start' | 'end';
                setFrequencyRulerPosition(value);
              }}
            >
              <option value="start">Start</option>
              <option value="end">End</option>
            </select>
            <label>Time Ruler Position:</label>
            <select
              value={timeRulerPosition}
              onChange={(e) => {
                const value = e.currentTarget.value as 'start' | 'end';
                setTimeRulerPosition(value);
              }}
            >
              <option value="start">Start</option>
              <option value="end">End</option>
            </select>

            <label>Dynamic Range: {dynamicRange}dB</label>
            <input
              type="range"
              value={dynamicRange}
              min={5}
              max={200}
              onChange={(e) => {
                setDynamicRange(parseInt(e.target.value));
              }}
            />

            <label>Dynamic Range Top: {dynamicRangeTop}dB</label>
            <input
              type="range"
              value={dynamicRangeTop}
              min={-50}
              max={0}
              onChange={(e) => {
                setDynamicRangeTop(parseInt(e.target.value));
              }}
            />

            <label>
              Frequency Scale:
            </label>
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
            <div>

            </div>
            <hr />
            <a
              href="https://archive.org/details/cd_paganini-24-caprices_julia-fischer-niccol-paganini/disc1/02.+Niccol%C3%B2+Paganini+-+24+Caprices+for+Solo+Violin+-+No.+2+in+B+minor.flac"
              target="_blank"
            >Niccolò Paganini - 24 Caprices for Solo Violin: No. 2 in B minor</a>
          </div>
        )}
      </div>
      <audio
        className="audio-player"
        ref={audioRef}
        src="./niccolo-paganini_24-caprices-for-solo-violin_no2-in-B-minor.mp3"
        controls

      />
    </div>
  );
};
const domContainer = document.querySelector('#root');

ReactDOM.render(<App />, domContainer);


