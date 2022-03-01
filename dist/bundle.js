(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.advancedAnalyserNode = {}));
})(this, (function (exports) { 'use strict';

  var MessageTypes;
  (function (MessageTypes) {
      MessageTypes[MessageTypes["start"] = 0] = "start";
      MessageTypes[MessageTypes["stop"] = 1] = "stop";
      MessageTypes[MessageTypes["updateProcessorOptions"] = 2] = "updateProcessorOptions";
      MessageTypes[MessageTypes["frequencyDataAvailable"] = 3] = "frequencyDataAvailable";
      MessageTypes[MessageTypes["byteFrequencyDataAvailable"] = 4] = "byteFrequencyDataAvailable";
      MessageTypes[MessageTypes["timeDomainDataAvailable"] = 5] = "timeDomainDataAvailable";
      MessageTypes[MessageTypes["byteTimeDomainDataAvailable"] = 6] = "byteTimeDomainDataAvailable";
      MessageTypes[MessageTypes["getFloatFrequencyData"] = 7] = "getFloatFrequencyData";
      MessageTypes[MessageTypes["requestedFloatFrequencyDataAvailable"] = 8] = "requestedFloatFrequencyDataAvailable";
      MessageTypes[MessageTypes["getByteFrequencyData"] = 9] = "getByteFrequencyData";
      MessageTypes[MessageTypes["requestedByteFrequencyDataAvailable"] = 10] = "requestedByteFrequencyDataAvailable";
      MessageTypes[MessageTypes["getFloatTimeDomainData"] = 11] = "getFloatTimeDomainData";
      MessageTypes[MessageTypes["requestedFloatTimeDomainDataAvailable"] = 12] = "requestedFloatTimeDomainDataAvailable";
      MessageTypes[MessageTypes["getByteTimeDomainData"] = 13] = "getByteTimeDomainData";
      MessageTypes[MessageTypes["requestedByteTimeDomainDataAvailable"] = 14] = "requestedByteTimeDomainDataAvailable";
      MessageTypes[MessageTypes["startedListeningTo"] = 15] = "startedListeningTo";
      MessageTypes[MessageTypes["stoppedListeningTo"] = 16] = "stoppedListeningTo";
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
  var WindowFunctionTypes;
  (function (WindowFunctionTypes) {
      WindowFunctionTypes["rectangular"] = "rectangular";
      WindowFunctionTypes["blackman"] = "blackman";
      WindowFunctionTypes["nuttall"] = "nuttall";
      WindowFunctionTypes["blackmanNuttall"] = "blackman-nuttall";
      WindowFunctionTypes["blackmanHarris"] = "blackman-harris";
      WindowFunctionTypes["hann"] = "hann";
      WindowFunctionTypes["hamming"] = "hamming";
      WindowFunctionTypes["bartlett"] = "bartlett";
  })(WindowFunctionTypes || (WindowFunctionTypes = {}));
  // export interface AdvancedAnalyserNode {
  //   addEventListener: AddEventListenerTypes
  // }

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgaT0wLHM9MTt0aGlzLnNpemU+cztzPDw9MSlpKys7dGhpcy5fd2lkdGg9aSUyPT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGk9MDtpPHQubGVuZ3RoO2krPTIpYVtpPj4+MV09dFtpXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxpPTA7aTxhLmxlbmd0aDtpKz0yKWFbaV09dFtpPj4+MV0sYVtpKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEsaT0yO2k8YTtpKz0yKXRbZS1pXT10W2ldLHRbZS1pKzFdPS10W2krMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQsaT10aGlzLl9jc2l6ZSxzPTE8PHRoaXMuX3dpZHRoLG49aS9zPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8aTt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLHMpfWVsc2UgZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEscyl9dmFyIHI9dGhpcy5faW52Py0xOjEsbD10aGlzLnRhYmxlO2ZvcihzPj49MjtzPj0yO3M+Pj0yKXt2YXIgaD0obj1pL3M8PDEpPj4+Mjtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgZj10K2gsdT10LG09MDt1PGY7dSs9MixtKz1zKXtjb25zdCB0PXUsZT10K2gsaT1lK2gscz1pK2gsbj1hW3RdLG89YVt0KzFdLGY9YVtlXSxfPWFbZSsxXSxjPWFbaV0scD1hW2krMV0seT1hW3NdLGQ9YVtzKzFdLGI9bixEPW8sZz1sW21dLFQ9cipsW20rMV0sRj1mKmctXypULHY9ZipUK18qZyxBPWxbMiptXSxxPXIqbFsyKm0rMV0sdz1jKkEtcCpxLE09YypxK3AqQSxCPWxbMyptXSxDPXIqbFszKm0rMV0sUz15KkItZCpDLEw9eSpDK2QqQixJPWIrdyx6PUQrTSxQPWItdyxrPUQtTSx4PUYrUyxOPXYrTCxPPXIqKEYtUyksVz1yKih2LUwpLFI9SSt4LEU9eitOLFU9SS14LGo9ei1OLEg9UCtXLFY9ay1PLEc9UC1XLEo9aytPO2FbdF09UixhW3QrMV09RSxhW2VdPUgsYVtlKzFdPVYsYVtpXT1VLGFbaSsxXT1qLGFbc109RyxhW3MrMV09Sn19fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3QgaT10aGlzLl9vdXQscz10aGlzLl9kYXRhLG49c1tlXSxvPXNbZSsxXSxyPXNbZSthXSxsPXNbZSthKzFdLGg9bityLGY9bytsLHU9bi1yLG09by1sO2lbdF09aCxpW3QrMV09ZixpW3QrMl09dSxpW3QrM109bX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IGk9dGhpcy5fb3V0LHM9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGw9c1tlXSxoPXNbZSsxXSxmPXNbZSthXSx1PXNbZSthKzFdLG09c1tlK29dLF89c1tlK28rMV0sYz1zW2Urcl0scD1zW2UrcisxXSx5PWwrbSxkPWgrXyxiPWwtbSxEPWgtXyxnPWYrYyxUPXUrcCxGPW4qKGYtYyksdj1uKih1LXApLEE9eStnLHE9ZCtULHc9Yit2LE09RC1GLEI9eS1nLEM9ZC1ULFM9Yi12LEw9RCtGO2lbdF09QSxpW3QrMV09cSxpW3QrMl09dyxpW3QrM109TSxpW3QrNF09QixpW3QrNV09QyxpW3QrNl09UyxpW3QrN109TH0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxpPXRoaXMuX2NzaXplLHM9MTw8dGhpcy5fd2lkdGgsbj1pL3M8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxzPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGk7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLHM+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxsPXRoaXMudGFibGU7Zm9yKHM+Pj0yO3M+PTI7cz4+PTIpe3ZhciBoPShuPWkvczw8MSk+Pj4xLGY9aD4+PjEsdT1mPj4+MTtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgbT0wLF89MDttPD11O20rPTIsXys9cyl7dmFyIGM9dCttLHA9YytmLHk9cCtmLGQ9eStmLGI9YVtjXSxEPWFbYysxXSxnPWFbcF0sVD1hW3ArMV0sRj1hW3ldLHY9YVt5KzFdLEE9YVtkXSxxPWFbZCsxXSx3PWIsTT1ELEI9bFtfXSxDPXIqbFtfKzFdLFM9ZypCLVQqQyxMPWcqQytUKkIsST1sWzIqX10sej1yKmxbMipfKzFdLFA9RipJLXYqeixrPUYqeit2KkkseD1sWzMqX10sTj1yKmxbMypfKzFdLE89QSp4LXEqTixXPUEqTitxKngsUj13K1AsRT1NK2ssVT13LVAsaj1NLWssSD1TK08sVj1MK1csRz1yKihTLU8pLEo9ciooTC1XKSxLPVIrSCxRPUUrVixYPVUrSixZPWotRztpZihhW2NdPUssYVtjKzFdPVEsYVtwXT1YLGFbcCsxXT1ZLDAhPT1tKXtpZihtIT09dSl7dmFyIFo9VSstcipKLCQ9LWorLXIqRyx0dD1SKy1yKkgsZXQ9LUUtIC1yKlYsYXQ9dCtmLW0saXQ9dCtoLW07YVthdF09WixhW2F0KzFdPSQsYVtpdF09dHQsYVtpdCsxXT1ldH19ZWxzZXt2YXIgc3Q9Ui1ILG50PUUtVjthW3ldPXN0LGFbeSsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj1zW2VdLG89c1tlK2FdLHI9bitvLGw9bi1vO2lbdF09cixpW3QrMV09MCxpW3QrMl09bCxpW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxsPXNbZV0saD1zW2UrYV0sZj1zW2Urb10sdT1zW2Urcl0sbT1sK2YsXz1sLWYsYz1oK3UscD1uKihoLXUpLHk9bStjLGQ9XyxiPS1wLEQ9bS1jLGc9XyxUPXA7aVt0XT15LGlbdCsxXT0wLGlbdCsyXT1kLGlbdCszXT1iLGlbdCs0XT1ELGlbdCs1XT0wLGlbdCs2XT1nLGlbdCs3XT1UfTt2YXIgaSxzLG4sbzshZnVuY3Rpb24odCl7dFt0LnN0YXJ0PTBdPSJzdGFydCIsdFt0LnN0b3A9MV09InN0b3AiLHRbdC51cGRhdGVQcm9jZXNzb3JPcHRpb25zPTJdPSJ1cGRhdGVQcm9jZXNzb3JPcHRpb25zIix0W3QuZnJlcXVlbmN5RGF0YUF2YWlsYWJsZT0zXT0iZnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTRdPSJieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LnRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTVdPSJ0aW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZT02XT0iYnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhPTddPSJnZXRGbG9hdEZyZXF1ZW5jeURhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGU9OF09InJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVGcmVxdWVuY3lEYXRhPTldPSJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTEwXT0icmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5nZXRGbG9hdFRpbWVEb21haW5EYXRhPTExXT0iZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSIsdFt0LnJlcXVlc3RlZEZsb2F0VGltZURvbWFpbkRhdGFBdmFpbGFibGU9MTJdPSJyZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhPTEzXT0iZ2V0Qnl0ZVRpbWVEb21haW5EYXRhIix0W3QucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTE0XT0icmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3Quc3RhcnRlZExpc3RlbmluZ1RvPTE1XT0ic3RhcnRlZExpc3RlbmluZ1RvIix0W3Quc3RvcHBlZExpc3RlbmluZ1RvPTE2XT0ic3RvcHBlZExpc3RlbmluZ1RvIn0oaXx8KGk9e30pKSxmdW5jdGlvbih0KXt0LmZmdFNpemU9ImZmdFNpemUiLHQuc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPSJzYW1wbGVzQmV0d2VlblRyYW5zZm9ybXMiLHQudGltZURvbWFpblNhbXBsZXNDb3VudD0idGltZURvbWFpblNhbXBsZXNDb3VudCIsdC53aW5kb3dGdW5jdGlvbj0id2luZG93RnVuY3Rpb24ifShzfHwocz17fSkpLGZ1bmN0aW9uKHQpe3QuZnJlcXVlbmN5ZGF0YT0iZnJlcXVlbmN5ZGF0YSIsdC5ieXRlZnJlcXVlbmN5ZGF0YT0iYnl0ZWZyZXF1ZW5jeWRhdGEiLHQudGltZWRvbWFpbmRhdGE9InRpbWVkb21haW5kYXRhIix0LmJ5dGV0aW1lZG9tYWluZGF0YT0iYnl0ZXRpbWVkb21haW5kYXRhIn0obnx8KG49e30pKSxmdW5jdGlvbih0KXt0LnJlY3Rhbmd1bGFyPSJyZWN0YW5ndWxhciIsdC5ibGFja21hbj0iYmxhY2ttYW4iLHQubnV0dGFsbD0ibnV0dGFsbCIsdC5ibGFja21hbk51dHRhbGw9ImJsYWNrbWFuLW51dHRhbGwiLHQuYmxhY2ttYW5IYXJyaXM9ImJsYWNrbWFuLWhhcnJpcyIsdC5oYW5uPSJoYW5uIix0LmhhbW1pbmc9ImhhbW1pbmciLHQuYmFydGxldHQ9ImJhcnRsZXR0In0ob3x8KG89e30pKTtjb25zdCByPSh0LGUpPT4uNS0uNSpNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSksbD0odCxlKT0+LjU0LS40NipNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSksaD0odCxlKT0+LjQyLS41Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMDgqTWF0aC5jb3MoNCpNYXRoLlBJKnQvKGUtMSkpLGY9KHQsZSk9Pi4zNTU3NjgtLjQ4NzM5NipNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSkrLjE0NDIzMipNYXRoLmNvcyg0Kk1hdGguUEkqdC8oZS0xKSktLjAxMjYwNCpNYXRoLmNvcyg2Kk1hdGguUEkqdC8oZS0xKSksdT0odCxlKT0+LjM1ODc1LS40ODgyOSpNYXRoLmNvcygyKk1hdGguUEkqdC8oZS0xKSkrLjE0MTI4Kk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKS0uMDExNjgqTWF0aC5jb3MoNipNYXRoLlBJKnQvKGUtMSkpLG09KHQsZSk9Pi4zNjM1ODE5LS40ODkxNzc1Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMTM2NTk5NSpNYXRoLmNvcyg0Kk1hdGguUEkqdC8oZS0xKSktLjAxMDY0MTEqTWF0aC5jb3MoNipNYXRoLlBJKnQvKGUtMSkpLF89KHQsZSk9PjEtTWF0aC5hYnMoMioodC0uNSooZS0xKSkvKGUtMSkpLGM9KHQsZSxhKT0+e2NvbnN0IGk9dC5sZW5ndGg7Zm9yKGxldCBzPTA7czxpOysrcyl0W3NdPXRbc10qZShzLGksYSl9LHA9e1tvLnJlY3Rhbmd1bGFyXTooKT0+e30sW28uaGFubl06dD0+Yyh0LHIpLFtvLmhhbW1pbmddOnQ9PmModCxsKSxbby5ibGFja21hbl06dD0+Yyh0LGgpLFtvLmJsYWNrbWFuTnV0dGFsbF06dD0+Yyh0LG0pLFtvLmJsYWNrbWFuSGFycmlzXTp0PT5jKHQsdSksW28ubnV0dGFsbF06dD0+Yyh0LGYpLFtvLmJhcnRsZXR0XTp0PT5jKHQsXyl9LHk9dD0+MjAqTWF0aC5sb2cxMCh0KSxkPSh0LGUsYSk9Pk1hdGgubWluKE1hdGgubWF4KHQsZSksYSk7Y2xhc3MgYiBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3Nvcntfc2FtcGxlc0NvdW50PTA7X2NvdW50PTA7X2ZpcnN0PSEwO19mZnRBbmFseXNlcjtfZmZ0U2l6ZTtfZmZ0SW5wdXQ7X2ZmdE91dHB1dDtfbGFzdFRyYW5zZm9ybTtfc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zO193aW5kb3dGdW5jdGlvblR5cGU9by5ibGFja21hbjtfaXNMaXN0ZW5pbmdUbz17ZnJlcXVlbmN5ZGF0YTohMSxieXRlZnJlcXVlbmN5ZGF0YTohMSx0aW1lZG9tYWluZGF0YTohMSxieXRldGltZWRvbWFpbmRhdGE6ITF9O19idWZmZXI9bmV3IEZsb2F0MzJBcnJheSgzMjc2OCk7X21pbkRlY2liZWxzPS0xMDA7X21heERlY2liZWxzPS0zMDtfc21vb3RoaW5nVGltZUNvbnN0YW50PTA7X3BvcnRNYXA9bmV3IE1hcDtfdGltZURvbWFpblNhbXBsZXNDb3VudDtnZXQgX2ZyZXF1ZW5jeUJpbkNvdW50KCl7cmV0dXJuIHRoaXMuX2ZmdFNpemUvMn1zZXQgZnJlcXVlbmN5QmluQ291bnQodCl7dGhpcy5fZmZ0U2l6ZT0yKnR9Z2V0IF9pc0xpc3RlbmluZ1RvRnJlcXVlbmN5RGF0YSgpe3JldHVybiB0aGlzLl9pc0xpc3RlbmluZ1RvLmZyZXF1ZW5jeWRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGF9Z2V0IF9pc0xpc3RlbmluZ1RvVGltZURvbWFpbkRhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUby50aW1lZG9tYWluZGF0YXx8dGhpcy5faXNMaXN0ZW5pbmdUby5ieXRldGltZWRvbWFpbmRhdGF9c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiaXNSZWNvcmRpbmciLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IodCl7c3VwZXIoKTtjb25zdHtmZnRTaXplOmUsc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zOmksdGltZURvbWFpblNhbXBsZXNDb3VudDpzLHdpbmRvd0Z1bmN0aW9uOm49by5ibGFja21hbn09dC5wcm9jZXNzb3JPcHRpb25zO3RoaXMuX2ZmdEFuYWx5c2VyPW5ldyBhKGUpLHRoaXMuX2ZmdElucHV0PW5ldyBGbG9hdDMyQXJyYXkoZSksdGhpcy5fZmZ0T3V0cHV0PXRoaXMuX2ZmdEFuYWx5c2VyLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuX2ZmdFNpemU9ZSx0aGlzLl9sYXN0VHJhbnNmb3JtPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpLHRoaXMuX3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz1pLHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQ9cyx0aGlzLl9zYW1wbGVzQ291bnQ9MCx0aGlzLl93aW5kb3dGdW5jdGlvblR5cGU9bix0aGlzLnBvcnQub25tZXNzYWdlPXQ9PnRoaXMuX29ubWVzc2FnZSh0LmRhdGEpfV9vbm1lc3NhZ2UodCl7c3dpdGNoKHQudHlwZSl7Y2FzZSBpLmdldEZsb2F0RnJlcXVlbmN5RGF0YTp0aGlzLl9nZXRGbG9hdEZyZXF1ZW5jeURhdGEodC5pZCk7YnJlYWs7Y2FzZSBpLmdldEJ5dGVGcmVxdWVuY3lEYXRhOnRoaXMuX2dldEJ5dGVGcmVxdWVuY3lEYXRhKHQuaWQpO2JyZWFrO2Nhc2UgaS5nZXRGbG9hdFRpbWVEb21haW5EYXRhOnRoaXMuX2dldEZsb2F0VGltZURvbWFpbkRhdGEodC5pZCk7YnJlYWs7Y2FzZSBpLmdldEJ5dGVUaW1lRG9tYWluRGF0YTp0aGlzLl9nZXRCeXRlVGltZURvbWFpbkRhdGEodC5pZCk7YnJlYWs7Y2FzZSBpLnN0YXJ0ZWRMaXN0ZW5pbmdUbzp0aGlzLl9pc0xpc3RlbmluZ1RvW3QucGF5bG9hZF09ITA7YnJlYWs7Y2FzZSBpLnN0b3BwZWRMaXN0ZW5pbmdUbzp0aGlzLl9pc0xpc3RlbmluZ1RvW3QucGF5bG9hZF09ITF9fV9wb3N0TWVzc2FnZSh0LGUpe3RoaXMucG9ydC5wb3N0TWVzc2FnZSh0LGUpfV9zaG91bGRGbHVzaEZyZXF1ZW5jaWVzKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG9GcmVxdWVuY3lEYXRhJiZ0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPT0wfV9zaG91bGRGbHVzaFRpbWVEb21haW5EYXRhKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG9UaW1lRG9tYWluRGF0YSYmdGhpcy5fc2FtcGxlc0NvdW50JXRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQ9PTB9X2FwcGVuZFRvQnVmZmVyKHQpe3RoaXMuX2J1ZmZlclt0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fYnVmZmVyLmxlbmd0aF09dCx0aGlzLl9zYW1wbGVzQ291bnQ9dGhpcy5fc2FtcGxlc0NvdW50KzEsdGhpcy5fc2hvdWxkRmx1c2hGcmVxdWVuY2llcygpJiZ0aGlzLl9mbHVzaEZyZXF1ZW5jaWVzKCksdGhpcy5fc2hvdWxkRmx1c2hUaW1lRG9tYWluRGF0YSgpJiZ0aGlzLl9mbHVzaFRpbWVEb21haW5TYW1wbGVzKCl9X3VwZGF0ZUZmdElucHV0KCl7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0aGlzLl9mZnRJbnB1dCkscFt0aGlzLl93aW5kb3dGdW5jdGlvblR5cGVdKHRoaXMuX2ZmdElucHV0KX1fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0KXtjb25zdCBlPXQubGVuZ3RoLGE9KHRoaXMuX3NhbXBsZXNDb3VudC1lKSV0aGlzLl9idWZmZXIubGVuZ3RoO2ZvcihsZXQgaT0wO2k8ZTtpKyspdFtpXT1hK2k8MD8wOnRoaXMuX2J1ZmZlclsoYStpKSV0aGlzLl9idWZmZXIubGVuZ3RoXX1fY29udmVydEZyZXF1ZW5jaWVzVG9EYih0KXtjb25zdCBlPU1hdGgubWluKHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoLHQubGVuZ3RoKTtpZihlPjApe2NvbnN0IGE9dGhpcy5fbGFzdFRyYW5zZm9ybTtmb3IobGV0IGk9MDtpPGU7KytpKXRbaV09eShhW2ldKX19X2NvbnZlcnRGcmVxdWVuY2llc1RvQnl0ZURhdGEodCl7Y29uc3QgZT1NYXRoLm1pbih0aGlzLl9sYXN0VHJhbnNmb3JtLmxlbmd0aCx0Lmxlbmd0aCk7aWYoZT4wKXtjb25zdCBhPXRoaXMuX2xhc3RUcmFuc2Zvcm0saT0xLyh0aGlzLl9tYXhEZWNpYmVscy10aGlzLl9taW5EZWNpYmVscyk7Zm9yKGxldCBzPTA7czxlOysrcyl7Y29uc3QgZT1hW3NdLG49MjU1Kih5KGUpLXRoaXMuX21pbkRlY2liZWxzKSppO3Rbc109ZCgwfG4sMCwyNTUpfX19X2NvbnZlcnRUaW1lRG9tYWluRGF0YVRvQnl0ZURhdGEodCxlKXtmb3IobGV0IGE9MDthPHQubGVuZ3RoOysrYSllW2FdPWQoMTI4Kih0W2FdKzEpfDAsMCwyNTUpfV9kb0ZmdCgpe3RoaXMuX2ZmdEFuYWx5c2VyLnJlYWxUcmFuc2Zvcm0odGhpcy5fZmZ0T3V0cHV0LHRoaXMuX2ZmdElucHV0KTtjb25zdCB0PTEvdGhpcy5fZmZ0U2l6ZSxlPWQodGhpcy5fc21vb3RoaW5nVGltZUNvbnN0YW50LDAsMSk7Zm9yKGxldCBhPTA7YTx0aGlzLl9sYXN0VHJhbnNmb3JtLmxlbmd0aDthKyspe2NvbnN0IGk9TWF0aC5hYnMoTWF0aC5oeXBvdCh0aGlzLl9mZnRPdXRwdXRbMiphXSx0aGlzLl9mZnRPdXRwdXRbMiphKzFdKSkqdDt0aGlzLl9sYXN0VHJhbnNmb3JtW2FdPWUqdGhpcy5fbGFzdFRyYW5zZm9ybVthXSsoMS1lKSppfX1fZmx1c2hGcmVxdWVuY2llcygpe2lmKHRoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZG9GZnQoKSx0aGlzLl9pc0xpc3RlbmluZ1RvLmZyZXF1ZW5jeWRhdGEpe2NvbnN0IHQ9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCk7dGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9EYih0KSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTppLmZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDp0LmJ1ZmZlcn0sW3QuYnVmZmVyXSl9aWYodGhpcy5faXNMaXN0ZW5pbmdUby5ieXRlZnJlcXVlbmN5ZGF0YSl7Y29uc3QgdD1uZXcgVWludDhBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCk7dGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9CeXRlRGF0YSh0KSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTppLmJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dC5idWZmZXJ9LFt0LmJ1ZmZlcl0pfX1fZmx1c2hUaW1lRG9tYWluU2FtcGxlcygpe2lmKHRoaXMuX2lzTGlzdGVuaW5nVG8udGltZWRvbWFpbmRhdGEpe2NvbnN0IHQ9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkudGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDp0LmJ1ZmZlcn0sW3QuYnVmZmVyXSl9aWYodGhpcy5faXNMaXN0ZW5pbmdUby5ieXRldGltZWRvbWFpbmRhdGEpe2NvbnN0IHQ9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHQpO2NvbnN0IGU9bmV3IFVpbnQ4QXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fY29udmVydFRpbWVEb21haW5EYXRhVG9CeXRlRGF0YSh0LGUpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkuYnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfX1fZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHQpe2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCk7dGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9kb0ZmdCgpLHRoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvRGIoZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTppLnJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX1fZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodCl7dGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9kb0ZmdCgpO2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKGUpO2NvbnN0IGE9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvQnl0ZURhdGEoYSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTppLnJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6YS5idWZmZXJ9LFthLmJ1ZmZlcl0pfV9nZXRGbG9hdFRpbWVEb21haW5EYXRhKHQpe2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKGUpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6aS5yZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfV9nZXRCeXRlVGltZURvbWFpbkRhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXMoZSk7Y29uc3QgYT1uZXcgVWludDhBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9jb252ZXJ0VGltZURvbWFpbkRhdGFUb0J5dGVEYXRhKGUsYSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTppLnJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOmEuYnVmZmVyfSxbYS5idWZmZXJdKX1wcm9jZXNzKHQsZSxhKXtjb25zdCBpPWEuaXNSZWNvcmRpbmc7Zm9yKGxldCBlPTA7ZTx0Lmxlbmd0aDtlKyspe2lmKDE9PT1pW2VdJiZ0WzBdWzBdKWZvcihsZXQgZT0wO2U8dFswXVswXS5sZW5ndGg7ZSsrKXRoaXMuX2FwcGVuZFRvQnVmZmVyKHRbMF1bMF1bZV0pfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiQWR2YW5jZWRBbmFseXNlclByb2Nlc3NvciIsYiksdC5BZHZhbmNlZEFuYWx5c2VyUHJvY2Vzc29yPWIsT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pfSkpOwo=";

  const MAX_FFT_SIZE = 32768;
  const MIN_FFT_SIZE = 32;
  const PROCESSOR_NAME = 'AdvancedAnalyserProcessor';

  const validateFftSize = (value) => {
      if (value && (value & (value - 1)) !== 0) {
          throw (new Error(`${value} is not a valid fftSize. fftSize has to be a power of 2`));
      }
      if (value > MAX_FFT_SIZE) {
          throw new Error(`${value} is above the maximum fftSize. Maximum fftSize is ${MAX_FFT_SIZE}`);
      }
      if (value < MIN_FFT_SIZE) {
          throw new Error(`${value} is below the minimum fftSize. Maximum fftSize is ${MIN_FFT_SIZE}`);
      }
  };
  const validateSamplesBetweenTransforms = (value) => {
      /**
       * TODO: should a minimum be stablished to avoid too many calls per second?
       */
      if (value <= 0) {
          throw new Error(`${value} is not a valid samplesBetweenTransform. samplesBetweenTransform needs to be above 0`);
      }
  };
  const validateTimeDomainSamplesCount = (value) => {
      /**
       * TODO: should a minimum be stablished to avoid too many calls per second?
       */
      if (value <= 0) {
          throw new Error(`${value} is not a valid timeDomainSamplesCount. timeDomainSamplesCount needs to be above 0`);
      }
  };
  const validateWindowFunction = (value) => {
      /**
       * TODO: should a minimum be stablished to avoid too many calls per second?
       */
      if (!Object.values(WindowFunctionTypes).includes(value)) {
          throw new Error(`${value} is not a valid windowFunction. Possible window functions are ${Object.values(WindowFunctionTypes)
            .map((windowFunction) => `'${windowFunction}'`)
            .join(', ')}`);
      }
  };

  class AdvancedAnalyserNode extends AudioWorkletNode {
      _portMapId = 0;
      _portMap = new Map();
      _fftSize = 1024;
      _samplesBetweenTransforms;
      _timeDomainSamplesCount;
      _windowFunction;
      get fftSize() {
          return this._fftSize;
      }
      set fftSize(value) {
          validateFftSize(value);
          this._fftSize = value;
          this._postMessage({
              type: MessageTypes.updateProcessorOptions,
              payload: {
                  fftSize: value,
                  /**
                   * If either _samplesBetweenTransforms or _timeDomainSamplesCount are undefined (meaning it wasn't manually assigned a value)
                   * also update these values with the fftSize.
                   */
                  ...(this._samplesBetweenTransforms ? {} : { samplesBetweenTransforms: value }),
                  ...(this._timeDomainSamplesCount ? {} : { timeDomainSamplesCount: value }),
              },
          });
      }
      set samplesBetweenTransforms(value) {
          validateSamplesBetweenTransforms(value);
          this._samplesBetweenTransforms = value;
          this._updateProcessorOptions({
              samplesBetweenTransforms: value,
          });
      }
      get samplesBetweenTransforms() {
          return this._samplesBetweenTransforms || this.fftSize;
      }
      get frequencyBinCount() {
          return this.fftSize / 2;
      }
      set timeDomainSamplesCount(value) {
          validateTimeDomainSamplesCount(value);
          this._timeDomainSamplesCount = value;
          this._updateProcessorOptions({
              timeDomainSamplesCount: value,
          });
      }
      get timeDomainSamplesCount() {
          return this._timeDomainSamplesCount || this.fftSize;
      }
      set windowFunction(value) {
          validateWindowFunction(value);
          this._windowFunction = value;
          this._updateProcessorOptions({
              windowFunction: value,
          });
      }
      get windowFunction() {
          return this._windowFunction;
      }
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
          [EventListenerTypes.timedomaindata]: [],
          [EventListenerTypes.bytetimedomaindata]: [],
      };
      constructor(context, inputs) {
          const { fftSize = 1024, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction = WindowFunctionTypes.blackman } = inputs;
          const processorOptions = {
              [ProcessorParameters.fftSize]: fftSize,
              [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
              [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
              [ProcessorParameters.windowFunction]: windowFunction,
          };
          super(context, PROCESSOR_NAME, {
              processorOptions,
              numberOfInputs: 1,
              numberOfOutputs: 1,
              channelCount: 1,
              channelCountMode: "max",
              channelInterpretation: "speakers",
          });
          this._validateInputs(inputs);
          this._fftSize = fftSize;
          this._samplesBetweenTransforms = samplesBetweenTransforms;
          this._timeDomainSamplesCount = timeDomainSamplesCount;
          this._windowFunction = windowFunction;
          this.port.onmessage = (event) => this._onmessage(event.data);
      }
      _validateInputs({ fftSize, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction, }) {
          validateFftSize(fftSize);
          if (typeof samplesBetweenTransforms !== 'undefined')
              validateSamplesBetweenTransforms(samplesBetweenTransforms);
          if (typeof timeDomainSamplesCount !== 'undefined')
              validateTimeDomainSamplesCount(timeDomainSamplesCount);
          if (typeof windowFunction !== 'undefined')
              validateWindowFunction(windowFunction);
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
      _updateProcessorOptions(payload) {
          this._postMessage({
              type: MessageTypes.updateProcessorOptions,
              payload
          });
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
          if (type !== 'processorerror')
              this._pushEventListener(type, listener);
      }
      removeEventListener(type, listener, options) {
          super.removeEventListener(type, listener, options);
          if (type !== 'processorerror')
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
