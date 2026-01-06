import { UseModulos } from "./useModulos";
import { useFormularioVisual } from "./useFormularioVisual";
import { UseMotivos } from "./useMotivos";

export function useFormularioCaseta() {
  const { modulosOptions } = UseModulos();
  const visual = useFormularioVisual();
  const { motivosOptions, motivoSeleccionado, setMotivoSeleccionado } =
    UseMotivos(visual.estado);

  return {
    modulosOptions,
    motivosOptions,
    motivoSeleccionado,
    setMotivoSeleccionado,
    ...visual,
  };
}
