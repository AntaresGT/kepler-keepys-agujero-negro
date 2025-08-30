import { useState } from 'react'
import './App.css'
import { AgujeroNegro } from './AgujeroNegro'
import { ControlesAgujeroNegro } from './ControlesAgujeroNegro'
import { type ConfiguracionAgujeroNegro, configuracionesPredefinidas, configuracionDefecto } from './configuraciones'

/**
 * Componente principal de la aplicación del simulador de agujero negro
 * Implementa las ecuaciones de Kip Thorne para agujeros negros rotativos
 * Proporciona controles interactivos para ajustar los parámetros físicos en tiempo real
 * 
 * FÍSICA IMPLEMENTADA:
 * - Métrica de Kerr para agujeros negros rotativos
 * - Lente gravitacional según la Relatividad General
 * - Disco de acreción con modelo Shakura-Sunyaev  
 * - Efectos de redshift gravitacional
 * - Ondas gravitacionales y perturbaciones del espacio-tiempo
 */
function App() {
    // Estado de configuración actual del agujero negro
    const [configuracionActual, setConfiguracionActual] = useState<ConfiguracionAgujeroNegro>(configuracionDefecto);
    
    /**
     * Maneja el cambio de configuración desde los controles de UI
     * Actualiza los parámetros del agujero negro en tiempo real
     */
    const manejarCambioConfiguracion = (nuevaConfiguracion: ConfiguracionAgujeroNegro) => {
        setConfiguracionActual(nuevaConfiguracion);
    };

    /**
     * Maneja la selección de una configuración predefinida
     * Permite cambiar rápidamente entre diferentes escenarios físicos
     */
    const manejarSeleccionConfiguracionPredefinida = (configuracion: ConfiguracionAgujeroNegro) => {
        setConfiguracionActual(configuracion);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Simulador de Agujero Negro - Renderizado 3D */}
            <AgujeroNegro configuracion={configuracionActual} />
            
            {/* Panel de Controles Interactivos */}
            <ControlesAgujeroNegro
                configuracion={configuracionActual}
                onCambioConfiguracion={manejarCambioConfiguracion}
                configuracionesPredefinidas={configuracionesPredefinidas}
                onSeleccionarConfiguracionPredefinida={manejarSeleccionConfiguracionPredefinida}
            />
        </div>
    )
}

export default App
