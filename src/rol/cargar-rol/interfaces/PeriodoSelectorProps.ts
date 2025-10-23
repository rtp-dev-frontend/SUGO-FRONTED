/**
 * Props para el selector de periodo.
 *
 * - `periodo`: periodo seleccionado (objeto/valor usado por el control).
 * - `setPeriodo`: setter que actualiza el periodo seleccionado.
 * - `opciones`: array de opciones del select con `label` y `value`.
 * - `hasError`: flag opcional para indicar error de validación en UI.
 */
export interface PeriodoSelectorProps {
    periodo: any;
    setPeriodo: (p: any) => void;
    opciones: { label: string; value: any }[];
    hasError?: boolean;
}