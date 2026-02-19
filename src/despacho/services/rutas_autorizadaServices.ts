export const getRutasAutorizadas = async () => {
  const response = await fetch("http://localhost:4000/api/rutas/");
  if (!response.ok) throw new Error("Error al obtener las rutas autorizadas");
  return response.json();
};
