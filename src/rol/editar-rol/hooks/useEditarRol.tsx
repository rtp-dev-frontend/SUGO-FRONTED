// Hook personalizado para editar rol por periodo
import { RutaEdit } from '../interfaces/RutaEdit.interface'; 
import { useState } from 'react';
import React from 'react';
import { IRolCargado } from '../../shared/interfaces/RolesCargados.interface';
import { CubredescansoEdit } from '../interfaces/CubredescansoEdit.interface';
import { JornadaEdit } from '../interfaces/JornadaEdit.interface';

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

export function useEditarRolPorPeriodo(ruta: IRolCargado) {
  // Estados para días impares y pares
  const [diasImpares, setDiasImpares] = useState<Date[] | null>(
    ruta?.dias_impar ? parseDiasToDates(ruta.dias_impar) : null
  );
  const [diasPares, setDiasPares] = useState<Date[] | null>(
    ruta?.dias_par ? parseDiasToDates(ruta.dias_par) : null
  );

  // Función para parsear los días a fechas
  function parseDiasToDates(dias: string): Date[] {
    if (!dias || typeof dias !== 'string') return [];
    const partes = dias.replace(/Y/g, ',').split(',');
    let mes: number | null = null, año: number | null = null;
    const fechas: Date[] = [];
    partes.forEach(p => {
      const str = p.trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [dia, mesStr, añoStr] = str.split('/').map(Number);
        mes = mesStr - 1;
        año = añoStr;
      }
    });
    partes.forEach(p => {
      const str = p.trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [dia, mesStr, añoStr] = str.split('/').map(Number);
        fechas.push(new Date(añoStr, mesStr - 1, dia));
      } else if (/^\d+$/.test(str) && mes !== null && año !== null) {
        fechas.push(new Date(año, mes, Number(str)));
      }
    });
    return fechas;
  }

  // Métodos para cambiar los días
  const handleImparesChange = (e: any) => {
    let value = e.value ?? [];
    if (!Array.isArray(value)) value = [value];
    setDiasImpares(value.filter((d: Date) => d.getDate() % 2 !== 0));
  };
  const handleParesChange = (e: any) => {
    let value = e.value ?? [];
    if (!Array.isArray(value)) value = [value];
    setDiasPares(value.filter((d: Date) => d.getDate() % 2 === 0));
  };

  // Utilidades para el calendario
  const getMinDate = (dates: Date[] | null): Date => {
    if (!dates || dates.length === 0) return new Date();
    let minDate = dates[0];
    dates.forEach(d => {
      if (d.getTime() < minDate.getTime()) minDate = d;
    });
    return minDate;
  };
  const imparTemplate = (event: any) => {
    if (event.day % 2 === 0) {
      return <span style={{ color: '#ccc', pointerEvents: 'none' }}>{event.day}</span>;
    }
    return <span>{event.day}</span>;
  };
  const parTemplate = (event: any) => {
    if (event.day % 2 !== 0) {
      return <span style={{ color: '#ccc', pointerEvents: 'none' }}>{event.day}</span>;
    }
    return <span>{event.day}</span>;
  };

  // Funciones para editar/borrar cubredescanso y jornada
  function handleEditarCubredescanso(cubredescanso: CubredescansoEdit) {
    // Aquí tu lógica de edición
    console.log('Editar cubredescanso', cubredescanso);
  }
  function handleBorrarCubredescanso(cubredescanso: CubredescansoEdit) {
    // Aquí tu lógica de borrado
    console.log('Borrar cubredescanso', cubredescanso);
  }
  function handleEditarJornada(jornada: JornadaEdit) {
    // Aquí tu lógica de edición
    console.log('Editar jornada', jornada);
  }
  function handleBorrarJornada(jornada: JornadaEdit) {
    // Aquí tu lógica de borrado
    console.log('Borrar jornada', jornada);
  }

  return {
    mapDataToRutaEdit,
    diasImpares,
    diasPares,
    handleImparesChange,
    handleParesChange,
    getMinDate,
    imparTemplate,
    parTemplate,
    handleEditarCubredescanso,
    handleBorrarCubredescanso,
    handleEditarJornada,
    handleBorrarJornada
    // ...otros métodos...
  };
}
