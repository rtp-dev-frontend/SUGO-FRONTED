import React from 'react';
import { JornadaDialogProps } from '../interfaces/JornadaEdit.interface';
import { useJornadaValidation } from '../hooks/useJornadaValidation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

const diasSemana = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D']; // Lista de días de la semana

// Componente de diálogo para editar o crear una jornada excepcional 
const JornadaDialog: React.FC<JornadaDialogProps> = ({ visible, onHide, onSave, initialData }) => {
  const {
    form,
    setForm,
    handleChange,
    handleDiaChange,
    descansoDias,
    descansoError,
    handleDescansoChange,
    handleGuardarUI
  } = useJornadaValidation(initialData, onSave);

  return (
    <Dialog header={initialData ? 'Editar Jornada Excepcional' : 'Nueva Jornada Excepcional'} visible={visible} style={{ width: '500px' }} onHide={onHide} modal>
      <form style={{
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
      onSubmit={e => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '26px', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Operador:</label>
            <input
              type="number"
              value={form.operador ?? ''}
              onChange={e => handleChange('operador', e.target.value === '' ? 0 : Number(e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Lugar:</label>
            <input
              type="text"
              value={form.lugar}
              onChange={e => handleChange('lugar', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '26px', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Hora inicio:</label>
            <input
              type="time"
              value={form.hora_inicio}
              onChange={e => handleChange('hora_inicio', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Hora término:</label>
            <input
              type="time"
              value={form.hora_termino}
              onChange={e => handleChange('hora_termino', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
            />
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 700, marginBottom: 8, display: 'block', fontSize: 17, color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Días de descanso</label>
          <MultiSelect
            value={descansoDias}
            options={diasSemana.map(dia => ({ label: dia, value: dia }))}
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
            {diasSemana.map(dia => {
              const isDescanso = descansoDias.includes(dia);
              return (
                <div key={dia} style={{ textAlign: 'center', background: isDescanso ? '#eaf0ff' : 'transparent', borderRadius: 8, padding: 4 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 4, display: 'block' }}>{dia}</label>
                  {!isDescanso && (
                    <input
                      type="text"
                      value={form.dias_servicio[dia] ?? ''}
                      onChange={e => handleDiaChange(dia, e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif", fontSize: 16, color: '#222', background: '#fff', marginBottom: 4, textAlign: 'center' }}
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
            severity="success"
            type="button"
            onClick={handleGuardarUI}
            style={{ minWidth: 130, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, fontWeight: 700, background: '#2f23ae', color: '#fff', borderRadius: '8px' }}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default JornadaDialog;
