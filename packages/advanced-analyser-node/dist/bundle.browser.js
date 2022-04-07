(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.advancedAnalyserNode = {}));
})(this, (function (exports) { 'use strict';

  var processor = "IWZ1bmN0aW9uKHQsZSl7Im9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYidW5kZWZpbmVkIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOiJmdW5jdGlvbiI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFsiZXhwb3J0cyJdLGUpOmUoKHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6dHx8c2VsZikuYWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj17fSl9KHRoaXMsKGZ1bmN0aW9uKHQpeyJ1c2Ugc3RyaWN0IjsidW5kZWZpbmVkIiE9dHlwZW9mIGdsb2JhbFRoaXM/Z2xvYmFsVGhpczoidW5kZWZpbmVkIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOiJ1bmRlZmluZWQiIT10eXBlb2Ygc2VsZiYmc2VsZjtmdW5jdGlvbiBlKHQpe2lmKHRoaXMuc2l6ZT0wfHQsdGhpcy5zaXplPD0xfHwwIT0odGhpcy5zaXplJnRoaXMuc2l6ZS0xKSl0aHJvdyBuZXcgRXJyb3IoIkZGVCBzaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28gYW5kIGJpZ2dlciB0aGFuIDEiKTt0aGlzLl9jc2l6ZT10PDwxO2Zvcih2YXIgZT1uZXcgQXJyYXkoMip0aGlzLnNpemUpLGE9MDthPGUubGVuZ3RoO2ErPTIpe2NvbnN0IHQ9TWF0aC5QSSphL3RoaXMuc2l6ZTtlW2FdPU1hdGguY29zKHQpLGVbYSsxXT0tTWF0aC5zaW4odCl9dGhpcy50YWJsZT1lO2Zvcih2YXIgaT0wLHM9MTt0aGlzLnNpemU+cztzPDw9MSlpKys7dGhpcy5fd2lkdGg9aSUyPT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbj0wO248dGhpcy5fYml0cmV2Lmxlbmd0aDtuKyspe3RoaXMuX2JpdHJldltuXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIHI9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldltuXXw9KG4+Pj5vJjMpPDxyfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9dmFyIGE9ZTtlLnByb3RvdHlwZS5mcm9tQ29tcGxleEFycmF5PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBhPWV8fG5ldyBBcnJheSh0Lmxlbmd0aD4+PjEpLGk9MDtpPHQubGVuZ3RoO2krPTIpYVtpPj4+MV09dFtpXTtyZXR1cm4gYX0sZS5wcm90b3R5cGUuY3JlYXRlQ29tcGxleEFycmF5PWZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH0sZS5wcm90b3R5cGUudG9Db21wbGV4QXJyYXk9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGE9ZXx8dGhpcy5jcmVhdGVDb21wbGV4QXJyYXkoKSxpPTA7aTxhLmxlbmd0aDtpKz0yKWFbaV09dFtpPj4+MV0sYVtpKzFdPTA7cmV0dXJuIGF9LGUucHJvdG90eXBlLmNvbXBsZXRlU3BlY3RydW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2NzaXplLGE9ZT4+PjEsaT0yO2k8YTtpKz0yKXRbZS1pXT10W2ldLHRbZS1pKzFdPS10W2krMV19LGUucHJvdG90eXBlLnRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9LGUucHJvdG90eXBlLnJlYWxUcmFuc2Zvcm09ZnVuY3Rpb24odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MCx0aGlzLl9yZWFsVHJhbnNmb3JtNCgpLHRoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH0sZS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybT1mdW5jdGlvbih0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0xLHRoaXMuX3RyYW5zZm9ybTQoKTtmb3IodmFyIGE9MDthPHQubGVuZ3RoO2ErKyl0W2FdLz10aGlzLnNpemU7dGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfSxlLnByb3RvdHlwZS5fdHJhbnNmb3JtND1mdW5jdGlvbigpe3ZhciB0LGUsYT10aGlzLl9vdXQsaT10aGlzLl9jc2l6ZSxzPTE8PHRoaXMuX3dpZHRoLG49aS9zPDwxLG89dGhpcy5fYml0cmV2O2lmKDQ9PT1uKWZvcih0PTAsZT0wO3Q8aTt0Kz1uLGUrKyl7Y29uc3QgYT1vW2VdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTIodCxhLHMpfWVsc2UgZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlVHJhbnNmb3JtNCh0LGEscyl9dmFyIHI9dGhpcy5faW52Py0xOjEsbD10aGlzLnRhYmxlO2ZvcihzPj49MjtzPj0yO3M+Pj0yKXt2YXIgaD0obj1pL3M8PDEpPj4+Mjtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgZj10K2gsdT10LG09MDt1PGY7dSs9MixtKz1zKXtjb25zdCB0PXUsZT10K2gsaT1lK2gscz1pK2gsbj1hW3RdLG89YVt0KzFdLGY9YVtlXSxfPWFbZSsxXSxjPWFbaV0scD1hW2krMV0seT1hW3NdLGQ9YVtzKzFdLGI9bixEPW8sZz1sW21dLFQ9cipsW20rMV0sRj1mKmctXypULHY9ZipUK18qZyxBPWxbMiptXSx3PXIqbFsyKm0rMV0scT1jKkEtcCp3LE09Yyp3K3AqQSxDPWxbMyptXSxTPXIqbFszKm0rMV0sQj15KkMtZCpTLEk9eSpTK2QqQyxMPWIrcSx6PUQrTSxQPWItcSx4PUQtTSxrPUYrQixPPXYrSSxOPXIqKEYtQiksVz1yKih2LUkpLEU9TCtrLFI9eitPLFU9TC1rLGo9ei1PLFo9UCtXLEg9eC1OLFg9UC1XLFY9eCtOO2FbdF09RSxhW3QrMV09UixhW2VdPVosYVtlKzFdPUgsYVtpXT1VLGFbaSsxXT1qLGFbc109WCxhW3MrMV09Vn19fSxlLnByb3RvdHlwZS5fc2luZ2xlVHJhbnNmb3JtMj1mdW5jdGlvbih0LGUsYSl7Y29uc3QgaT10aGlzLl9vdXQscz10aGlzLl9kYXRhLG49c1tlXSxvPXNbZSsxXSxyPXNbZSthXSxsPXNbZSthKzFdLGg9bityLGY9bytsLHU9bi1yLG09by1sO2lbdF09aCxpW3QrMV09ZixpW3QrMl09dSxpW3QrM109bX0sZS5wcm90b3R5cGUuX3NpbmdsZVRyYW5zZm9ybTQ9ZnVuY3Rpb24odCxlLGEpe2NvbnN0IGk9dGhpcy5fb3V0LHM9dGhpcy5fZGF0YSxuPXRoaXMuX2ludj8tMToxLG89MiphLHI9MyphLGw9c1tlXSxoPXNbZSsxXSxmPXNbZSthXSx1PXNbZSthKzFdLG09c1tlK29dLF89c1tlK28rMV0sYz1zW2Urcl0scD1zW2UrcisxXSx5PWwrbSxkPWgrXyxiPWwtbSxEPWgtXyxnPWYrYyxUPXUrcCxGPW4qKGYtYyksdj1uKih1LXApLEE9eStnLHc9ZCtULHE9Yit2LE09RC1GLEM9eS1nLFM9ZC1ULEI9Yi12LEk9RCtGO2lbdF09QSxpW3QrMV09dyxpW3QrMl09cSxpW3QrM109TSxpW3QrNF09QyxpW3QrNV09UyxpW3QrNl09QixpW3QrN109SX0sZS5wcm90b3R5cGUuX3JlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKCl7dmFyIHQsZSxhPXRoaXMuX291dCxpPXRoaXMuX2NzaXplLHM9MTw8dGhpcy5fd2lkdGgsbj1pL3M8PDEsbz10aGlzLl9iaXRyZXY7aWYoND09PW4pZm9yKHQ9MCxlPTA7dDxpO3QrPW4sZSsrKXtjb25zdCBhPW9bZV07dGhpcy5fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxhPj4+MSxzPj4+MSl9ZWxzZSBmb3IodD0wLGU9MDt0PGk7dCs9bixlKyspe2NvbnN0IGE9b1tlXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGE+Pj4xLHM+Pj4xKX12YXIgcj10aGlzLl9pbnY/LTE6MSxsPXRoaXMudGFibGU7Zm9yKHM+Pj0yO3M+PTI7cz4+PTIpe3ZhciBoPShuPWkvczw8MSk+Pj4xLGY9aD4+PjEsdT1mPj4+MTtmb3IodD0wO3Q8aTt0Kz1uKWZvcih2YXIgbT0wLF89MDttPD11O20rPTIsXys9cyl7dmFyIGM9dCttLHA9YytmLHk9cCtmLGQ9eStmLGI9YVtjXSxEPWFbYysxXSxnPWFbcF0sVD1hW3ArMV0sRj1hW3ldLHY9YVt5KzFdLEE9YVtkXSx3PWFbZCsxXSxxPWIsTT1ELEM9bFtfXSxTPXIqbFtfKzFdLEI9ZypDLVQqUyxJPWcqUytUKkMsTD1sWzIqX10sej1yKmxbMipfKzFdLFA9RipMLXYqeix4PUYqeit2Kkwsaz1sWzMqX10sTz1yKmxbMypfKzFdLE49QSprLXcqTyxXPUEqTyt3KmssRT1xK1AsUj1NK3gsVT1xLVAsaj1NLXgsWj1CK04sSD1JK1csWD1yKihCLU4pLFY9ciooSS1XKSxHPUUrWixKPVIrSCxLPVUrVixRPWotWDtpZihhW2NdPUcsYVtjKzFdPUosYVtwXT1LLGFbcCsxXT1RLDAhPT1tKXtpZihtIT09dSl7dmFyIFk9VSstcipWLCQ9LWorLXIqWCx0dD1FKy1yKlosZXQ9LVItIC1yKkgsYXQ9dCtmLW0saXQ9dCtoLW07YVthdF09WSxhW2F0KzFdPSQsYVtpdF09dHQsYVtpdCsxXT1ldH19ZWxzZXt2YXIgc3Q9RS1aLG50PVItSDthW3ldPXN0LGFbeSsxXT1udH19fX0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yPWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj1zW2VdLG89c1tlK2FdLHI9bitvLGw9bi1vO2lbdF09cixpW3QrMV09MCxpW3QrMl09bCxpW3QrM109MH0sZS5wcm90b3R5cGUuX3NpbmdsZVJlYWxUcmFuc2Zvcm00PWZ1bmN0aW9uKHQsZSxhKXtjb25zdCBpPXRoaXMuX291dCxzPXRoaXMuX2RhdGEsbj10aGlzLl9pbnY/LTE6MSxvPTIqYSxyPTMqYSxsPXNbZV0saD1zW2UrYV0sZj1zW2Urb10sdT1zW2Urcl0sbT1sK2YsXz1sLWYsYz1oK3UscD1uKihoLXUpLHk9bStjLGQ9XyxiPS1wLEQ9bS1jLGc9XyxUPXA7aVt0XT15LGlbdCsxXT0wLGlbdCsyXT1kLGlbdCszXT1iLGlbdCs0XT1ELGlbdCs1XT0wLGlbdCs2XT1nLGlbdCs3XT1UfTt2YXIgaT17ZXhwb3J0czp7fX07IWZ1bmN0aW9uKHQsZSl7IWZ1bmN0aW9uKHQpe2NvbnN0IGU9MzI3NjgsYT0zMjt2YXIgaTt0LkZyZXF1ZW5jeVNjYWxlPXZvaWQgMCwoaT10LkZyZXF1ZW5jeVNjYWxlfHwodC5GcmVxdWVuY3lTY2FsZT17fSkpLmxpbmVhcj0ibGluZWFyIixpLmxvZ2FyaXRobWljPSJsb2dhcml0aG1pYyIsdC5NQVhfRkZUX1NJWkU9ZSx0Lk1JTl9GRlRfU0laRT1hLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KX0oZSl9KDAsaS5leHBvcnRzKTt2YXIgcyxuLG87IWZ1bmN0aW9uKHQpe3RbdC5zdGFydD0wXT0ic3RhcnQiLHRbdC5zdG9wPTFdPSJzdG9wIix0W3QudXBkYXRlUHJvY2Vzc29yT3B0aW9ucz0yXT0idXBkYXRlUHJvY2Vzc29yT3B0aW9ucyIsdFt0LmZyZXF1ZW5jeURhdGFBdmFpbGFibGU9M109ImZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5ieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZT00XT0iYnl0ZUZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC50aW1lRG9tYWluRGF0YUF2YWlsYWJsZT01XT0idGltZURvbWFpbkRhdGFBdmFpbGFibGUiLHRbdC5ieXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGU9Nl09ImJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmdldEZsb2F0RnJlcXVlbmN5RGF0YT03XT0iZ2V0RmxvYXRGcmVxdWVuY3lEYXRhIix0W3QucmVxdWVzdGVkRmxvYXRGcmVxdWVuY3lEYXRhQXZhaWxhYmxlPThdPSJyZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGUiLHRbdC5nZXRCeXRlRnJlcXVlbmN5RGF0YT05XT0iZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLHRbdC5yZXF1ZXN0ZWRCeXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZT0xMF09InJlcXVlc3RlZEJ5dGVGcmVxdWVuY3lEYXRhQXZhaWxhYmxlIix0W3QuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YT0xMV09ImdldEZsb2F0VGltZURvbWFpbkRhdGEiLHRbdC5yZXF1ZXN0ZWRGbG9hdFRpbWVEb21haW5EYXRhQXZhaWxhYmxlPTEyXT0icmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LmdldEJ5dGVUaW1lRG9tYWluRGF0YT0xM109ImdldEJ5dGVUaW1lRG9tYWluRGF0YSIsdFt0LnJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZT0xNF09InJlcXVlc3RlZEJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSIsdFt0LnN0YXJ0ZWRMaXN0ZW5pbmdUbz0xNV09InN0YXJ0ZWRMaXN0ZW5pbmdUbyIsdFt0LnN0b3BwZWRMaXN0ZW5pbmdUbz0xNl09InN0b3BwZWRMaXN0ZW5pbmdUbyJ9KHN8fChzPXt9KSksZnVuY3Rpb24odCl7dC5mZnRTaXplPSJmZnRTaXplIix0LnNhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz0ic2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zIix0LnRpbWVEb21haW5TYW1wbGVzQ291bnQ9InRpbWVEb21haW5TYW1wbGVzQ291bnQiLHQud2luZG93RnVuY3Rpb249IndpbmRvd0Z1bmN0aW9uIix0Lm1pbkRlY2liZWxzPSJtaW5EZWNpYmVscyIsdC5tYXhEZWNpYmVscz0ibWF4RGVjaWJlbHMiLHQuc21vb3RoaW5nVGltZUNvbnN0YW50PSJzbW9vdGhpbmdUaW1lQ29uc3RhbnQifShufHwobj17fSkpLGZ1bmN0aW9uKHQpe3QucmVjdGFuZ3VsYXI9InJlY3Rhbmd1bGFyIix0LmJsYWNrbWFuPSJibGFja21hbiIsdC5udXR0YWxsPSJudXR0YWxsIix0LmJsYWNrbWFuTnV0dGFsbD0iYmxhY2ttYW4tbnV0dGFsbCIsdC5ibGFja21hbkhhcnJpcz0iYmxhY2ttYW4taGFycmlzIix0Lmhhbm49Imhhbm4iLHQuaGFtbWluZz0iaGFtbWluZyIsdC5iYXJ0bGV0dD0iYmFydGxldHQifShvfHwobz17fSkpO2NvbnN0IHI9KHQsZSk9Pi41LS41Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSxsPSh0LGUpPT4uNTQtLjQ2Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSxoPSh0LGUpPT4uNDItLjUqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4wOCpNYXRoLmNvcyg0Kk1hdGguUEkqdC8oZS0xKSksZj0odCxlKT0+LjM1NTc2OC0uNDg3Mzk2Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMTQ0MjMyKk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKS0uMDEyNjA0Kk1hdGguY29zKDYqTWF0aC5QSSp0LyhlLTEpKSx1PSh0LGUpPT4uMzU4NzUtLjQ4ODI5Kk1hdGguY29zKDIqTWF0aC5QSSp0LyhlLTEpKSsuMTQxMjgqTWF0aC5jb3MoNCpNYXRoLlBJKnQvKGUtMSkpLS4wMTE2OCpNYXRoLmNvcyg2Kk1hdGguUEkqdC8oZS0xKSksbT0odCxlKT0+LjM2MzU4MTktLjQ4OTE3NzUqTWF0aC5jb3MoMipNYXRoLlBJKnQvKGUtMSkpKy4xMzY1OTk1Kk1hdGguY29zKDQqTWF0aC5QSSp0LyhlLTEpKS0uMDEwNjQxMSpNYXRoLmNvcyg2Kk1hdGguUEkqdC8oZS0xKSksXz0odCxlKT0+MS1NYXRoLmFicygyKih0LS41KihlLTEpKS8oZS0xKSksYz0odCxlLGEpPT57Y29uc3QgaT10Lmxlbmd0aDtmb3IobGV0IHM9MDtzPGk7KytzKXRbc109dFtzXSplKHMsaSxhKX0scD17W28ucmVjdGFuZ3VsYXJdOigpPT57fSxbby5oYW5uXTp0PT5jKHQsciksW28uaGFtbWluZ106dD0+Yyh0LGwpLFtvLmJsYWNrbWFuXTp0PT5jKHQsaCksW28uYmxhY2ttYW5OdXR0YWxsXTp0PT5jKHQsbSksW28uYmxhY2ttYW5IYXJyaXNdOnQ9PmModCx1KSxbby5udXR0YWxsXTp0PT5jKHQsZiksW28uYmFydGxldHRdOnQ9PmModCxfKX0seT10PT4yMCpNYXRoLmxvZzEwKHQpLGQ9KHQsZSxhKT0+TWF0aC5taW4oTWF0aC5tYXgodCxlKSxhKTtjbGFzcyBiIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye19zYW1wbGVzQ291bnQ9MDtfY291bnQ9MDtfZmlyc3Q9ITA7X2ZmdEFuYWx5c2VyO19mZnRTaXplO19mZnRJbnB1dDtfZmZ0T3V0cHV0O19sYXN0VHJhbnNmb3JtO19zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM7X3dpbmRvd0Z1bmN0aW9uPW8uYmxhY2ttYW47X2lzTGlzdGVuaW5nVG89e2ZyZXF1ZW5jeWRhdGE6ITEsYnl0ZWZyZXF1ZW5jeWRhdGE6ITEsdGltZWRvbWFpbmRhdGE6ITEsYnl0ZXRpbWVkb21haW5kYXRhOiExfTtfYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkoaS5leHBvcnRzLk1BWF9GRlRfU0laRSk7X21pbkRlY2liZWxzPS0xMDA7X21heERlY2liZWxzPS0zMDtfc21vb3RoaW5nVGltZUNvbnN0YW50PTA7X3BvcnRNYXA9bmV3IE1hcDtfdGltZURvbWFpblNhbXBsZXNDb3VudDtnZXQgX2ZyZXF1ZW5jeUJpbkNvdW50KCl7cmV0dXJuIHRoaXMuX2ZmdFNpemUvMn1zZXQgZnJlcXVlbmN5QmluQ291bnQodCl7dGhpcy5fZmZ0U2l6ZT0yKnR9Z2V0IF9pc0xpc3RlbmluZ1RvRnJlcXVlbmN5RGF0YSgpe3JldHVybiB0aGlzLl9pc0xpc3RlbmluZ1RvLmZyZXF1ZW5jeWRhdGF8fHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGF9Z2V0IF9pc0xpc3RlbmluZ1RvVGltZURvbWFpbkRhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUby50aW1lZG9tYWluZGF0YXx8dGhpcy5faXNMaXN0ZW5pbmdUby5ieXRldGltZWRvbWFpbmRhdGF9c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiaXNSZWNvcmRpbmciLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IodCl7c3VwZXIoKTtjb25zdHtmZnRTaXplOmUsc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zOmksdGltZURvbWFpblNhbXBsZXNDb3VudDpzLHdpbmRvd0Z1bmN0aW9uOm49by5ibGFja21hbixtaW5EZWNpYmVsczpyLG1heERlY2liZWxzOmwsc21vb3RoaW5nVGltZUNvbnN0YW50Omh9PXQucHJvY2Vzc29yT3B0aW9uczt0aGlzLl9mZnRBbmFseXNlcj1uZXcgYShlKSx0aGlzLl9mZnRJbnB1dD1uZXcgRmxvYXQzMkFycmF5KGUpLHRoaXMuX2ZmdE91dHB1dD10aGlzLl9mZnRBbmFseXNlci5jcmVhdGVDb21wbGV4QXJyYXkoKSx0aGlzLl9mZnRTaXplPWUsdGhpcy5fbGFzdFRyYW5zZm9ybT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KSx0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9aSx0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50PXMsdGhpcy5fc2FtcGxlc0NvdW50PTAsdGhpcy5fd2luZG93RnVuY3Rpb249bix0aGlzLl9taW5EZWNpYmVscz1yLHRoaXMuX21heERlY2liZWxzPWwsdGhpcy5fc21vb3RoaW5nVGltZUNvbnN0YW50PWgsdGhpcy5wb3J0Lm9ubWVzc2FnZT10PT50aGlzLl9vbm1lc3NhZ2UodC5kYXRhKX1fb25tZXNzYWdlKHQpe3N3aXRjaCh0LnR5cGUpe2Nhc2Ugcy5nZXRGbG9hdEZyZXF1ZW5jeURhdGE6dGhpcy5fZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHQuaWQpO2JyZWFrO2Nhc2Ugcy5nZXRCeXRlRnJlcXVlbmN5RGF0YTp0aGlzLl9nZXRCeXRlRnJlcXVlbmN5RGF0YSh0LmlkKTticmVhaztjYXNlIHMuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YTp0aGlzLl9nZXRGbG9hdFRpbWVEb21haW5EYXRhKHQuaWQpO2JyZWFrO2Nhc2Ugcy5nZXRCeXRlVGltZURvbWFpbkRhdGE6dGhpcy5fZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKHQuaWQpO2JyZWFrO2Nhc2Ugcy5zdGFydGVkTGlzdGVuaW5nVG86dGhpcy5faXNMaXN0ZW5pbmdUb1t0LnBheWxvYWRdPSEwO2JyZWFrO2Nhc2Ugcy5zdG9wcGVkTGlzdGVuaW5nVG86dGhpcy5faXNMaXN0ZW5pbmdUb1t0LnBheWxvYWRdPSExO2JyZWFrO2Nhc2Ugcy51cGRhdGVQcm9jZXNzb3JPcHRpb25zOntjb25zdHtmZnRTaXplOmUsc2FtcGxlc0JldHdlZW5UcmFuc2Zvcm1zOmEsdGltZURvbWFpblNhbXBsZXNDb3VudDppLHdpbmRvd0Z1bmN0aW9uOnMsbWluRGVjaWJlbHM6bixtYXhEZWNpYmVsczpvLHNtb290aGluZ1RpbWVDb25zdGFudDpyfT10LnBheWxvYWQ7dm9pZCAwIT09ZSYmKHRoaXMuX2ZmdFNpemU9ZSksdm9pZCAwIT09YSYmKHRoaXMuX3NhbXBsZXNCZXR3ZWVuVHJhbnNmb3Jtcz1hKSx2b2lkIDAhPT1pJiYodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudD1pKSx2b2lkIDAhPT1zJiYodGhpcy5fd2luZG93RnVuY3Rpb249cyksdm9pZCAwIT09biYmKHRoaXMuX21pbkRlY2liZWxzPW4pLHZvaWQgMCE9PW8mJih0aGlzLl9tYXhEZWNpYmVscz1vKSx2b2lkIDAhPT1yJiYodGhpcy5fc21vb3RoaW5nVGltZUNvbnN0YW50PXIpO2JyZWFrfX19X3Bvc3RNZXNzYWdlKHQsZSl7dGhpcy5wb3J0LnBvc3RNZXNzYWdlKHQsZSl9X3Nob3VsZEZsdXNoRnJlcXVlbmNpZXMoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUb0ZyZXF1ZW5jeURhdGEmJnRoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl9zYW1wbGVzQmV0d2VlblRyYW5zZm9ybXM9PTB9X3Nob3VsZEZsdXNoVGltZURvbWFpbkRhdGEoKXtyZXR1cm4gdGhpcy5faXNMaXN0ZW5pbmdUb1RpbWVEb21haW5EYXRhJiZ0aGlzLl9zYW1wbGVzQ291bnQldGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudD09MH1fYXBwZW5kVG9CdWZmZXIodCl7dGhpcy5fYnVmZmVyW3RoaXMuX3NhbXBsZXNDb3VudCV0aGlzLl9idWZmZXIubGVuZ3RoXT10LHRoaXMuX3NhbXBsZXNDb3VudD10aGlzLl9zYW1wbGVzQ291bnQrMSx0aGlzLl9zaG91bGRGbHVzaEZyZXF1ZW5jaWVzKCkmJnRoaXMuX2ZsdXNoRnJlcXVlbmNpZXMoKSx0aGlzLl9zaG91bGRGbHVzaFRpbWVEb21haW5EYXRhKCkmJnRoaXMuX2ZsdXNoVGltZURvbWFpblNhbXBsZXMoKX1fdXBkYXRlRmZ0SW5wdXQoKXt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKHRoaXMuX2ZmdElucHV0KSxwW3RoaXMuX3dpbmRvd0Z1bmN0aW9uXSh0aGlzLl9mZnRJbnB1dCl9X2ZpbGxBcnJheVdpdGhMYXN0TlNhbXBsZXModCl7Y29uc3QgZT10Lmxlbmd0aCxhPSh0aGlzLl9zYW1wbGVzQ291bnQtZSkldGhpcy5fYnVmZmVyLmxlbmd0aDtmb3IobGV0IGk9MDtpPGU7aSsrKXRbaV09YStpPDA/MDp0aGlzLl9idWZmZXJbKGEraSkldGhpcy5fYnVmZmVyLmxlbmd0aF19X2NvbnZlcnRGcmVxdWVuY2llc1RvRGIodCl7Y29uc3QgZT1NYXRoLm1pbih0aGlzLl9sYXN0VHJhbnNmb3JtLmxlbmd0aCx0Lmxlbmd0aCk7aWYoZT4wKXtjb25zdCBhPXRoaXMuX2xhc3RUcmFuc2Zvcm07Zm9yKGxldCBpPTA7aTxlOysraSl0W2ldPXkoYVtpXSl9fV9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKHQpe2NvbnN0IGU9TWF0aC5taW4odGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGgsdC5sZW5ndGgpO2lmKGU+MCl7Y29uc3QgYT10aGlzLl9sYXN0VHJhbnNmb3JtLGk9MS8odGhpcy5fbWF4RGVjaWJlbHMtdGhpcy5fbWluRGVjaWJlbHMpO2ZvcihsZXQgcz0wO3M8ZTsrK3Mpe2NvbnN0IGU9YVtzXSxuPTI1NSooeShlKS10aGlzLl9taW5EZWNpYmVscykqaTt0W3NdPWQoMHxuLDAsMjU1KX19fV9jb252ZXJ0VGltZURvbWFpbkRhdGFUb0J5dGVEYXRhKHQsZSl7Zm9yKGxldCBhPTA7YTx0Lmxlbmd0aDsrK2EpZVthXT1kKDEyOCoodFthXSsxKXwwLDAsMjU1KX1fZG9GZnQoKXt0aGlzLl9mZnRBbmFseXNlci5yZWFsVHJhbnNmb3JtKHRoaXMuX2ZmdE91dHB1dCx0aGlzLl9mZnRJbnB1dCk7Y29uc3QgdD0xL3RoaXMuX2ZmdFNpemUsZT1kKHRoaXMuX3Ntb290aGluZ1RpbWVDb25zdGFudCwwLDEpO2ZvcihsZXQgYT0wO2E8dGhpcy5fbGFzdFRyYW5zZm9ybS5sZW5ndGg7YSsrKXtjb25zdCBpPU1hdGguYWJzKE1hdGguaHlwb3QodGhpcy5fZmZ0T3V0cHV0WzIqYV0sdGhpcy5fZmZ0T3V0cHV0WzIqYSsxXSkpKnQ7dGhpcy5fbGFzdFRyYW5zZm9ybVthXT1lKnRoaXMuX2xhc3RUcmFuc2Zvcm1bYV0rKDEtZSkqaX19X2ZsdXNoRnJlcXVlbmNpZXMoKXtpZih0aGlzLl91cGRhdGVGZnRJbnB1dCgpLHRoaXMuX2RvRmZ0KCksdGhpcy5faXNMaXN0ZW5pbmdUby5mcmVxdWVuY3lkYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvRGIodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6cy5mcmVxdWVuY3lEYXRhQXZhaWxhYmxlLHBheWxvYWQ6dC5idWZmZXJ9LFt0LmJ1ZmZlcl0pfWlmKHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZWZyZXF1ZW5jeWRhdGEpe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX2NvbnZlcnRGcmVxdWVuY2llc1RvQnl0ZURhdGEodCksdGhpcy5fcG9zdE1lc3NhZ2Uoe3R5cGU6cy5ieXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOnQuYnVmZmVyfSxbdC5idWZmZXJdKX19X2ZsdXNoVGltZURvbWFpblNhbXBsZXMoKXtpZih0aGlzLl9pc0xpc3RlbmluZ1RvLnRpbWVkb21haW5kYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0KSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTpzLnRpbWVEb21haW5EYXRhQXZhaWxhYmxlLHBheWxvYWQ6dC5idWZmZXJ9LFt0LmJ1ZmZlcl0pfWlmKHRoaXMuX2lzTGlzdGVuaW5nVG8uYnl0ZXRpbWVkb21haW5kYXRhKXtjb25zdCB0PW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyh0KTtjb25zdCBlPW5ldyBVaW50OEFycmF5KHRoaXMuX3RpbWVEb21haW5TYW1wbGVzQ291bnQpO3RoaXMuX2NvbnZlcnRUaW1lRG9tYWluRGF0YVRvQnl0ZURhdGEodCxlKSx0aGlzLl9wb3N0TWVzc2FnZSh7dHlwZTpzLmJ5dGVUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX19X2dldEZsb2F0RnJlcXVlbmN5RGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fZnJlcXVlbmN5QmluQ291bnQpO3RoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZG9GZnQoKSx0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0RiKGUpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6cy5yZXF1ZXN0ZWRGbG9hdEZyZXF1ZW5jeURhdGFBdmFpbGFibGUscGF5bG9hZDplLmJ1ZmZlcn0sW2UuYnVmZmVyXSl9X2dldEJ5dGVGcmVxdWVuY3lEYXRhKHQpe3RoaXMuX3VwZGF0ZUZmdElucHV0KCksdGhpcy5fZG9GZnQoKTtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKTtjb25zdCBhPW5ldyBVaW50OEFycmF5KHRoaXMuX2ZyZXF1ZW5jeUJpbkNvdW50KTt0aGlzLl9jb252ZXJ0RnJlcXVlbmNpZXNUb0J5dGVEYXRhKGEpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6cy5yZXF1ZXN0ZWRCeXRlRnJlcXVlbmN5RGF0YUF2YWlsYWJsZSxwYXlsb2FkOmEuYnVmZmVyfSxbYS5idWZmZXJdKX1fZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSh0KXtjb25zdCBlPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fZmlsbEFycmF5V2l0aExhc3ROU2FtcGxlcyhlKSx0aGlzLl9wb3N0TWVzc2FnZSh7aWQ6dCx0eXBlOnMucmVxdWVzdGVkRmxvYXRUaW1lRG9tYWluRGF0YUF2YWlsYWJsZSxwYXlsb2FkOmUuYnVmZmVyfSxbZS5idWZmZXJdKX1fZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKHQpe2NvbnN0IGU9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl90aW1lRG9tYWluU2FtcGxlc0NvdW50KTt0aGlzLl9maWxsQXJyYXlXaXRoTGFzdE5TYW1wbGVzKGUpO2NvbnN0IGE9bmV3IFVpbnQ4QXJyYXkodGhpcy5fdGltZURvbWFpblNhbXBsZXNDb3VudCk7dGhpcy5fY29udmVydFRpbWVEb21haW5EYXRhVG9CeXRlRGF0YShlLGEpLHRoaXMuX3Bvc3RNZXNzYWdlKHtpZDp0LHR5cGU6cy5yZXF1ZXN0ZWRCeXRlVGltZURvbWFpbkRhdGFBdmFpbGFibGUscGF5bG9hZDphLmJ1ZmZlcn0sW2EuYnVmZmVyXSl9cHJvY2Vzcyh0LGUsYSl7Y29uc3QgaT1hLmlzUmVjb3JkaW5nO2ZvcihsZXQgZT0wO2U8dC5sZW5ndGg7ZSsrKXtpZigxPT09aVtlXSYmdFswXVswXSlmb3IobGV0IGU9MDtlPHRbMF1bMF0ubGVuZ3RoO2UrKyl0aGlzLl9hcHBlbmRUb0J1ZmZlcih0WzBdWzBdW2VdKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoIkFkdmFuY2VkQW5hbHlzZXJQcm9jZXNzb3IiLGIpLHQuQWR2YW5jZWRBbmFseXNlclByb2Nlc3Nvcj1iLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KX0pKTsK";

  /*
  * The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
  * The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string,
  * to avoid needing to be manually imported and loaded by this module's consumers
  */
  const createAdvancedAnalyserNode = async (context, options = {}) => {
      {
          const processorUrl = "data:application/javascript;base64," + processor;
          await context.audioWorklet.addModule(processorUrl);
          const AdvancedAnalyserNode = (await Promise.resolve().then(function () { return advancedAnalyserNode; })).AdvancedAnalyserNode;
          const advancedAnalyser = new AdvancedAnalyserNode(context, {
              ...options,
          });
          return advancedAnalyser;
      }
  };

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

  const PROCESSOR_NAME = "AdvancedAnalyserProcessor";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var constants = {exports: {}};

  (function (module, exports) {
  (function (global, factory) {
      factory(exports) ;
  })(commonjsGlobal, (function (exports) {
      const MAX_FFT_SIZE = 32768;
      const MIN_FFT_SIZE = 32;
      exports.FrequencyScale = void 0;
      (function (FrequencyScale) {
          FrequencyScale["linear"] = "linear";
          FrequencyScale["logarithmic"] = "logarithmic";
      })(exports.FrequencyScale || (exports.FrequencyScale = {}));

      exports.MAX_FFT_SIZE = MAX_FFT_SIZE;
      exports.MIN_FFT_SIZE = MIN_FFT_SIZE;

      Object.defineProperty(exports, '__esModule', { value: true });

  }));
  }(constants, constants.exports));

  const validateFftSize = (value) => {
      if (value && (value & (value - 1)) !== 0) {
          throw (new Error(`${value} is not a valid fftSize. fftSize has to be a power of 2`));
      }
      if (value > constants.exports.MAX_FFT_SIZE) {
          throw new Error(`${value} is above the maximum fftSize. Maximum fftSize is ${constants.exports.MAX_FFT_SIZE}`);
      }
      if (value < constants.exports.MIN_FFT_SIZE) {
          throw new Error(`${value} is below the minimum fftSize. Maximum fftSize is ${constants.exports.MIN_FFT_SIZE}`);
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
            .join(", ")}`);
      }
  };
  const validateMaxAndMinDecibels = (minDecibels, maxDecibels) => {
      if (maxDecibels <= minDecibels) {
          throw new Error(`Values ${minDecibels} for minDecibels and ${maxDecibels} for maxDecibels are invalid: maxDecibels value cannot be equal or lower than minDecibels.`);
      }
  };
  const validateSmoothingTimeConstant = (value) => {
      if (value < 0 && value > 1) {
          throw new Error("smoothingTimeConstant value must be between 0 and 1");
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
          frequencydata: [],
          bytefrequencydata: [],
          timedomaindata: [],
          bytetimedomaindata: []
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
          if (typeof samplesBetweenTransforms !== "undefined")
              this.samplesBetweenTransforms = samplesBetweenTransforms;
          if (typeof timeDomainSamplesCount !== "undefined")
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
                  this.dispatchEvent(new CustomEvent("frequencydata", { detail: new Float32Array(event.payload) }));
                  break;
              }
              case MessageTypes.byteFrequencyDataAvailable: {
                  this.dispatchEvent(new CustomEvent("bytefrequencydata", { detail: new Uint8Array(event.payload) }));
                  break;
              }
              case MessageTypes.timeDomainDataAvailable: {
                  this.dispatchEvent(new CustomEvent("timedomaindata", { detail: new Float32Array(event.payload) }));
                  break;
              }
              case MessageTypes.byteTimeDomainDataAvailable: {
                  this.dispatchEvent(new CustomEvent("bytetimedomaindata", { detail: new Uint8Array(event.payload) }));
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
          if (type !== "processorerror")
              this._pushEventListener(type, listener);
      }
      removeEventListener(type, listener, options) {
          super.removeEventListener(type, listener, options);
          if (type !== "processorerror")
              this._removeEventListener(type, listener);
      }
  }

  var advancedAnalyserNode = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AdvancedAnalyserNode: AdvancedAnalyserNode
  });

  exports.createAdvancedAnalyserNode = createAdvancedAnalyserNode;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
