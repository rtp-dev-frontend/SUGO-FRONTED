import { envConfig } from '../../../config/envConfig';

/**
 * Servicio para guardar un servicio.
 */
export const guardarServicio = async (data: any) => {
  const response = await fetch(`${envConfig.api}/api/servicios/guardar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para editar un servicio.
 */
export const editarServicio = async (no: number, data: any) => {
  const response = await fetch(`${envConfig.api}/api/servicios/editar/${no}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para eliminar (soft delete) un servicio.
 */
export const eliminarServicio = async (no: number) => {
  const response = await fetch(`${envConfig.api}/api/servicios/eliminar/${no}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};
