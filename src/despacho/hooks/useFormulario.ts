import { UseModulos } from "./useModulos";
import { UseMotivos } from "./useMotivos";

export function useFormularioDespacho() {
  // este hook se encarga de manejar el formulario de despacho, y se encarga de obtener los modulos desde la api
  const { modulosOptions } = UseModulos();
  const { motivosOptions } = UseMotivos();

  //   aqui se pueden agregar mas hooks para manejar el formulario, como por ejemplo los motivos de despacho, o el estado del formulario, etc.
  return {
    modulosOptions,
    motivosOptions, 
  };
}
