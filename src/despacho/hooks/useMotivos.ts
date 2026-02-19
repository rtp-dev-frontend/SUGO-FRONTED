import { useState, useEffect } from "react";
import { getMotivos } from "../services/motivosServices";

export function UseMotivos() {
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    getMotivos()
      .then(setMotivos)
      .catch(() => setMotivos([]));
  }, []);

  const motivosOptions = motivos
    .filter((m: any) => m.tipo === 1)
    .map((m: any) => ({
      ...m,
      label: m.desc,
      value: m.id,
    }));
  return { motivosOptions };
}
