[advanced-analyser-node](../DOC.md) / EventListenerTypes

# Enumeration: EventListenerTypes

## Table of contents

### Enumeration members

- [bytefrequencydata](EventListenerTypes.md#bytefrequencydata)
- [bytetimedomaindata](EventListenerTypes.md#bytetimedomaindata)
- [frequencydata](EventListenerTypes.md#frequencydata)
- [timedomaindata](EventListenerTypes.md#timedomaindata)

## Enumeration members

### bytefrequencydata

• **bytefrequencydata** = `"bytefrequencydata"`

Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
The data is represented in bytes
Returns a Uint8Array with half the `fftSize`, with the current frequency data.

#### Defined in

[src/types.ts:114](https://github.com/ju-faria/advanced-analyser-node/blob/f2ab6f9/src/types.ts#L114)

___

### bytetimedomaindata

• **bytetimedomaindata** = `"bytetimedomaindata"`

Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
Returns a Uint8Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.

#### Defined in

[src/types.ts:124](https://github.com/ju-faria/advanced-analyser-node/blob/f2ab6f9/src/types.ts#L124)

___

### frequencydata

• **frequencydata** = `"frequencydata"`

Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
Returns a Float32Array with half the `fftSize`, with the current frequency data.

#### Defined in

[src/types.ts:108](https://github.com/ju-faria/advanced-analyser-node/blob/f2ab6f9/src/types.ts#L108)

___

### timedomaindata

• **timedomaindata** = `"timedomaindata"`

Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
Returns a Float32Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.

#### Defined in

[src/types.ts:119](https://github.com/ju-faria/advanced-analyser-node/blob/f2ab6f9/src/types.ts#L119)
