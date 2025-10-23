/**
 * Hook para manejar los cambios en los selectores de periodo y módulo.
 *
 * Permite limpiar errores visuales automáticamente al seleccionar una opción válida.
 *
 * @param setPeriodo Setter para el periodo seleccionado
 * @param setModulo Setter para el módulo seleccionado
 * @param setPeriodoError Setter para error visual en periodo
 * @param setModuloError Setter para error visual en módulo
 */
import { useCallback } from 'react';

/**
 * Hook personalizado para manejar los handlers de los selectores (Periodo y Módulo)
 * con limpieza automática de errores
 */
export function useSelectorHandlers(
    setPeriodo: (p: any) => void,
    setModulo: (m: any) => void,
    setPeriodoError: (error: boolean) => void,
    setModuloError: (error: boolean) => void
) {

    const handlePeriodoChange = useCallback((periodo: any) => {
        setPeriodo(periodo);
        // Limpiar error si se selecciona un valor válido
        if (periodo) {
            setPeriodoError(false);
        }
    }, [setPeriodo, setPeriodoError]);

    const handleModuloChange = useCallback((modulo: any) => {
        setModulo(modulo);
        // Limpiar error si se selecciona un valor válido
        if (modulo?.name) {
            setModuloError(false);
        }
    }, [setModulo, setModuloError]);

    return {
        handlePeriodoChange,
        handleModuloChange
    };
}