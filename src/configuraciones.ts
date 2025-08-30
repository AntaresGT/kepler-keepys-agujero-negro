/**
 * Configuraciones predefinidas para diferentes casos de uso del simulador
 * Estas configuraciones pueden importarse en el componente App.tsx
 */

export interface ConfiguracionAgujeroNegro {
    nombre: string;
    descripcion: string;
    masaAgujeroNegro: number;
    velocidadRotacionDisco: number;
    temperaturaMaximaDisco: number;
    intensidadDistorsion: number;
    cantidadEstrellas: number;
    amplitudVibraciones: number;
    velocidadAcrecion: number;
    intensidadVineta: number;
    desplazamientoCromatico: number;
    intensidadRuido: number;
}

/**
 * Configuraciones predefinidas basadas en objetos reales y casos educativos
 */
export const configuracionesPredefinidas: ConfiguracionAgujeroNegro[] = [
    {
        nombre: "Sagittarius A*",
        descripcion: "Agujero negro supermasivo en el centro de la Vía Láctea (4.1 × 10⁶ M☉, escala reducida)",
        masaAgujeroNegro: 60,
        velocidadRotacionDisco: 0.8,
        temperaturaMaximaDisco: 12000,
        intensidadDistorsion: 1.2,
        cantidadEstrellas: 25000,
        amplitudVibraciones: 0.05,
        velocidadAcrecion: 0.15,
        intensidadVineta: 1.1,
        desplazamientoCromatico: 0.025,
        intensidadRuido: 0.08
    },
    {
        nombre: "M87* (Event Horizon Telescope)",
        descripcion: "Agujero negro supermasivo fotografiado por EHT (6.5 × 10⁹ M☉, escala reducida)",
        masaAgujeroNegro: 100,
        velocidadRotacionDisco: 1.2,
        temperaturaMaximaDisco: 15000,
        intensidadDistorsion: 1.5,
        cantidadEstrellas: 30000,
        amplitudVibraciones: 0.03,
        velocidadAcrecion: 0.25,
        intensidadVineta: 1.3,
        desplazamientoCromatico: 0.035,
        intensidadRuido: 0.06
    },
    {
        nombre: "Agujero Negro Estelar",
        descripcion: "Agujero negro formado por colapso estelar (típicamente 5-25 M☉)",
        masaAgujeroNegro: 15,
        velocidadRotacionDisco: 1.5,
        temperaturaMaximaDisco: 8000,
        intensidadDistorsion: 1.0,
        cantidadEstrellas: 15000,
        amplitudVibraciones: 0.15,
        velocidadAcrecion: 0.3,
        intensidadVineta: 0.9,
        desplazamientoCromatico: 0.02,
        intensidadRuido: 0.12
    },
    {
        nombre: "Agujero Negro Intermedio",
        descripcion: "Masa intermedia entre estelares y supermasivos",
        masaAgujeroNegro: 40,
        velocidadRotacionDisco: 1.0,
        temperaturaMaximaDisco: 10000,
        intensidadDistorsion: 1.1,
        cantidadEstrellas: 20000,
        amplitudVibraciones: 0.08,
        velocidadAcrecion: 0.2,
        intensidadVineta: 1.0,
        desplazamientoCromatico: 0.022,
        intensidadRuido: 0.1
    },
    {
        nombre: "Configuración Educativa",
        descripcion: "Optimizada para demostraciones en aula con efectos visibles pero realistas",
        masaAgujeroNegro: 20,
        velocidadRotacionDisco: 1.2,
        temperaturaMaximaDisco: 10000,
        intensidadDistorsion: 1.3,
        cantidadEstrellas: 18000,
        amplitudVibraciones: 0.1,
        velocidadAcrecion: 0.25,
        intensidadVineta: 1.1,
        desplazamientoCromatico: 0.025,
        intensidadRuido: 0.1
    },
    {
        nombre: "Modo Divulgación",
        descripcion: "Máximo impacto visual para presentaciones públicas",
        masaAgujeroNegro: 80,
        velocidadRotacionDisco: 2.5,
        temperaturaMaximaDisco: 14000,
        intensidadDistorsion: 2.2,
        cantidadEstrellas: 35000,
        amplitudVibraciones: 0.2,
        velocidadAcrecion: 0.4,
        intensidadVineta: 1.5,
        desplazamientoCromatico: 0.04,
        intensidadRuido: 0.15
    },
    {
        nombre: "Modo Científico Puro",
        descripcion: "Parámetros basados estrictamente en física sin efectos exagerados",
        masaAgujeroNegro: 25,
        velocidadRotacionDisco: 1.0,
        temperaturaMaximaDisco: 9500,
        intensidadDistorsion: 1.0,
        cantidadEstrellas: 12000,
        amplitudVibraciones: 0.02,
        velocidadAcrecion: 0.15,
        intensidadVineta: 0.8,
        desplazamientoCromatico: 0.015,
        intensidadRuido: 0.05
    },
    {
        nombre: "Agujero Negro Extremo",
        descripcion: "Configuración de máxima masa y efectos para explorar límites",
        masaAgujeroNegro: 100,
        velocidadRotacionDisco: 3.0,
        temperaturaMaximaDisco: 15000,
        intensidadDistorsion: 3.0,
        cantidadEstrellas: 50000,
        amplitudVibraciones: 0.25,
        velocidadAcrecion: 0.6,
        intensidadVineta: 2.0,
        desplazamientoCromatico: 0.06,
        intensidadRuido: 0.2
    },
    {
        nombre: "Agujero Negro Mínimo",
        descripcion: "Configuración de masa mínima para estudiar límites inferiores",
        masaAgujeroNegro: 3,
        velocidadRotacionDisco: 0.5,
        temperaturaMaximaDisco: 5000,
        intensidadDistorsion: 0.8,
        cantidadEstrellas: 8000,
        amplitudVibraciones: 0.25,
        velocidadAcrecion: 0.1,
        intensidadVineta: 0.7,
        desplazamientoCromatico: 0.01,
        intensidadRuido: 0.15
    },
    {
        nombre: "Evento de Fusión",
        descripcion: "Simula la fusión de dos agujeros negros con perturbaciones intensas",
        masaAgujeroNegro: 50,
        velocidadRotacionDisco: 4.0,
        temperaturaMaximaDisco: 13000,
        intensidadDistorsion: 2.5,
        cantidadEstrellas: 25000,
        amplitudVibraciones: 1.0,
        velocidadAcrecion: 0.8,
        intensidadVineta: 1.4,
        desplazamientoCromatico: 0.05,
        intensidadRuido: 0.3
    }
];

