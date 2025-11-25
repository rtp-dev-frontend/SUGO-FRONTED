import React, { useEffect } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';
import { PeriodoSelector } from "../../shared/components/PeriodoSelector"; // Importa el selector de periodo compartido
import { useSelectoresRol } from "../../shared/hooks/useSelectoresRol"; // Hook compartido para manejar selectores y validación
import { RutaCard } from "./index";
import { RutaEdit } from "../interfaces/RutaEdit.interface";
import { useRolesCargados } from '../../shared/hooks/useRolesCargados'; // Hook para obtener roles cargados
import useAuthStore from "../../../shared/auth/useAuthStore";

// Componente de formulario para editar rol
export const EditarFormulario: React.FC = () => {

    // Hook para edición y consulta de roles por periodo
    const { periodo, setPeriodo, periodos, periodoError, setPeriodoError, handlePeriodoChange } = useSelectoresRol();
    const { roles, loading, error, fetchRoles } = useRolesCargados(); // Hook para obtener roles cargados
    const { credencial: credencial_usuario, modulo: modulo_usuario } = useAuthStore((store) => store.user); //obtienne credencial y modulo del usuario autenticado

    // Efecto para detectar cambios de periodo y al cargar la página
    useEffect(() => {
        if (periodo) {
            fetchRoles(periodo.id);
        }
    }, [periodo]);


    // Renderizado del formulario con los selectores
    return (
        <div>
            {/* Selector de periodo */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                    <div className="w-3">
                        <PeriodoSelector
                            periodo={periodo}
                            setPeriodo={handlePeriodoChange}
                            opciones={periodos}
                        />
                    </div>
                </div>
            </div>

            {/* Animación de carga */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="4" fill="#f4f4f4" animationDuration="1s" />
                </div>
            ) : (
                roles && roles.length > 0 ? (
                    (() => {
                        const rutasFiltradas = roles.filter((ruta: RutaEdit) => ruta.modulo === modulo_usuario);
                        return rutasFiltradas.length > 0 ? (
                            rutasFiltradas.map((ruta: RutaEdit) => (
                                <RutaCard key={ruta.id} ruta={ruta} onEdit={() => { }} />
                            ))
                        ) : (
                            <div>No hay roles cargados para el periodo seleccionado.</div>
                        );
                    })()
                ) : (
                    <div>No hay roles cargados para el periodo seleccionado.</div>
                )
            )}
        </div>
    );
}