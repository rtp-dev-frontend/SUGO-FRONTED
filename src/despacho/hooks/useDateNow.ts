import { useEffect, useState } from "react";

// Función auxiliar para agregar un cero a números menores de 10 (ejemplo: 9 -> "09")
function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

// Hook personalizado para obtener la hora y fecha actual, actualizándose cada segundo si no está pausado
export function useDateNow(paused: boolean) {
  // Estado para la hora actual en formato HH:mm:ss
  const [hora, setHora] = useState("");
  // Estado para la fecha actual en formato DD/MM/YYYY
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    // Función que actualiza los estados de hora y fecha
    const update = () => {
      const now = new Date();
      // Actualiza la hora en formato HH:mm:ss
      setHora(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
      // Actualiza la fecha en formato DD/MM/YYYY
      setFecha(
        `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
      );
    };
    // Llama a la función de actualización al montar el componente
    update();
    // Si no está pausado, inicia un intervalo para actualizar cada segundo
    if (!paused) {
      const interval = setInterval(update, 1000);
      // Limpia el intervalo al desmontar el componente o al cambiar 'paused'
      return () => clearInterval(interval);
    }
  }, [paused]);

  // Retorna la hora y fecha actual
  return { hora, fecha };
}
