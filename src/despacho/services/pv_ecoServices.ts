export const getPvEstados = async (eco: number) => {
  const response = await fetch(
    `http://localhost:4000/api/caseta/pv-estados?eco=${eco}`,
  );
  if (!response.ok) throw new Error("Error al obtener los estados del PV");
  return response.json();
};

export const getPvEstadosTabla = async (eco: number) => {
  const response = await fetch(`http://localhost:4000/api/caseta/pv-estados`);
  if (!response.ok) throw new Error("Error al obtener los estados del PV");
  return response.json();
};
