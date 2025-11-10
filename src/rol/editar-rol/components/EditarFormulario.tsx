import React from "react";
import { PeriodoSelector } from "../../shared/components/PeriodoSelector"; // Importa el selector de periodo compartido
import { ModuloSelector } from "../../shared/components/ModuloSelector"; // Importa el selector de módulo compartido
import { useSelectoresRol } from "../../shared/hooks/useSelectoresRol"; // Hook compartido para manejar selectores y validación


// Componente de formulario para editar rol
export const EditarFormulario: React.FC = () => {

    // Hook unificado para selectores y validación
    const {
        periodo, setPeriodo, periodos, periodoError, setPeriodoError, handlePeriodoChange,
        modulo, setModulo, modulos, moduloError, setModuloError, handleModuloChange
    } = useSelectoresRol();


    // Renderizado del formulario con los selectores
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                <div className="w-3">
                    <PeriodoSelector
                        periodo={periodo}
                        setPeriodo={handlePeriodoChange}
                        opciones={periodos}
                        hasError={periodoError}
                    />
                    {periodoError && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            Selecciona un periodo
                        </span>
                    )}
                </div>
                <div className="w-2">
                    <ModuloSelector
                        modulo={modulo}
                        setModulo={handleModuloChange}
                        opciones={modulos}
                        hasError={moduloError}
                    />
                    {moduloError && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            Selecciona un módulo
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}