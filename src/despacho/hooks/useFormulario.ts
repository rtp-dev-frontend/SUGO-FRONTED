import { UseModulos } from "./useModulos";
import { UseMotivos } from "./useMotivos";
import { UseModalidades } from "./useModalidades";
import { UseRutasAutorizadas } from "./rutas_autorizadas";

// Hook personalizado para manejar el formulario de despacho
export function useFormularioDespacho() {
  // Obtiene las opciones de módulos desde el hook UseModulos (consulta a la API)
  const { modulosOptions } = UseModulos();

  // Obtiene las opciones de modalidades desde el hook UseModalidades (consulta a la API)
  const { modalidadesOptions } = UseModalidades();

  // Obtiene las opciones de motivos desde el hook UseMotivos (consulta a la API)
  const { motivosOptions } = UseMotivos();

  // Obtiene las rutas autorizadas desde el hook UseRutasAutorizadas (consulta a la API)
  const { rutasOptions } = UseRutasAutorizadas();

  // Retorna las opciones para usarlas en el componente del formulario
  return {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    rutasOptions,
  };
}
