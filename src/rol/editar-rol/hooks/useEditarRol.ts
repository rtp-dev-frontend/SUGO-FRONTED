// Hook personalizado para editar rol por periodo
import { RutaEdit } from '../interfaces/RutaEdit.interface'; 

// Función para transformar la data de ruta
function mapDataToRutaEdit(data: any): RutaEdit {
  // console.log('DATA RECIBIDA EN MAPDATA:', data);
  return {
    id: Number(data.id),
    modulo: data.modulo_usuario ?? data.modulo ?? 0, 
    nombre: data.RutaModalidade?.ruta?.ruta ?? '-',
    origen: data.RutaModalidade?.ruta?.origen ?? '-',
    destino: data.RutaModalidade?.ruta?.destino ?? '-',
    modalidad: data.RutaModalidade?.modalidad?.name ?? '-',
    dias_impar: data.dias_impar ?? '-',
    dias_par: data.dias_par ?? '-',    
    servicios: (data.servicios ?? []).map((s: any) => ({
      no: Number(s.id),
      economico: s.economico,
      sistema: s.sistema,
      turno_operadores: (s.operadores_servicios ?? []).reduce((acc: any, op: any) => {
        acc[`Turno ${op.turno}`] = {
          credencial: op.operador,
          descansos: op.descansos ?? []
        };
        return acc;
      }, {}),
      "Lunes a Viernes": (s.horarios ?? []).filter((h: any) => h.dias_servicios === "Lunes a Viernes").reduce((acc: any, h: any) => {
        acc[`Turno ${h.turno}`] = {
          hora_inicio_turno: h.hora_inicio_turno ?? h.hora_inicio ?? null,
          hora_inicio_cc: h.hora_inicio_cc ?? null,
          lugar_inicio: h.lugar_inicio ?? null,
          hora_termino_turno: h.hora_termino_turno ?? h.hora_termino ?? null,
          hora_termino_cc: h.hora_termino_cc ?? null,
          lugar_termino_cc: h.lugar_termino_cc ?? null,
          termino_modulo: h.termino_modulo ?? null,
          termino_turno: h.termino_turno ?? null
        };
        return acc;
      }, {}),
      "Sabado": (s.horarios ?? []).filter((h: any) => h.dias_servicios === "Sabado").reduce((acc: any, h: any) => {
        acc[`Turno ${h.turno}`] = {
          hora_inicio_turno: h.hora_inicio_turno ?? h.hora_inicio ?? null,
          hora_inicio_cc: h.hora_inicio_cc ?? null,
          lugar_inicio: h.lugar_inicio ?? null,
          hora_termino_turno: h.hora_termino_turno ?? h.hora_termino ?? null,
          hora_termino_cc: h.hora_termino_cc ?? null,
          lugar_termino_cc: h.lugar_termino_cc ?? null,
          termino_modulo: h.termino_modulo ?? null,
          termino_turno: h.termino_turno ?? null
        };
        return acc;
      }, {}),
      "Domingo": (s.horarios ?? []).filter((h: any) => h.dias_servicios === "Domingo").reduce((acc: any, h: any) => {
        acc[`Turno ${h.turno}`] = {
          hora_inicio_turno: h.hora_inicio_turno ?? h.hora_inicio ?? null,
          hora_inicio_cc: h.hora_inicio_cc ?? null,
          lugar_inicio: h.lugar_inicio ?? null,
          hora_termino_turno: h.hora_termino_turno ?? h.hora_termino ?? null,
          hora_termino_cc: h.hora_termino_cc ?? null,
          lugar_termino_cc: h.lugar_termino_cc ?? null,
          termino_modulo: h.termino_modulo ?? null,
          termino_turno: h.termino_turno ?? null
        };
        return acc;
      }, {})
    })),
    cubredescansos: (data.cubredescansos ?? []).map((c: any) => ({
      No: c.id,
      Economico: c.economico,
      Sistema: c.sistema,
      "1er Turno": c.cubredescansos_turnos?.[0]?.operador ?? null,
      "2do Turno": c.cubredescansos_turnos?.[1]?.operador ?? null,
      "3er Turno": c.cubredescansos_turnos?.[2]?.operador ?? null,
      L: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.L ?? null,
      M: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.M ?? null,
      Mi: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.Mi ?? null,
      J: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.J ?? null,
      V: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.V ?? null,
      S: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.S ?? null,
      D: c.cubredescansos_turnos?.[0]?.servicios_a_cubrir?.D ?? null
    })),
    jornadas: (data.jornadas_excepcionales ?? []).map((j: any) => ({
      operador: j.operador,
      lugar: j.lugar,
      hora_inicio: j.hora_inicio,
      hora_termino: j.hora_termino,
      dias_servicio: j.dias_servicio ?? {}
    })),
    notas: data.notas ?? ''
  };
}

export function useEditarRolPorPeriodo() {
  return {
    mapDataToRutaEdit // Exporta la función para usarla donde la necesites
  };
}
