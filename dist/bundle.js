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
      WindowingFunctionTypes["none"] = "none";
      WindowingFunctionTypes["blackmanWindow"] = "blackmanWindow";
  })(WindowingFunctionTypes || (WindowingFunctionTypes = {}));

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgaT0wLHM9MTt0aGlzLnNpemU+cztzPDw9MSlpKys7dGhpcy5fd2lkdGg9aSUyPT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGk9MDtpPHQubGVuZ3RoO2krPTIpYVtpPj4+MV09dFtpXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxpPTA7aTxhLmxlbmd0aDtpKz0yKWFbaV09dFtpPj4+MV0sYVtpKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEsaT0yO2k8YTtpKz0yKXRbZS1pXT10W2ldLHRbZS1pKzFdPS10W2krMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQsaT10aGlzLl9jc2l6ZSxzPTE8PHRoaXMuX3dpZHRoLG49aS9zPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8aTt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLHMpfWVsc2UgZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEscyl9dmFyIHI9dGhpcy5faW52Py0xOjEsbD10aGlzLnRhYmxlO2ZvcihzPj49MjtzPj0yO3M+Pj0yKXt2YXIgZj0obj1pL3M8PDEpPj4+Mjtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgaD10K2YsdT10LG09MDt1PGg7dSs9MixtKz1zKXtjb25zdCB0PXUsZT10K2YsaT1lK2Yscz1pK2Ysbj1hW3RdLG89YVt0KzFdLGg9YVtlXSxfPWFbZSsxXSxjPWFbaV0scD1hW2krMV0seT1hW3NdLGQ9YVtzKzFdLEQ9bixiPW8sZz1sW21dLFQ9cipsW20rMV0sRj1oKmctXypULHY9aCpUK18qZyxBPWxbMiptXSxxPXIqbFsyKm0rMV0sdz1jKkEtcCpxLEI9YypxK3AqQSxDPWxbMyptXSxTPXIqbFszKm0rMV0sTD15KkMtZCpTLE09eSpTK2QqQyx6PUQrdyxJPWIrQixXPUQtdyx4PWItQixrPUYrTCxQPXYrTSxOPXIqKEYtTCksTz1yKih2LU0pLFI9eitrLEU9SStQLFU9ei1rLGo9SS1QLFY9VytPLEc9eC1OLEg9Vy1PLEo9eCtOO2FbdF09UixhW3QrMV09RSxhW2VdPVYsYVtlKzFdPUcsYVtpXT1VLGFbaSsxXT1qLGFbc109SCxhW3MrMV09Sn19fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3QgaT10aGlzLl9vdXQscz10aGlzLl9kYXRhLG49c1tlXSxvPXNbZSsxXSxyPXNbZSthXSxsPXNbZSthKzFdLGY9bityLGg9bytsLHU9bi1yLG09by1sO2lbdF09ZixpW3QrMV09aCxpW3QrMl09dSxpW3QrM109bX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IGk9dGhpcy5fb3V0LHM9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGw9c1tlXSxmPXNbZSsxXSxoPXNbZSthXSx1PXNbZSthKzFdLG09c1tlK29dLF89c1tlK28rMV0sYz1zW2Urcl0scD1zW2UrcisxXSx5PWwrbSxkPWYrXyxEPWwtbSxiPWYtXyxnPWgrYyxUPXUrcCxGPW4qKGgtYyksdj1uKih1LXApLEE9eStnLHE9ZCtULHc9RCt2LEI9Yi1GLEM9eS1nLFM9ZC1ULEw9RC12LE09YitGO2lbdF09QSxpW3QrMV09cSxpW3QrMl09dyxpW3QrM109QixpW3QrNF09QyxpW3QrNV09UyxpW3QrNl09TCxpW3QrN109TX0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxpPXRoaXMuX2NzaXplLHM9MTw8dGhpcy5fd2lkdGgsbj1pL3M8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxzPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGk7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLHM+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxsPXRoaXMudGFibGU7Zm9yKHM+Pj0yO3M+PTI7cz4+PTIpe3ZhciBmPShuPWkvczw8MSk+Pj4xLGg9Zj4+PjEsdT1oPj4+MTtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgbT0wLF89MDttPD11O20rPTIsXys9cyl7dmFyIGM9dCttLHA9YytoLHk9cCtoLGQ9eStoLEQ9YVtjXSxiPWFbYysxXSxnPWFbcF0sVD1hW3ArMV0sRj1hW3ldLHY9YVt5KzFdLEE9YVtkXSxxPWFbZCsxXSx3PUQsQj1iLEM9bFtfXSxTPXIqbFtfKzFdLEw9ZypDLVQqUyxNPWcqUytUKkMsej1sWzIqX10sST1yKmxbMipfKzFdLFc9Rip6LXYqSSx4PUYqSSt2Knosaz1sWzMqX10sUD1yKmxbMypfKzFdLE49QSprLXEqUCxPPUEqUCtxKmssUj13K1csRT1CK3gsVT13LVcsaj1CLXgsVj1MK04sRz1NK08sSD1yKihMLU4pLEo9ciooTS1PKSxLPVIrVixRPUUrRyxYPVUrSixZPWotSDtpZihhW2NdPUssYVtjKzFdPVEsYVtwXT1YLGFbcCsxXT1ZLDAhPT1tKXtpZihtIT09dSl7dmFyIFo9VSstcipKLCQ9LWorLXIqSCx0dD1SKy1yKlYsZXQ9LUUtIC1yKkcsYXQ9dCtoLW0saXQ9dCtmLW07YVthdF09WixhW2F0KzFdPSQsYVtpdF09dHQsYVtpdCsxXT1ldH19ZWxzZXt2YXIgc3Q9Ui1WLG50PUUtRzthW3ldPXN0LGFbeSsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj1zW2VdLG89c1tlK2FdLHI9bitvLGw9bi1vO2lbdF09cixpW3QrMV09MCxpW3QrMl09bCxpW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxsPXNbZV0sZj1zW2UrYV0saD1zW2Urb10sdT1zW2Urcl0sbT1sK2gsXz1sLWgsYz1mK3UscD1uKihmLXUpLHk9bStjLGQ9XyxEPS1wLGI9bS1jLGc9XyxUPXA7aVt0XT15LGlbdCsxXT0wLGlbdCsyXT1kLGlbdCszXT1ELGlbdCs0XT1iLGlbdCs1XT0wLGlbdCs2XT1nLGlbdCs3XT1UfTt2YXIgaSxzLG4sbzshZnVuY3Rpb24odCl7dFt0LnN0YXJ0PTBdPSJzdGFydCIsdFt0LnN0b3A9MV09InN0b3AiLHRbdC5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTJdPSJmcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGU9M109ImJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QudGltZURvbWFpbkRhdGFBdmFpbGFibGU9NF09InRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuYnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTVdPSJieXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUiLHRbdC5nZXRGbG9hdEZyZXF1ZW5jeURhdGE9Nl09ImdldEZsb2F0RnJlcXVlbmN5RGF0YSIsdFt0LnJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZT03XT0icmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGE9OF09ImdldEJ5dGVGcmVxdWVuY3lEYXRhIix0W3QucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGU9OV09InJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YT0xMF09ImdldEZsb2F0VGltZURvbWFpbkRhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTExXT0icmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVUaW1lRG9tYWluRGF0YT0xMl09ImdldEJ5dGVUaW1lRG9tYWluRGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZT0xM109InJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LnN0YXJ0ZWRMaXN0ZW5pbmdUbz0xNF09InN0YXJ0ZWRMaXN0ZW5pbmdUbyIsdFt0LnN0b3BwZWRMaXN0ZW5pbmdUbz0xNV09InN0b3BwZWRMaXN0ZW5pbmdUbyJ9KGl8fChpPXt9KSksZnVuY3Rpb24odCl7dC5mZnRTaXplPSJmZnRTaXplIix0LnNhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz0ic2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zIix0LnRpbWVEb21haW5TYW1wbGVzQ291bnQ9InRpbWVEb21haW5TYW1wbGVzQ291bnQiLHQud2luZG93RnVuY3Rpb249IndpbmRvd0Z1bmN0aW9uIn0oc3x8KHM9e30pKSxmdW5jdGlvbih0KXt0LmZyZXF1ZW5jeWRhdGE9ImZyZXF1ZW5jeWRhdGEiLHQuYnl0ZWZyZXF1ZW5jeWRhdGE9ImJ5dGVmcmVxdWVuY3lkYXRhIix0LnRpbWVkb21haW5kYXRhPSJ0aW1lZG9tYWluZGF0YSIsdC5ieXRldGltZWRvbWFpbmRhdGE9ImJ5dGV0aW1lZG9tYWluZGF0YSJ9KG58fChuPXt9KSksZnVuY3Rpb24odCl7dC5ub25lPSJub25lIix0LmJsYWNrbWFuV2luZG93PSJibGFja21hbldpbmRvdyJ9KG98fChvPXt9KSk7Y29uc3Qgcj17bm9uZTooKT0+e30sYmxhY2ttYW5XaW5kb3c6dD0+e2NvbnN0IGU9dC5sZW5ndGg7Zm9yKGxldCBhPTA7YTxlO2ErKyl7Y29uc3QgaT1hL2Uscz0uNDItLjUqTWF0aC5jb3MoMipNYXRoLlBJKmkpKy4wOCpNYXRoLmNvcygyKk1hdGguUEkqMippKTt0W2FdKj1NYXRoLmFicyhzKX19fSxsPXQ9PjIwKk1hdGgubG9nMTAodCksZj0odCxlLGEpPT5NYXRoLm1pbihNYXRoLm1heCh0LGUpLGEpO2NsYXNzIGggZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7X3NhbXBsZXNDb3VudD0wO19jb3VudD0wO19maXJzdD0hMDtfZmZ0QW5hbHlzZXI7X2ZmdFNpemU7X2ZmdElucHV0O19mZnRPdXRwdXQ7X2xhc3RUcmFuc2Zvcm07X3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtcztfdGltZURvbWFpblNhbXBsZXNDb3VudDtfd2luZG93RnVuY3Rpb25UeXBlPW8uYmxhY2ttYW5XaW5kb3c7X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITEsdGltZWRvbWFpbmRhdGE6ITEsYnl0ZXRpbWVkb21haW5kYXRhOiExfTtfYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkoMzI3NjgpO19taW5EZWNpYmVscz0tMTAwO19tYXhEZWNpYmVscz0tMzA7X3Ntb290aGluZ1RpbWVDb25zdGFudD0wO19wb3J0TWFwPW5ldyBNYXA7Z2V0IF9mcmVxdWVuY3lCaW5Db3VudCgpe3JldHVybiB0aGlzLl9mZnRTaXplLzJ9c2V0IGZyZXF1ZW5jeUJpbkNvdW50KHQpe3RoaXMuX2ZmdFNpemU9Mip0fWdldCBfaXNMaXN0ZW5pbmdUb0ZyZXF1ZW5jeURhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUby5mcmVxdWVuY3lkYXRhfHx0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGVmcmVxdWVuY3lkYXRhfWdldCBfaXNMaXN0ZW5pbmdUb1RpbWVEb21haW5EYXRhKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG8udGltZWRvbWFpbmRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZXRpbWVkb21haW5kYXRhfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImlzUmVjb3JkaW5nIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHQpe3N1cGVyKCk7Y29uc3R7ZmZ0U2l6ZTplLHNhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtczppLHRpbWVEb21haW5TYW1wbGVzQ291bnQ6cyx3aW5kb3dGdW5jdGlvbjpuPW8uYmxhY2ttYW5XaW5kb3d9PXQucHJvY2Vzc29yT3B0aW9uczt0aGlzLl9mZnRBbmFseXNlcj1uZXcgYShlKSx0aGlzLl9mZnRJbnB1dD1uZXcgRmxvYXQzMkFycmF5KGUpLHRoaXMuX2ZmdE91dHB1dD10aGlzLl9mZnRBbmFseXNlci5jcmVhdGVDb21wbGV4QXJyYXkoKSx0aGlzLl9mZnRTaXplPWUsdGhpcy5fbGFzdFRyYW5zZm9ybT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KSx0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9aXx8ZSx0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50PXMsdGhpcy5fc2FtcGxlc0NvdW50PTAsdGhpcy5fd2luZG93RnVuY3Rpb25UeXBlPW4sdGhpcy5wb3J0Lm9ubWVzc2FnZT10PT50aGlzLl9vbm1lc3NhZ2UodC5kYXRhKX1fb25tZXNzYWdlKHQpe3N3aXRjaCh0LnR5cGUpe2Nhc2UgaS5nZXRGbG9hdEZyZXF1ZW5jeURhdGE6dGhpcy5fZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHQuaWQpO2JyZWFrO2Nhc2UgaS5nZXRCeXRlRnJlcXVlbmN5RGF0YTp0aGlzLl9nZXRCeXRlRnJlcXVlbmN5RGF0YSh0LmlkKTticmVhaztjYXNlIGkuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YTp0aGlzLl9nZXRGbG9hdFRpbWVEb21haW5EYXRhKHQuaWQpO2JyZWFrO2Nhc2UgaS5nZXRCeXRlVGltZURvbWFpbkRhdGE6dGhpcy5fZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKHQuaWQpO2JyZWFrO2Nhc2UgaS5zdGFydGVkTGlzdGVuaW5nVG86dGhpcy5faXNMaXN0ZW5pbmdUb1t0LnBheWxvYWRdPSEwO2JyZWFrO2Nhc2UgaS5zdG9wcGVkTGlzdGVuaW5nVG86dGhpcy5faXNMaXN0ZW5pbmdUb1t0LnBheWxvYWRdPSExfX1fcG9zdE1lc3NhZ2UodCxlKXt0aGlzLnBvcnQucG9zdE1lc3NhZ2UodCxlKX1fc2hvdWxkRmx1c2hGcmVxdWVuY2llcygpe3JldHVybiB0aGlzLl9pc0xpc3RlbmluZ1RvRnJlcXVlbmN5RGF0YSYmdGhpcy5fc2FtcGxlc0NvdW50JXRoaXMuX3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz09MH1fc2hvdWxkRmx1c2hUaW1lRG9tYWluRGF0YSgpe3JldHVybiB0aGlzLl9pc0xpc3RlbmluZ1RvVGltZURvbWFpbkRhdGEmJnRoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50PT0wfV9hcHBlbmRUb0J1ZmZlcih0KXt0aGlzLl9idWZmZXJbdGhpcy5fc2FtcGxlc0NvdW50JXRoaXMuX2J1ZmZlci5sZW5ndGhdPXQsdGhpcy5fc2FtcGxlc0NvdW50PXRoaXMuX3NhbXBsZXNDb3VudCsxLHRoaXMuX3Nob3VsZEZsdXNoRnJlcXVlbmNpZXMoKSYmdGhpcy5fZmx1c2hGcmVxdWVuY2llcygpLHRoaXMuX3Nob3VsZEZsdXNoVGltZURvbWFpbkRhdGEoKSYmdGhpcy5fZmx1c2hUaW1lRG9tYWluU2FtcGxlcygpfV91cGRhdGVGZnRJbnB1dCgpe3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModGhpcy5fZmZ0SW5wdXQpLHJbdGhpcy5fd2luZG93RnVuY3Rpb25UeXBlXSh0aGlzLl9mZnRJbnB1dCl9X2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCl7Y29uc3QgZT10Lmxlbmd0aCxhPSh0aGlzLl9zYW1wbGVzQ291bnQtZSkldGhpcy5fYnVmZmVyLmxlbmd0aDtmb3IobGV0IGk9MDtpPGU7aSsrKXRbaV09YStpPDA/MDp0aGlzLl9idWZmZXJbKGEraSkldGhpcy5fYnVmZmVyLmxlbmd0aF19X2NvbnZlcnRGcmVxdWVuY2llc1RvRGIodCl7Y29uc3QgZT1NYXRoLm1pbih0aGlzLl9sYXN0VHJhbnNmb3JtLmxlbmd0aCx0Lmxlbmd0aCk7aWYoZT4wKXtjb25zdCBhPXRoaXMuX2xhc3RUcmFuc2Zvcm07Zm9yKGxldCBpPTA7aTxlOysraSl0W2ldPWwoYVtpXSl9fV9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3QgYT10aGlzLl9sYXN0VHJhbnNmb3JtLGk9MS8odGhpcy5fbWF4RGVjaWJlbHMtdGhpcy5fbWluRGVjaWJlbHMpO2ZvcihsZXQgcz0wO3M8ZTsrK3Mpe2NvbnN0IGU9YVtzXSxuPTI1NSoobChlKS10aGlzLl9taW5EZWNpYmVscykqaTt0W3NdPWYoMHxuLDAsMjU1KX19fV9jb252ZXJ0VGltZURvbWFpbkRhdGFUb0J5dGVEYXRhKHQsZSl7Zm9yKGxldCBhPTA7YTx0Lmxlbmd0aDsrK2EpZVthXT1mKDEyOCoodFthXSsxKXwwLDAsMjU1KX1fZG9GZnQoKXt0aGlzLl9mZnRBbmFseXNlci5yZWFsVHJhbnNmb3JtKHRoaXMuX2ZmdE91dHB1dCx0aGlzLl9mZnRJbnB1dCk7Y29uc3QgdD0xL3RoaXMuX2ZmdFNpemUsZT1mKHRoaXMuX3Ntb290aGluZ1RpbWVDb25zdGFudCwwLDEpO2ZvcihsZXQgYT0wO2E8dGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGg7YSsrKXtjb25zdCBpPU1hdGguYWJzKE1hdGguaHlwb3QodGhpcy5fZmZ0T3V0cHV0WzIqYV0sdGhpcy5fZmZ0T3V0cHV0WzIqYSsxXSkpKnQ7dGhpcy5fbGFzdFRyYW5zZm9ybVthXT1lKnRoaXMuX2xhc3RUcmFuc2Zvcm1bYV0rKDEtZSkqaX19X2ZsdXNoRnJlcXVlbmNpZXMoKXtpZih0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCksdGhpcy5faXNMaXN0ZW5pbmdUby5mcmVxdWVuY3lkYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvRGIodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dC5idWZmZXJ9LFt0LmJ1ZmZlcl0pfWlmKHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGEpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvQnl0ZURhdGEodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS5ieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX19X2ZsdXNoVGltZURvbWFpblNhbXBsZXMoKXtpZih0aGlzLl9pc0xpc3RlbmluZ1RvLnRpbWVkb21haW5kYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0KSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTppLnRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6dC5idWZmZXJ9LFt0LmJ1ZmZlcl0pfWlmKHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZXRpbWVkb21haW5kYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0KTtjb25zdCBlPW5ldyBVaW50OEFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2NvbnZlcnRUaW1lRG9tYWluRGF0YVRvQnl0ZURhdGEodCxlKSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTppLmJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX19X2dldEZsb2F0RnJlcXVlbmN5RGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZG9GZnQoKSx0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKGUpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6aS5yZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9X2dldEJ5dGVGcmVxdWVuY3lEYXRhKHQpe3RoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZG9GZnQoKTtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKTtjb25zdCBhPW5ldyBVaW50OEFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKGEpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6aS5yZXF1ZXN0ZWRCeXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOmEuYnVmZmVyfSxbYS5idWZmZXJdKX1fZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX1fZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKHQpe2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKGUpO2NvbnN0IGE9bmV3IFVpbnQ4QXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fY29udmVydFRpbWVEb21haW5EYXRhVG9CeXRlRGF0YShlLGEpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6aS5yZXF1ZXN0ZWRCeXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDphLmJ1ZmZlcn0sW2EuYnVmZmVyXSl9cHJvY2Vzcyh0LGUsYSl7Y29uc3QgaT1hLmlzUmVjb3JkaW5nO2ZvcihsZXQgZT0wO2U8dC5sZW5ndGg7ZSsrKXtpZigxPT09aVtlXSYmdFswXVswXSlmb3IobGV0IGU9MDtlPHRbMF1bMF0ubGVuZ3RoO2UrKyl0aGlzLl9hcHBlbmRUb0J1ZmZlcih0WzBdWzBdW2VdKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoIkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3IiLGgpLHQuQWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj1oLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KX0pKTsK";

  class AdvancedAnalyserNode extends AudioWorkletNode {
      _portMapId = 0;
      _portMap = new Map();
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
          [EventListenerTypes.timedomaindata]: [],
          [EventListenerTypes.bytetimedomaindata]: [],
      };
      constructor(context, { fftSize = 1024, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction = WindowingFunctionTypes.blackmanWindow }) {
          super(context, 'AdvancedAnalyserProcessor', {
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