/**
 * Función para obtener configuración por nombre
 */
export function obtenerConfiguracion(nombre: string): ConfiguracionAgujeroNegro | null {
    return configuracionesPredefinidas.find(config => config.nombre === nombre) || null;
}

/**
 * Función para obtener configuración aleatoria
 */
export function obtenerConfiguracionAleatoria(): ConfiguracionAgujeroNegro {
    const indiceAleatorio = Math.floor(Math.random() * configuracionesPredefinidas.length);
    return configuracionesPredefinidas[indiceAleatorio];
}

/**
 * Valores por defecto para nuevas configuraciones
 */
export const configuracionDefecto: ConfiguracionAgujeroNegro = {
    nombre: "Por Defecto",
    descripcion: "Configuración estándar balanceada",
    masaAgujeroNegro: 10,
    velocidadRotacionDisco: 1.0,
    temperaturaMaximaDisco: 10000,
    intensidadDistorsion: 1.0,
    cantidadEstrellas: 10000,
    amplitudVibraciones: 0.1,
    velocidadAcrecion: 0.1,
    intensidadVineta: 1.0,
    desplazamientoCromatico: 0.02,
    intensidadRuido: 0.1
};

/**
 * Agregar la configuración por defecto al inicio del arreglo principal
 * Esto facilita restablecer los valores originales desde la interfaz
 */
configuracionesPredefinidas.unshift(configuracionDefecto);

/**
 * Rangos válidos para validación de parámetros
 */
export const rangosParametros = {
    masaAgujeroNegro: { min: 1, max: 100, unidad: "M☉" },
    velocidadRotacionDisco: { min: 0.1, max: 5.0, unidad: "×" },
    temperaturaMaximaDisco: { min: 1000, max: 15000, unidad: "K" },
    intensidadDistorsion: { min: 0.1, max: 3.0, unidad: "×" },
    cantidadEstrellas: { min: 1000, max: 50000, unidad: "estrellas" },
    amplitudVibraciones: { min: 0.0, max: 1.0, unidad: "×" },
    velocidadAcrecion: { min: 0.01, max: 1.0, unidad: "×" },
    intensidadVineta: { min: 0.0, max: 2.0, unidad: "×" },
    desplazamientoCromatico: { min: 0.0, max: 0.1, unidad: "×" },
    intensidadRuido: { min: 0.0, max: 1.0, unidad: "×" }
};
