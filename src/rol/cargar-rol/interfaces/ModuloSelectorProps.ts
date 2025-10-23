/**
 * Props para el selector de módulo (M01..M07).
 *
 * - `modulo`: valor seleccionado actualmente (puede ser cualquier estructura usada por el select).
 * - `setModulo`: setter que recibe el nuevo valor.
 * - `opciones`: lista de opciones con `name` y `value` para renderizar el select.
 * - `hasError`: indicador opcional para marcar visualmente el control cuando hay error.
 */
export interface ModuloSelectorProps {
    modulo: any;
    setModulo: (m: any) => void;
    opciones: { name: string; value: any }[];
    hasError?: boolean;
}
