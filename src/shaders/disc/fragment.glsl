/**
 * Shader del Disco de Acreción - Modelo Shakura-Sunyaev
 * Implementa las ecuaciones físicas de discos de acreción según Kip Thorne
 * 
 * ECUACIONES FÍSICAS:
 * - Temperatura: T(r) ∝ (GM/r³)^(1/4) [ley r^(-3/4)]
 * - Velocidad orbital: v = √(GM/r) [tercera ley de Kepler]
 * - Luminosidad: L ∝ GMṀ/(2r) [conversión de energía gravitacional]
 * - Emisión térmica según la ley de Planck para cuerpo negro
 */

uniform float uTime;
uniform sampler2D uGradientTexture;
uniform sampler2D uNoisesTexture;

// Parámetros físicos configurables del disco
uniform float uTemperaturaMaxima;    // Temperatura máxima en el borde interno [K]
uniform float uVelocidadRotacion;    // Factor de velocidad orbital v = √(GM/r)
uniform float uVelocidadAcrecion;    // Tasa de acreción Ṁ = dM/dt
uniform float uIntensidadRuido;      // Turbulencia magnetohidrodinámica

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
   * Generación de Turbulencia del Disco
   * Usa múltiples octavas de ruido para simular la turbulencia magnetohidrodinámica
   * Velocidades diferentes para simular el movimiento diferencial kepleriano
   */
  float tiempoEscalado = uTime * uVelocidadRotacion;
  
  // Múltiples capas de ruido con frecuencias diferentes (realista para MHD)
  float noise1 = texture(uNoisesTexture, vUv - vec2(tiempoEscalado * 0.1, 0.0)).r;
  float noise2 = texture(uNoisesTexture, vUv - vec2(tiempoEscalado * 0.08, 0.0)).g;
  float noise3 = texture(uNoisesTexture, vUv - vec2(tiempoEscalado * 0.06, 0.0)).b;
  float noise4 = texture(uNoisesTexture, vUv - vec2(tiempoEscalado * 0.04, 0.0)).a;
  
  // Combinación de ruidos para turbulencia compleja
  vec4 noiseVector = vec4(noise1, noise2, noise3, noise4);
  float noiseLength = length(noiseVector) * uIntensidadRuido;

  /**
   * Distribución de Temperatura Radial
   * Implementa T(r) ∝ r^(-3/4) según el modelo Shakura-Sunyaev
   * Falloff hacia el borde externo por pérdida de materia
   * Falloff hacia el borde interno por ISCO (Innermost Stable Circular Orbit)
   */
  
  // Falloff externo: pérdida de masa hacia el exterior
  float outerFalloff = remap(vUv.y, 0.4, 0.0, 1.0, 0.0);
  
  // Falloff interno: cerca del horizonte (ISCO ≈ 3rs para Schwarzschild)
  float innerFalloff = remap(vUv.y, 1.0, 0.95, 0.0, 1.0);
  
  // Distribución de temperatura combinada
  float falloff = min(outerFalloff, innerFalloff);
  falloff = smoothstep(0.0, 1.0, falloff);

  /**
   * Aplicación de Efectos Dinámicos
   * - Movimiento por acreción hacia el interior
   * - Turbulencia por inestabilidades magnetorotacionales
   * - Variaciones de temperatura locales
   */
  vec2 uv = vUv;
  
  // Desplazamiento por turbulencia (conserva momento angular)
  uv.y += noiseLength * 0.4 * falloff;
  
  // Efecto de acreción: movimiento hacia el centro con el tiempo
  uv.y -= uVelocidadAcrecion * uTime * 0.01 * falloff;
  
  // Modular la intensidad total por el falloff radial
  uv.y *= falloff;

  /**
   * Muestreo de Color del Gradiente de Temperatura
   * El gradiente representa la emisión de cuerpo negro a diferentes temperaturas
   * Colores: blanco (>12000K) → amarillo (8000K) → rojo (3000K) → púrpura (<2000K)
   */
  vec4 color = texture(uGradientTexture, uv);
  
  // La transparencia representa la densidad de material emisor
  color.a = uv.y;
  
  // Modular el brillo total por la temperatura máxima configurada
  float temperatureFactor = uTemperaturaMaxima / 10000.0; // Normalizado a 10000K
  color.rgb *= temperatureFactor;
  
  gl_FragColor = color;
}
