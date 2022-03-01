# Advanced Analyser Node

Advanced Analyser Node aims to be an enhanced version of the native Analyser Node. Both Audio nodes provide real-time frequency and time-domain analysis information.

## Why this exists?
The native Analyser Node offers two primary features: Request frequency data (`.getFloatFrequencyData|.getByteFrequencyData`) and time-domain data (`.getFloatTimeDomainData|.getByteTimeDomainData`). The main problem is that the Analyser Node only gives you the data at the time of the request, meaning that when you request for the frequency data, the node will apply the Fast Fourier Transform to the last n audio samples (n is the fftSize property), or in the case of time-domain data, the last n audio samples.

That's good enough if you are creating an audio visualization of the data currently being played, as the usual approach is to create a loop that requests and draws the data every frame (and if you're doing that, you should probably stick to the native Analyser Node as it will give you better performance).

The problem happens when you need to display the data **over time** (ex: Spectrograms, the waveform of the whole track). As the native Analyser Node gives you the data at the request time, it's impossible to guarantee that all requests will be evenly spaced in time. That means you will have inconsistent data overlaps or even skip some samples altogether. Depending on your goal, overlapping or skipping samples are not a problem per se; the issue is the inconsistency as the interval between samples will be completely based on your loop FPS.

The Advanced Analyser Node provides all the native version features (with a slightly different API), but also gives you the option of registering events that will be consistently triggered based on its configuration. For advanced users, you also have the option of choosing between different window functions.

## Installation

Using npm:
```bash
npm install --save-dev advanced-analyser-node
```
Using yarn:
```bash
yarn add --dev advanced-analyser-node
```


## Usage

```javascript
import { createAdvancedAnalyserNode } from 'advanced-analyser-node';

const init = async () => {

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  const context = new AudioContext();
  const audioSource = context.createMediaStreamSource(stream);

  const analyserNode = await createAdvancedAnalyserNode(context, {
    fftSize: 2048,                 // needs to be a power of 2
    samplesBetweenTransforms: 1024 // fixed samples interval between transforms
                                   // it can be greater or smaller than the fftSize, which will cause overlaps or skip samples
  });

  const transforms = [];
  analyserNode.addEventListener('bytefrequencydata', ({ detail }) => {
    transforms.push(detail)
  })

  audioSource.connect(analyserNode)

}

init();
```

```javascript
const data = await analyserNode.getByteFrequencyData() // Differently from the native implementation, the request methods are asynchronous, and do not take an array as parameter
```


## Documentation


## Caveats

- The performance is enough for most cases (around 1ms~2ms per request with the default settings). However, the native Analyser Node will always give you better performance, so if the native implementation suits your needs, use it.

- Differently from the native implementation, this node will down-mix its  channels to mono, so do not use it as an intermediary node (don't connect this node to another).

- The native api allows you to reuse the same arrays between requests to save on memory. It's not possible to do that with this node due to technical limitations of the Audio Worklet api.




## License
[MIT](https://choosealicense.com/licenses/mit/)
