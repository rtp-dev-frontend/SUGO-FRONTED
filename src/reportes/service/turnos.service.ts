import { Iturnos } from "../interface/turnos.interface";
import { envConfig } from "../../config/envConfig";

export async function fetchTurnos(): Promise<Iturnos[]> {
  const response = await fetch(`${envConfig.api}/api/turnos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("Turnos fetched:", data);
  return data;
}
