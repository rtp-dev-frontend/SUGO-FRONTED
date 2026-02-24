import { useEffect, useState } from "react";
import { getPvEstados } from "../services/pv_ecoServices";

export function useEcoEstado(eco: number | null) {
  const [estado, setEstado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eco) {
      setEstado(null);
      return;
    }
    setLoading(true);
    getPvEstados(eco)
      .then((data) => {
        const results = data?.results || [];
        if (Array.isArray(results) && results.length > 0) {
          // Ordena por fecha descendente y toma el primero
          const ultimo = results.sort(
            (a, b) =>
              new Date(b.momento).getTime() - new Date(a.momento).getTime(),
          )[0];
          setEstado(ultimo);
        } else {
          setEstado(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo obtener el estado del eco");
        setLoading(false);
      });
  }, [eco]);

  return { estado, loading, error };
}
