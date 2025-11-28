import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { CubredescansoDialogProps, DiaSemana } from '../interfaces/CubredescansoEdit.interface';
import { useCubredescansoValidation } from '../hooks/useCubredescansoValidation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


const diasSemana: DiaSemana[] = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D']; // Lista de días de la semana

// Componente de diálogo para editar o crear un cubredescanso
const CubredescansoDialog: React.FC<CubredescansoDialogProps> = ({ visible, onHide, onSave, initialData }) => {
  const {
    form,
    descansoDias,
    descansoError,
    handleDescansoChange,
    handleChange,
    handleGuardarUI
  } = useCubredescansoValidation({
    diasSemana,
    initialData,
    onSave
  });

  return (
    <Dialog header={initialData ? 'Editar Cubredescanso' : 'Nuevo Cubredescanso'} visible={visible} style={{ width: '700px' }} onHide={onHide} modal>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'transparent',
          borderRadius: 0,
          boxShadow: 'none',
          padding: '0',
          maxWidth: '100%',
          margin: 0,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          fontSize: 16
        }}
        onSubmit={e => e.preventDefault()} // Evita el submit por defecto
      >
        {/* Datos generales */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'flex', gap: '26px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 16 }}>Económico:</label>
              <input
                type="text"
                value={form.Economico ?? ''}
                onChange={e => handleChange('Economico', e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 16 }}>Sistema:</label>
              <input
                type="text"
                value={form.Sistema ?? ''}
                onChange={e => handleChange('Sistema', e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
              />
            </div>
          </div>
        </div>
        {/* Turnos */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
          <label style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 4, display: 'block' }}>Turnos</label>
          <div style={{ display: 'flex', gap: '26px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 16 }}>1er Turno:</label>
              <input
                type="number"
                value={form['1er Turno'] ?? ''}
                onChange={e => handleChange('1er Turno', e.target.value === '' ? null : Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 16 }}>2do Turno:</label>
              <input
                type="number"
                value={form['2do Turno'] ?? ''}
                onChange={e => handleChange('2do Turno', e.target.value === '' ? null : Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 16 }}>3er Turno:</label>
              <input
                type="number"
                value={form['3er Turno'] ?? ''}
                onChange={e => handleChange('3er Turno', e.target.value === '' ? null : Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
              />
            </div>
          </div>
        </div>
        {/* Días de la semana con multiselect para descanso */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa', borderRadius: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: 18, color: '#2f23ae', marginBottom: 8, display: 'block' }}>Días de descanso</label>
          <MultiSelect
            value={descansoDias}
            options={diasSemana.map((dia: DiaSemana) => ({ label: dia, value: dia }))}
            onChange={e => handleDescansoChange(e.value)}
            display="chip"
            placeholder="Selecciona días de descanso"
            style={{ width: '100%', marginBottom: 16, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16 }}
            maxSelectedLabels={2}
          />
          {descansoError && (
            <div style={{ color: 'red', fontWeight: 600, marginTop: 4 }}>{descansoError}</div>
          )}
          <label style={{ fontWeight: 700, fontSize: 18, color: '#2f23ae', marginBottom: 8, display: 'block' }}>Días laborables</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {diasSemana.map((dia: DiaSemana) => {
              const isDescanso = descansoDias.includes(dia);
              return (
                <div key={dia} style={{ textAlign: 'center', background: isDescanso ? '#eaf0ff' : 'transparent', borderRadius: 8, padding: 4 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 4, display: 'block' }}>{dia}</label>
                  {!isDescanso && (
                    <input
                      type="number"
                      value={form[dia] ?? ''}
                      onChange={e => handleChange(dia, e.target.value === '' ? '' : Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16, color: '#222', background: '#fff', marginBottom: 4, textAlign: 'center' }}
                    />
                  )}
                  {isDescanso && (
                    <span style={{ fontWeight: 700, color: '#2f23ae', fontSize: 18 }}>D</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '18px' }}>
          <Button
            label="Guardar"
            icon="pi pi-save"
            type="button"
            onClick={handleGuardarUI}
            style={{ minWidth: 130, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, fontWeight: 700, background: '#2f23ae', color: '#fff', borderRadius: '8px' }}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CubredescansoDialog;
