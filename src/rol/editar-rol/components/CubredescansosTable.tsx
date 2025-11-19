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
  // console.log(cubredescansos);
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
          {cubredescansos && cubredescansos.length > 0 && (
            <Button
              label="Editar Cubredescansos"
              icon="pi pi-pencil"
              severity="info"
              style={{
                height: 40,
                minWidth: 200
              }}
              // onClick={handleAgregarCubredescanso}
            />
          )}
          <Button
            label="Nuevo Cubredescanso"
            icon="pi pi-calendar-plus"
            style={{
              height: 40,
              minWidth: 180
            }}
            // onClick={handleAgregarCubredescanso}
          />
        </div>
      </div>
      {(!cubredescansos || cubredescansos.length === 0) ? (
        <div style={{ color: '#888', fontWeight: 500, padding: '16px 0', textAlign: 'center' }}>
          No hay registro de cubredescansos.
        </div>
      ) : (
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
              // Convierte el índice a letra mayúscula (A, B, C, ...)
              const letra = String.fromCharCode(65 + idx);
              return (
                <tr key={idx} style={rowStyle(idx)}>
                  <td style={cellStyle}>{letra}</td>
                  <td style={cellStyle}>{cubredescanso.Economico}</td>
                  <td style={cellStyle}>{cubredescanso.Sistema}</td>
                  <td style={cellStyle}>{cubredescanso["1er Turno"] ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso["2do Turno"] ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso["3er Turno"] ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.L ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.M ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.Mi ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.J ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.V ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.S ?? '-'}</td>
                  <td style={cellStyle}>{cubredescanso.D ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CubredescansosTable;
