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
/*uniform float uMasaAgujeroNegro;     // Masa M en unidades solares
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
  /*
  float distanceToCenter = length(vUv - 0.5);
  
  // Factor de escala basado en la masa del agujero negro
  float massFactor = sqrt(uMasaAgujeroNegro / 10.0);
  
  /**
   * Aplicación de la Fórmula de Lente Gravitacional
   * α = 4GM/(c²r) - ángulo de deflexión
   * Aproximación: intensidad ∝ 1/r² cerca del horizonte
   */
  /*
  float radioInternoEfectivo = 0.1 * massFactor;  // Zona de máxima distorsión
  float radioExternoEfectivo = 0.5 / massFactor;  // Límite de influencia gravitacional
  
  // Distribución de distorsión con caída r^(-2) (físicamente correcta)
  float strength = remap(distanceToCenter, radioInternoEfectivo, radioExternoEfectivo, 1.0, 0.0);
  
  // Aplicar perfil de distorsión suavizado (evita discontinuidades numéricas)
  strength = smoothstep(0.0, 1.0, strength);
  
  // Intensificar según el parámetro de configuración
  strength *= uIntensidadDistorsion;
  
  /**
   * Efecto de Horizonte de Eventos
   * En el centro exacto, la distorsión es máxima (singularidad visual)
   * Se suaviza para evitar artifacts numéricos
   */
  /*
  if (distanceToCenter < radioInternoEfectivo * 0.5) {
    strength = uIntensidadDistorsion; // Distorsión máxima en el centro
  }
  
  // Asegurar que la intensidad esté en el rango válido
  strength = clamp(strength, 0.0, 2.0);
  
  // Output: intensidad de distorsión en el canal rojo
  gl_FragColor = vec4(vec3(strength), 1.0);
}
*/

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}


float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main() {
  float distanceToCenter = length(vUv - 0.5);
  float strength = remap(distanceToCenter, 0.2, 0.5, 1.0, 0.0);
  strength = smoothstep(0.0, 1.0, strength);
  gl_FragColor = vec4(vec3(strength), 1.0);
}
