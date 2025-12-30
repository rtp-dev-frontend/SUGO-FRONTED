// Aqui se realiza la llamada a la API para obtener los módulos
export const getModulos = async () => {
  const response = await fetch("http://localhost:4000/api/modulos");
  if (!response.ok) throw new Error("Error al obtener los módulos");
  return response.json();
};




