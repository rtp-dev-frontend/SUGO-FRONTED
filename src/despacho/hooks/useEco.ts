import { useState, useEffect } from "react";
import { getPvEstados } from "../services/pv_ecoServices";

export function useEcoEstado(eco: number | null) {
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEcoEstado - eco changed:", eco); // Debug: Verificar el valor de eco al cambiar
    if (!eco) {
      setEstado(null);
      return;
    }

    setLoading(true);
    setError(null);

    getPvEstados(eco)
      .then((data) => {
        setEstado(Array.isArray(data) ? data[0] : data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eco]); // Aquí estaba el error principal de llaves y paréntesis

  return { estado, loading, error };
}
