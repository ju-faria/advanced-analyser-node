advanced-analyser-node

# advanced-analyser-node

## Table of contents

### Enumerations

- [EventListenerTypes](enums/EventListenerTypes.md)
- [WindowFunctionTypes](enums/WindowFunctionTypes.md)

### Classes

- [AdvancedAnalyserNode](classes/AdvancedAnalyserNode.md)

### Type aliases

- [AdvancedAnalyserNodeProperties](DOC.md#advancedanalysernodeproperties)

### Functions

- [createAdvancedAnalyserNode](DOC.md#createadvancedanalysernode)

## Type aliases

### AdvancedAnalyserNodeProperties

Ƭ **AdvancedAnalyserNodeProperties**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `fftSize?` | `number` | The size of the FFT used for frequency-domain analysis (in sample-frames). This MUST be a power of two in the range 32 to 32768. The default value is 2048. Note that large FFT sizes can be costly to compute. |
| `maxDecibels?` | `number` | Value representing the maximum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event. |
| `minDecibels?` | `number` | Value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()` and `bytefrequencydata` event. |
| `samplesBetweenTransforms?` | `number` | The interval in number of samples between transforms. Note that if this number is higher than the fftSize, some samples will be skipped, and if it's lower, samples will be overlapped. |
| `smoothingTimeConstant?` | `number` | Represents the averaging constant with the last analysis frame. It's basically an average between the current buffer and the last buffer the AnalyserNode processed, and results in a much smoother set of value changes over time. |
| `timeDomainSamplesCount?` | `number` | The number of samples that will be returned in the time-domain events callback |
| `windowFunction?` | [`WindowFunctionTypes`](enums/WindowFunctionTypes.md) | The [Window Function](https://en.wikipedia.org/wiki/Window_function) to be applied applied to the samples before each transform. |

#### Defined in

[src/types.ts:163](https://github.com/ju-faria/advanced-analyser-node/blob/f2ab6f9/src/types.ts#L163)

## Functions

### createAdvancedAnalyserNode

▸ **createAdvancedAnalyserNode**(`context`, `options`): `Promise`<[`AdvancedAnalyserNode`](classes/AdvancedAnalyserNode.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `BaseAudioContext` |
| `options` | [`AdvancedAnalyserNodeProperties`](DOC.md#advancedanalysernodeproperties) |

#### Returns

`Promise`<[`AdvancedAnalyserNode`](classes/AdvancedAnalyserNode.md)\>

#### Defined in

src/node/create-advanced-analyser.ts:10
