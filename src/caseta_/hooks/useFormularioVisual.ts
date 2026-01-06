// Importa los hooks de React y la función para obtener los módulos desde la API
import { useState, useEffect } from "react";

// Hook personalizado para manejar la lógica del formulario de caseta
export function useFormularioVisual() {
  // Estado para el módulo seleccionado en el dropdown
  const [selectedModulo, setSelectedModulo] = useState(null);

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

  // habilitar el dropdown de motivos al cambiar de estato
  const handleEnableMotivos = () => {
    setMotivosDisabled(false);
  };
  // Devuelve todos los estados y funciones necesarias para el formulario
  return {
    selectedModulo,
    setSelectedModulo,
    economico,
    setEconomico,
    estado,
    handleEstadoYTextoChange,
    color,
    text,
    motivosDisabled,
    handleEnableMotivos,
  };
}
