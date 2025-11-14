import React from 'react';
import { CubredescansoEdit } from '../interfaces/CubredescansoEdit.interface';
import { Button } from 'primereact/button';
import { cellStyle, headerCellStyle, tableStyle } from '../../../shared/styles/TableStyles';

interface CubredescansosTableProps {
  cubredescansos: CubredescansoEdit[];
}

const CubredescansosTable: React.FC<CubredescansosTableProps> = ({ cubredescansos }) => {
  const rowStyle = (idx: number) => ({
    background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
    transition: 'background 0.2s',
    cursor: 'pointer'
  });

  return (
    <div style={{ marginBottom: 40, position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 3,
        justifyContent: 'space-between'
      }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: 17 }}>Cubre Descansos</label>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <Button
            label="Editar Cubredescansos"
            icon="pi pi-pencil"
            severity="info"
            style={{
              height: 40,
              minWidth: 200
            }}
            // onClick={handleAgregarCubredescanso} // Implementa la función según tu lógica
          />
          <Button
            label="Nuevo Cubredescanso"
            icon="pi pi-calendar-plus"
            style={{
              height: 40,
              minWidth: 180
            }}
            // onClick={handleAgregarCubredescanso} // Implementa la función según tu lógica
          />
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Económico</th>
            <th style={headerCellStyle}>Sistema</th>
            <th style={headerCellStyle}>1er Turno</th>
            <th style={headerCellStyle}>2do Turno</th>
            <th style={headerCellStyle}>3er Turno</th>
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
          {(cubredescansos ?? []).map((cubredescanso, idx) => {
            // Usa la propiedad correcta para los turnos
            const turnos = cubredescanso.cubredescansos_turnos ?? [];
            const turno1 = turnos.find((t: any) => t.turno === 1);
            const turno2 = turnos.find((t: any) => t.turno === 2);
            const turno3 = turnos.find((t: any) => t.turno === 3);

            const getDia = (turno: any, dia: string) =>
              turno?.servicios_a_cubrir?.[dia] ?? '-';

            // Convierte el índice a letra mayúscula (A, B, C, ...)
            const letra = String.fromCharCode(65 + idx); // 65 = 'A'

            return (
              <tr key={idx} style={rowStyle(idx)}>
                <td style={cellStyle}>{letra}</td>
                <td style={cellStyle}>{cubredescanso.Economico}</td>
                <td style={cellStyle}>{cubredescanso.Sistema}</td>
                <td style={cellStyle}>{turno1?.operador ?? '-'}</td>
                <td style={cellStyle}>{turno2?.operador ?? '-'}</td>
                <td style={cellStyle}>{turno3?.operador ?? '-'}</td>
                <td style={cellStyle}>{getDia(turno1, 'L')}</td>
                <td style={cellStyle}>{getDia(turno1, 'M')}</td>
                <td style={cellStyle}>{getDia(turno1, 'Mi')}</td>
                <td style={cellStyle}>{getDia(turno1, 'J')}</td>
                <td style={cellStyle}>{getDia(turno1, 'V')}</td>
                <td style={cellStyle}>{getDia(turno1, 'S')}</td>
                <td style={cellStyle}>{getDia(turno1, 'D')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CubredescansosTable;
