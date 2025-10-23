/**
 * Props para el componente que muestra roles ya enviados.
 *
 * - `periodo` y `modulo` sirven para filtrar los roles mostrados.
 * - `deps` es un objeto auxiliar de dependencias/params para recargas (puede ser un token, timestamps, etc.).
 */
export interface RolesEnviadosProps {
    periodo: any;
    modulo: any;
    deps: any;
}