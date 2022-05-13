precision highp float;

uniform sampler2D fft;
uniform float u_visibleTransforms;
uniform float u_xTransformOffset;
uniform float u_minFrequency;
uniform float u_maxFrequency;
uniform float u_dynamicRange;
uniform float u_dynamicRangeTop;
uniform float u_minDecibels;
uniform float u_maxDecibels;
uniform float u_sampleRate;
uniform vec2 u_textureSize;
uniform vec2 u_viewportSize;


float lerp(float from, float to, float rel){
  return ((1. - rel) * from) + (rel * to);
}
float invLerp(float from, float to, float value){
  return (value - from) / (to - from);
}

float remap(float origFrom, float origTo, float targetFrom, float targetTo, float value){
  float rel = invLerp(origFrom, origTo, value);
  return lerp(targetFrom, targetTo, rel);
} 

{{COLOR_RAMP}}

void main() {
  vec2 normCoord = (gl_FragCoord.xy + vec2(0., 0.))/ u_viewportSize.xy;
  float xOffset = u_xTransformOffset / u_visibleTransforms;
  float xScale =  u_visibleTransforms / u_textureSize.x;
  float x = (normCoord.x + xOffset ) * xScale ;
  
  float minLog = log2(u_minFrequency);
  float maxLog = log2(u_maxFrequency);

  float hz = pow(2., lerp(minLog, maxLog, normCoord.y));
  float y = (hz / u_sampleRate ) * 2.;

  float color = texture2D(fft, vec2(x, y )).x;

  gl_FragColor = vec4(color_ramp(
    clamp(invLerp( u_dynamicRangeTop - u_dynamicRange, u_dynamicRangeTop, lerp(u_minDecibels, u_maxDecibels, color)), 0., 1.)
  ), 1.);
}
