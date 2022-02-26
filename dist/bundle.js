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
      MessageTypes[MessageTypes["floatTimeDomainData"] = 8] = "floatTimeDomainData";
      MessageTypes[MessageTypes["byteTimeDomainData"] = 9] = "byteTimeDomainData";
      MessageTypes[MessageTypes["startedListeningTo"] = 10] = "startedListeningTo";
      MessageTypes[MessageTypes["stoppedListeningTo"] = 11] = "stoppedListeningTo";
  })(MessageTypes || (MessageTypes = {}));
  var ProcessorParameters;
  (function (ProcessorParameters) {
      ProcessorParameters["fftSize"] = "fftSize";
      ProcessorParameters["samplesBetweenTransforms"] = "samplesBetweenTransforms";
      ProcessorParameters["dataAsByteArray"] = "dataAsByteArray";
  })(ProcessorParameters || (ProcessorParameters = {}));
  var EventListenerTypes;
  (function (EventListenerTypes) {
      EventListenerTypes["frequencydata"] = "frequencydata";
      EventListenerTypes["bytefrequencydata"] = "bytefrequencydata";
  })(EventListenerTypes || (EventListenerTypes = {}));

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLHM9MDtzPGUubGVuZ3RoO3MrPTIpe2NvbnN0IHQ9TWF0aC5QSSpzL3RoaXMuc2l6ZTtlW3NdPU1hdGguY29zKHQpLGVbcysxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgYT0wLGk9MTt0aGlzLnNpemU+aTtpPDw9MSlhKys7dGhpcy5fd2lkdGg9YSUyPT0wP2EtMTphLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgcj0wO3I8dGhpcy5fYml0cmV2Lmxlbmd0aDtyKyspe3RoaXMuX2JpdHJldltyXT0wO2Zvcih2YXIgbj0wO248dGhpcy5fd2lkdGg7bis9Mil7dmFyIG89dGhpcy5fd2lkdGgtbi0yO3RoaXMuX2JpdHJldltyXXw9KHI+Pj5uJjMpPDxvfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIHM9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBzPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGE9MDthPHQubGVuZ3RoO2ErPTIpc1thPj4+MV09dFthXTtyZXR1cm4gc30sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIHM9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxhPTA7YTxzLmxlbmd0aDthKz0yKXNbYV09dFthPj4+MV0sc1thKzFdPTA7cmV0dXJuIHN9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLHM9ZT4+PjEsYT0yO2E8czthKz0yKXRbZS1hXT10W2FdLHRbZS1hKzFdPS10W2ErMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIHM9MDtzPHQubGVuZ3RoO3MrKyl0W3NdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUscz10aGlzLl9vdXQsYT10aGlzLl9jc2l6ZSxpPTE8PHRoaXMuX3dpZHRoLHI9YS9pPDwxLG49dGhpcy5fYml0cmV2O2lmKDQ9PT1yKWZvcih0PTAsZT0wO3Q8YTt0Kz1yLGUrKyl7Y29uc3Qgcz1uW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxzLGkpfWVsc2UgZm9yKHQ9MCxlPTA7dDxhO3QrPXIsZSsrKXtjb25zdCBzPW5bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LHMsaSl9dmFyIG89dGhpcy5faW52Py0xOjEsZj10aGlzLnRhYmxlO2ZvcihpPj49MjtpPj0yO2k+Pj0yKXt2YXIgaD0ocj1hL2k8PDEpPj4+Mjtmb3IodD0wO3Q8YTt0Kz1yKWZvcih2YXIgbD10K2gsXz10LHU9MDtfPGw7Xys9Mix1Kz1pKXtjb25zdCB0PV8sZT10K2gsYT1lK2gsaT1hK2gscj1zW3RdLG49c1t0KzFdLGw9c1tlXSxjPXNbZSsxXSxwPXNbYV0seT1zW2ErMV0sZD1zW2ldLG09c1tpKzFdLGc9cixiPW4sdj1mW3VdLFQ9bypmW3UrMV0sRj1sKnYtYypULEE9bCpUK2MqdixEPWZbMip1XSx3PW8qZlsyKnUrMV0scT1wKkQteSp3LHo9cCp3K3kqRCxCPWZbMyp1XSxNPW8qZlszKnUrMV0sQz1kKkItbSpNLFM9ZCpNK20qQix4PWcrcSxMPWIreixJPWctcSxPPWIteixQPUYrQyxSPUErUyxFPW8qKEYtQyksaz1vKihBLVMpLGo9eCtQLFU9TCtSLFY9eC1QLFc9TC1SLEc9SStrLEg9Ty1FLEo9SS1rLEs9TytFO3NbdF09aixzW3QrMV09VSxzW2VdPUcsc1tlKzFdPUgsc1thXT1WLHNbYSsxXT1XLHNbaV09SixzW2krMV09S319fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUscyl7Y29uc3QgYT10aGlzLl9vdXQsaT10aGlzLl9kYXRhLHI9aVtlXSxuPWlbZSsxXSxvPWlbZStzXSxmPWlbZStzKzFdLGg9citvLGw9bitmLF89ci1vLHU9bi1mO2FbdF09aCxhW3QrMV09bCxhW3QrMl09XyxhW3QrM109dX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLHMpe2NvbnN0IGE9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxyPXRoaXMuX2ludj8tMToxLG49MipzLG89MypzLGY9aVtlXSxoPWlbZSsxXSxsPWlbZStzXSxfPWlbZStzKzFdLHU9aVtlK25dLGM9aVtlK24rMV0scD1pW2Urb10seT1pW2UrbysxXSxkPWYrdSxtPWgrYyxnPWYtdSxiPWgtYyx2PWwrcCxUPV8reSxGPXIqKGwtcCksQT1yKihfLXkpLEQ9ZCt2LHc9bStULHE9ZytBLHo9Yi1GLEI9ZC12LE09bS1ULEM9Zy1BLFM9YitGO2FbdF09RCxhW3QrMV09dyxhW3QrMl09cSxhW3QrM109eixhW3QrNF09QixhW3QrNV09TSxhW3QrNl09QyxhW3QrN109U30sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxzPXRoaXMuX291dCxhPXRoaXMuX2NzaXplLGk9MTw8dGhpcy5fd2lkdGgscj1hL2k8PDEsbj10aGlzLl9iaXRyZXY7aWYoND09PXIpZm9yKHQ9MCxlPTA7dDxhO3QrPXIsZSsrKXtjb25zdCBzPW5bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxzPj4+MSxpPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGE7dCs9cixlKyspe2NvbnN0IHM9bltlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LHM+Pj4xLGk+Pj4xKX12YXIgbz10aGlzLl9pbnY/LTE6MSxmPXRoaXMudGFibGU7Zm9yKGk+Pj0yO2k+PTI7aT4+PTIpe3ZhciBoPShyPWEvaTw8MSk+Pj4xLGw9aD4+PjEsXz1sPj4+MTtmb3IodD0wO3Q8YTt0Kz1yKWZvcih2YXIgdT0wLGM9MDt1PD1fO3UrPTIsYys9aSl7dmFyIHA9dCt1LHk9cCtsLGQ9eStsLG09ZCtsLGc9c1twXSxiPXNbcCsxXSx2PXNbeV0sVD1zW3krMV0sRj1zW2RdLEE9c1tkKzFdLEQ9c1ttXSx3PXNbbSsxXSxxPWcsej1iLEI9ZltjXSxNPW8qZltjKzFdLEM9dipCLVQqTSxTPXYqTStUKkIseD1mWzIqY10sTD1vKmZbMipjKzFdLEk9Rip4LUEqTCxPPUYqTCtBKngsUD1mWzMqY10sUj1vKmZbMypjKzFdLEU9RCpQLXcqUixrPUQqUit3KlAsaj1xK0ksVT16K08sVj1xLUksVz16LU8sRz1DK0UsSD1TK2ssSj1vKihDLUUpLEs9byooUy1rKSxOPWorRyxRPVUrSCxYPVYrSyxZPVctSjtpZihzW3BdPU4sc1twKzFdPVEsc1t5XT1YLHNbeSsxXT1ZLDAhPT11KXtpZih1IT09Xyl7dmFyIFo9VistbypLLCQ9LVcrLW8qSix0dD1qKy1vKkcsZXQ9LVUtIC1vKkgsc3Q9dCtsLXUsYXQ9dCtoLXU7c1tzdF09WixzW3N0KzFdPSQsc1thdF09dHQsc1thdCsxXT1ldH19ZWxzZXt2YXIgaXQ9ai1HLHJ0PVUtSDtzW2RdPWl0LHNbZCsxXT1ydH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxzKXtjb25zdCBhPXRoaXMuX291dCxpPXRoaXMuX2RhdGEscj1pW2VdLG49aVtlK3NdLG89cituLGY9ci1uO2FbdF09byxhW3QrMV09MCxhW3QrMl09ZixhW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxzKXtjb25zdCBhPXRoaXMuX291dCxpPXRoaXMuX2RhdGEscj10aGlzLl9pbnY/LTE6MSxuPTIqcyxvPTMqcyxmPWlbZV0saD1pW2Urc10sbD1pW2Urbl0sXz1pW2Urb10sdT1mK2wsYz1mLWwscD1oK18seT1yKihoLV8pLGQ9dStwLG09YyxnPS15LGI9dS1wLHY9YyxUPXk7YVt0XT1kLGFbdCsxXT0wLGFbdCsyXT1tLGFbdCszXT1nLGFbdCs0XT1iLGFbdCs1XT0wLGFbdCs2XT12LGFbdCs3XT1UfTt2YXIgYSxpLHI7IWZ1bmN0aW9uKHQpe3RbdC5zdGFydD0wXT0ic3RhcnQiLHRbdC5zdG9wPTFdPSJzdG9wIix0W3QuZnJlcXVlbmN5RGF0YUF2YWlsYWJsZT0yXT0iZnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTNdPSJieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmdldEZsb2F0RnJlcXVlbmN5RGF0YT00XT0iZ2V0RmxvYXRGcmVxdWVuY3lEYXRhIix0W3QucmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTVdPSJyZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5nZXRCeXRlRnJlcXVlbmN5RGF0YT02XT0iZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLHRbdC5yZXF1ZXN0ZWRCeXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZT03XT0icmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5mbG9hdFRpbWVEb21haW5EYXRhPThdPSJmbG9hdFRpbWVEb21haW5EYXRhIix0W3QuYnl0ZVRpbWVEb21haW5EYXRhPTldPSJieXRlVGltZURvbWFpbkRhdGEiLHRbdC5zdGFydGVkTGlzdGVuaW5nVG89MTBdPSJzdGFydGVkTGlzdGVuaW5nVG8iLHRbdC5zdG9wcGVkTGlzdGVuaW5nVG89MTFdPSJzdG9wcGVkTGlzdGVuaW5nVG8ifShhfHwoYT17fSkpLGZ1bmN0aW9uKHQpe3QuZmZ0U2l6ZT0iZmZ0U2l6ZSIsdC5zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9InNhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtcyIsdC5kYXRhQXNCeXRlQXJyYXk9ImRhdGFBc0J5dGVBcnJheSJ9KGl8fChpPXt9KSksZnVuY3Rpb24odCl7dC5mcmVxdWVuY3lkYXRhPSJmcmVxdWVuY3lkYXRhIix0LmJ5dGVmcmVxdWVuY3lkYXRhPSJieXRlZnJlcXVlbmN5ZGF0YSJ9KHJ8fChyPXt9KSk7Y29uc3Qgbj10PT4yMCpNYXRoLmxvZzEwKHQpLG89KHQsZSxzKT0+TWF0aC5taW4oTWF0aC5tYXgodCxlKSxzKTtjbGFzcyBmIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye19zYW1wbGVzQ291bnQ9MDtfY291bnQ9MDtfZmlyc3Q9ITA7X2ZmdEFuYWx5c2VyO19mZnRTaXplO19mZnRJbnB1dDtfZmZ0T3V0cHV0O19sYXN0VHJhbnNmb3JtO19zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM7X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITF9O19idWZmZXI9bmV3IEZsb2F0MzJBcnJheSgzMjc2OCk7X21pbkRlY2liZWxzPS0xMDA7X21heERlY2liZWxzPS0zMDtfc21vb3RoaW5nVGltZUNvbnN0YW50PTA7X3BvcnRNYXA9bmV3IE1hcDtzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJpc1JlY29yZGluZyIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcih0KXtzdXBlcigpO2NvbnN0e2ZmdFNpemU6ZSxzYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM6YX09dC5wcm9jZXNzb3JPcHRpb25zO3RoaXMuX2ZmdEFuYWx5c2VyPW5ldyBzKGUpLHRoaXMuX2ZmdElucHV0PW5ldyBGbG9hdDMyQXJyYXkoZSksdGhpcy5fZmZ0T3V0cHV0PXRoaXMuX2ZmdEFuYWx5c2VyLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuX2xhc3RUcmFuc2Zvcm09bmV3IEZsb2F0MzJBcnJheShlLzIpLHRoaXMuX2ZmdFNpemU9ZSx0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9YSx0aGlzLl9zYW1wbGVzQ291bnQ9MCx0aGlzLnBvcnQub25tZXNzYWdlPXQ9PnRoaXMuX29ubWVzc2FnZSh0LmRhdGEpfV9vbm1lc3NhZ2UodCl7c3dpdGNoKHQudHlwZSl7Y2FzZSBhLmdldEZsb2F0RnJlcXVlbmN5RGF0YTp0aGlzLl9nZXRGbG9hdEZyZXF1ZW5jeURhdGEodC5pZCk7YnJlYWs7Y2FzZSBhLnN0YXJ0ZWRMaXN0ZW5pbmdUbzp0aGlzLl9pc0xpc3RlbmluZ1RvW3QucGF5bG9hZF09ITA7YnJlYWs7Y2FzZSBhLnN0b3BwZWRMaXN0ZW5pbmdUbzp0aGlzLl9pc0xpc3RlbmluZ1RvW3QucGF5bG9hZF09ITF9fV9wb3N0TWVzc2FnZSh0LGUpe3RoaXMucG9ydC5wb3N0TWVzc2FnZSh0LGUpfV9zaG91bGRGbHVzaCgpe3JldHVybih0aGlzLl9pc0xpc3RlbmluZ1RvLmZyZXF1ZW5jeWRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGEpJiZ0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPT0wfV9hcHBlbmRUb0J1ZmZlcih0KXt0aGlzLl9idWZmZXJbdGhpcy5fc2FtcGxlc0NvdW50JXRoaXMuX2J1ZmZlci5sZW5ndGhdPXQsdGhpcy5fc2FtcGxlc0NvdW50PXRoaXMuX3NhbXBsZXNDb3VudCsxLHRoaXMuX3Nob3VsZEZsdXNoKCkmJnRoaXMuX2ZsdXNoKCl9X3VwZGF0ZUZmdElucHV0KCl7Y29uc3QgdD0odGhpcy5fc2FtcGxlc0NvdW50LXRoaXMuX2ZmdFNpemUpJXRoaXMuX2J1ZmZlci5sZW5ndGg7Zm9yKGxldCBlPTA7ZTx0aGlzLl9mZnRJbnB1dC5sZW5ndGg7ZSsrKXRoaXMuX2ZmdElucHV0W2VdPXQrZTwwPzA6dGhpcy5fYnVmZmVyWyh0K2UpJXRoaXMuX2J1ZmZlci5sZW5ndGhdfV9jb252ZXJ0RmxvYXRUb0RiKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3Qgcz10aGlzLl9sYXN0VHJhbnNmb3JtO2ZvcihsZXQgYT0wO2E8ZTsrK2EpdFthXT1uKHNbYV0pfX1fY29udmVydFRvQnl0ZURhdGEodCl7Y29uc3QgZT1NYXRoLm1pbih0aGlzLl9sYXN0VHJhbnNmb3JtLmxlbmd0aCx0Lmxlbmd0aCk7aWYoZT4wKXtjb25zdCBzPXRoaXMuX2xhc3RUcmFuc2Zvcm0sYT0xLyh0aGlzLl9tYXhEZWNpYmVscy10aGlzLl9taW5EZWNpYmVscyk7Zm9yKGxldCBpPTA7aTxlOysraSl7Y29uc3QgZT1zW2ldLHI9MjU1KihuKGUpLXRoaXMuX21pbkRlY2liZWxzKSphO3RbaV09bygwfHIsMCwyNTUpfX19X2RvRmZ0KCl7dGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9mZnRBbmFseXNlci5yZWFsVHJhbnNmb3JtKHRoaXMuX2ZmdE91dHB1dCx0aGlzLl9mZnRJbnB1dCk7Y29uc3QgdD0xL3RoaXMuX2ZmdFNpemUsZT1vKHRoaXMuX3Ntb290aGluZ1RpbWVDb25zdGFudCwwLDEpO2ZvcihsZXQgcz0wO3M8dGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGg7cysrKXtjb25zdCBhPU1hdGguYWJzKE1hdGguaHlwb3QodGhpcy5fZmZ0T3V0cHV0WzIqc10sdGhpcy5fZmZ0T3V0cHV0WzIqcysxXSkpKnQ7dGhpcy5fbGFzdFRyYW5zZm9ybVtzXT1lKnRoaXMuX2xhc3RUcmFuc2Zvcm1bc10rKDEtZSkqYX19Z2V0IF9mZnRCaW5TaXplKCl7cmV0dXJuIHRoaXMuX2ZmdFNpemUvMn1fZmx1c2goKXtpZih0aGlzLl9kb0ZmdCgpLHRoaXMuX2lzTGlzdGVuaW5nVG8uZnJlcXVlbmN5ZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZmdEJpblNpemUpO3RoaXMuX2NvbnZlcnRGbG9hdFRvRGIodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6YS5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dH0pfWVsc2V7Y29uc3QgdD1uZXcgVWludDhBcnJheSh0aGlzLl9mZnRCaW5TaXplKTt0aGlzLl9jb252ZXJ0VG9CeXRlRGF0YSh0KSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTphLmJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dH0pfX1fZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHQpe2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl9mZnRTaXplLzIpO3RoaXMuX2RvRmZ0KCksdGhpcy5fY29udmVydEZsb2F0VG9EYihlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmEucmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfV9nZXRCeXRlRnJlcXVlbmN5RGF0YSh0KXt0aGlzLl9kb0ZmdCgpO2NvbnN0IGU9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZmZ0U2l6ZS8yKTt0aGlzLl9jb252ZXJ0VG9CeXRlRGF0YShlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmEucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9cHJvY2Vzcyh0LGUscyl7Y29uc3QgYT1zLmlzUmVjb3JkaW5nO2ZvcihsZXQgZT0wO2U8dC5sZW5ndGg7ZSsrKXtpZigxPT09YVtlXSYmdFswXVswXSlmb3IobGV0IGU9MDtlPHRbMF1bMF0ubGVuZ3RoO2UrKyl0aGlzLl9hcHBlbmRUb0J1ZmZlcih0WzBdWzBdW2VdKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoIkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3IiLGYpLHQuQWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj1mLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KX0pKTsK";

  class AdvancedAnalyserNode extends AudioWorkletNode {
      fftSize;
      samplesBetweenTransforms;
      _portMapId = 0;
      _portMap = new Map();
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
      };
      // _onDataAvailable = new CustomEvent('ondataavailable', { value: })
      constructor(context, { fftSize = 1024, samplesBetweenTransforms, }) {
          super(context, 'AdvancedAnalyserProcessor', {
              processorOptions: {
                  [ProcessorParameters.fftSize]: fftSize,
                  [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize
              }
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
              case MessageTypes.requestedFloatFrequencyDataAvailable: {
                  const { id, payload } = event;
                  const resolve = this._portMap.get(id);
                  this._portMap.delete(id);
                  resolve(payload);
                  break;
              }
          }
      }
      getFloatFrequencyData() {
          return new Promise(resolve => {
              const id = this._uniqId();
              this._portMap.set(id, (buffer) => resolve(new Float32Array(buffer)));
              this._postMessage({
                  id,
                  type: MessageTypes.getFloatFrequencyData,
              });
          });
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
