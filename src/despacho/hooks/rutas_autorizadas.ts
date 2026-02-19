import { useState, useEffect } from "react";
import { getRutasAutorizadas } from "../services/rutas_autorizadaServices";

// Hook personalizado para obtener las rutas autorizadas desde la API
export function UseRutasAutorizadas() {
  // Estado para guardar la lista de rutas autorizadas obtenidas
  const [rutasAutorizadas, setRutasAutorizadas] = useState([]);

  // Efecto que se ejecuta al montar el componente para obtener las rutas autorizadas
  useEffect(() => {
    // Llama a la función getRutasAutorizadas (consulta a la API)
    getRutasAutorizadas()
      .then(setRutasAutorizadas) // Si la consulta es exitosa, guarda las rutas autorizadas en el estado
      .catch(() => setRutasAutorizadas([])); // Si hay error, deja el estado vacío
  }, []);

  const rutasOptions = rutasAutorizadas.map((ruta: any) => ({
    ...ruta,
    label: ruta.origen_destino, // Asigna el nombre de la ruta al campo 'label' para usar en el dropdown
    value: ruta.id, // Asigna el id de la ruta al campo 'value' para usar en el dropdown
  }));

  // Retorna las rutas autorizadas para usarlas en el formulario
  return { rutasOptions };
}
