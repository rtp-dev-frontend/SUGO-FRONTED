import React from 'react';
import { Button } from 'primereact/button';
import { RutaEdit, RutaHeaderProps } from '../interfaces/RutaEdit.interface';


const RutaHeader: React.FC<RutaHeaderProps> = ({ ruta, onEdit, abierto }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      background: '#e8f5e9',
      cursor: 'pointer'
    }}
  >
    <div>
      <strong style={{ fontSize: 22, color: '#388e3c' }}>
        {ruta.nombre} {ruta.modalidad ? `(${ruta.modalidad})` : ''}
      </strong>
      <div style={{ color: '#666', fontSize: 16, marginTop: 4 }}>
        {ruta.origen} - {ruta.destino}
      </div>
      {/* Resumen de totales debajo del nombre */}
      <div style={{
        display: 'flex',
        gap: '32px',
        margin: '18px 0 0 0',
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif'",
        fontSize: 16,
        fontWeight: 600
      }}>
        <span>
          Servicios: <span style={{ color: '#2f23ae', fontWeight: 700 }}>{ruta.servicios?.length ?? 0}</span>
        </span>
        <span>
          Cubre descansos: <span style={{ color: '#388e3c', fontWeight: 700 }}>{ruta.cubredescansos?.length ?? 0}</span>
        </span>
        <span>
          Jornadas excepcionales: <span style={{ color: '#d32f2f', fontWeight: 700 }}>{ruta.jornadas?.length ?? 0}</span>
        </span>
      </div>
    </div>
    <div style={{ textAlign: 'right', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Button
        label={abierto ? 'Ocultar' : 'Editar'}
        icon={abierto ? 'pi pi-chevron-up' : 'pi pi-pencil'}
        onClick={onEdit}
        className="p-button-text p-button-lg"
      />
    </div>
  </div>
);

export default RutaHeader;
