varying vec2 vUv;

// Parámetros físicos de la distorsión
uniform float uIntensidadDistorsion; // Factor de lente gravitacional
uniform float uRadioSchwarzschild;   // Radio de Schwarzschild visual
uniform float uRadioDisco;           // Radio externo del disco

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  float distanciaNormalizada = length(vUv - 0.5);
  // Conversión a radio físico del disco (diámetro = 2*uRadioDisco)
  float r = distanciaNormalizada * uRadioDisco * 2.0;

  // Distorsión que decae desde el horizonte hasta el borde del disco
  float strength = remap(r, uRadioSchwarzschild, uRadioDisco, 1.0, 0.0);
  strength = smoothstep(0.0, 1.0, strength);
  strength *= uIntensidadDistorsion;

  gl_FragColor = vec4(vec3(strength), 1.0);
}
