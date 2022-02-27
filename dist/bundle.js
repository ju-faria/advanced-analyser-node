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
      MessageTypes[MessageTypes["getFloatFrequencyData"] = 4] = "getFloatFrequencyData";
      MessageTypes[MessageTypes["requestedFloatFrequencyDataAvailable"] = 5] = "requestedFloatFrequencyDataAvailable";
      MessageTypes[MessageTypes["getByteFrequencyData"] = 6] = "getByteFrequencyData";
      MessageTypes[MessageTypes["requestedByteFrequencyDataAvailable"] = 7] = "requestedByteFrequencyDataAvailable";
      MessageTypes[MessageTypes["getFloatTimeDomainData"] = 8] = "getFloatTimeDomainData";
      MessageTypes[MessageTypes["requestedFloatTimeDomainDataAvailable"] = 9] = "requestedFloatTimeDomainDataAvailable";
      MessageTypes[MessageTypes["getByteTimeDomainData"] = 10] = "getByteTimeDomainData";
      MessageTypes[MessageTypes["requestedByteTimeDomainDataAvailable"] = 11] = "requestedByteTimeDomainDataAvailable";
      MessageTypes[MessageTypes["startedListeningTo"] = 12] = "startedListeningTo";
      MessageTypes[MessageTypes["stoppedListeningTo"] = 13] = "stoppedListeningTo";
  })(MessageTypes || (MessageTypes = {}));
  var ProcessorParameters;
  (function (ProcessorParameters) {
      ProcessorParameters["fftSize"] = "fftSize";
      ProcessorParameters["samplesBetweenTransforms"] = "samplesBetweenTransforms";
      ProcessorParameters["dataAsByteArray"] = "dataAsByteArray";
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

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgcz0wLGk9MTt0aGlzLnNpemU+aTtpPDw9MSlzKys7dGhpcy5fd2lkdGg9cyUyPT0wP3MtMTpzLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLHM9MDtzPHQubGVuZ3RoO3MrPTIpYVtzPj4+MV09dFtzXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxzPTA7czxhLmxlbmd0aDtzKz0yKWFbc109dFtzPj4+MV0sYVtzKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEscz0yO3M8YTtzKz0yKXRbZS1zXT10W3NdLHRbZS1zKzFdPS10W3MrMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQscz10aGlzLl9jc2l6ZSxpPTE8PHRoaXMuX3dpZHRoLG49cy9pPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8czt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLGkpfWVsc2UgZm9yKHQ9MCxlPTA7dDxzO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEsaSl9dmFyIHI9dGhpcy5faW52Py0xOjEsZj10aGlzLnRhYmxlO2ZvcihpPj49MjtpPj0yO2k+Pj0yKXt2YXIgaD0obj1zL2k8PDEpPj4+Mjtmb3IodD0wO3Q8czt0Kz1uKWZvcih2YXIgbD10K2gsdT10LF89MDt1PGw7dSs9MixfKz1pKXtjb25zdCB0PXUsZT10K2gscz1lK2gsaT1zK2gsbj1hW3RdLG89YVt0KzFdLGw9YVtlXSxjPWFbZSsxXSx5PWFbc10scD1hW3MrMV0sZD1hW2ldLG09YVtpKzFdLGc9bixiPW8sVD1mW19dLHY9cipmW18rMV0sRD1sKlQtYyp2LEY9bCp2K2MqVCx3PWZbMipfXSxxPXIqZlsyKl8rMV0sQT15KnctcCpxLEI9eSpxK3AqdyxNPWZbMypfXSx6PXIqZlszKl8rMV0sQz1kKk0tbSp6LEk9ZCp6K20qTSxMPWcrQSx4PWIrQixTPWctQSxrPWItQixQPUQrQyxPPUYrSSxSPXIqKEQtQyksVz1yKihGLUkpLEU9TCtQLFU9eCtPLGo9TC1QLFY9eC1PLEc9UytXLEg9ay1SLEo9Uy1XLEs9aytSO2FbdF09RSxhW3QrMV09VSxhW2VdPUcsYVtlKzFdPUgsYVtzXT1qLGFbcysxXT1WLGFbaV09SixhW2krMV09S319fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3Qgcz10aGlzLl9vdXQsaT10aGlzLl9kYXRhLG49aVtlXSxvPWlbZSsxXSxyPWlbZSthXSxmPWlbZSthKzFdLGg9bityLGw9bytmLHU9bi1yLF89by1mO3NbdF09aCxzW3QrMV09bCxzW3QrMl09dSxzW3QrM109X30sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IHM9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGY9aVtlXSxoPWlbZSsxXSxsPWlbZSthXSx1PWlbZSthKzFdLF89aVtlK29dLGM9aVtlK28rMV0seT1pW2Urcl0scD1pW2UrcisxXSxkPWYrXyxtPWgrYyxnPWYtXyxiPWgtYyxUPWwreSx2PXUrcCxEPW4qKGwteSksRj1uKih1LXApLHc9ZCtULHE9bSt2LEE9ZytGLEI9Yi1ELE09ZC1ULHo9bS12LEM9Zy1GLEk9YitEO3NbdF09dyxzW3QrMV09cSxzW3QrMl09QSxzW3QrM109QixzW3QrNF09TSxzW3QrNV09eixzW3QrNl09QyxzW3QrN109SX0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxzPXRoaXMuX2NzaXplLGk9MTw8dGhpcy5fd2lkdGgsbj1zL2k8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxzO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxpPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PHM7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLGk+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxmPXRoaXMudGFibGU7Zm9yKGk+Pj0yO2k+PTI7aT4+PTIpe3ZhciBoPShuPXMvaTw8MSk+Pj4xLGw9aD4+PjEsdT1sPj4+MTtmb3IodD0wO3Q8czt0Kz1uKWZvcih2YXIgXz0wLGM9MDtfPD11O18rPTIsYys9aSl7dmFyIHk9dCtfLHA9eStsLGQ9cCtsLG09ZCtsLGc9YVt5XSxiPWFbeSsxXSxUPWFbcF0sdj1hW3ArMV0sRD1hW2RdLEY9YVtkKzFdLHc9YVttXSxxPWFbbSsxXSxBPWcsQj1iLE09ZltjXSx6PXIqZltjKzFdLEM9VCpNLXYqeixJPVQqeit2Kk0sTD1mWzIqY10seD1yKmZbMipjKzFdLFM9RCpMLUYqeCxrPUQqeCtGKkwsUD1mWzMqY10sTz1yKmZbMypjKzFdLFI9dypQLXEqTyxXPXcqTytxKlAsRT1BK1MsVT1CK2ssaj1BLVMsVj1CLWssRz1DK1IsSD1JK1csSj1yKihDLVIpLEs9ciooSS1XKSxOPUUrRyxRPVUrSCxYPWorSyxZPVYtSjtpZihhW3ldPU4sYVt5KzFdPVEsYVtwXT1YLGFbcCsxXT1ZLDAhPT1fKXtpZihfIT09dSl7dmFyIFo9aistcipLLCQ9LVYrLXIqSix0dD1FKy1yKkcsZXQ9LVUtIC1yKkgsYXQ9dCtsLV8sc3Q9dCtoLV87YVthdF09WixhW2F0KzFdPSQsYVtzdF09dHQsYVtzdCsxXT1ldH19ZWxzZXt2YXIgaXQ9RS1HLG50PVUtSDthW2RdPWl0LGFbZCsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBzPXRoaXMuX291dCxpPXRoaXMuX2RhdGEsbj1pW2VdLG89aVtlK2FdLHI9bitvLGY9bi1vO3NbdF09cixzW3QrMV09MCxzW3QrMl09ZixzW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBzPXRoaXMuX291dCxpPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxmPWlbZV0saD1pW2UrYV0sbD1pW2Urb10sdT1pW2Urcl0sXz1mK2wsYz1mLWwseT1oK3UscD1uKihoLXUpLGQ9Xyt5LG09YyxnPS1wLGI9Xy15LFQ9Yyx2PXA7c1t0XT1kLHNbdCsxXT0wLHNbdCsyXT1tLHNbdCszXT1nLHNbdCs0XT1iLHNbdCs1XT0wLHNbdCs2XT1ULHNbdCs3XT12fTt2YXIgcyxpLG4sbzshZnVuY3Rpb24odCl7dFt0LnN0YXJ0PTBdPSJzdGFydCIsdFt0LnN0b3A9MV09InN0b3AiLHRbdC5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTJdPSJmcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGU9M109ImJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhPTRdPSJnZXRGbG9hdEZyZXF1ZW5jeURhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGU9NV09InJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVGcmVxdWVuY3lEYXRhPTZdPSJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTddPSJyZXF1ZXN0ZWRCeXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmdldEZsb2F0VGltZURvbWFpbkRhdGE9OF09ImdldEZsb2F0VGltZURvbWFpbkRhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTldPSJyZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhPTEwXT0iZ2V0Qnl0ZVRpbWVEb21haW5EYXRhIix0W3QucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTExXT0icmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3Quc3RhcnRlZExpc3RlbmluZ1RvPTEyXT0ic3RhcnRlZExpc3RlbmluZ1RvIix0W3Quc3RvcHBlZExpc3RlbmluZ1RvPTEzXT0ic3RvcHBlZExpc3RlbmluZ1RvIn0oc3x8KHM9e30pKSxmdW5jdGlvbih0KXt0LmZmdFNpemU9ImZmdFNpemUiLHQuc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPSJzYW1wbGVzQmV0d2VlblRyYW5zZm9ybXMiLHQuZGF0YUFzQnl0ZUFycmF5PSJkYXRhQXNCeXRlQXJyYXkiLHQud2luZG93RnVuY3Rpb249IndpbmRvd0Z1bmN0aW9uIn0oaXx8KGk9e30pKSxmdW5jdGlvbih0KXt0LmZyZXF1ZW5jeWRhdGE9ImZyZXF1ZW5jeWRhdGEiLHQuYnl0ZWZyZXF1ZW5jeWRhdGE9ImJ5dGVmcmVxdWVuY3lkYXRhIix0LnRpbWVkb21haW5kYXRhPSJ0aW1lZG9tYWluZGF0YSIsdC5ieXRldGltZWRvbWFpbmRhdGE9ImJ5dGV0aW1lZG9tYWluZGF0YSJ9KG58fChuPXt9KSksZnVuY3Rpb24odCl7dC5ub25lPSJub25lIix0LmJsYWNrbWFuV2luZG93PSJibGFja21hbldpbmRvdyJ9KG98fChvPXt9KSk7Y29uc3Qgcj17bm9uZTooKT0+e30sYmxhY2ttYW5XaW5kb3c6dD0+e2NvbnN0IGU9dC5sZW5ndGg7Zm9yKGxldCBhPTA7YTxlO2ErKyl7Y29uc3Qgcz1hL2UsaT0uNDItLjUqTWF0aC5jb3MoMipNYXRoLlBJKnMpKy4wOCpNYXRoLmNvcygyKk1hdGguUEkqMipzKTt0W2FdKj1NYXRoLmFicyhpKX19fSxmPXQ9PjIwKk1hdGgubG9nMTAodCksaD0odCxlLGEpPT5NYXRoLm1pbihNYXRoLm1heCh0LGUpLGEpO2NsYXNzIGwgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7X3NhbXBsZXNDb3VudD0wO19jb3VudD0wO19maXJzdD0hMDtfZmZ0QW5hbHlzZXI7X2ZmdFNpemU7X2ZmdElucHV0O19mZnRPdXRwdXQ7X2xhc3RUcmFuc2Zvcm07X3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcztfd2luZG93RnVuY3Rpb25UeXBlPW8uYmxhY2ttYW5XaW5kb3c7X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITEsdGltZWRvbWFpbmRhdGE6ITEsYnl0ZXRpbWVkb21haW5kYXRhOiExfTtfYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkoMzI3NjgpO19taW5EZWNpYmVscz0tMTAwO19tYXhEZWNpYmVscz0tMzA7X3Ntb290aGluZ1RpbWVDb25zdGFudD0wO19wb3J0TWFwPW5ldyBNYXA7Z2V0IF9mcmVxdWVuY3lCaW5Db3VudCgpe3JldHVybiB0aGlzLl9mZnRTaXplLzJ9c2V0IGZyZXF1ZW5jeUJpbkNvdW50KHQpe3RoaXMuX2ZmdFNpemU9Mip0fXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImlzUmVjb3JkaW5nIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHQpe3N1cGVyKCk7Y29uc3R7ZmZ0U2l6ZTplLHNhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtczpzLHdpbmRvd0Z1bmN0aW9uOmk9by5ibGFja21hbldpbmRvd309dC5wcm9jZXNzb3JPcHRpb25zO3RoaXMuX2ZmdEFuYWx5c2VyPW5ldyBhKGUpLHRoaXMuX2ZmdElucHV0PW5ldyBGbG9hdDMyQXJyYXkoZSksdGhpcy5fZmZ0T3V0cHV0PXRoaXMuX2ZmdEFuYWx5c2VyLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuX2ZmdFNpemU9ZSx0aGlzLl9sYXN0VHJhbnNmb3JtPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpLHRoaXMuX3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz1zLHRoaXMuX3NhbXBsZXNDb3VudD0wLHRoaXMuX3dpbmRvd0Z1bmN0aW9uVHlwZT1pLHRoaXMucG9ydC5vbm1lc3NhZ2U9dD0+dGhpcy5fb25tZXNzYWdlKHQuZGF0YSl9X29ubWVzc2FnZSh0KXtzd2l0Y2godC50eXBlKXtjYXNlIHMuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhOnRoaXMuX2dldEZsb2F0RnJlcXVlbmN5RGF0YSh0LmlkKTticmVhaztjYXNlIHMuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGE6dGhpcy5fZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodC5pZCk7YnJlYWs7Y2FzZSBzLmdldEZsb2F0VGltZURvbWFpbkRhdGE6dGhpcy5fZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIHMuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhOnRoaXMuX2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIHMuc3RhcnRlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMDticmVhaztjYXNlIHMuc3RvcHBlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMX19X3Bvc3RNZXNzYWdlKHQsZSl7dGhpcy5wb3J0LnBvc3RNZXNzYWdlKHQsZSl9X3Nob3VsZEZsdXNoKCl7cmV0dXJuKHRoaXMuX2lzTGlzdGVuaW5nVG8uZnJlcXVlbmN5ZGF0YXx8dGhpcy5faXNMaXN0ZW5pbmdUby5ieXRlZnJlcXVlbmN5ZGF0YSkmJnRoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9PTB9X2FwcGVuZFRvQnVmZmVyKHQpe3RoaXMuX2J1ZmZlclt0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fYnVmZmVyLmxlbmd0aF09dCx0aGlzLl9zYW1wbGVzQ291bnQ9dGhpcy5fc2FtcGxlc0NvdW50KzEsdGhpcy5fc2hvdWxkRmx1c2goKSYmdGhpcy5fZmx1c2goKX1fdXBkYXRlRmZ0SW5wdXQoKXtjb25zdCB0PSh0aGlzLl9zYW1wbGVzQ291bnQtdGhpcy5fZmZ0U2l6ZSkldGhpcy5fYnVmZmVyLmxlbmd0aDtmb3IobGV0IGU9MDtlPHRoaXMuX2ZmdElucHV0Lmxlbmd0aDtlKyspdGhpcy5fZmZ0SW5wdXRbZV09dCtlPDA/MDp0aGlzLl9idWZmZXJbKHQrZSkldGhpcy5fYnVmZmVyLmxlbmd0aF07clt0aGlzLl93aW5kb3dGdW5jdGlvblR5cGVdKHRoaXMuX2ZmdElucHV0KX1fY29udmVydEZsb2F0VG9EYih0KXtjb25zdCBlPU1hdGgubWluKHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoLHQubGVuZ3RoKTtpZihlPjApe2NvbnN0IGE9dGhpcy5fbGFzdFRyYW5zZm9ybTtmb3IobGV0IHM9MDtzPGU7KytzKXRbc109ZihhW3NdKX19X2NvbnZlcnRUb0J5dGVEYXRhKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3QgYT10aGlzLl9sYXN0VHJhbnNmb3JtLHM9MS8odGhpcy5fbWF4RGVjaWJlbHMtdGhpcy5fbWluRGVjaWJlbHMpO2ZvcihsZXQgaT0wO2k8ZTsrK2kpe2NvbnN0IGU9YVtpXSxuPTI1NSooZihlKS10aGlzLl9taW5EZWNpYmVscykqczt0W2ldPWgoMHxuLDAsMjU1KX19fV9kb0ZmdCgpe3RoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZmZ0QW5hbHlzZXIucmVhbFRyYW5zZm9ybSh0aGlzLl9mZnRPdXRwdXQsdGhpcy5fZmZ0SW5wdXQpO2NvbnN0IHQ9MS90aGlzLl9mZnRTaXplLGU9aCh0aGlzLl9zbW9vdGhpbmdUaW1lQ29uc3RhbnQsMCwxKTtmb3IobGV0IGE9MDthPHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoO2ErKyl7Y29uc3Qgcz1NYXRoLmFicyhNYXRoLmh5cG90KHRoaXMuX2ZmdE91dHB1dFsyKmFdLHRoaXMuX2ZmdE91dHB1dFsyKmErMV0pKSp0O3RoaXMuX2xhc3RUcmFuc2Zvcm1bYV09ZSp0aGlzLl9sYXN0VHJhbnNmb3JtW2FdKygxLWUpKnN9fV9mbHVzaCgpe2lmKHRoaXMuX2RvRmZ0KCksdGhpcy5faXNMaXN0ZW5pbmdUby5mcmVxdWVuY3lkYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGbG9hdFRvRGIodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6cy5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dH0pfWlmKHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGEpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRUb0J5dGVEYXRhKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOnMuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDp0fSl9fV9nZXRGbG9hdEZyZXF1ZW5jeURhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9kb0ZmdCgpLHRoaXMuX2NvbnZlcnRGbG9hdFRvRGIoZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTpzLnJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX1fZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodCl7dGhpcy5fZG9GZnQoKTtjb25zdCBlPW5ldyBVaW50OEFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0VG9CeXRlRGF0YShlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOnMucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9X2dldEZsb2F0VGltZURvbWFpbkRhdGEodCl7dGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOnMucmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOnRoaXMuX2ZmdElucHV0fSl9X2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0KXt0aGlzLl91cGRhdGVGZnRJbnB1dCgpO2NvbnN0IGU9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZmZ0U2l6ZSk7Zm9yKGxldCB0PTA7dDx0aGlzLl9mZnRTaXplOysrdCllW3RdPWgoMTI4Kih0aGlzLl9mZnRJbnB1dFt0XSsxKXwwLDAsMjU1KTt0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOnMucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfXByb2Nlc3ModCxlLGEpe2NvbnN0IHM9YS5pc1JlY29yZGluZztmb3IobGV0IGU9MDtlPHQubGVuZ3RoO2UrKyl7aWYoMT09PXNbZV0mJnRbMF1bMF0pZm9yKGxldCBlPTA7ZTx0WzBdWzBdLmxlbmd0aDtlKyspdGhpcy5fYXBwZW5kVG9CdWZmZXIodFswXVswXVtlXSl9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJBZHZhbmNlZEFuYWx5c2VyUHJvY2Vzc29yIixsKSx0LkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3I9bCxPYmplY3QuZGVmaW5lUHJvcGVydHkodCwiX19lc01vZHVsZSIse3ZhbHVlOiEwfSl9KSk7Cg==";

  class AdvancedAnalyserNode extends AudioWorkletNode {
      fftSize;
      samplesBetweenTransforms;
      _portMapId = 0;
      _portMap = new Map();
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
          [EventListenerTypes.timedomaindata]: [],
          [EventListenerTypes.bytetimedomaindata]: [],
      };
      constructor(context, { fftSize = 1024, samplesBetweenTransforms, windowFunction = WindowingFunctionTypes.blackmanWindow }) {
          super(context, 'AdvancedAnalyserProcessor', {
              processorOptions: {
                  [ProcessorParameters.fftSize]: fftSize,
                  [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
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
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.frequencydata, { detail: event.payload }));
                  break;
              }
              case MessageTypes.byteFrequencyDataAvailable: {
                  this.dispatchEvent(new CustomEvent(EventListenerTypes.bytefrequencydata, { detail: event.payload }));
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
