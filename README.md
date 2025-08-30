# Simulación de Agujero Negro - Basado en Kip Thorne

Una simulación en tiempo real de un agujero negro que implementa las ecuaciones físicas de las investigaciones de Kip Thorne, el físico teórico que asesoró la película Interstellar.

## Características Principales

### Física Implementada
- **Lente Gravitacional**: Implementa la curvatura del espacio-tiempo según la Relatividad General de Einstein
- **Métrica de Kerr**: Simula agujeros negros rotativos con parámetro de spin variable
- **Disco de Acreción**: Material caliente orbitando el agujero negro con temperaturas realistas
- **Efectos Relativistas**: Incluye efectos Doppler y emisión de cuerpo negro
- **Horizonte de Eventos**: Radio de Schwarzschild donde el escape es imposible

### Efectos Visuales
- **Colores Realistas**: Basados en la temperatura de cuerpo negro del disco de acreción
- **Animación Fluida**: 60 FPS con renderizado optimizado
- **Fondo Estrellado**: Utiliza la imagen de fondo para simular el campo estelar distorsionado
- **Partículas Dinámicas**: Simulación de material cayendo al agujero negro

## Controles en Tiempo Real

Durante la simulación puedes modificar los parámetros físicos:

| Tecla | Función |
|-------|---------|
| `Q` | Aumentar Radio de Schwarzschild |
| `A` | Disminuir Radio de Schwarzschild |
| `W` | Aumentar Spin del agujero negro (parámetro a) |
| `S` | Disminuir Spin del agujero negro |
| `E` | Aumentar fuerza de la lente gravitacional |
| `D` | Disminuir fuerza de la lente gravitacional |
| `R` | Aumentar temperatura del disco de acreción |
| `F` | Disminuir temperatura del disco de acreción |
| `ESC` | Salir de la simulación |

## Fundamentos Físicos

### Ecuaciones Implementadas

#### 1. Radio de Schwarzschild
```
rs = 2GM/c²
```
Donde:
- G = Constante gravitacional
- M = Masa del agujero negro
- c = Velocidad de la luz

#### 2. Lente Gravitacional
```
α ≈ 4GM/(c²r) × factor_relativista
```
Ángulo de deflexión de la luz al pasar cerca del agujero negro.

#### 3. Temperatura del Disco de Acreción
```
T(r) ∝ r^(-3/4)
```
La temperatura decrece con la distancia según la ley de potencia.

#### 4. Velocidad Orbital
```
v ∝ r^(-1/2)
```
Tercera ley de Kepler para órbitas circulares.

#### 5. Métrica de Kerr (Simplificada)
```
factor_kerr = 1 + (a²rs²)/(4r²)
```
Donde 'a' es el parámetro de spin del agujero negro.

## Instalación y Ejecución

### Requisitos
- Python 3.7+
- Pygame 2.5.0+
- NumPy 1.24.0+
- Numba 0.57.0+
- OpenCV-Python 4.7.0+

### Instalación
```bash
pip install -r requirements.txt
```

### Ejecución
```bash
python principal.py
```

## Detalles Técnicos

### Optimizaciones Implementadas
- **Ray Tracing Inverso**: Para calcular la lente gravitacional eficientemente
- **Renderizado por Lotes**: Agrupa píxeles para mejorar rendimiento
- **Distribución Estadística**: Usa distribuciones realistas para las partículas del disco
- **Interpolación de Colores**: Suaviza transiciones de temperatura

### Parámetros por Defecto
- Radio de Schwarzschild: 50 píxeles
- Spin: 0.7 (agujero negro rotativo)
- Temperatura del disco: 6000K
- Fuerza de lente: 1.5

## Precisión Científica

Esta simulación está basada en:

1. **Investigaciones de Kip Thorne** sobre agujeros negros y lente gravitacional
2. **Ecuaciones de Einstein** de la Relatividad General
3. **Modelos de discos de acreción** de Shakura-Sunyaev
4. **Efectos relativistas** observados en agujeros negros reales

### Simplificaciones Realizadas
- Se usa una aproximación 2D de efectos 3D
- La métrica de Kerr está simplificada para rendimiento
- Los efectos cuánticos cerca del horizonte no están incluidos
- Se asume simetría axial perfecta

## Referencias Científicas

- Thorne, K. S. (2014). "The Science of Interstellar"
- Chandrasekhar, S. (1983). "The Mathematical Theory of Black Holes"
- Misner, Thorne & Wheeler (1973). "Gravitation"
- James et al. (2015). "Gravitational lensing by spinning black holes in astrophysics, and in the movie Interstellar"

## Estructura del Código

```
principal.py
├── ConstantesAgujeroNegro     # Parámetros físicos
├── SimuladorAgujeroNegro      # Clase principal
│   ├── ecuacion_geodesica_agujero_negro()    # Física de deflexión
│   ├── calcular_temperatura_disco()         # Termodinámica
│   ├── aplicar_lente_gravitacional()        # Ray tracing
│   ├── dibujar_disco_acrecion()             # Renderizado
│   └── procesar_eventos()                   # Controles
└── main()                     # Función principal
```

## Contribuciones

Este proyecto está inspirado en el trabajo científico de Kip Thorne y está diseñado con fines educativos y de visualización científica. Las ecuaciones implementadas reflejan la física real de los agujeros negros según nuestro entendimiento actual.

## Licencia

Ver archivo LICENSE para detalles.
