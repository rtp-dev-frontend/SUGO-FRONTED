import React, { useState } from 'react';
import { JornadaEdit } from '../interfaces/JornadaEdit.interface';
import { Button } from 'primereact/button';
import { cellStyle, headerCellStyle, tableStyle } from '../../../shared/styles/TableStyles';
import JornadaDialog from './JornadaDialog';

interface JornadasTableProps {
  jornadas: JornadaEdit[];
}

const JornadasTable: React.FC<JornadasTableProps> = ({ jornadas }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editData, setEditData] = useState<JornadaEdit | undefined>(undefined);
  const [data, setData] = useState<JornadaEdit[]>(jornadas ?? []);

  const rowStyle = (idx: number) => ({
    background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
    transition: 'background 0.2s',
    cursor: 'pointer'
  });

  const handleNuevo = () => {
    setEditData(undefined);
    setDialogVisible(true);
  };

  const handleEditar = (jornada: JornadaEdit) => {
    setEditData(jornada);
    setDialogVisible(true);
  };

  const handleEliminar = (idx: number) => {
    setData(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (jornada: JornadaEdit) => {
    if (editData) {
      // Editar existente
      setData(prev => prev.map(j => j === editData ? jornada : j));
    } else {
      // Nuevo
      setData(prev => [...prev, jornada]);
    }
    setDialogVisible(false);
  };

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
          <Button
            label="Nueva Jornada Excepcional"
            icon="pi pi-calendar-plus"
            style={{
              height: 40,
              minWidth: 200
            }}
            onClick={handleNuevo}
          />
        </div>
      </div>
      {(!data || data.length === 0) ? (
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
              <th style={headerCellStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((jornada, idx) => (
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
                <td style={{ ...cellStyle, minWidth: 120 }}>
                  <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Editar" style={{ marginRight: 8 }} onClick={() => handleEditar(jornada)} />
                  <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Eliminar" onClick={() => handleEliminar(idx)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <JornadaDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSave={handleSave}
        initialData={editData}
      />
    </div>
  );
};

export default JornadasTable;
