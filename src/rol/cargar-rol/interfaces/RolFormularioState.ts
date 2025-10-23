/**
 * Estado y API expuesta por el hook `useRolFormulario`.
 *
 * El hook orquesta la carga y parseo de un archivo Excel (rol) y expone
 * tanto estado para UI (periodos, modulos, errores) como utilidades para
 * disparar la carga/parseo (`sendData`) y limpiar el formulario.
 *
 * Notas sobre el contrato de datos:
 * - `infoGeneral` es la fuente de verdad para los valores del encabezado y
 *    para las `notas` (si están presentes). No exponer `porEncabezados` ni
 *    `notas` por separado evita duplicidad.
 * - `resultadosPorHoja` mantiene el parseo por cada hoja leída para usos
 *    avanzados o debugging.
 */
export interface RolFormularioState {
    periodo: any;
    setPeriodo: (p: any) => void;
    periodos: any[];
    modulo: any;
    setModulo: (m: any) => void;
    modulos: any[];
    excel: any; // Archivo cargado
    setExcel: (e: any) => void; // Función para establecer archivo
    errores: any[];
    error: string;
    isLoading: boolean;
    validatingData: boolean;
    canUpload: boolean;
    showErr: boolean;
    cont: number;
    sendData: () => void;
    limpiarFormulario: () => void;
    rolesSended: any[];
    servicios?: any[];
    /**
     * Objeto con campos de encabezado (periodo, ruta, origen, modalidad, destino, modulo)
     * y, cuando existan, `notas` combinadas para impresión.
     */
    infoGeneral?: Record<string, any>;
    getHeaderForPrint?: () => Record<string, any>;
    /**
     * Resultados por hoja: arreglo con objetos { sheetName, resultado: ResultadoParse }
     * que mantiene la información parseada de cada hoja leída.
     */
    resultadosPorHoja?: any[];
    periodoError: boolean;
    setPeriodoError: (v: boolean) => void;
    moduloError: boolean;
    setModuloError: (v: boolean) => void;
}
