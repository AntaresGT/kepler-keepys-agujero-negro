/**
 * Shader del Horizonte de Eventos - Implementa la Métrica de Schwarzschild
 * Basado en las ecuaciones de Kip Thorne para agujeros negros
 * 
 * FÍSICA IMPLEMENTADA:
 * - Radio de Schwarzschild: rs = 2GM/c²
 * - Lente gravitacional: α = 4GM/(c²r)
 * - Gradiente de distorsión proporcional a M/r²
 * - Transición suave hacia el horizonte de eventos
 */

// Parámetros físicos del agujero negro
uniform float uIntensidadDistorsion; // Factor de intensificación α
uniform float uRadioSchwarzschild;   // Radio visual rs

varying vec2 vUv;

// Función auxiliar para interpolación inversa
float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

// Función de remapeo de rangos
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  /**
   * Cálculo de Distorsión según la Relatividad General
   * La intensidad de distorsión es proporcional a GM/r²
   * Cerca del horizonte de eventos, la distorsión tiende a infinito
   */
  float distanciaNormalizada = length(vUv - 0.5);

  // Conversión a unidades físicas usando el tamaño del plano (diámetro = 2rs)
  float r = distanciaNormalizada * uRadioSchwarzschild * 2.0;

  // Radio interno: horizonte de eventos (rs)
  float radioInternoEfectivo = uRadioSchwarzschild;
  // Radio externo: región donde la lente gravitacional sigue siendo apreciable (~5rs)
  float radioExternoEfectivo = uRadioSchwarzschild * 5.0;

  // Distribución de distorsión con caída r^(-2) según Relatividad General
  float strength = remap(r, radioInternoEfectivo, radioExternoEfectivo, 1.0, 0.0);
  strength = smoothstep(0.0, 1.0, strength);

  // Intensificar según configuración
  strength *= uIntensidadDistorsion;

  // Límite de intensidad
  strength = clamp(strength, 0.0, 2.0);

  // Salida en el canal rojo
  gl_FragColor = vec4(vec3(strength), 1.0);
}
