import { useEffect, useState } from "react";
import { fetchTurnos } from "../service/turnos.service";

export const Turnos = () => {
  const [turnos, setTurnos] = useState<any>([]);

  useEffect(() => {
    const fetchTurnosData = async () => {
      const data = await fetchTurnos();

      const formattedData = data.map((item: any) => ({
        label:
          item.descripcion +
          (item.notas_descripcion ? ` - ${item.notas_descripcion}` : ""),
        value: item.id,
      }));
      setTurnos(formattedData);
    };
    fetchTurnosData();
  }, []);

  console.log("turnos en hook:", turnos);
  return turnos;
};
