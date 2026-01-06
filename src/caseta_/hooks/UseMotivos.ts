import { useState, useEffect } from "react";
import { getMotivos } from "../services/motivos.services";

export function UseMotivos(estado: string) {
  const [motivos, setMotivos] = useState([]);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);

  useEffect(() => {
    getMotivos()
      .then(setMotivos)
      .catch(() => setMotivos([]));
  }, []);

  // Relaciona el valor de estado con el tipo numérico de tu base de datos
  const tipoMap: Record<string, number> = {
    Despacho: 1,
    Recepción: 2,
    Actualización: 4, // Ajusta según tus necesidades
  };

  const motivosOptions = motivos
    .filter((m: any) => m.tipo === tipoMap[estado])
    .map((m: any) => ({
      ...m,
      label: ` ${m.desc}`,
      value: m.id,
    }));

  return { motivosOptions, motivoSeleccionado, setMotivoSeleccionado };
}
