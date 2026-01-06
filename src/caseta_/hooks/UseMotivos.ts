import { useState, useEffect } from "react";
import { getMotivos } from "../services/motivos.services";

export function UseMotivos() {
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    getMotivos()
      .then(setMotivos)
      .catch(() => setMotivos([]));
  }, []);

  const motivosOptions = motivos.map((m: any) => ({
    ...m,
    label: ` ${m.desc}`,
    value: m.id,
  }));
  return { motivosOptions, motivos, setMotivos };
}
