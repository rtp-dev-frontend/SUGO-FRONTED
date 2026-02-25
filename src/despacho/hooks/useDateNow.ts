import { useEffect, useState } from "react";

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

// Obtiene la hora y fecha actual en formato string
function getNow() {
  const now = new Date();
  const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const fecha = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  return { hora, fecha };
}

export function useDateNow(paused: boolean) {
  // Estado inicial con la hora y fecha actual
  const [hora, setHora] = useState(getNow().hora);
  const [fecha, setFecha] = useState(getNow().fecha);

  useEffect(() => {
    const update = () => {
      const { hora, fecha } = getNow();
      setHora(hora);
      setFecha(fecha);
    };
    update();
    if (!paused) {
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  return { hora, fecha };
}
