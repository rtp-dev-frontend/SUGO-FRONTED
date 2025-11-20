import React, { useState } from 'react';
// Interfaces
import { RutaEdit } from '../interfaces/RutaEdit.interface';
import { IRolCargado } from '../../shared/interfaces/RolesCargados.interface';
// Componentes hijos
import RutaHeader from './RutaHeader';
import ServiciosTable from './ServiciosTable';
import CubredescansosTable from './CubredescansosTable';
import JornadasTable from './JornadasTable';
// Hooks
import { useEditarRolPorPeriodo } from '../hooks/useEditarRol';
// estilos
import { cellStyle } from '../../../shared/styles/TableStyles';
// prime components
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';



export const RutaCard: React.FC<{ ruta: IRolCargado; onEdit?: () => void }> = ({ ruta }) => {
  const { mapDataToRutaEdit } = useEditarRolPorPeriodo(); // Hook para mapear data
  const form: RutaEdit = mapDataToRutaEdit(ruta); // Mapea la data del rol cargado a la interfaz RutaEdit
  const [abierto, setAbierto] = useState(false); // Estado para controlar visibilidad del contenido

  // Estado para las observaciones (notas)
  const [notas, setNotas] = useState(form.notas ?? '');

  // Convierte string de días a array de fechas Date
  function parseDiasToDates(dias: string): Date[] {
    if (!dias || typeof dias !== 'string') return [];
    const partes = dias.replace(/Y/g, ',').split(',');
    let mes: number | null = null, año: number | null = null;
    const fechas: Date[] = [];

    // Primero busca la fecha completa para extraer mes/año
    partes.forEach(p => {
      const str = p.trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [dia, mesStr, añoStr] = str.split('/').map(Number);
        mes = mesStr - 1;
        año = añoStr;
      }
    });

    // Ahora agrega todas las fechas
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

  // Inicializa los estados con los días de la data
  const [diasImpares, setDiasImpares] = useState<Date[] | null>(
    form.dias_impar ? parseDiasToDates(form.dias_impar) : null
  );
  const [diasPares, setDiasPares] = useState<Date[] | null>(
    form.dias_par ? parseDiasToDates(form.dias_par) : null
  );

  // Calcula la fecha mínima seleccionada para mostrar el mes/año correcto
  const getMinDate = (dates: Date[] | null) => {
    if (!dates || dates.length === 0) return new Date(); // mes/año actual si no hay fechas
    // Busca la fecha más antigua
    let minDate = dates[0];
    dates.forEach(d => {
      if (d.getTime() < minDate.getTime()) minDate = d;
    });
    return minDate;
  };

  // Template para deshabilitar visualmente días pares
  const imparTemplate = (event: any) => {
    if (event.day % 2 === 0) {
      return <span style={{ color: '#ccc', pointerEvents: 'none' }}>{event.day}</span>;
    }
    return <span>{event.day}</span>;
  };

  // Template para deshabilitar visualmente días impares
  const parTemplate = (event: any) => {
    if (event.day % 2 !== 0) {
      return <span style={{ color: '#ccc', pointerEvents: 'none' }}>{event.day}</span>;
    }
    return <span>{event.day}</span>;
  };

  // Solo permite seleccionar días impares
  const handleImparesChange = (e: any) => {
    let value = e.value ?? [];
    if (!Array.isArray(value)) value = [value];
    setDiasImpares(value.filter((d: Date) => d.getDate() % 2 !== 0));
  };

  // Solo permite seleccionar días pares
  const handleParesChange = (e: any) => {
    let value = e.value ?? [];
    if (!Array.isArray(value)) value = [value];
    setDiasPares(value.filter((d: Date) => d.getDate() % 2 === 0));
  };

  const handleToggle = () => setAbierto(a => !a); // Alterna la visibilidad del contenido

  // console.log('RUTA EN RUTA CARD:', form);

  return (
    <div style={{ marginBottom: 24, borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', background: '#fff' }}>
      <RutaHeader ruta={form} onEdit={handleToggle} abierto={abierto} />
      {abierto && (
        <div style={{ padding: '0 24px 24px 24px' }}>
          {/* Calendarios y observaciones en un solo div compacto */}
          <div style={{ display: 'flex', gap: '24px', marginTop: 32, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ ...cellStyle, fontWeight: 700, fontSize: 15, marginBottom: 8, display: 'block', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px' }}>
                LOS OPERADORES DEL PRIMER TURNO SACA LOS DÍAS: <span style={{ color: '#2f23ae', fontWeight: 700 }}>IMPAR</span>
              </label>
              <Calendar
                value={diasImpares}
                onChange={handleImparesChange}
                selectionMode="multiple"
                dateTemplate={imparTemplate}
                dateFormat="dd/mm/yy"
                style={{ width: '100%', marginTop: 1 }}
                inline={false}
                showIcon
                placeholder="Selecciona días impares"
                viewDate={getMinDate(diasImpares)}
              />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ ...cellStyle, fontWeight: 700, fontSize: 15, marginBottom: 8, display: 'block', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px' }}>
                LOS OPERADORES DEL SEGUNDO TURNO SACAN LOS DÍAS: <span style={{ color: '#2f23ae', fontWeight: 700 }}>PAR</span>
              </label>
              <Calendar
                value={diasPares}
                onChange={handleParesChange}
                selectionMode="multiple"
                dateTemplate={parTemplate}
                dateFormat="dd/mm/yy"
                style={{ width: '100%', marginTop: 1 }}
                inline={false}
                showIcon
                placeholder="Selecciona días pares"
                viewDate={getMinDate(diasPares)}
              />
            </div>
          </div>

          {/* Observaciones textarea debajo de los calendarios */}
          <div>
            <label style={{ ...cellStyle, fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block', background: '#f8f9fa' }}>
              Observaciones de la ruta:
            </label>
            <textarea
              rows={3}
              style={{
                ...cellStyle,
                width: '100%',
                padding: '50px',
                borderRadius: '12px',
                resize: 'vertical',
                fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
          </div>
          
          {/* Boton Guardar */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '18px', width: '100%' }}>
            <Button label="Guardar" icon="pi pi-save" style={{ minWidth: 130, fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 24 }} />
          </div>

          {/* Tablas de Servicios, Cubredescansos y Jornadas */}

          <ServiciosTable servicios={form.servicios} />
          <CubredescansosTable cubredescansos={form.cubredescansos} />
          <JornadasTable jornadas={form.jornadas} />
        </div>
      )}
    </div>
  );
};
