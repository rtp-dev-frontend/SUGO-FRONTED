import React, { useState } from 'react';
import { ServicioEdit } from '../interfaces/ServicioEdit.interface';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Accordion, AccordionTab } from 'primereact/accordion';

const DIAS = ['Lunes a Viernes', 'Sabado', 'Domingo'];
const TURNOS = [1, 2, 3];

// Formulario para editar servicio con estilo tipo RolFormulario
const EditarServicioFormulario: React.FC<{
    servicio: ServicioEdit;
    onCancel: () => void;
    onSave?: (servicio: ServicioEdit) => void;
}> = ({ servicio, onCancel }) => {
    const [form, setForm] = useState<ServicioEdit>(servicio);

    // Estado para operadores dinámicos (máximo 3)
    const [operadores, setOperadores] = useState<any[]>(
        servicio.operadores_servicios && servicio.operadores_servicios.length > 0
            ? servicio.operadores_servicios.slice(0, 3)
            : [{ turno: 1, operador: '' }]
    );

    // Adaptar descansos para el primer turno disponible
    const primerTurno = Object.keys(servicio.turno_operadores)[0];
    const [descansos, setDescansos] = useState<string[]>(
        servicio.turno_operadores[primerTurno]?.descansos ?? []
    );

    return (
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
        }}>
            <div style={{ display: 'flex', gap: '26px', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Económico:</label>
                    <input
                        type="number"
                        value={form.economico ?? ''}
                        onChange={e => setForm({ ...form, economico: Number(e.target.value) })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 18, letterSpacing: '0.5px', color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Sistema:</label>
                    <input
                        type="text"
                        value={form.sistema ?? ''}
                        onChange={e => setForm({ ...form, sistema: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
                    />
                </div>
            </div>
            <div>
                <label style={{ fontWeight: 700, marginBottom: 8, display: 'block', fontSize: 17, color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Descansos (máximo 2 días):</label>
                <MultiSelect
                    value={descansos}
                    options={[
                        { label: 'Lunes', value: 'L' },
                        { label: 'Martes', value: 'M' },
                        { label: 'Miércoles', value: 'Mi' },
                        { label: 'Jueves', value: 'J' },
                        { label: 'Viernes', value: 'V' },
                        { label: 'Sábado', value: 'S' },
                        { label: 'Domingo', value: 'D' }
                    ]}
                    onChange={(e) => {
                        if (e.value.length <= 2) setDescansos(e.value);
                    }}
                    display="chip"
                    placeholder="Selecciona días de descanso"
                    maxSelectedLabels={2}
                    style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
                />
            </div>
            <div>
                <label style={{ fontWeight: 700, marginBottom: 8, display: 'block', fontSize: 17, color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Turnos:</label>
                <Accordion multiple>
                    {TURNOS.map((turno) => {
                        const turnoKey = `Turno ${turno}`;
                        const operadorObj = servicio.turno_operadores?.[turnoKey];
                        return (
                            <AccordionTab key={turnoKey} header={turnoKey} headerStyle={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontWeight: 700, fontSize: 18, color: '#2f23ae' }}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, fontSize: 17, color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Operador (credencial):</label>
                                    <input
                                        type="number"
                                        value={operadorObj?.credencial ?? ''}
                                        onChange={() => { }}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, color: '#222', background: '#fafbfc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, fontSize: 17, color: '#222', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>Horarios:</label>
                                </div>
                                {/* Horarios por día para este turno */}
                                {DIAS.map(dia => {
                                    const horariosDia = (servicio as any)[dia] ?? {};
                                    const turnoKey = `Turno ${turno}`;
                                    const h = horariosDia[turnoKey] ?? {};

                                    // Los inputs SIEMPRE se muestran, aunque no haya datos
                                    return (
                                        <div key={dia + turnoKey} style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px 18px', marginBottom: 14, boxShadow: 'none' }}>
                                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#2f23ae', fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                                <span style={{ fontSize: 20 }}>🕒</span>
                                                {dia}
                                            </div>
                                            {/* Solo los inputs, sin mostrar datos crudos */}
                                            {turno === 1 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora inicio Turno:</label>
                                                        <input type="time" defaultValue={h.hora_inicio_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora inicio en CC:</label>
                                                        <input type="time" defaultValue={h.hora_inicio_cc ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={h.lugar_inicio ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora término Turno:</label>
                                                        <input type="time" defaultValue={h.hora_termino_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                </div>
                                            )}
                                            {turno === 2 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={h.lugar_inicio ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora inicio:</label>
                                                        <input type="time" defaultValue={h.hora_inicio_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora término Turno:</label>
                                                        <input type="time" defaultValue={h.hora_termino_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                </div>
                                            )}
                                            {turno === 3 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={h.lugar_inicio ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora inicio Turno:</label>
                                                        <input type="time" defaultValue={h.hora_inicio_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Hora término en CC:</label>
                                                        <input type="time" defaultValue={h.hora_termino_cc ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Lugar de término CC:</label>
                                                        <input type="text" defaultValue={h.lugar_termino_cc ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Término en Módulo:</label>
                                                        <input type="time" defaultValue={h.termino_modulo ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>Término del Turno:</label>
                                                        <input type="time" defaultValue={h.termino_turno ?? ''} style={{ ...inputStyle }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </AccordionTab>
                        );
                    })}
                </Accordion>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '18px' }}>
                <Button label="Guardar" icon="pi pi-save" style={{ minWidth: 130, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 17, fontWeight: 700, background: '#2f23ae', color: '#fff', borderRadius: '8px' }} />
            </div>
        </form>
    );
};

export default EditarServicioFormulario;


const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d0d0d0',
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    fontSize: 16,
    color: '#222',
    background: '#fafbfc',
    marginBottom: 8
};