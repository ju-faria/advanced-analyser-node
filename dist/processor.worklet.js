!function(t,s){"object"==typeof exports&&"undefined"!=typeof module?s(exports):"function"==typeof define&&define.amd?define(["exports"],s):s((t="undefined"!=typeof globalThis?globalThis:t||self).advancedAnalyserProcessor={})}(this,(function(t){"use strict";function s(t){if(this.size=0|t,this.size<=1||0!=(this.size&this.size-1))throw new Error("FFT size must be a power of two and bigger than 1");this._csize=t<<1;for(var s=new Array(2*this.size),e=0;e<s.length;e+=2){const t=Math.PI*e/this.size;s[e]=Math.cos(t),s[e+1]=-Math.sin(t)}this.table=s;for(var r=0,i=1;this.size>i;i<<=1)r++;this._width=r%2==0?r-1:r,this._bitrev=new Array(1<<this._width);for(var o=0;o<this._bitrev.length;o++){this._bitrev[o]=0;for(var n=0;n<this._width;n+=2){var a=this._width-n-2;this._bitrev[o]|=(o>>>n&3)<<a}}this._out=null,this._data=null,this._inv=0}var e=s;s.prototype.fromComplexArray=function(t,s){for(var e=s||new Array(t.length>>>1),r=0;r<t.length;r+=2)e[r>>>1]=t[r];return e},s.prototype.createComplexArray=function(){const t=new Array(this._csize);for(var s=0;s<t.length;s++)t[s]=0;return t},s.prototype.toComplexArray=function(t,s){for(var e=s||this.createComplexArray(),r=0;r<e.length;r+=2)e[r]=t[r>>>1],e[r+1]=0;return e},s.prototype.completeSpectrum=function(t){for(var s=this._csize,e=s>>>1,r=2;r<e;r+=2)t[s-r]=t[r],t[s-r+1]=-t[r+1]},s.prototype.transform=function(t,s){if(t===s)throw new Error("Input and output buffers must be different");this._out=t,this._data=s,this._inv=0,this._transform4(),this._out=null,this._data=null},s.prototype.realTransform=function(t,s){if(t===s)throw new Error("Input and output buffers must be different");this._out=t,this._data=s,this._inv=0,this._realTransform4(),this._out=null,this._data=null},s.prototype.inverseTransform=function(t,s){if(t===s)throw new Error("Input and output buffers must be different");this._out=t,this._data=s,this._inv=1,this._transform4();for(var e=0;e<t.length;e++)t[e]/=this.size;this._out=null,this._data=null},s.prototype._transform4=function(){var t,s,e=this._out,r=this._csize,i=1<<this._width,o=r/i<<1,n=this._bitrev;if(4===o)for(t=0,s=0;t<r;t+=o,s++){const e=n[s];this._singleTransform2(t,e,i)}else for(t=0,s=0;t<r;t+=o,s++){const e=n[s];this._singleTransform4(t,e,i)}var a=this._inv?-1:1,f=this.table;for(i>>=2;i>=2;i>>=2){var h=(o=r/i<<1)>>>2;for(t=0;t<r;t+=o)for(var _=t+h,l=t,u=0;l<_;l+=2,u+=i){const t=l,s=t+h,r=s+h,i=r+h,o=e[t],n=e[t+1],_=e[s],p=e[s+1],c=e[r],m=e[r+1],d=e[i],v=e[i+1],T=o,y=n,b=f[u],g=a*f[u+1],w=_*b-p*g,A=_*g+p*b,z=f[2*u],C=a*f[2*u+1],F=c*z-m*C,x=c*C+m*z,M=f[3*u],I=a*f[3*u+1],B=d*M-v*I,D=d*I+v*M,S=T+F,O=y+x,P=T-F,R=y-x,E=w+B,j=A+D,L=a*(w-B),k=a*(A-D),U=S+E,V=O+j,W=S-E,q=O-j,G=P+k,H=R-L,J=P-k,K=R+L;e[t]=U,e[t+1]=V,e[s]=G,e[s+1]=H,e[r]=W,e[r+1]=q,e[i]=J,e[i+1]=K}}},s.prototype._singleTransform2=function(t,s,e){const r=this._out,i=this._data,o=i[s],n=i[s+1],a=i[s+e],f=i[s+e+1],h=o+a,_=n+f,l=o-a,u=n-f;r[t]=h,r[t+1]=_,r[t+2]=l,r[t+3]=u},s.prototype._singleTransform4=function(t,s,e){const r=this._out,i=this._data,o=this._inv?-1:1,n=2*e,a=3*e,f=i[s],h=i[s+1],_=i[s+e],l=i[s+e+1],u=i[s+n],p=i[s+n+1],c=i[s+a],m=i[s+a+1],d=f+u,v=h+p,T=f-u,y=h-p,b=_+c,g=l+m,w=o*(_-c),A=o*(l-m),z=d+b,C=v+g,F=T+A,x=y-w,M=d-b,I=v-g,B=T-A,D=y+w;r[t]=z,r[t+1]=C,r[t+2]=F,r[t+3]=x,r[t+4]=M,r[t+5]=I,r[t+6]=B,r[t+7]=D},s.prototype._realTransform4=function(){var t,s,e=this._out,r=this._csize,i=1<<this._width,o=r/i<<1,n=this._bitrev;if(4===o)for(t=0,s=0;t<r;t+=o,s++){const e=n[s];this._singleRealTransform2(t,e>>>1,i>>>1)}else for(t=0,s=0;t<r;t+=o,s++){const e=n[s];this._singleRealTransform4(t,e>>>1,i>>>1)}var a=this._inv?-1:1,f=this.table;for(i>>=2;i>=2;i>>=2){var h=(o=r/i<<1)>>>1,_=h>>>1,l=_>>>1;for(t=0;t<r;t+=o)for(var u=0,p=0;u<=l;u+=2,p+=i){var c=t+u,m=c+_,d=m+_,v=d+_,T=e[c],y=e[c+1],b=e[m],g=e[m+1],w=e[d],A=e[d+1],z=e[v],C=e[v+1],F=T,x=y,M=f[p],I=a*f[p+1],B=b*M-g*I,D=b*I+g*M,S=f[2*p],O=a*f[2*p+1],P=w*S-A*O,R=w*O+A*S,E=f[3*p],j=a*f[3*p+1],L=z*E-C*j,k=z*j+C*E,U=F+P,V=x+R,W=F-P,q=x-R,G=B+L,H=D+k,J=a*(B-L),K=a*(D-k),N=U+G,Q=V+H,X=W+K,Y=q-J;if(e[c]=N,e[c+1]=Q,e[m]=X,e[m+1]=Y,0!==u){if(u!==l){var Z=W+-a*K,$=-q+-a*J,tt=U+-a*G,st=-V- -a*H,et=t+_-u,rt=t+h-u;e[et]=Z,e[et+1]=$,e[rt]=tt,e[rt+1]=st}}else{var it=U-G,ot=V-H;e[d]=it,e[d+1]=ot}}}},s.prototype._singleRealTransform2=function(t,s,e){const r=this._out,i=this._data,o=i[s],n=i[s+e],a=o+n,f=o-n;r[t]=a,r[t+1]=0,r[t+2]=f,r[t+3]=0},s.prototype._singleRealTransform4=function(t,s,e){const r=this._out,i=this._data,o=this._inv?-1:1,n=2*e,a=3*e,f=i[s],h=i[s+e],_=i[s+n],l=i[s+a],u=f+_,p=f-_,c=h+l,m=o*(h-l),d=u+c,v=p,T=-m,y=u-c,b=p,g=m;r[t]=d,r[t+1]=0,r[t+2]=v,r[t+3]=T,r[t+4]=y,r[t+5]=0,r[t+6]=b,r[t+7]=g};var r,i;!function(t){t.start="start",t.stop="stop",t.dataAvailable="data-available"}(r||(r={})),function(t){t.fftSize="fftSize",t.samplesBetweenTransforms="samplesBetweenTransforms"}(i||(i={}));const o=t=>20*Math.log10(t),n=(t,s,e)=>Math.min(Math.max(t,s),e);class a extends AudioWorkletProcessor{_samplesCount=0;_count=0;_first=!0;_fftAnalyser;_fftSize;_fftInput;_fftOutput;_lastTransform;_samplesBetweenTransforms;_buffer=new Float32Array(32768);_minDecibels=-100;_maxDecibels=-30;_smoothingTimeConstant=0;static get parameterDescriptors(){return[{name:"isRecording",defaultValue:1}]}constructor(t){super();const{fftSize:s,samplesBetweenTransforms:r}=t.processorOptions;this._fftAnalyser=new e(s),this._fftInput=new Float32Array(s),this._fftOutput=this._fftAnalyser.createComplexArray(),this._lastTransform=new Float32Array(s/2),this._fftSize=s,this._samplesBetweenTransforms=r,this._samplesCount=0}_isTimeToFLush(){return this._samplesCount%this._samplesBetweenTransforms==0}_appendToBuffer(t){this._buffer[this._samplesCount%this._buffer.length]=t,this._samplesCount=this._samplesCount+1,this._isTimeToFLush()&&this._flush()}_updateFftInput(){const t=(this._samplesCount-this._fftSize)%this._buffer.length;for(let s=0;s<this._fftInput.length;s++)this._fftInput[s]=t+s<0?0:this._buffer[(t+s)%this._buffer.length]}_convertFloatToDb(t){const s=Math.min(this._lastTransform.length,t.length);if(s>0){const e=this._lastTransform;for(let r=0;r<s;++r)t[r]=o(e[r])}}_convertToByteData(t){const s=Math.min(this._lastTransform.length,t.length);if(s>0){const e=this._lastTransform,r=1/(this._maxDecibels-this._minDecibels);for(let i=0;i<s;++i){const s=e[i],a=255*(o(s)-this._minDecibels)*r;t[i]=n(0|a,0,255)}}}_doFft(){this._updateFftInput(),this._fftAnalyser.realTransform(this._fftOutput,this._fftInput);const t=1/this._fftSize,s=n(this._smoothingTimeConstant,0,1);for(let e=0;e<this._lastTransform.length;e++){const r=Math.abs(Math.hypot(this._fftOutput[2*e],this._fftOutput[2*e+1]))*t;this._lastTransform[e]=s*this._lastTransform[e]+(1-s)*r}}_flush(){this._doFft();const t=new Uint8Array(this._fftSize/2);t instanceof Float32Array?this._convertFloatToDb(t):this._convertToByteData(t),this.port.postMessage({type:r.dataAvailable,currentTime:currentTime,data:t})}process(t,s,e){const r=e.isRecording;for(let s=0;s<t.length;s++){if(1===r[s]&&t[0][0])for(let s=0;s<t[0][0].length;s++)this._appendToBuffer(t[0][0][s])}return!0}}registerProcessor("AdvancedAnalyserProcessor",a),t.AdvancedAnalyserProcessor=a,Object.defineProperty(t,"__esModule",{value:!0})}));
