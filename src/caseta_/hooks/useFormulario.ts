import { UseMotivos } from "./useMotivos";
import { UseModulos } from "./useModulos";
import { useFormularioVisual } from "./useFormularioVisual";

export function useFormularioCaseta() {
  const { modulosOptions } = UseModulos();
  const { motivosOptions, motivos, setMotivos } = UseMotivos();
  const visual = useFormularioVisual();

  return {
    modulosOptions,
    motivosOptions,
    motivos,
    setMotivos,
    ...visual,
  };
}
