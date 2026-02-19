import { useState, useEffect } from "react";
import { getModalidades } from "../services/modalidadServices";

export function UseModalidades() {
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    getModalidades()
      .then(setModalidades)
      .catch(() => setModalidades([]));
  }, []);

  const modalidadesOptions = modalidades.map((m: any) => ({
    ...m,
    label: m.name,
    value: m.id,
  }));
  return { modalidadesOptions };
}
