import { useState, useEffect } from "react";
import { getModulos } from "../services/modulosServices";

export function UseModulos() {
  const [modulos, setModulos] = useState([]);

  //   esto se usa para obtener los modulos desde la api
  useEffect(() => {
    getModulos()
      .then(setModulos)
      .catch(() => setModulos([]));
  }, []);

  const modulosOptions = modulos.map((m: any) => ({
    ...m,
    label: ` ${m.descripcion}`,
    value: m.id,
  }));
  return { modulosOptions };
}
