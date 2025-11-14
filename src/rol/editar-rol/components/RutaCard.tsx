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
  const [diasImpares, setDiasImpares] = useState<Date[] | null>(null); // Estado para días impares
  const [diasPares, setDiasPares] = useState<Date[] | null>(null); // Estado para días pares

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

              {/* Calendario para dias impares */}
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
              />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ ...cellStyle, fontWeight: 700, fontSize: 15, marginBottom: 8, display: 'block', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px' }}>
                LOS OPERADORES DEL SEGUNDO TURNO SACAN LOS DÍAS: <span style={{ color: '#2f23ae', fontWeight: 700 }}>PAR</span>
              </label>

              {/* Calendario para dias pares */}
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
              />
            </div>
          </div>

          {/* Observaciones textarea debajo de los calendarios */}
          <div style={{
          }}>
            <label style={{ ...cellStyle, fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block', background: '#f8f9fa' }}>
              Observaciones de la ruta:
            </label>
            <textarea rows={3} style={{ ...cellStyle, width: '100%', padding: '12px', borderRadius: '8px', resize: 'vertical' }} />
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
