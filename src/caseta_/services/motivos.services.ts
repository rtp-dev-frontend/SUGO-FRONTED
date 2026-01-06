export const getMotivos = async () => {
  const response = await fetch(
    "http://localhost:4000/api/caseta/pv-estados/motivos"
  );
  if (!response.ok) throw new Error("Error al obtener los motivos");
  return response.json();
};
