import { envConfig } from '../../../config/envConfig';

/**
 * Servicio para guardar un cubredescanso.
 */
export const guardarCubredescanso = async (data: any) => {
  const response = await fetch(`${envConfig.api}/api/cubredescansos/guardar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para editar un cubredescanso.
 */
export const editarCubredescanso = async (No: string, data: any) => {
  const response = await fetch(`${envConfig.api}/api/cubredescansos/editar/${No}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para eliminar (soft delete) un cubredescanso.
 */
export const eliminarCubredescanso = async (No: string) => {
  const response = await fetch(`${envConfig.api}/api/cubredescansos/eliminar/${No}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};
