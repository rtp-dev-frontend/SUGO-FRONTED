export const getModalidades = async () => {
  const response = await fetch("http://localhost:4000/api/modalidades");
  if (!response.ok) throw new Error("Error al obtener las modalidades");
  return response.json();
};



