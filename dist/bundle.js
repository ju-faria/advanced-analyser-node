(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.advancedAnalyserNode = {}));
})(this, (function (exports) { 'use strict';

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgaT0wLHM9MTt0aGlzLnNpemU+cztzPDw9MSlpKys7dGhpcy5fd2lkdGg9aSUyPT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGk9MDtpPHQubGVuZ3RoO2krPTIpYVtpPj4+MV09dFtpXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxpPTA7aTxhLmxlbmd0aDtpKz0yKWFbaV09dFtpPj4+MV0sYVtpKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEsaT0yO2k8YTtpKz0yKXRbZS1pXT10W2ldLHRbZS1pKzFdPS10W2krMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQsaT10aGlzLl9jc2l6ZSxzPTE8PHRoaXMuX3dpZHRoLG49aS9zPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8aTt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLHMpfWVsc2UgZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEscyl9dmFyIHI9dGhpcy5faW52Py0xOjEsbD10aGlzLnRhYmxlO2ZvcihzPj49MjtzPj0yO3M+Pj0yKXt2YXIgaD0obj1pL3M8PDEpPj4+Mjtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgZj10K2gsbT10LHU9MDttPGY7bSs9Mix1Kz1zKXtjb25zdCB0PW0sZT10K2gsaT1lK2gscz1pK2gsbj1hW3RdLG89YVt0KzFdLGY9YVtlXSxfPWFbZSsxXSxjPWFbaV0scD1hW2krMV0seT1hW3NdLGQ9YVtzKzFdLGI9bixEPW8sZz1sW3VdLFQ9cipsW3UrMV0sdj1mKmctXypULEY9ZipUK18qZyxBPWxbMip1XSxxPXIqbFsyKnUrMV0sdz1jKkEtcCpxLE09YypxK3AqQSxDPWxbMyp1XSxCPXIqbFszKnUrMV0sUz15KkMtZCpCLEw9eSpCK2QqQyxJPWIrdyx6PUQrTSxQPWItdyxrPUQtTSx4PXYrUyxPPUYrTCxOPXIqKHYtUyksVz1yKihGLUwpLFI9SSt4LEU9eitPLFU9SS14LGo9ei1PLEg9UCtXLFY9ay1OLEc9UC1XLEo9aytOO2FbdF09UixhW3QrMV09RSxhW2VdPUgsYVtlKzFdPVYsYVtpXT1VLGFbaSsxXT1qLGFbc109RyxhW3MrMV09Sn19fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3QgaT10aGlzLl9vdXQscz10aGlzLl9kYXRhLG49c1tlXSxvPXNbZSsxXSxyPXNbZSthXSxsPXNbZSthKzFdLGg9bityLGY9bytsLG09bi1yLHU9by1sO2lbdF09aCxpW3QrMV09ZixpW3QrMl09bSxpW3QrM109dX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IGk9dGhpcy5fb3V0LHM9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGw9c1tlXSxoPXNbZSsxXSxmPXNbZSthXSxtPXNbZSthKzFdLHU9c1tlK29dLF89c1tlK28rMV0sYz1zW2Urcl0scD1zW2UrcisxXSx5PWwrdSxkPWgrXyxiPWwtdSxEPWgtXyxnPWYrYyxUPW0rcCx2PW4qKGYtYyksRj1uKihtLXApLEE9eStnLHE9ZCtULHc9YitGLE09RC12LEM9eS1nLEI9ZC1ULFM9Yi1GLEw9RCt2O2lbdF09QSxpW3QrMV09cSxpW3QrMl09dyxpW3QrM109TSxpW3QrNF09QyxpW3QrNV09QixpW3QrNl09UyxpW3QrN109TH0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxpPXRoaXMuX2NzaXplLHM9MTw8dGhpcy5fd2lkdGgsbj1pL3M8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxzPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGk7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLHM+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxsPXRoaXMudGFibGU7Zm9yKHM+Pj0yO3M+PTI7cz4+PTIpe3ZhciBoPShuPWkvczw8MSk+Pj4xLGY9aD4+PjEsbT1mPj4+MTtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgdT0wLF89MDt1PD1tO3UrPTIsXys9cyl7dmFyIGM9dCt1LHA9YytmLHk9cCtmLGQ9eStmLGI9YVtjXSxEPWFbYysxXSxnPWFbcF0sVD1hW3ArMV0sdj1hW3ldLEY9YVt5KzFdLEE9YVtkXSxxPWFbZCsxXSx3PWIsTT1ELEM9bFtfXSxCPXIqbFtfKzFdLFM9ZypDLVQqQixMPWcqQitUKkMsST1sWzIqX10sej1yKmxbMipfKzFdLFA9dipJLUYqeixrPXYqeitGKkkseD1sWzMqX10sTz1yKmxbMypfKzFdLE49QSp4LXEqTyxXPUEqTytxKngsUj13K1AsRT1NK2ssVT13LVAsaj1NLWssSD1TK04sVj1MK1csRz1yKihTLU4pLEo9ciooTC1XKSxLPVIrSCxRPUUrVixYPVUrSixZPWotRztpZihhW2NdPUssYVtjKzFdPVEsYVtwXT1YLGFbcCsxXT1ZLDAhPT11KXtpZih1IT09bSl7dmFyIFo9VSstcipKLCQ9LWorLXIqRyx0dD1SKy1yKkgsZXQ9LUUtIC1yKlYsYXQ9dCtmLXUsaXQ9dCtoLXU7YVthdF09WixhW2F0KzFdPSQsYVtpdF09dHQsYVtpdCsxXT1ldH19ZWxzZXt2YXIgc3Q9Ui1ILG50PUUtVjthW3ldPXN0LGFbeSsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj1zW2VdLG89c1tlK2FdLHI9bitvLGw9bi1vO2lbdF09cixpW3QrMV09MCxpW3QrMl09bCxpW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxsPXNbZV0saD1zW2UrYV0sZj1zW2Urb10sbT1zW2Urcl0sdT1sK2YsXz1sLWYsYz1oK20scD1uKihoLW0pLHk9dStjLGQ9XyxiPS1wLEQ9dS1jLGc9XyxUPXA7aVt0XT15LGlbdCsxXT0wLGlbdCsyXT1kLGlbdCszXT1iLGlbdCs0XT1ELGlbdCs1XT0wLGlbdCs2XT1nLGlbdCs3XT1UfTt2YXIgaSxzLG4sbzshZnVuY3Rpb24odCl7dFt0LnN0YXJ0PTBdPSJzdGFydCIsdFt0LnN0b3A9MV09InN0b3AiLHRbdC51cGRhdGVQcm9jZXNzb3JPcHRpb25zPTJdPSJ1cGRhdGVQcm9jZXNzb3JPcHRpb25zIix0W3QuZnJlcXVlbmN5RGF0YUF2YWlsYWJsZT0zXT0iZnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTRdPSJieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LnRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTVdPSJ0aW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZT02XT0iYnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhPTddPSJnZXRGbG9hdEZyZXF1ZW5jeURhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGU9OF09InJlcXVlc3RlZEZsb2F0RnJlcXVlbmN5RGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVGcmVxdWVuY3lEYXRhPTldPSJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPTEwXT0icmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5nZXRGbG9hdFRpbWVEb21haW5EYXRhPTExXT0iZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSIsdFt0LnJlcXVlc3RlZEZsb2F0VGltZURvbWFpbkRhdGFBdmFpbGFibGU9MTJdPSJyZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3QuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhPTEzXT0iZ2V0Qnl0ZVRpbWVEb21haW5EYXRhIix0W3QucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTE0XT0icmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlIix0W3Quc3RhcnRlZExpc3RlbmluZ1RvPTE1XT0ic3RhcnRlZExpc3RlbmluZ1RvIix0W3Quc3RvcHBlZExpc3RlbmluZ1RvPTE2XT0ic3RvcHBlZExpc3RlbmluZ1RvIn0oaXx8KGk9e30pKSxmdW5jdGlvbih0KXt0LmZmdFNpemU9ImZmdFNpemUiLHQuc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPSJzYW1wbGVzQmV0d2VlblRyYW5zZm9ybXMiLHQudGltZURvbWFpblNhbXBsZXNDb3VudD0idGltZURvbWFpblNhbXBsZXNDb3VudCIsdC53aW5kb3dGdW5jdGlvbj0id2luZG93RnVuY3Rpb24iLHQubWluRGVjaWJlbHM9Im1pbkRlY2liZWxzIix0Lm1heERlY2liZWxzPSJtYXhEZWNpYmVscyIsdC5zbW9vdGhpbmdUaW1lQ29uc3RhbnQ9InNtb290aGluZ1RpbWVDb25zdGFudCJ9KHN8fChzPXt9KSksZnVuY3Rpb24odCl7dC5mcmVxdWVuY3lkYXRhPSJmcmVxdWVuY3lkYXRhIix0LmJ5dGVmcmVxdWVuY3lkYXRhPSJieXRlZnJlcXVlbmN5ZGF0YSIsdC50aW1lZG9tYWluZGF0YT0idGltZWRvbWFpbmRhdGEiLHQuYnl0ZXRpbWVkb21haW5kYXRhPSJieXRldGltZWRvbWFpbmRhdGEifShufHwobj17fSkpLGZ1bmN0aW9uKHQpe3QucmVjdGFuZ3VsYXI9InJlY3Rhbmd1bGFyIix0LmJsYWNrbWFuPSJibGFja21hbiIsdC5udXR0YWxsPSJudXR0YWxsIix0LmJsYWNrbWFuTnV0dGFsbD0iYmxhY2ttYW4tbnV0dGFsbCIsdC5ibGFja21hbkhhcnJpcz0iYmxhY2ttYW4taGFycmlzIix0Lmhhbm49Imhhbm4iLHQuaGFtbWluZz0iaGFtbWluZyIsdC5iYXJ0bGV0dD0iYmFydGxldHQifShvfHwobz17fSkpO2NvbnN0IHI9KHQsZSk9Pi41LS41Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSxsPSh0LGUpPT4uNTQtLjQ2Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSxoPSh0LGUpPT4uNDItLjUqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4wOCpNYXRoLmNvcyg0Kk1hdGguUEkqdC8oZS0xKSksZj0odCxlKT0+LjM1NTc2OC0uNDg3Mzk2Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMTQ0MjMyKk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKS0uMDEyNjA0Kk1hdGguY29zKDYqTWF0aC5QSSp0LyhlLTEpKSxtPSh0LGUpPT4uMzU4NzUtLjQ4ODI5Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMTQxMjgqTWF0aC5jb3MoNCpNYXRoLlBJKnQvKGUtMSkpLS4wMTE2OCpNYXRoLmNvcyg2Kk1hdGguUEkqdC8oZS0xKSksdT0odCxlKT0+LjM2MzU4MTktLjQ4OTE3NzUqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4xMzY1OTk1Kk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKS0uMDEwNjQxMSpNYXRoLmNvcyg2Kk1hdGguUEkqdC8oZS0xKSksXz0odCxlKT0+MS1NYXRoLmFicygyKih0LS41KihlLTEpKS8oZS0xKSksYz0odCxlLGEpPT57Y29uc3QgaT10Lmxlbmd0aDtmb3IobGV0IHM9MDtzPGk7KytzKXRbc109dFtzXSplKHMsaSxhKX0scD17W28ucmVjdGFuZ3VsYXJdOigpPT57fSxbby5oYW5uXTp0PT5jKHQsciksW28uaGFtbWluZ106dD0+Yyh0LGwpLFtvLmJsYWNrbWFuXTp0PT5jKHQsaCksW28uYmxhY2ttYW5OdXR0YWxsXTp0PT5jKHQsdSksW28uYmxhY2ttYW5IYXJyaXNdOnQ9PmModCxtKSxbby5udXR0YWxsXTp0PT5jKHQsZiksW28uYmFydGxldHRdOnQ9PmModCxfKX0seT10PT4yMCpNYXRoLmxvZzEwKHQpLGQ9KHQsZSxhKT0+TWF0aC5taW4oTWF0aC5tYXgodCxlKSxhKTtjbGFzcyBiIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye19zYW1wbGVzQ291bnQ9MDtfY291bnQ9MDtfZmlyc3Q9ITA7X2ZmdEFuYWx5c2VyO19mZnRTaXplO19mZnRJbnB1dDtfZmZ0T3V0cHV0O19sYXN0VHJhbnNmb3JtO19zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM7X3dpbmRvd0Z1bmN0aW9uPW8uYmxhY2ttYW47X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITEsdGltZWRvbWFpbmRhdGE6ITEsYnl0ZXRpbWVkb21haW5kYXRhOiExfTtfYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkoMzI3NjgpO19taW5EZWNpYmVscz0tMTAwO19tYXhEZWNpYmVscz0tMzA7X3Ntb290aGluZ1RpbWVDb25zdGFudD0wO19wb3J0TWFwPW5ldyBNYXA7X3RpbWVEb21haW5TYW1wbGVzQ291bnQ7Z2V0IF9mcmVxdWVuY3lCaW5Db3VudCgpe3JldHVybiB0aGlzLl9mZnRTaXplLzJ9c2V0IGZyZXF1ZW5jeUJpbkNvdW50KHQpe3RoaXMuX2ZmdFNpemU9Mip0fWdldCBfaXNMaXN0ZW5pbmdUb0ZyZXF1ZW5jeURhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUby5mcmVxdWVuY3lkYXRhfHx0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGVmcmVxdWVuY3lkYXRhfWdldCBfaXNMaXN0ZW5pbmdUb1RpbWVEb21haW5EYXRhKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG8udGltZWRvbWFpbmRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZXRpbWVkb21haW5kYXRhfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImlzUmVjb3JkaW5nIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHQpe3N1cGVyKCk7Y29uc3R7ZmZ0U2l6ZTplLHNhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtczppLHRpbWVEb21haW5TYW1wbGVzQ291bnQ6cyx3aW5kb3dGdW5jdGlvbjpuPW8uYmxhY2ttYW4sbWluRGVjaWJlbHM6cixtYXhEZWNpYmVsczpsLHNtb290aGluZ1RpbWVDb25zdGFudDpofT10LnByb2Nlc3Nvck9wdGlvbnM7dGhpcy5fZmZ0QW5hbHlzZXI9bmV3IGEoZSksdGhpcy5fZmZ0SW5wdXQ9bmV3IEZsb2F0MzJBcnJheShlKSx0aGlzLl9mZnRPdXRwdXQ9dGhpcy5fZmZ0QW5hbHlzZXIuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy5fZmZ0U2l6ZT1lLHRoaXMuX2xhc3RUcmFuc2Zvcm09bmV3IEZsb2F0MzJBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCksdGhpcy5fc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPWksdGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudD1zLHRoaXMuX3NhbXBsZXNDb3VudD0wLHRoaXMuX3dpbmRvd0Z1bmN0aW9uPW4sdGhpcy5fbWluRGVjaWJlbHM9cix0aGlzLl9tYXhEZWNpYmVscz1sLHRoaXMuX3Ntb290aGluZ1RpbWVDb25zdGFudD1oLHRoaXMucG9ydC5vbm1lc3NhZ2U9dD0+dGhpcy5fb25tZXNzYWdlKHQuZGF0YSl9X29ubWVzc2FnZSh0KXtzd2l0Y2godC50eXBlKXtjYXNlIGkuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhOnRoaXMuX2dldEZsb2F0RnJlcXVlbmN5RGF0YSh0LmlkKTticmVhaztjYXNlIGkuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGE6dGhpcy5fZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodC5pZCk7YnJlYWs7Y2FzZSBpLmdldEZsb2F0VGltZURvbWFpbkRhdGE6dGhpcy5fZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIGkuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhOnRoaXMuX2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0LmlkKTticmVhaztjYXNlIGkuc3RhcnRlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMDticmVhaztjYXNlIGkuc3RvcHBlZExpc3RlbmluZ1RvOnRoaXMuX2lzTGlzdGVuaW5nVG9bdC5wYXlsb2FkXT0hMTticmVhaztjYXNlIGkudXBkYXRlUHJvY2Vzc29yT3B0aW9uczp7Y29uc3R7ZmZ0U2l6ZTplLHNhbXBsZXNCZXR3ZWVuVHJhbnNmb3JtczphLHRpbWVEb21haW5TYW1wbGVzQ291bnQ6aSx3aW5kb3dGdW5jdGlvbjpzLG1pbkRlY2liZWxzOm4sbWF4RGVjaWJlbHM6byxzbW9vdGhpbmdUaW1lQ29uc3RhbnQ6cn09dC5wYXlsb2FkO3ZvaWQgMCE9PWUmJih0aGlzLl9mZnRTaXplPWUpLHZvaWQgMCE9PWEmJih0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9YSksdm9pZCAwIT09aSYmKHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQ9aSksdm9pZCAwIT09cyYmKHRoaXMuX3dpbmRvd0Z1bmN0aW9uPXMpLHZvaWQgMCE9PW4mJih0aGlzLl9taW5EZWNpYmVscz1uKSx2b2lkIDAhPT1vJiYodGhpcy5fbWF4RGVjaWJlbHM9byksdm9pZCAwIT09ciYmKHRoaXMuX3Ntb290aGluZ1RpbWVDb25zdGFudD1yKTticmVha319fV9wb3N0TWVzc2FnZSh0LGUpe3RoaXMucG9ydC5wb3N0TWVzc2FnZSh0LGUpfV9zaG91bGRGbHVzaEZyZXF1ZW5jaWVzKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG9GcmVxdWVuY3lEYXRhJiZ0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zPT0wfV9zaG91bGRGbHVzaFRpbWVEb21haW5EYXRhKCl7cmV0dXJuIHRoaXMuX2lzTGlzdGVuaW5nVG9UaW1lRG9tYWluRGF0YSYmdGhpcy5fc2FtcGxlc0NvdW50JXRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQ9PTB9X2FwcGVuZFRvQnVmZmVyKHQpe3RoaXMuX2J1ZmZlclt0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fYnVmZmVyLmxlbmd0aF09dCx0aGlzLl9zYW1wbGVzQ291bnQ9dGhpcy5fc2FtcGxlc0NvdW50KzEsdGhpcy5fc2hvdWxkRmx1c2hGcmVxdWVuY2llcygpJiZ0aGlzLl9mbHVzaEZyZXF1ZW5jaWVzKCksdGhpcy5fc2hvdWxkRmx1c2hUaW1lRG9tYWluRGF0YSgpJiZ0aGlzLl9mbHVzaFRpbWVEb21haW5TYW1wbGVzKCl9X3VwZGF0ZUZmdElucHV0KCl7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0aGlzLl9mZnRJbnB1dCkscFt0aGlzLl93aW5kb3dGdW5jdGlvbl0odGhpcy5fZmZ0SW5wdXQpfV9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHQpe2NvbnN0IGU9dC5sZW5ndGgsYT0odGhpcy5fc2FtcGxlc0NvdW50LWUpJXRoaXMuX2J1ZmZlci5sZW5ndGg7Zm9yKGxldCBpPTA7aTxlO2krKyl0W2ldPWEraTwwPzA6dGhpcy5fYnVmZmVyWyhhK2kpJXRoaXMuX2J1ZmZlci5sZW5ndGhdfV9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3QgYT10aGlzLl9sYXN0VHJhbnNmb3JtO2ZvcihsZXQgaT0wO2k8ZTsrK2kpdFtpXT15KGFbaV0pfX1fY29udmVydEZyZXF1ZW5jaWVzVG9CeXRlRGF0YSh0KXtjb25zdCBlPU1hdGgubWluKHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoLHQubGVuZ3RoKTtpZihlPjApe2NvbnN0IGE9dGhpcy5fbGFzdFRyYW5zZm9ybSxpPTEvKHRoaXMuX21heERlY2liZWxzLXRoaXMuX21pbkRlY2liZWxzKTtmb3IobGV0IHM9MDtzPGU7KytzKXtjb25zdCBlPWFbc10sbj0yNTUqKHkoZSktdGhpcy5fbWluRGVjaWJlbHMpKmk7dFtzXT1kKDB8biwwLDI1NSl9fX1fY29udmVydFRpbWVEb21haW5EYXRhVG9CeXRlRGF0YSh0LGUpe2ZvcihsZXQgYT0wO2E8dC5sZW5ndGg7KythKWVbYV09ZCgxMjgqKHRbYV0rMSl8MCwwLDI1NSl9X2RvRmZ0KCl7dGhpcy5fZmZ0QW5hbHlzZXIucmVhbFRyYW5zZm9ybSh0aGlzLl9mZnRPdXRwdXQsdGhpcy5fZmZ0SW5wdXQpO2NvbnN0IHQ9MS90aGlzLl9mZnRTaXplLGU9ZCh0aGlzLl9zbW9vdGhpbmdUaW1lQ29uc3RhbnQsMCwxKTtmb3IobGV0IGE9MDthPHRoaXMuX2xhc3RUcmFuc2Zvcm0ubGVuZ3RoO2ErKyl7Y29uc3QgaT1NYXRoLmFicyhNYXRoLmh5cG90KHRoaXMuX2ZmdE91dHB1dFsyKmFdLHRoaXMuX2ZmdE91dHB1dFsyKmErMV0pKSp0O3RoaXMuX2xhc3RUcmFuc2Zvcm1bYV09ZSp0aGlzLl9sYXN0VHJhbnNmb3JtW2FdKygxLWUpKml9fV9mbHVzaEZyZXF1ZW5jaWVzKCl7aWYodGhpcy5fdXBkYXRlRmZ0SW5wdXQoKSx0aGlzLl9kb0ZmdCgpLHRoaXMuX2lzTGlzdGVuaW5nVG8uZnJlcXVlbmN5ZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkuZnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX1pZih0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGVmcmVxdWVuY3lkYXRhKXtjb25zdCB0PW5ldyBVaW50OEFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKHQpLHRoaXMuX3Bvc3RNZXNzYWdlKHt0eXBlOmkuYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDp0LmJ1ZmZlcn0sW3QuYnVmZmVyXSl9fV9mbHVzaFRpbWVEb21haW5TYW1wbGVzKCl7aWYodGhpcy5faXNMaXN0ZW5pbmdUby50aW1lZG9tYWluZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS50aW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX1pZih0aGlzLl9pc0xpc3RlbmluZ1RvLmJ5dGV0aW1lZG9tYWluZGF0YSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCk7Y29uc3QgZT1uZXcgVWludDhBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9jb252ZXJ0VGltZURvbWFpbkRhdGFUb0J5dGVEYXRhKHQsZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6aS5ieXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9fV9nZXRGbG9hdEZyZXF1ZW5jeURhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCksdGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9EYihlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6ZS5idWZmZXJ9LFtlLmJ1ZmZlcl0pfV9nZXRCeXRlRnJlcXVlbmN5RGF0YSh0KXt0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCk7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXMoZSk7Y29uc3QgYT1uZXcgVWludDhBcnJheSh0aGlzLl9mcmVxdWVuY3lCaW5Db3VudCk7dGhpcy5fY29udmVydEZyZXF1ZW5jaWVzVG9CeXRlRGF0YShhKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkQnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDphLmJ1ZmZlcn0sW2EuYnVmZmVyXSl9X2dldEZsb2F0VGltZURvbWFpbkRhdGEodCl7Y29uc3QgZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXMoZSksdGhpcy5fcG9zdE1lc3NhZ2Uoe2lkOnQsdHlwZTppLnJlcXVlc3RlZEZsb2F0VGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9X2dldEJ5dGVUaW1lRG9tYWluRGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKTtjb25zdCBhPW5ldyBVaW50OEFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2NvbnZlcnRUaW1lRG9tYWluRGF0YVRvQnl0ZURhdGEoZSxhKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOmkucmVxdWVzdGVkQnl0ZVRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6YS5idWZmZXJ9LFthLmJ1ZmZlcl0pfXByb2Nlc3ModCxlLGEpe2NvbnN0IGk9YS5pc1JlY29yZGluZztmb3IobGV0IGU9MDtlPHQubGVuZ3RoO2UrKyl7aWYoMT09PWlbZV0mJnRbMF1bMF0pZm9yKGxldCBlPTA7ZTx0WzBdWzBdLmxlbmd0aDtlKyspdGhpcy5fYXBwZW5kVG9CdWZmZXIodFswXVswXVtlXSl9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJBZHZhbmNlZEFuYWx5c2VyUHJvY2Vzc29yIixiKSx0LkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3I9YixPYmplY3QuZGVmaW5lUHJvcGVydHkodCwiX19lc01vZHVsZSIse3ZhbHVlOiEwfSl9KSk7Cg==";

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
      ProcessorParameters["minDecibels"] = "minDecibels";
      ProcessorParameters["maxDecibels"] = "maxDecibels";
      ProcessorParameters["smoothingTimeConstant"] = "smoothingTimeConstant";
  })(ProcessorParameters || (ProcessorParameters = {}));
  var EventListenerTypes;
  (function (EventListenerTypes) {
      /**
       * Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
       * Returns a Float32Array with half the `fftSize`, with the current frequency data.
       */
      EventListenerTypes["frequencydata"] = "frequencydata";
      /**
       * Listens to Frequency data events. The interval between calls is defined by the `samplesBetweenTransforms` property.
       * The data is represented in bytes
       * Returns a Uint8Array with half the `fftSize`, with the current frequency data.
       */
      EventListenerTypes["bytefrequencydata"] = "bytefrequencydata";
      /**
       * Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
       * Returns a Float32Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.
       */
      EventListenerTypes["timedomaindata"] = "timedomaindata";
      /**
       * Listens to Time-domain data events. The interval between calls is defined the `timeDomainSamplesCount` property.
       * Returns a Uint8Array with the size defined by `timeDomainSamplesCount`, with the current time-domain data.
       */
      EventListenerTypes["bytetimedomaindata"] = "bytetimedomaindata";
  })(EventListenerTypes || (EventListenerTypes = {}));
  var WindowFunctionTypes;
  (function (WindowFunctionTypes) {
      /**
       * Retangular window - Doesn't change the signal
       */
      WindowFunctionTypes["rectangular"] = "rectangular";
      /**
       * [Blackmann window](https://en.wikipedia.org/wiki/Window_function#Blackman_window)
       */
      WindowFunctionTypes["blackman"] = "blackman";
      /**
       * [Nuttall window](https://en.wikipedia.org/wiki/Window_function#Nuttall_window,_continuous_first_derivative)
       */
      WindowFunctionTypes["nuttall"] = "nuttall";
      /**
       * [Blackman-Nutall window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Nuttall_window)
       */
      WindowFunctionTypes["blackmanNuttall"] = "blackman-nuttall";
      /**
       * [Blackman-Harris window](https://en.wikipedia.org/wiki/Window_function#Blackman%E2%80%93Harris_window)
       */
      WindowFunctionTypes["blackmanHarris"] = "blackman-harris";
      /**
       * [Hann window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
       */
      WindowFunctionTypes["hann"] = "hann";
      /**
       * [Hamming window](https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows)
       */
      WindowFunctionTypes["hamming"] = "hamming";
      /**
       * Bartlett window
       */
      WindowFunctionTypes["bartlett"] = "bartlett";
  })(WindowFunctionTypes || (WindowFunctionTypes = {}));

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
  const validateMaxAndMinDecibels = (minDecibels, maxDecibels) => {
      if (maxDecibels <= minDecibels) {
          throw new Error(`Values ${minDecibels} for minDecibels and ${maxDecibels} for maxDecibels are invalid: maxDecibels value cannot be equal or lower than minDecibels.`);
      }
  };
  const validateSmoothingTimeConstant = (value) => {
      if (value < 0 && value > 1) {
          throw new Error('smoothingTimeConstant value must be between 0 and 1');
      }
  };

  /**
   * The Audio Node class. Do not instantiate this class directly.
   * Use the `createAdvancedAnalyserNode` method instead.
   */
  class AdvancedAnalyserNode extends AudioWorkletNode {
      _portMapId = 0;
      _portMap = new Map();
      _fftSize = 2048;
      _samplesBetweenTransforms;
      _timeDomainSamplesCount;
      _windowFunction;
      _minDecibels;
      _maxDecibels;
      _smoothingTimeConstant;
      channelCount;
      numberOfInputs;
      numberOfOutputs;
      channelCountMode;
      channelInterpretation;
      /**
       * The size of the FFT used for frequency-domain analysis (in sample-frames).
       * This MUST be a power of two in the range 32 to 32768. The default value is 2048.
       * Note that large FFT sizes can be costly to compute.
       *
       * @defaultValue 2048
       */
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
                  /*
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
      /**
       * Represents the minimum power value in the scaling range for the FFT analysis data,
       * for conversion to unsigned byte values.
       * Basically, this specifies the minimum value for the range of results when using `getByteFrequencyData()`
       * or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of minDecibels
       * or lower will be returned as 0.
       *
       * An exception will be thrown if set to more than or equal to maxDecibels.
       * @defaultValue -100 dB
       */
      get minDecibels() {
          return this._minDecibels;
      }
      set minDecibels(value) {
          validateMaxAndMinDecibels(value, this._maxDecibels);
          this._minDecibels = value;
          this._updateProcessorOptions({
              minDecibels: value,
          });
      }
      /**
       * Represents the maximum power value in the scaling range for the FFT analysis data,
       * for conversion to unsigned byte values.
       * Basically, this specifies the maximum value for the range of results when using `getByteFrequencyData()`
       * or listening to the `bytefrequencydata` event, in which any frequencies with an amplitude of maxDecibels
       * or higher will be returned as 255.
       *
       * An exception will be thrown if set to less than or equal to maxDecibels.
       * @defaultValue -30 dB
       */
      get maxDecibels() {
          return this._maxDecibels;
      }
      set maxDecibels(value) {
          validateMaxAndMinDecibels(this._minDecibels, value);
          this._maxDecibels = value;
          this._updateProcessorOptions({
              maxDecibels: value,
          });
      }
      /**
       * Represents the averaging constant with the last analysis frame.
       * It's basically an average between the current buffer and the last buffer the AnalyserNode processed,
       * and results in a much smoother set of value changes over time.
       *
       * @defaultValue 0. No averaging is applied.
       */
      get smoothingTimeConstant() {
          return this._smoothingTimeConstant;
      }
      set smoothingTimeConstant(value) {
          validateSmoothingTimeConstant(value);
          this._smoothingTimeConstant = value;
          this._updateProcessorOptions({
              smoothingTimeConstant: value,
          });
      }
      _eventListenersCount = {
          [EventListenerTypes.frequencydata]: [],
          [EventListenerTypes.bytefrequencydata]: [],
          [EventListenerTypes.timedomaindata]: [],
          [EventListenerTypes.bytetimedomaindata]: [],
      };
      /**
       * The Audiio Node class. Do not instantiate this class directly.
       * Use the `createAdvancedAnalyserNode` method, which registers this Worklet before instantiating it
       */
      constructor(context, properties) {
          const { fftSize = 2048, samplesBetweenTransforms, timeDomainSamplesCount, windowFunction = WindowFunctionTypes.blackman, minDecibels = -100, maxDecibels = -30, smoothingTimeConstant = 0, } = properties;
          const processorOptions = {
              [ProcessorParameters.fftSize]: fftSize,
              [ProcessorParameters.samplesBetweenTransforms]: samplesBetweenTransforms || fftSize,
              [ProcessorParameters.timeDomainSamplesCount]: timeDomainSamplesCount || fftSize,
              [ProcessorParameters.windowFunction]: windowFunction,
              [ProcessorParameters.minDecibels]: minDecibels,
              [ProcessorParameters.maxDecibels]: maxDecibels,
              [ProcessorParameters.smoothingTimeConstant]: smoothingTimeConstant,
          };
          super(context, PROCESSOR_NAME, {
              processorOptions,
              numberOfInputs: 1,
              numberOfOutputs: 1,
              channelCount: 1,
              channelCountMode: "max",
              channelInterpretation: "speakers",
          });
          this.fftSize = fftSize;
          if (typeof samplesBetweenTransforms !== 'undefined')
              this.samplesBetweenTransforms = samplesBetweenTransforms;
          if (typeof timeDomainSamplesCount !== 'undefined')
              this.timeDomainSamplesCount = timeDomainSamplesCount;
          this.windowFunction = windowFunction;
          this.minDecibels = minDecibels;
          this.maxDecibels = maxDecibels;
          this.smoothingTimeConstant = smoothingTimeConstant;
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
      _updateProcessorOptions(payload) {
          this._postMessage({
              type: MessageTypes.updateProcessorOptions,
              payload
          });
      }
      _postIdentifiedDataRequest(requestType) {
          return new Promise(resolve => {
              const id = this._uniqId();
              this._portMap.set(id, (buffer) => resolve(buffer));
              this._postMessage({
                  id,
                  type: requestType
              });
          });
      }
      async getFloatFrequencyData() {
          return new Float32Array(await this._postIdentifiedDataRequest(MessageTypes.getFloatFrequencyData));
      }
      async getByteFrequencyData() {
          return new Uint8Array(await this._postIdentifiedDataRequest(MessageTypes.getByteFrequencyData));
      }
      async getFloatTimeDomainData() {
          return new Float32Array(await this._postIdentifiedDataRequest(MessageTypes.getFloatTimeDomainData));
      }
      async getByteTimeDomainData() {
          return new Uint8Array(await this._postIdentifiedDataRequest(MessageTypes.getByteTimeDomainData));
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

  /*
  * The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
  * The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string,
  * to avoid needing to be manually imported and loaded by this module's consumers
  */
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
