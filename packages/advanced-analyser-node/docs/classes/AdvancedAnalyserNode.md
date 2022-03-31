[@audioui/advanced-analyser-node](../DOC.md) / AdvancedAnalyserNode

# Class: AdvancedAnalyserNode

The Audio Node class. Do not instantiate this class directly.
Use the `createAdvancedAnalyserNode` method instead.

## Hierarchy

- `AudioWorkletNode`

  ↳ **`AdvancedAnalyserNode`**

## Table of contents

### Constructors

- [constructor](AdvancedAnalyserNode.md#constructor)

### Properties

- [channelCount](AdvancedAnalyserNode.md#channelcount)
- [channelCountMode](AdvancedAnalyserNode.md#channelcountmode)
- [channelInterpretation](AdvancedAnalyserNode.md#channelinterpretation)
- [context](AdvancedAnalyserNode.md#context)
- [numberOfInputs](AdvancedAnalyserNode.md#numberofinputs)
- [numberOfOutputs](AdvancedAnalyserNode.md#numberofoutputs)
- [parameters](AdvancedAnalyserNode.md#parameters)
- [port](AdvancedAnalyserNode.md#port)

### Accessors

- [fftSize](AdvancedAnalyserNode.md#fftsize)
- [frequencyBinCount](AdvancedAnalyserNode.md#frequencybincount)
- [maxDecibels](AdvancedAnalyserNode.md#maxdecibels)
- [minDecibels](AdvancedAnalyserNode.md#mindecibels)
- [samplesBetweenTransforms](AdvancedAnalyserNode.md#samplesbetweentransforms)
- [smoothingTimeConstant](AdvancedAnalyserNode.md#smoothingtimeconstant)
- [timeDomainSamplesCount](AdvancedAnalyserNode.md#timedomainsamplescount)
- [windowFunction](AdvancedAnalyserNode.md#windowfunction)

### Methods

- [addEventListener](AdvancedAnalyserNode.md#addeventlistener)
- [connect](AdvancedAnalyserNode.md#connect)
- [disconnect](AdvancedAnalyserNode.md#disconnect)
- [dispatchEvent](AdvancedAnalyserNode.md#dispatchevent)
- [getByteFrequencyData](AdvancedAnalyserNode.md#getbytefrequencydata)
- [getByteTimeDomainData](AdvancedAnalyserNode.md#getbytetimedomaindata)
- [getFloatFrequencyData](AdvancedAnalyserNode.md#getfloatfrequencydata)
- [getFloatTimeDomainData](AdvancedAnalyserNode.md#getfloattimedomaindata)
- [onprocessorerror](AdvancedAnalyserNode.md#onprocessorerror)
- [removeEventListener](AdvancedAnalyserNode.md#removeeventlistener)

## Constructors

### constructor

• **new AdvancedAnalyserNode**(`context`, `properties`)

The Audiio Node class. Do not instantiate this class directly.
Use the `createAdvancedAnalyserNode` method, which registers this Worklet before instantiating it

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `BaseAudioContext` |
| `properties` | [`AdvancedAnalyserNodeProperties`](../DOC.md#advancedanalysernodeproperties) |

#### Overrides

window.AudioWorkletNode.constructor

#### Defined in

[src/node/advanced-analyser-node.ts:202](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L202)

## Properties

### channelCount

• `Readonly` **channelCount**: `number`

#### Overrides

window.AudioWorkletNode.channelCount

#### Defined in

[src/node/advanced-analyser-node.ts:46](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L46)

___

### channelCountMode

• `Readonly` **channelCountMode**: `ChannelCountMode`

#### Overrides

window.AudioWorkletNode.channelCountMode

#### Defined in

[src/node/advanced-analyser-node.ts:52](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L52)

___

### channelInterpretation

• `Readonly` **channelInterpretation**: `ChannelInterpretation`

#### Overrides

window.AudioWorkletNode.channelInterpretation

#### Defined in

[src/node/advanced-analyser-node.ts:54](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L54)

___

### context

• `Readonly` **context**: `BaseAudioContext`

#### Inherited from

window.AudioWorkletNode.context

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2150

___

### numberOfInputs

• `Readonly` **numberOfInputs**: `number`

#### Overrides

window.AudioWorkletNode.numberOfInputs

#### Defined in

[src/node/advanced-analyser-node.ts:48](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L48)

___

### numberOfOutputs

• `Readonly` **numberOfOutputs**: `number`

#### Overrides

window.AudioWorkletNode.numberOfOutputs

#### Defined in

[src/node/advanced-analyser-node.ts:50](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L50)

___

### parameters

• `Readonly` **parameters**: `AudioParamMap`

#### Inherited from

window.AudioWorkletNode.parameters

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2253

___

### port

• `Readonly` **port**: `MessagePort`

#### Inherited from

window.AudioWorkletNode.port

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2254

## Accessors

### fftSize

• `get` **fftSize**(): `number`

The size of the FFT used for frequency-domain analysis (in sample-frames).
This MUST be a power of two in the range 32 to 32768. The default value is 2048.
Note that large FFT sizes can be costly to compute.

**`defaultvalue`** 2048

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:63](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L63)

• `set` **fftSize**(`value`): `void`

The size of the FFT used for frequency-domain analysis (in sample-frames).
This MUST be a power of two in the range 32 to 32768. The default value is 2048.
Note that large FFT sizes can be costly to compute.

**`defaultvalue`** 2048

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:67](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L67)

___

### frequencyBinCount

• `get` **frequencyBinCount**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:98](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L98)

___

### maxDecibels

• `get` **maxDecibels**(): `number`

Represents the maximum power value in the scaling range for the FFT analysis data,
for conversion to unsigned byte values.
Basically, this specifies the maximum value for the range of results when using `getByteFrequencyData()`
or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of maxDecibels
or higher will be returned as 255.

An exception will be thrown if set to less than or equal to maxDecibels.

**`defaultvalue`** -30 dB

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:158](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L158)

• `set` **maxDecibels**(`value`): `void`

Represents the maximum power value in the scaling range for the FFT analysis data,
for conversion to unsigned byte values.
Basically, this specifies the maximum value for the range of results when using `getByteFrequencyData()`
or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of maxDecibels
or higher will be returned as 255.

An exception will be thrown if set to less than or equal to maxDecibels.

**`defaultvalue`** -30 dB

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:162](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L162)

___

### minDecibels

• `get` **minDecibels**(): `number`

Represents the minimum power value in the scaling range for the FFT analysis data,
for conversion to unsigned byte values.
Basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()`
or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of minDecibels
or lower will be returned as 0.

An exception will be thrown if set to more than or equal to maxDecibels.

**`defaultvalue`** -100 dB

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:136](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L136)

• `set` **minDecibels**(`value`): `void`

Represents the minimum power value in the scaling range for the FFT analysis data,
for conversion to unsigned byte values.
Basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()`
or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of minDecibels
or lower will be returned as 0.

An exception will be thrown if set to more than or equal to maxDecibels.

**`defaultvalue`** -100 dB

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:140](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L140)

___

### samplesBetweenTransforms

• `get` **samplesBetweenTransforms**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:94](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L94)

• `set` **samplesBetweenTransforms**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:86](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L86)

___

### smoothingTimeConstant

• `get` **smoothingTimeConstant**(): `number`

Represents the averaging constant with the last analysis frame.
It's basically an average between the current buffer and the last buffer the AnalyserNode processed,
and results in a much smoother set of value changes over time.

**`defaultvalue`** 0. No averaging is applied.

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:177](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L177)

• `set` **smoothingTimeConstant**(`value`): `void`

Represents the averaging constant with the last analysis frame.
It's basically an average between the current buffer and the last buffer the AnalyserNode processed,
and results in a much smoother set of value changes over time.

**`defaultvalue`** 0. No averaging is applied.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:181](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L181)

___

### timeDomainSamplesCount

• `get` **timeDomainSamplesCount**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:110](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L110)

• `set` **timeDomainSamplesCount**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:102](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L102)

___

### windowFunction

• `get` **windowFunction**(): [`WindowFunctionTypes`](../enums/WindowFunctionTypes.md)

#### Returns

[`WindowFunctionTypes`](../enums/WindowFunctionTypes.md)

#### Defined in

[src/node/advanced-analyser-node.ts:122](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L122)

• `set` **windowFunction**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`WindowFunctionTypes`](../enums/WindowFunctionTypes.md) |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:114](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L114)

## Methods

### addEventListener

▸ **addEventListener**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`bytefrequencydata`](../enums/EventListenerTypes.md#bytefrequencydata) \| [`bytetimedomaindata`](../enums/EventListenerTypes.md#bytetimedomaindata) |
| `listener` | `Listener`<`Uint8Array`\> |

#### Returns

`void`

#### Overrides

window.AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:354](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L354)

▸ **addEventListener**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`frequencydata`](../enums/EventListenerTypes.md#frequencydata) \| [`timedomaindata`](../enums/EventListenerTypes.md#timedomaindata) |
| `listener` | `Listener`<`Float32Array`\> |

#### Returns

`void`

#### Overrides

window.AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:356](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L356)

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"processorerror"`` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Overrides

window.AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:359](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L359)

___

### connect

▸ **connect**(`destinationNode`, `output?`, `input?`): `AudioNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output?` | `number` |
| `input?` | `number` |

#### Returns

`AudioNode`

#### Inherited from

window.AudioWorkletNode.connect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2153

▸ **connect**(`destinationParam`, `output?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |
| `output?` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.connect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2154

___

### disconnect

▸ **disconnect**(): `void`

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2155

▸ **disconnect**(`output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2156

▸ **disconnect**(`destinationNode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2157

▸ **disconnect**(`destinationNode`, `output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2158

▸ **disconnect**(`destinationNode`, `output`, `input`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output` | `number` |
| `input` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2159

▸ **disconnect**(`destinationParam`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2160

▸ **disconnect**(`destinationParam`, `output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2161

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `boolean`

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`boolean`

#### Inherited from

window.AudioWorkletNode.dispatchEvent

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:4983

___

### getByteFrequencyData

▸ **getByteFrequencyData**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:316](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L316)

___

### getByteTimeDomainData

▸ **getByteTimeDomainData**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:324](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L324)

___

### getFloatFrequencyData

▸ **getFloatFrequencyData**(): `Promise`<`Float32Array`\>

#### Returns

`Promise`<`Float32Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:312](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L312)

___

### getFloatTimeDomainData

▸ **getFloatTimeDomainData**(): `Promise`<`Float32Array`\>

#### Returns

`Promise`<`Float32Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:320](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L320)

___

### onprocessorerror

▸ **onprocessorerror**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Event` |

#### Returns

`void`

#### Overrides

window.AudioWorkletNode.onprocessorerror

#### Defined in

[src/node/advanced-analyser-node.ts:253](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L253)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`EventListenerTypes`](../enums/EventListenerTypes.md) \| ``"processorerror"`` |
| `listener` | `EventListenerOrEventListenerObject` \| `Listener`<`ArrayBuffer`\> |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Overrides

window.AudioWorkletNode.removeEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:366](https://github.com/ju-faria/advanced-analyser-node/blob/e49d444/src/node/advanced-analyser-node.ts#L366)
