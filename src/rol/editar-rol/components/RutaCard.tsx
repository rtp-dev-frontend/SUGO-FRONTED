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
  const {
    mapDataToRutaEdit,
    diasImpares,
    diasPares,
    handleImparesChange,
    handleParesChange,
    getMinDate,
    imparTemplate,
    parTemplate
  } = useEditarRolPorPeriodo(ruta);

  const form: RutaEdit = mapDataToRutaEdit(ruta);
  const [abierto, setAbierto] = useState(false);
  const [notas, setNotas] = useState(form.notas ?? '');

  const handleToggle = () => setAbierto(a => !a);

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
