(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.advancedAnalyserNode = {}));
})(this, (function (exports) { 'use strict';

  var MessageTypes;
  (function (MessageTypes) {
      MessageTypes[MessageTypes["start"] = 0] = "start";
      MessageTypes[MessageTypes["stop"] = 1] = "stop";
      MessageTypes[MessageTypes["frequencyDataAvailable"] = 2] = "frequencyDataAvailable";
      MessageTypes[MessageTypes["byteFrequencyDataAvailable"] = 3] = "byteFrequencyDataAvailable";
      MessageTypes[MessageTypes["timeDomainDataAvailable"] = 4] = "timeDomainDataAvailable";
      MessageTypes[MessageTypes["byteTimeDomainDataAvailable"] = 5] = "byteTimeDomainDataAvailable";
      MessageTypes[MessageTypes["getFloatFrequencyData"] = 6] = "getFloatFrequencyData";
      MessageTypes[MessageTypes["requestedFloatFrequencyDataAvailable"] = 7] = "requestedFloatFrequencyDataAvailable";
      MessageTypes[MessageTypes["getByteFrequencyData"] = 8] = "getByteFrequencyData";
      MessageTypes[MessageTypes["requestedByteFrequencyDataAvailable"] = 9] = "requestedByteFrequencyDataAvailable";
      MessageTypes[MessageTypes["getFloatTimeDomainData"] = 10] = "getFloatTimeDomainData";
      MessageTypes[MessageTypes["requestedFloatTimeDomainDataAvailable"] = 11] = "requestedFloatTimeDomainDataAvailable";
      MessageTypes[MessageTypes["getByteTimeDomainData"] = 12] = "getByteTimeDomainData";
      MessageTypes[MessageTypes["requestedByteTimeDomainDataAvailable"] = 13] = "requestedByteTimeDomainDataAvailable";
      MessageTypes[MessageTypes["startedListeningTo"] = 14] = "startedListeningTo";
      MessageTypes[MessageTypes["stoppedListeningTo"] = 15] = "stoppedListeningTo";
  })(MessageTypes || (MessageTypes = {}));
  var ProcessorParameters;
  (function (ProcessorParameters) {
      ProcessorParameters["fftSize"] = "fftSize";
      ProcessorParameters["samplesBetweenTransforms"] = "samplesBetweenTransforms";
      ProcessorParameters["timeDomainSamplesCount"] = "timeDomainSamplesCount";
      ProcessorParameters["windowFunction"] = "windowFunction";
  })(ProcessorParameters || (ProcessorParameters = {}));
  var EventListenerTypes;
  (function (EventListenerTypes) {
      EventListenerTypes["frequencydata"] = "frequencydata";
      EventListenerTypes["bytefrequencydata"] = "bytefrequencydata";
      EventListenerTypes["timedomaindata"] = "timedomaindata";
      EventListenerTypes["bytetimedomaindata"] = "bytetimedomaindata";
  })(EventListenerTypes || (EventListenerTypes = {}));
  var WindowingFunctionTypes;
  (function (WindowingFunctionTypes) {
      WindowingFunctionTypes["rectangular"] = "rectangular";
      WindowingFunctionTypes["blackman"] = "blackman";
      WindowingFunctionTypes["nuttall"] = "nuttall";
      WindowingFunctionTypes["blackmanNuttall"] = "blackman-nuttall";
      WindowingFunctionTypes["blackmanHarris"] = "blackman-harris";
      WindowingFunctionTypes["hann"] = "hann";
      WindowingFunctionTypes["hamming"] = "hamming";
      WindowingFunctionTypes["bartlett"] = "bartlett";
  })(WindowingFunctionTypes || (WindowingFunctionTypes = {}));

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgaT0wLHM9MTt0aGlzLnNpemU+cztzPDw9MSlpKys7dGhpcy5fd2lkdGg9aSUyPT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGk9MDtpPHQubGVuZ3RoO2krPTIpYVtpPj4+MV09dFtpXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxpPTA7aTxhLmxlbmd0aDtpKz0yKWFbaV09dFtpPj4+MV0sYVtpKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEsaT0yO2k8YTtpKz0yKXRbZS1pXT10W2ldLHRbZS1pKzFdPS10W2krMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQsaT10aGlzLl9jc2l6ZSxzPTE8PHRoaXMuX3dpZHRoLG49aS9zPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8aTt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLHMpfWVsc2UgZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEscyl9dmFyIHI9dGhpcy5faW52Py0xOjEsbD10aGlzLnRhYmxlO2ZvcihzPj49MjtzPj0yO3M+Pj0yKXt2YXIgaD0obj1pL3M8PDEpPj4+Mjtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgZj10K2gsdT10LG09MDt1PGY7dSs9MixtKz1zKXtjb25zdCB0PXUsZT10K2gsaT1lK2gscz1pK2gsbj1hW3RdLG89YVt0KzFdLGY9YVtlXSxfPWFbZSsxXSxjPWFbaV0scD1hW2krMV0seT1hW3NdLGQ9YVtzKzFdLEQ9bixiPW8sZz1sW21dLFQ9cipsW20rMV0sRj1mKmctXypULHY9ZipUK18qZyxBPWxbMiptXSxxPXIqbFsyKm0rMV0sdz1jKkEtcCpxLE09YypxK3AqQSxDPWxbMyptXSxCPXIqbFszKm0rMV0sUz15KkMtZCpCLEw9eSpCK2QqQyxJPUQrdyx6PWIrTSxQPUQtdyxrPWItTSx4PUYrUyxOPXYrTCxXPXIqKEYtUyksTz1yKih2LUwpLFI9SSt4LFY9eitOLEU9SS14LFU9ei1OLGo9UCtPLEg9ay1XLEc9UC1PLEo9aytXO2FbdF09UixhW3QrMV09VixhW2VdPWosYVtlKzFdPUgsYVtpXT1FLGFbaSsxXT1VLGFbc109RyxhW3MrMV09Sn19fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3QgaT10aGlzLl9vdXQscz10aGlzLl9kYXRhLG49c1tlXSxvPXNbZSsxXSxyPXNbZSthXSxsPXNbZSthKzFdLGg9bityLGY9bytsLHU9bi1yLG09by1sO2lbdF09aCxpW3QrMV09ZixpW3QrMl09dSxpW3QrM109bX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IGk9dGhpcy5fb3V0LHM9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGw9c1tlXSxoPXNbZSsxXSxmPXNbZSthXSx1PXNbZSthKzFdLG09c1tlK29dLF89c1tlK28rMV0sYz1zW2Urcl0scD1zW2UrcisxXSx5PWwrbSxkPWgrXyxEPWwtbSxiPWgtXyxnPWYrYyxUPXUrcCxGPW4qKGYtYyksdj1uKih1LXApLEE9eStnLHE9ZCtULHc9RCt2LE09Yi1GLEM9eS1nLEI9ZC1ULFM9RC12LEw9YitGO2lbdF09QSxpW3QrMV09cSxpW3QrMl09dyxpW3QrM109TSxpW3QrNF09QyxpW3QrNV09QixpW3QrNl09UyxpW3QrN109TH0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxpPXRoaXMuX2NzaXplLHM9MTw8dGhpcy5fd2lkdGgsbj1pL3M8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxzPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGk7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLHM+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxsPXRoaXMudGFibGU7Zm9yKHM+Pj0yO3M+PTI7cz4+PTIpe3ZhciBoPShuPWkvczw8MSk+Pj4xLGY9aD4+PjEsdT1mPj4+MTtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgbT0wLF89MDttPD11O20rPTIsXys9cyl7dmFyIGM9dCttLHA9YytmLHk9cCtmLGQ9eStmLEQ9YVtjXSxiPWFbYysxXSxnPWFbcF0sVD1hW3ArMV0sRj1hW3ldLHY9YVt5KzFdLEE9YVtkXSxxPWFbZCsxXSx3PUQsTT1iLEM9bFtfXSxCPXIqbFtfKzFdLFM9ZypDLVQqQixMPWcqQitUKkMsST1sWzIqX10sej1yKmxbMipfKzFdLFA9RipJLXYqeixrPUYqeit2KkkseD1sWzMqX10sTj1yKmxbMypfKzFdLFc9QSp4LXEqTixPPUEqTitxKngsUj13K1AsVj1NK2ssRT13LVAsVT1NLWssaj1TK1csSD1MK08sRz1yKihTLVcpLEo9ciooTC1PKSxLPVIraixRPVYrSCxYPUUrSixZPVUtRztpZihhW2NdPUssYVtjKzFdPVEsYVtwXT1YLGFbcCsxXT1ZLDAhPT1tKXtpZihtIT09dSl7dmFyIFo9RSstcipKLCQ9LVUrLXIqRyx0dD1SKy1yKmosZXQ9LVYtIC1yKkgsYXQ9dCtmLW0saXQ9dCtoLW07YVthdF09WixhW2F0KzFdPSQsYVtpdF09dHQsYVtpdCsxXT1ldH19ZWxzZXt2YXIgc3Q9Ui1qLG50PVYtSDthW3ldPXN0LGFbeSsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj1zW2VdLG89c1tlK2FdLHI9bitvLGw9bi1vO2lbdF09cixpW3QrMV09MCxpW3QrMl09bCxpW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxsPXNbZV0saD1zW2UrYV0sZj1zW2Urb10sdT1zW2Urcl0sbT1sK2YsXz1sLWYsYz1oK3UscD1uKihoLXUpLHk9bStjLGQ9XyxEPS1wLGI9bS1jLGc9XyxUPXA7aVt0XT15LGlbdCsxXT0wLGlbdCsyXT1kLGlbdCszXT1ELGlbdCs0XT1iLGlbdCs1XT0wLGlbdCs2XT1nLGlbdCs3XT1UfTt2YXIgaSxzLG4sbzshZnVuY3Rpb24odCl7dFt0LnN0YXJ0PTBdPSJzdGFydCIsdFt0LnN0b3A9MV09InN0b3AiLHRbdC5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTJdPSJmcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGU9M109ImJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QudGltZURvbWFpbkRhdGFBdmFpbGFibGU9NF09InRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuYnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTVdPSJieXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUiLHRbdC5nZXRGbG9hdEZyZXF1ZW5jeURhdGE9Nl09ImdldEZsb2F0RnJlcXVlbmN5RGF0YSIsdFt0LnJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZT03XT0icmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGE9OF09ImdldEJ5dGVGcmVxdWVuY3lEYXRhIix0W3QucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGU9OV09InJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YT0xMF09ImdldEZsb2F0VGltZURvbWFpbkRhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTExXT0icmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVUaW1lRG9tYWluRGF0YT0xMl09ImdldEJ5dGVUaW1lRG9tYWluRGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZT0xM109InJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LnN0YXJ0ZWRMaXN0ZW5pbmdUbz0xNF09InN0YXJ0ZWRMaXN0ZW5pbmdUbyIsdFt0LnN0b3BwZWRMaXN0ZW5pbmdUbz0xNV09InN0b3BwZWRMaXN0ZW5pbmdUbyJ9KGl8fChpPXt9KSksZnVuY3Rpb24odCl7dC5mZnRTaXplPSJmZnRTaXplIix0LnNhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz0ic2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zIix0LnRpbWVEb21haW5TYW1wbGVzQ291bnQ9InRpbWVEb21haW5TYW1wbGVzQ291bnQiLHQud2luZG93RnVuY3Rpb249IndpbmRvd0Z1bmN0aW9uIn0oc3x8KHM9e30pKSxmdW5jdGlvbih0KXt0LmZyZXF1ZW5jeWRhdGE9ImZyZXF1ZW5jeWRhdGEiLHQuYnl0ZWZyZXF1ZW5jeWRhdGE9ImJ5dGVmcmVxdWVuY3lkYXRhIix0LnRpbWVkb21haW5kYXRhPSJ0aW1lZG9tYWluZGF0YSIsdC5ieXRldGltZWRvbWFpbmRhdGE9ImJ5dGV0aW1lZG9tYWluZGF0YSJ9KG58fChuPXt9KSksZnVuY3Rpb24odCl7dC5yZWN0YW5ndWxhcj0icmVjdGFuZ3VsYXIiLHQuYmxhY2ttYW49ImJsYWNrbWFuIix0Lm51dHRhbGw9Im51dHRhbGwiLHQuYmxhY2ttYW5OdXR0YWxsPSJibGFja21hbi1udXR0YWxsIix0LmJsYWNrbWFuSGFycmlzPSJibGFja21hbi1oYXJyaXMiLHQuaGFubj0iaGFubiIsdC5oYW1taW5nPSJoYW1taW5nIix0LmJhcnRsZXR0PSJiYXJ0bGV0dCJ9KG98fChvPXt9KSk7Y29uc3Qgcj0odCxlKT0+LjUtLjUqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpLGw9KHQsZSk9Pi41NC0uNDYqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpLGg9KHQsZSk9Pi40Mi0uNSpNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSkrLjA4Kk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKSxmPSh0LGUpPT4uMzU1NzY4LS40ODczOTYqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4xNDQyMzIqTWF0aC5jb3MoNCpNYXRoLlBJKnQvKGUtMSkpLS4wMTI2MDQqTWF0aC5jb3MoNipNYXRoLlBJKnQvKGUtMSkpLHU9KHQsZSk9Pi4zNTg3NS0uNDg4MjkqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4xNDEyOCpNYXRoLmNvcyg0Kk1hdGguUEkqdC8oZS0xKSktLjAxMTY4Kk1hdGguY29zKDYqTWF0aC5QSSp0LyhlLTEpKSxtPSh0LGUpPT4uMzYzNTgxOS0uNDg5MTc3NSpNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSkrLjEzNjU5OTUqTWF0aC5jb3MoNCpNYXRoLlBJKnQvKGUtMSkpLS4wMTA2NDExKk1hdGguY29zKDYqTWF0aC5QSSp0LyhlLTEpKSxfPSh0LGUpPT4xLU1hdGguYWJzKDIqKHQtLjUqKGUtMSkpLyhlLTEpKSxjPSh0LGUsYSk9Pntjb25zdCBpPXQubGVuZ3RoO2ZvcihsZXQgcz0wO3M8aTsrK3MpdFtzXT10W3NdKmUocyxpLGEpfSxwPXtbby5yZWN0YW5ndWxhcl06KCk9Pnt9LFtvLmhhbm5dOnQ9PmModCxyKSxbby5oYW1taW5nXTp0PT5jKHQsbCksW28uYmxhY2ttYW5dOnQ9PmModCxoKSxbby5ibGFja21hbk51dHRhbGxdOnQ9PmModCxtKSxbby5ibGFja21hbkhhcnJpc106dD0+Yyh0LHUpLFtvLm51dHRhbGxdOnQ9PmModCxmKSxbby5iYXJ0bGV0dF06dD0+Yyh0LF8pfSx5PXQ9PjIwKk1hdGgubG9nMTAodCksZD0odCxlLGEpPT5NYXRoLm1pbihNYXRoLm1heCh0LGUpLGEpO2NsYXNzIEQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7X3NhbXBsZXNDb3VudD0wO19jb3VudD0wO19maXJzdD0hMDtfZmZ0QW5hbHlzZXI7X2ZmdFNpemU7X2ZmdElucHV0O19mZnRPdXRwdXQ7X2xhc3RUcmFuc2Zvcm07X3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcztfd2luZG93RnVuY3Rpb25UeXBlPW8uYmxhY2ttYW47X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITEsdGltZWRvbWFpbmRhdGE6ITEsYnl0ZXRpbWVkb21haW5kYXRhOiExfTtfYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkoMzI3NjgpO19taW5EZWNpYmVscz0tMTAwO19tYXhEZWNpYmVscz0tMzA7X3Ntb290aGluZ1RpbWVDb25zdGFudD0wO19wb3J0TWFwPW5ldyBNYXA7X3RpbWVEb21haW5TYW1wbGVzQ291bnRWYWx1ZTtnZXQgX2ZyZXF1ZW5jeUJpbkNvdW50KCl7cmV0dXJuIHRoaXMuX2ZmdFNpemUvMn1zZXQgZnJlcXVlbmN5QmluQ291bnQodCl7dGhpcy5fZmZ0U2l6ZT0yKnR9Z2V0IF9pc0xpc3RlbmluZ1RvRnJlcXVlbmN5RGF0YSgpe3JldHVybiB0aGlzLl9pc0xpc3RlbmluZ1RvLmZyZXF1ZW5jeWRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGF9Z2V0IF9pc0xpc3RlbmluZ1RvVGltZURvbWFpbkRhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUby50aW1lZG9tYWluZGF0YXx8dGhpcy5faXNMaXN0ZW5pbmdUby5ieXRldGltZWRvbWFpbmRhdGF9Z2V0IF90aW1lRG9tYWluU2FtcGxlc0NvdW50KCl7cmV0dXJuIHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnRWYWx1ZXx8dGhpcy5fZmZ0U2l6ZX1zZXQgX3RpbWVEb21haW5TYW1wbGVzQ291bnQodCl7dGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudFZhbHVlPXR9c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiaXNSZWNvcmRpbmciLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IodCl7c3VwZXIoKTtjb25zdHtmZnRTaXplOmUsc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zOmksdGltZURvbWFpblNhbXBsZXNDb3VudDpzLHdpbmRvd0Z1bmN0aW9uOm49by5ibGFja21hbn09dC5wcm9jZXNzb3JPcHRpb25zO3RoaXMuX2ZmdEFuYWx5c2VyPW5ldyBhKGUpLHRoaXMuX2ZmdElucHV0PW5ldyBGbG9hdDMyQXJyYXkoZSksdGhpcy5fZmZ0T3V0cHV0PXRoaXMuX2ZmdEFuYWx5c2VyLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuX2ZmdFNpemU9ZSx0aGlzLl9sYXN0VHJhbnNmb3JtPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpLHRoaXMuX3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz1pfHxlLHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnRWYWx1ZT1zLHRoaXMuX3NhbXBsZXNDb3VudD0wLHRoaXMuX3dpbmRvd0Z1bmN0aW9uVHlwZT1uLHRoaXMucG9ydC5vbm1lc3NhZ2U9dD0+dGhpcy5fb25tZXNzYWdlKHQuZGF0YSl9X29ubWVzc2FnZSh0KXtzd2l0Y2godC50eXBlKXtjYXNlIGkuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhOnRoaXMuX2dldEZsb2F0RnJlcXVlbmN5RGF0YSh0LmlkKTticmVhaztjYXNlIGkuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGE6dGhpcy5fZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodC5pZCk7YnJlYWs7Y2FzZSBpLmdldEZsb2F0VGltZURvbWFpbkRhdGE6dGhpcy5fZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIGkuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhOnRoaXMuX2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIGkuc3RhcnRlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMDticmVhaztjYXNlIGkuc3RvcHBlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMX19X3Bvc3RNZXNzYWdlKHQsZSl7dGhpcy5wb3J0LnBvc3RNZXNzYWdlKHQsZSl9X3Nob3VsZEZsdXNoRnJlcXVlbmNpZXMoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUb0ZyZXF1ZW5jeURhdGEmJnRoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9PTB9X3Nob3VsZEZsdXNoVGltZURvbWFpbkRhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUb1RpbWVEb21haW5EYXRhJiZ0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudD09MH1fYXBwZW5kVG9CdWZmZXIodCl7dGhpcy5fYnVmZmVyW3RoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl9idWZmZXIubGVuZ3RoXT10LHRoaXMuX3NhbXBsZXNDb3VudD10aGlzLl9zYW1wbGVzQ291bnQrMSx0aGlzLl9zaG91bGRGbHVzaEZyZXF1ZW5jaWVzKCkmJnRoaXMuX2ZsdXNoRnJlcXVlbmNpZXMoKSx0aGlzLl9zaG91bGRGbHVzaFRpbWVEb21haW5EYXRhKCkmJnRoaXMuX2ZsdXNoVGltZURvbWFpblNhbXBsZXMoKX1fdXBkYXRlRmZ0SW5wdXQoKXt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHRoaXMuX2ZmdElucHV0KSxwW3RoaXMuX3dpbmRvd0Z1bmN0aW9uVHlwZV0odGhpcy5fZmZ0SW5wdXQpfV9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHQpe2NvbnN0IGU9dC5sZW5ndGgsYT0odGhpcy5fc2FtcGxlc0NvdW50LWUpJXRoaXMuX2J1ZmZlci5sZW5ndGg7Zm9yKGxldCBpPTA7aTxlO2krKyl0W2ldPWEraTwwPzA6dGhpcy5fYnVmZmVyWyhhK2kpJXRoaXMuX2J1ZmZlci5sZW5ndGhdfV9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3QgYT10aGlzLl9sYXN0VHJhbnNmb3JtO2ZvcihsZXQgaT0wO2k8ZTsrK2kpdFtpXT15KGFbaV0pfX1fY29udmVydEZyZXF1ZW5jaWVzVG9CeXRlRGF0YSh0KXtjb25zdCBlPU1hdGgubWluKHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoLHQubGVuZ3RoKTtpZihlPjApe2NvbnN0IGE9dGhpcy5fbGFzdFRyYW5zZm9ybSxpPTEvKHRoaXMuX21heERlY2liZWxzLXRoaXMuX21pbkRlY2liZWxzKTtmb3IobGV0IHM9MDtzPGU7KytzKXtjb25zdCBlPWFbc10sbj0yNTUqKHkoZSktdGhpcy5fbWluRGVjaWJlbHMpKmk7dFtzXT1kKDB8biwwLDI1NSl9fX1fY29udmVydFRpbWVEb21haW5EYXRhVG9CeXRlRGF0YSh0LGUpe2ZvcihsZXQgYT0wO2E8dC5sZW5ndGg7KythKWVbYV09ZCgxMjgqKHRbYV0rMSl8MCwwLDI1NSl9X2RvRmZ0KCl7dGhpcy5fZmZ0QW5hbHlzZXIucmVhbFRyYW5zZm9ybSh0aGlzLl9mZnRPdXRwdXQsdGhpcy5fZmZ0SW5wdXQpO2NvbnN0IHQ9MS90aGlzLl9mZnRTaXplLGU9ZCh0aGlzLl9zbW9vdGhpbmdUaW1lQ29uc3RhbnQsMCwxKTtmb3IobGV0IGE9MDthPHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoO2ErKyl7Y29uc3QgaT1NYXRoLmFicyhNYXRoLmh5cG90KHRoaXMuX2ZmdE91dHB1dFsyKmFdLHRoaXMuX2ZmdE91dHB1dFsyKmErMV0pKSp0O3RoaXMuX2xhc3RUcmFuc2Zvcm1bYV09ZSp0aGlzLl9sYXN0VHJhbnNmb3JtW2FdKygxLWUpKml9fV9mbHVzaEZyZXF1ZW5jaWVzKCl7aWYodGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9kb0ZmdCgpLHRoaXMuX2lzTGlzdGVuaW5nVG8uZnJlcXVlbmN5ZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkuZnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX1pZih0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGVmcmVxdWVuY3lkYXRhKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDp0LmJ1ZmZlcn0sW3QuYnVmZmVyXSl9fV9mbHVzaFRpbWVEb21haW5TYW1wbGVzKCl7aWYodGhpcy5faXNMaXN0ZW5pbmdUby50aW1lZG9tYWluZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS50aW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX1pZih0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGV0aW1lZG9tYWluZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCk7Y29uc3QgZT1uZXcgVWludDhBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9jb252ZXJ0VGltZURvbWFpbkRhdGFUb0J5dGVEYXRhKHQsZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS5ieXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9fV9nZXRGbG9hdEZyZXF1ZW5jeURhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCksdGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9EYihlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfV9nZXRCeXRlRnJlcXVlbmN5RGF0YSh0KXt0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCk7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXMoZSk7Y29uc3QgYT1uZXcgVWludDhBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCk7dGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9CeXRlRGF0YShhKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDphLmJ1ZmZlcn0sW2EuYnVmZmVyXSl9X2dldEZsb2F0VGltZURvbWFpbkRhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXMoZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTppLnJlcXVlc3RlZEZsb2F0VGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9X2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKTtjb25zdCBhPW5ldyBVaW50OEFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2NvbnZlcnRUaW1lRG9tYWluRGF0YVRvQnl0ZURhdGEoZSxhKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6YS5idWZmZXJ9LFthLmJ1ZmZlcl0pfXByb2Nlc3ModCxlLGEpe2NvbnN0IGk9YS5pc1JlY29yZGluZztmb3IobGV0IGU9MDtlPHQubGVuZ3RoO2UrKyl7aWYoMT09PWlbZV0mJnRbMF1bMF0pZm9yKGxldCBlPTA7ZTx0WzBdWzBdLmxlbmd0aDtlKyspdGhpcy5fYXBwZW5kVG9CdWZmZXIodFswXVswXVtlXSl9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJBZHZhbmNlZEFuYWx5c2VyUHJvY2Vzc29yIixEKSx0LkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3I9RCxPYmplY3QuZGVmaW5lUHJvcGVydHkodCwiX19lc01vZHVsZSIse3ZhbHVlOiEwfSl9KSk7Cg==";

  const PROCESSOR_NAME = 'AdvancedAnalyserProcessor';

  class AdvancedAnalyserNode extends AudioWorkletNode {
      _portMapId = 0;
      _portMap = new Map();
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
          [EventListenerTypes.timedomaindata]: [],
          [EventListenerTypes.bytetimedomaindata]: [],
      };
      constructor(context, { fftSize = 1024, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction = WindowingFunctionTypes.blackman }) {
          super(context, PROCESSOR_NAME, {
              processorOptions: {
                  [ProcessorParameters.fftSize]: fftSize,
                  [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
                  [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
                  [ProcessorParameters.windowFunction]: windowFunction,
              },
              numberOfInputs: 1,
              numberOfOutputs: 1,
              channelCount: 1,
              channelCountMode: "max",
              channelInterpretation: "speakers",
          });
          this.port.onmessage = (event) => this._onmessage(event.data);
      }
      _uniqId() {
          return this._portMapId++;
      }
      _postMessage(message, transfer) {
          this.port.postMessage(message, transfer);
      }
      onprocessorerror = (err) => {
          console.log(`An error from AudioWorkletProcessor.process() occurred: ${err}`);
      };
      _onmessage(event) {
          switch (event.type) {
              case MessageTypes.frequencyDataAvailable: {
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.frequencydata, { detail: new Float32Array(event.payload) }));
                  break;
              }
              case MessageTypes.byteFrequencyDataAvailable: {
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.bytefrequencydata, { detail: new Uint8Array(event.payload) }));
                  break;
              }
              case MessageTypes.timeDomainDataAvailable: {
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.timedomaindata, { detail: new Float32Array(event.payload) }));
                  break;
              }
              case MessageTypes.byteTimeDomainDataAvailable: {
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.bytetimedomaindata, { detail: new Uint8Array(event.payload) }));
                  break;
              }
              case MessageTypes.requestedFloatFrequencyDataAvailable:
              case MessageTypes.requestedByteFrequencyDataAvailable:
              case MessageTypes.requestedFloatTimeDomainDataAvailable:
              case MessageTypes.requestedByteTimeDomainDataAvailable: {
                  const { id, payload } = event;
                  const resolve = this._portMap.get(id);
                  this._portMap.delete(id);
                  resolve(payload);
                  break;
              }
          }
      }
      _postIdentifiedDataRequest(requestType) {
          return new Promise(resolve => {
              const id = this._uniqId();
              this._portMap.set(id, (buffer) => {
                  if (requestType === MessageTypes.getByteFrequencyData
                      || requestType === MessageTypes.getByteTimeDomainData) {
                      resolve(new Uint8Array(buffer));
                  }
                  else {
                      resolve(new Float32Array(buffer));
                  }
              });
              this._postMessage({
                  id,
                  type: requestType
              });
          });
      }
      getFloatFrequencyData() {
          return this._postIdentifiedDataRequest(MessageTypes.getFloatFrequencyData);
      }
      getByteFrequencyData() {
          return this._postIdentifiedDataRequest(MessageTypes.getByteFrequencyData);
      }
      getFloatTimeDomainData() {
          return this._postIdentifiedDataRequest(MessageTypes.getFloatTimeDomainData);
      }
      getByteTimeDomainData() {
          return this._postIdentifiedDataRequest(MessageTypes.getByteTimeDomainData);
      }
      start() {
          this.parameters.get('isRecording').setValueAtTime(1, this.context.currentTime);
      }
      _pushEventListener(type, listener) {
          const listeners = this._eventListenersCount[type];
          listeners.push(listener);
          if (listeners.length === 1) {
              this._postMessage({
                  type: MessageTypes.startedListeningTo,
                  payload: type
              });
          }
      }
      _removeEventListener(type, listener) {
          const listeners = this._eventListenersCount[type];
          const index = listeners.indexOf(listener);
          if (index === -1)
              return;
          listeners.splice(index, 1);
          if (listeners.length === 0) {
              this._postMessage({
                  type: MessageTypes.stoppedListeningTo,
                  payload: type
              });
          }
      }
      addEventListener(type, listener, options) {
          super.addEventListener(type, listener, options);
          if (type !== 'processorerror' && typeof this._eventListenersCount[type] !== 'undefined')
              this._pushEventListener(type, listener);
      }
      removeEventListener(type, listener, options) {
          super.removeEventListener(type, listener, options);
          if (type !== 'processorerror' && typeof this._eventListenersCount[type] !== 'undefined')
              this._removeEventListener(type, listener);
      }
  }
  const createAdvancedAnalyserNode = async (context, options) => {
      const processorUrl = 'data:application/javascript;base64,' + processor;
      await context.audioWorklet.addModule(processorUrl);
      const advancedAnalyser = new AdvancedAnalyserNode(context, {
          ...options,
      });
      return advancedAnalyser;
  };

  exports.AdvancedAnalyserNode = AdvancedAnalyserNode;
  exports.createAdvancedAnalyserNode = createAdvancedAnalyserNode;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
