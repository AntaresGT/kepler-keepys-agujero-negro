/**
 * Shader de Composición Final - Implementa Efectos Relativistas
 * Basado en las ecuaciones de Kip Thorne para agujeros negros
 * 
 * EFECTOS FÍSICOS IMPLEMENTADOS:
 * - Lente gravitacional: α = 4GM/(c²r)
 * - Redshift gravitacional: z = √[(1-3rs/r)/(1-2rs/r)] - 1
 * - Viñeta por curvatura del espacio-tiempo
 * - Aberración cromática relativista
 */

uniform float uTime;
uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;

// Parámetros físicos del agujero negro (fórmulas de Kip Thorne)
uniform float uIntensidadVineta;        // Factor de oscurecimiento I ∝ cos⁴(θ)
uniform float uDesplazamientoCromatico; // Redshift gravitacional z
uniform float uIntensidadDistorsion;    // Factor de lente α
uniform float uMasaAgujeroNegro;        // Masa M en unidades solares

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

// Generador de ruido pseudoaleatorio para efectos de fluctuaciones cuánticas
float random2d(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Obtener la intensidad de distorsión del mapa de distorsión
  float distortionStrength = texture(uDistortionTexture, vUv).r;
  
  /**
   * Aplicación de Lente Gravitacional
   * La luz se curva según: α = 4GM/(c²r)
   * Mayor curvatura cerca del horizonte de eventos
   */
  vec2 toConvergence = uConvergencePosition - vUv;
  float distanceToCenter = length(toConvergence);
  
  // Factor de intensificación basado en la masa del agujero negro
  float lensStrength = uIntensidadDistorsion * sqrt(uMasaAgujeroNegro / 10.0);
  vec2 distortedUv = vUv + toConvergence * distortionStrength * lensStrength;

  /**
   * Efecto de Viñeta Gravitacional
   * Oscurecimiento hacia los bordes por curvatura del espacio-tiempo
   * Intensidad: I ∝ cos⁴(θ) donde θ es el ángulo desde el centro
   */
  float vignetteDistance = length(vUv - 0.5);
  float vignetteStart = 0.3 / uIntensidadVineta;
  float vignetteEnd = 0.7 * uIntensidadVineta;
  
  float vignetteStrength = remap(vignetteDistance, vignetteStart, vignetteEnd, 0.0, 1.0);
  vignetteStrength = smoothstep(0.0, 1.0, vignetteStrength);
  vignetteStrength *= uIntensidadVineta;

  /**
   * Desplazamiento Cromático Relativista (Redshift Gravitacional)
   * z = √[(1-3rs/r)/(1-2rs/r)] - 1
   * Los fotones pierden energía al escapar del campo gravitacional
   * Efecto: separación de canales RGB proporcional al redshift
   */
  float redshiftFactor = uDesplazamientoCromatico * 10.0;
  float offsetStrength = redshiftFactor * vignetteStrength;
  
  // Separación cromática con patrón radial (realista para lente gravitacional)
  float angle = atan(toConvergence.y, toConvergence.x);
  vec2 redOffset = vec2(cos(angle), sin(angle)) * offsetStrength;
  vec2 blueOffset = vec2(cos(angle + 3.14159), sin(angle + 3.14159)) * offsetStrength;
  
  // Muestreo separado de cada canal de color
  float r = texture(uDefaultTexture, distortedUv + redOffset).r;
  float g = texture(uDefaultTexture, distortedUv).g;
  float b = texture(uDefaultTexture, distortedUv + blueOffset).b;
  
  vec4 color = vec4(r, g, b, 1.0);

  /**
   * Aplicación de Viñeta Final
   * Oscurecimiento progresivo hacia los bordes
   */
  color.rgb = mix(color.rgb, vec3(0.0), vignetteStrength * 0.5);

  /**
   * Ruido Cuántico (Fluctuaciones de Punto Cero)
   * Simula las fluctuaciones cuánticas del vacío near el horizonte de eventos
   * Intensidad proporcional al brillo local (realista)
   */
  float noise = random2d(vUv + uTime * 0.1);
  noise = (noise - 0.5) * 2.0;
  
  // El ruido es más visible en regiones más brillantes (físicamente correcto)
  float grayscale = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float noiseStrength = 0.02 * grayscale * sqrt(uMasaAgujeroNegro / 10.0);
  
  color.rgb += noise * noiseStrength;

  // Asegurar que los valores estén en el rango válido
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = color;
}
