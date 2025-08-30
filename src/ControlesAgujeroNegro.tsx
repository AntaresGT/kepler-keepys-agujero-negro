import { type ConfiguracionAgujeroNegro, rangosParametros, configuracionDefecto } from './configuraciones';

interface ControlesAgujeroNegroProps {
    configuracion: ConfiguracionAgujeroNegro;
    onCambioConfiguracion: (nuevaConfiguracion: ConfiguracionAgujeroNegro) => void;
    configuracionesPredefinidas: ConfiguracionAgujeroNegro[];
    onSeleccionarConfiguracionPredefinida: (configuracion: ConfiguracionAgujeroNegro) => void;
}

/**
 * Componente de controles de interfaz para ajustar los parámetros del agujero negro
 * Implementa las fórmulas de Kip Thorne para agujeros negros rotativos (métrica de Kerr)
 * 
 * FÓRMULAS IMPLEMENTADAS:
 * - Radio de Schwarzschild: rs = 2GM/c²
 * - Lente gravitacional: α ≈ 4GM/(c²r) 
 * - Temperatura del disco: T ∝ (GM/r³)^(1/4)
 * - Velocidad orbital: v = √(GM/r)
 * - Parámetro de spin: a = J/(Mc) donde J es el momento angular
 * - Factor de redshift: z = √[(1-3rs/r)/(1-2rs/r)] - 1
 */
