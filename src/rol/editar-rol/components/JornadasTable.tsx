import React from 'react';
import { JornadaEdit } from '../interfaces/JornadaEdit.interface';
import { Button } from 'primereact/button';
import { cellStyle, headerCellStyle, tableStyle } from '../../../shared/styles/TableStyles';

interface JornadasTableProps {
  jornadas: JornadaEdit[];
}

const JornadasTable: React.FC<JornadasTableProps> = ({ jornadas }) => {
  const rowStyle = (idx: number) => ({
    background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
    transition: 'background 0.2s',
    cursor: 'pointer'
  });
  // console.log(jornadas);

  return (
    <div style={{ marginBottom: 40, position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 3,
        justifyContent: 'space-between'
      }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: 17 }}>Jornadas Excepcionales</label>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          {jornadas && jornadas.length > 0 && (
            <Button
              label="Editar Jornadas Excepcionales"
              icon="pi pi-pencil"
              severity="info"
              style={{
                height: 40,
                minWidth: 200
              }}
            // onClick={handleAgregarCubredescanso} // Implementa la función según tu lógica
            />
          )}
          <Button
            label="Nueva Jornada Excepcional"
            icon="pi pi-calendar-plus"
            style={{
              height: 40,
              minWidth: 200
            }}
          // onClick={handleAgregarJornada} // Implementa la función según tu lógica
          />
        </div>
      </div>
      {(!jornadas || jornadas.length === 0) ? (
        <div style={{ color: '#888', fontWeight: 500, padding: '16px 0', textAlign: 'center' }}>
          No hay registro de jornadas excepcionales.
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Operador</th>
              <th style={headerCellStyle}>Lugar</th>
              <th style={headerCellStyle}>Hora inicio</th>
              <th style={headerCellStyle}>Hora término</th>
              <th style={headerCellStyle}>Lunes</th>
              <th style={headerCellStyle}>Martes</th>
              <th style={headerCellStyle}>Miércoles</th>
              <th style={headerCellStyle}>Jueves</th>
              <th style={headerCellStyle}>Viernes</th>
              <th style={headerCellStyle}>Sábado</th>
              <th style={headerCellStyle}>Domingo</th>
            </tr>
          </thead>
          <tbody>
            {(jornadas ?? []).map((jornada, idx) => (
              <tr key={idx} style={rowStyle(idx)}>
                <td style={cellStyle}>{jornada.operador}</td>
                <td style={cellStyle}>{jornada.lugar}</td>
                <td style={cellStyle}>{jornada.hora_inicio}</td>
                <td style={cellStyle}>{jornada.hora_termino}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.L ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.M ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.Mi ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.J ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.V ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.S ?? '-'}</td>
                <td style={cellStyle}>{jornada.dias_servicio?.D ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JornadasTable;
