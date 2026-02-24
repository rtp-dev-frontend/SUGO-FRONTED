// hooks/tabla_pv_estados.ts
import { useEffect, useState } from "react";
import { getPvEstadosTabla } from "../services/pv_ecoServices";

export function usePvEstadosTabla() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPvEstadosTabla(0)
      .then((res) => {
        // res.results es el array real
        if (res && Array.isArray(res.results)) {
          setData(res.results);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
