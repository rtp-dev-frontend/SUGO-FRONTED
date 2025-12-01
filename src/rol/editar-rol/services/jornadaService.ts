import { envConfig } from '../../../config/envConfig';

/**
 * Servicio para guardar una jornada excepcional.
 */
export const guardarJornada = async (data: any) => {
  const response = await fetch(`${envConfig.api}/api/jornadas/guardar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para editar una jornada excepcional.
 */
export const editarJornada = async (id: string, data: any) => {
  const response = await fetch(`${envConfig.api}/api/jornadas/editar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

/**
 * Servicio para eliminar (soft delete) una jornada excepcional.
 */
export const eliminarJornada = async (id: string) => {
  const response = await fetch(`${envConfig.api}/api/jornadas/eliminar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};
