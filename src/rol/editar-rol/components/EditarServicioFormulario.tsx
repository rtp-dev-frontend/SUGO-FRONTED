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

    console.log('servicios', servicio);
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
            fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", // Fuente moderna
            fontSize: 16 // Tamaño base más grande
        }}>
            <div style={{ display: 'flex', gap: '26px', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 17, letterSpacing: '0.5px' }}>Económico:</label>
                    <input type="number" defaultValue={servicio.economico ?? ''} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16 }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, marginBottom: 4, display: 'block', fontSize: 17, letterSpacing: '0.5px' }}>Sistema:</label>
                    <input type="text" defaultValue={servicio.sistema ?? ''} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16 }} />
                </div>
            </div>
            <div>
                <label style={{ fontWeight: 700, marginBottom: 8, display: 'block', fontSize: 16 }}>Descansos (máximo 2 días):</label>
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
                    style={{ width: '100%', fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16 }}
                />
            </div>
            <div>
                <label style={{ fontWeight: 700, marginBottom: 8, display: 'block', fontSize: 16 }}>Turnos:</label>
                <Accordion multiple>
                    {TURNOS.map((turno) => {
                        const turnoKey = `Turno ${turno}`;
                        const operadorObj = servicio.turno_operadores?.[turnoKey];
                        return (
                            <AccordionTab key={turnoKey} header={turnoKey} headerStyle={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontWeight: 700, fontSize: 17 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, fontSize: 16 }}>Operador (credencial):</label>
                                    <input
                                        type="number"
                                        value={operadorObj?.credencial ?? ''}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16 }}
                                        readOnly
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, fontSize: 16 }}>Descansos:</label>
                                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                                        {(operadorObj?.descansos ?? []).join(', ') || '-'}
                                    </span>
                                </div>
                                {/* Horarios por día para este turno */}
                                {DIAS.map(dia => {
                                    const horario = servicio[dia]?.[turnoKey];
                                    if (!horario) return null;
                                    return (
                                        <div key={dia + turnoKey} style={{
                                            background: '#f8f9fa',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '6px',
                                            padding: '12px 14px',
                                            marginBottom: 12,
                                            boxShadow: 'none'
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#2f23ae', fontSize: 18, fontWeight: 700 }}>🕒</span>
                                                {dia}
                                            </div>
                                            {/* Inputs estrictos por turno */}
                                            {turno === 1 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora inicio Turno:</label>
                                                        <input type="time" defaultValue={horario.hora_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora inicio en CC:</label>
                                                        <input type="time" defaultValue={horario.hora_inicio_cc ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={horario.lugar_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora término Turno:</label>
                                                        <input type="time" defaultValue={horario.hora_termino ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                </div>
                                            )}
                                            {turno === 2 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={horario.lugar_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora inicio:</label>
                                                        <input type="time" defaultValue={horario.hora_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora término Turno:</label>
                                                        <input type="time" defaultValue={horario.hora_termino ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                </div>
                                            )}
                                            {turno === 3 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Lugar inicio:</label>
                                                        <input type="text" defaultValue={horario.lugar_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora inicio Turno:</label>
                                                        <input type="time" defaultValue={horario.hora_inicio ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Hora término en CC:</label>
                                                        <input type="time" defaultValue={horario.hora_termino_cc ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Lugar de término CC:</label>
                                                        <input type="text" defaultValue={horario.lugar_termino_cc ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Término en Módulo:</label>
                                                        <input type="time" defaultValue={horario.termino_modulo ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontWeight: 500 }}>Término del Turno:</label>
                                                        <input type="time" defaultValue={horario.termino_turno ?? ''} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: 8 }} />
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
                <Button label="Guardar" icon="pi pi-save" style={{ minWidth: 130, fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", fontSize: 16, fontWeight: 600 }} />
            </div>
        </form>
    );
};

export default EditarServicioFormulario;