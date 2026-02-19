import { useState, useEffect } from "react";
import { getModulos } from "../services/modulosServices";

// Hook personalizado para obtener los módulos desde la API
export function UseModulos() {
  // Estado para guardar la lista de módulos obtenidos
  const [modulos, setModulos] = useState([]);

  // Efecto que se ejecuta al montar el componente para obtener los módulos
  useEffect(() => {
    // Llama a la función getModulos (consulta a la API)
    getModulos()
      .then(setModulos) // Si la consulta es exitosa, guarda los módulos en el estado
      .catch(() => setModulos([])); // Si hay error, deja el estado vacío
  }, []);

  // Transforma la lista de módulos en opciones para el dropdown
  const modulosOptions = modulos.map((m: any) => ({
    ...m,
    label: ` ${m.descripcion}`, // Texto que se muestra en el dropdown
    value: m.id, // Valor que se selecciona
  }));

  // Retorna las opciones para usarlas en el formulario
  return { modulosOptions };
}
