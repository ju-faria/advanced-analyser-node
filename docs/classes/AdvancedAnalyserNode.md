[advanced-analyser-node](../DOC.md) / AdvancedAnalyserNode

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

AudioWorkletNode.constructor

#### Defined in

[src/node/advanced-analyser-node.ts:203](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L203)

## Properties

### channelCount

• `Readonly` **channelCount**: `number`

#### Overrides

AudioWorkletNode.channelCount

#### Defined in

[src/node/advanced-analyser-node.ts:47](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L47)

___

### channelCountMode

• `Readonly` **channelCountMode**: `ChannelCountMode`

#### Overrides

AudioWorkletNode.channelCountMode

#### Defined in

[src/node/advanced-analyser-node.ts:53](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L53)

___

### channelInterpretation

• `Readonly` **channelInterpretation**: `ChannelInterpretation`

#### Overrides

AudioWorkletNode.channelInterpretation

#### Defined in

[src/node/advanced-analyser-node.ts:55](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L55)

___

### context

• `Readonly` **context**: `BaseAudioContext`

#### Inherited from

AudioWorkletNode.context

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2150

___

### numberOfInputs

• `Readonly` **numberOfInputs**: `number`

#### Overrides

AudioWorkletNode.numberOfInputs

#### Defined in

[src/node/advanced-analyser-node.ts:49](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L49)

___

### numberOfOutputs

• `Readonly` **numberOfOutputs**: `number`

#### Overrides

AudioWorkletNode.numberOfOutputs

#### Defined in

[src/node/advanced-analyser-node.ts:51](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L51)

___

### parameters

• `Readonly` **parameters**: `AudioParamMap`

#### Inherited from

AudioWorkletNode.parameters

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2253

___

### port

• `Readonly` **port**: `MessagePort`

#### Inherited from

AudioWorkletNode.port

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

[src/node/advanced-analyser-node.ts:64](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L64)

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

[src/node/advanced-analyser-node.ts:68](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L68)

___

### frequencyBinCount

• `get` **frequencyBinCount**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:99](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L99)

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

[src/node/advanced-analyser-node.ts:159](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L159)

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

[src/node/advanced-analyser-node.ts:163](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L163)

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

[src/node/advanced-analyser-node.ts:137](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L137)

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

[src/node/advanced-analyser-node.ts:141](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L141)

___

### samplesBetweenTransforms

• `get` **samplesBetweenTransforms**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:95](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L95)

• `set` **samplesBetweenTransforms**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:87](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L87)

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

[src/node/advanced-analyser-node.ts:178](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L178)

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

[src/node/advanced-analyser-node.ts:182](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L182)

___

### timeDomainSamplesCount

• `get` **timeDomainSamplesCount**(): `number`

#### Returns

`number`

#### Defined in

[src/node/advanced-analyser-node.ts:111](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L111)

• `set` **timeDomainSamplesCount**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:103](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L103)

___

### windowFunction

• `get` **windowFunction**(): [`WindowFunctionTypes`](../enums/WindowFunctionTypes.md)

#### Returns

[`WindowFunctionTypes`](../enums/WindowFunctionTypes.md)

#### Defined in

[src/node/advanced-analyser-node.ts:123](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L123)

• `set` **windowFunction**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`WindowFunctionTypes`](../enums/WindowFunctionTypes.md) |

#### Returns

`void`

#### Defined in

[src/node/advanced-analyser-node.ts:115](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L115)

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

AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:355](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L355)

▸ **addEventListener**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`frequencydata`](../enums/EventListenerTypes.md#frequencydata) \| [`timedomaindata`](../enums/EventListenerTypes.md#timedomaindata) |
| `listener` | `Listener`<`Float32Array`\> |

#### Returns

`void`

#### Overrides

AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:357](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L357)

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

AudioWorkletNode.addEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:360](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L360)

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

AudioWorkletNode.connect

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

AudioWorkletNode.connect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:2154

___

### disconnect

▸ **disconnect**(): `void`

#### Returns

`void`

#### Inherited from

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.disconnect

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

AudioWorkletNode.dispatchEvent

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:4983

___

### getByteFrequencyData

▸ **getByteFrequencyData**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:317](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L317)

___

### getByteTimeDomainData

▸ **getByteTimeDomainData**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:325](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L325)

___

### getFloatFrequencyData

▸ **getFloatFrequencyData**(): `Promise`<`Float32Array`\>

#### Returns

`Promise`<`Float32Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:313](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L313)

___

### getFloatTimeDomainData

▸ **getFloatTimeDomainData**(): `Promise`<`Float32Array`\>

#### Returns

`Promise`<`Float32Array`\>

#### Defined in

[src/node/advanced-analyser-node.ts:321](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L321)

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

AudioWorkletNode.onprocessorerror

#### Defined in

[src/node/advanced-analyser-node.ts:254](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L254)

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

AudioWorkletNode.removeEventListener

#### Defined in

[src/node/advanced-analyser-node.ts:367](https://github.com/ju-faria/advanced-analyser-node/blob/bc691c4/src/node/advanced-analyser-node.ts#L367)