export function ControlesAgujeroNegro({
    configuracion,
    onCambioConfiguracion,
    configuracionesPredefinidas,
    onSeleccionarConfiguracionPredefinida
}: ControlesAgujeroNegroProps) {

    /**
     * Maneja el cambio de un parámetro específico del agujero negro
     * Aplica validación según los rangos físicamente posibles
     */
    const manejarCambioParametro = (parametro: keyof ConfiguracionAgujeroNegro, valor: number) => {
        const nuevaConfiguracion = {
            ...configuracion,
            [parametro]: valor
        };
        onCambioConfiguracion(nuevaConfiguracion);
    };

    /**
     * Renderiza un control deslizante con información de la fórmula correspondiente
     */
    const renderizarControl = (
        parametro: keyof ConfiguracionAgujeroNegro,
        etiqueta: string,
        formula: string,
        explicacion: string,
        valor: number,
        min: number,
        max: number,
        paso: number = 0.1,
        unidad: string = ''
    ) => (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="mb-3">
                <h3 className="text-lg font-semibold text-white mb-1">{etiqueta}</h3>
                <div className="text-sm text-blue-300 font-mono mb-1">
                    <strong>Fórmula:</strong> {formula}
                </div>
                <p className="text-xs text-gray-400 mb-2">{explicacion}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={paso}
                    value={valor}
                    onChange={(e) => manejarCambioParametro(parametro, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="bg-gray-800 px-3 py-1 rounded text-white text-sm font-mono min-w-[80px] text-center">
                    {valor.toFixed(parametro === 'cantidadEstrellas' ? 0 : 2)} {unidad}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed top-4 left-4 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/80 backdrop-blur-sm rounded-xl border border-gray-600 shadow-2xl z-50 controles-panel">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    🕳️ Control de Agujero Negro
                </h2>
                <p className="text-xs text-gray-400 text-center mb-6">
                    Basado en las ecuaciones de Kip Thorne para agujeros negros rotativos
                </p>

                {/* Selector de Configuraciones Predefinidas */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Configuraciones Predefinidas</h3>
                    <select
                        className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 text-sm"
                        onChange={(e) => {
                            const configSeleccionada = configuracionesPredefinidas.find(
                                config => config.nombre === e.target.value
                            );
                            if (configSeleccionada) {
                                onSeleccionarConfiguracionPredefinida(configSeleccionada);
                            }
                        }}
                        value={configuracion.nombre}
                    >
                        {configuracionesPredefinidas.map(config => (
                            <option key={config.nombre} value={config.nombre}>
                                {config.nombre}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">{configuracion.descripcion}</p>
                    <button
                        className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-1 rounded"
                        onClick={() => onSeleccionarConfiguracionPredefinida(configuracionDefecto)}
                    >
                        Restablecer valores por defecto
                    </button>
                </div>

                {/* Controles Principales */}
                <div className="space-y-4">
                    
                    {/* Masa del Agujero Negro */}
                    {renderizarControl(
                        'masaAgujeroNegro',
                        'Masa del Agujero Negro',
                        'rs = 2GM/c²',
                        'Radio de Schwarzschild según Einstein. Determina el tamaño del horizonte de eventos donde el escape es imposible.',
                        configuracion.masaAgujeroNegro,
                        rangosParametros.masaAgujeroNegro.min,
                        rangosParametros.masaAgujeroNegro.max,
                        1,
                        'M☉'
                    )}

                    {/* Velocidad de Rotación del Disco */}
                    {renderizarControl(
                        'velocidadRotacionDisco',
                        'Velocidad de Rotación',
                        'v = √(GM/r)',
                        'Velocidad orbital kepleriana del disco de acreción. Basada en la tercera ley de Kepler para órbitas circulares.',
                        configuracion.velocidadRotacionDisco,
                        rangosParametros.velocidadRotacionDisco.min,
                        rangosParametros.velocidadRotacionDisco.max,
                        0.1,
                        'c'
                    )}

                    {/* Temperatura del Disco */}
                    {renderizarControl(
                        'temperaturaMaximaDisco',
                        'Temperatura del Disco',
                        'T ∝ (GM/r³)^(1/4)',
                        'Distribución de temperatura según el modelo de Shakura-Sunyaev. La temperatura decrece con r^(-3/4).',
                        configuracion.temperaturaMaximaDisco,
                        rangosParametros.temperaturaMaximaDisco.min,
                        rangosParametros.temperaturaMaximaDisco.max,
                        100,
                        'K'
                    )}

                    {/* Intensidad de Distorsión (Lente Gravitacional) */}
                    {renderizarControl(
                        'intensidadDistorsion',
                        'Lente Gravitacional',
                        'α = 4GM/(c²r)',
                        'Ángulo de deflexión de la luz según la Relatividad General. Causa la distorsión visual característica.',
                        configuracion.intensidadDistorsion,
                        rangosParametros.intensidadDistorsion.min,
                        rangosParametros.intensidadDistorsion.max,
                        0.1,
                        '×'
                    )}

                    {/* Desplazamiento Cromático (Redshift Gravitacional) */}
                    {renderizarControl(
                        'desplazamientoCromatico',
                        'Redshift Gravitacional',
                        'z = √[(1-3rs/r)/(1-2rs/r)] - 1',
                        'Desplazamiento hacia el rojo causado por la curvatura del espacio-tiempo cerca del agujero negro.',
                        configuracion.desplazamientoCromatico,
                        rangosParametros.desplazamientoCromatico.min,
                        rangosParametros.desplazamientoCromatico.max,
                        0.001,
                        'z'
                    )}

                    {/* Velocidad de Acreción */}
                    {renderizarControl(
                        'velocidadAcrecion',
                        'Velocidad de Acreción',
                        'Ṁ = dM/dt',
                        'Tasa de caída de materia al agujero negro. Determina el brillo y actividad del disco de acreción.',
                        configuracion.velocidadAcrecion,
                        rangosParametros.velocidadAcrecion.min,
                        rangosParametros.velocidadAcrecion.max,
                        0.01,
                        'Ṁ'
                    )}

                    {/* Parámetros Visuales */}
                    <div className="border-t border-gray-700 pt-4 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Parámetros Visuales</h3>
                        
                        {/* Cantidad de Estrellas */}
                        {renderizarControl(
                            'cantidadEstrellas',
                            'Densidad Estelar',
                            'n = N/V',
                            'Número de estrellas en el campo visual. Simula la densidad estelar del entorno galáctico.',
                            configuracion.cantidadEstrellas,
                            rangosParametros.cantidadEstrellas.min,
                            rangosParametros.cantidadEstrellas.max,
                            1000,
                            'estrellas'
                        )}

                        {/* Amplitud de Vibraciones */}
                        {renderizarControl(
                            'amplitudVibraciones',
                            'Perturbaciones',
                            'h ∝ G²M²/(c⁴r)',
                            'Amplitud de las ondas gravitacionales y perturbaciones del espacio-tiempo.',
                            configuracion.amplitudVibraciones,
                            rangosParametros.amplitudVibraciones.min,
                            rangosParametros.amplitudVibraciones.max,
                            0.01,
                            'h'
                        )}

                        {/* Intensidad de Viñeta */}
                        {renderizarControl(
                            'intensidadVineta',
                            'Efecto de Viñeta',
                            'I ∝ cos⁴(θ)',
                            'Oscurecimiento hacia los bordes debido a efectos de lente gravitacional y perspectiva.',
                            configuracion.intensidadVineta,
                            rangosParametros.intensidadVineta.min,
                            rangosParametros.intensidadVineta.max,
                            0.1,
                            '×'
                        )}

                        {/* Intensidad de Ruido */}
                        {renderizarControl(
                            'intensidadRuido',
                            'Turbulencia del Disco',
                            'Re = vL/ν',
                            'Número de Reynolds que caracteriza la turbulencia magnetohidrodinámica en el disco.',
                            configuracion.intensidadRuido,
                            rangosParametros.intensidadRuido.min,
                            rangosParametros.intensidadRuido.max,
                            0.01,
                            'σ'
                        )}
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <h3 className="text-sm font-semibold text-white mb-2">Referencias Científicas</h3>
                    <div className="text-xs text-gray-400 space-y-1">
                        <p>• Thorne, K. S. "The Science of Interstellar" (2014)</p>
                        <p>• Métrica de Kerr para agujeros negros rotativos</p>
                        <p>• Modelo de disco de acreción Shakura-Sunyaev</p>
                        <p>• Efectos de lente gravitacional relativista</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
