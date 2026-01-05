// Importa los hooks de React y la función para obtener los módulos desde la API
import { useState, useEffect } from "react";
import { getModulos } from "../services/modulosServices";

// Hook personalizado para manejar la lógica del formulario de caseta
export function useFormularioCaseta() {
  // Estado para la lista de módulos obtenidos de la API
  const [modulos, setModulos] = useState([]);
  // Estado para el módulo seleccionado en el dropdown
  const [selectedModulo, setSelectedModulo] = useState(null);
  // Estado para saber si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para el valor del input "Económico"
  const [economico, setEconomico] = useState("");
  // Estado para el valor seleccionado en el SelectButton (Despacho/Actualización)
  const [estado, setEstado] = useState("");
  // Estado para el color de fondo de la Card
  const [color, setColor] = useState("#EEEEEE");
  // Estado para el texto de la etiqueta (span) en la esquina superior derecha
  const [text, setText] = useState("Actualización");
  // estado para controlar la habilitacion del dropdown de motivos
  const [motivosDisabled, setMotivosDisabled] = useState(true);

  // useEffect para cargar los módulos al montar el componente
  useEffect(() => {
    getModulos()
      .then(setModulos) // Guarda los módulos obtenidos
      .catch(() => setModulos([])) // Si hay error, deja la lista vacía
      .finally(() => setLoading(false)); // Cuando termina, quita el loading
  }, []);

  // Maneja el cambio de estado y actualiza el color de la Card
  const handleEstadoYTextoChange = (e: any) => {
    setEstado(e.value);
    if (e.value === "Despacho") {
      setColor("#d9ebddff");
      setText("Despacho");
    } else if (e.value === "Actualizacion") {
      setColor("#EEEEEE");
      setText("Actualización dentro de modulos");
    } else {
      setColor("#EEEEEE");
      setText("Actualización");
    }
  };

  // Transforma los módulos para usarlos como opciones en el Dropdown
  const modulosOptions = modulos.map((m: any) => ({
    ...m,
    label: ` ${m.descripcion}`, // Texto que se muestra
    value: m.id, // Valor que se guarda
  }));

  // habilitar el dropdown de motivos al cambiar de estato
  const handleEnableMotivos = () => {
    setMotivosDisabled(false);
  };
  // Devuelve todos los estados y funciones necesarias para el formulario
  return {
    modulosOptions,
    selectedModulo,
    setSelectedModulo,
    loading,
    economico,
    setEconomico,
    estado,
    handleEstadoYTextoChange,
    color,
    text,
    handleEnableMotivos,
    motivosDisabled,
  };
}
