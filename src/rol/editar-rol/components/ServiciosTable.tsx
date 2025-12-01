import React, { useState } from 'react';
import { ServicioEdit } from '../interfaces/ServicioEdit.interface';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import EditarServicioFormulario from './EditarServicioFormulario';
import { cellStyle, headerCellStyle, tableStyle } from '../../../shared/styles/TableStyles';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import useEditarServicioForm from '../hooks/useEditarServicioForm';

interface ServiciosTableProps {
    servicios: ServicioEdit[];
}

const OPERADORES_BASE = [0, 1, 2];
const DIAS = ['Lunes a Viernes', 'Sabado', 'Domingo'];
const TURNOS = [1, 2, 3];

const DIAS_SEMANA = [
    { label: 'Lunes', value: 'L' },
    { label: 'Martes', value: 'M' },
    { label: 'Miércoles', value: 'Mi' },
    { label: 'Jueves', value: 'J' },
    { label: 'Viernes', value: 'V' },
    { label: 'Sábado', value: 'S' },
    { label: 'Domingo', value: 'D' }
];

const ServiciosTable: React.FC<ServiciosTableProps> = ({ servicios }) => {
    const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioEdit | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [serviciosState, setServiciosState] = useState<ServicioEdit[]>(servicios ?? []);

    const {
        handleConfirmarEliminar,
        handleGuardarUI,
        toast,
        handleEditarUI,
        handleAgregarServicioUI,
        handleCerrarModalUI
    } = useEditarServicioForm(
        servicioSeleccionado as ServicioEdit,
        serviciosState,
        setServiciosState,
        setServicioSeleccionado,
        setModalVisible,
        // onSave callback para actualizar el estado local
        (servicioGuardado) => {
            setServiciosState(prev => {
                const idx = prev.findIndex(s => s.economico === servicioGuardado.economico);
                if (idx >= 0) {
                    // Editar
                    const copia = [...prev];
                    copia[idx] = servicioGuardado;
                    return copia;
                } else {
                    // Crear
                    return [...prev, servicioGuardado];
                }
            });
            setModalVisible(false);
            setServicioSeleccionado(null);
        }
    );

    const rowStyle = (idx: number) => ({
        background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
        transition: 'background 0.2s',
        cursor: 'pointer'
    });

    return (
        <div style={{ marginBottom: 40, position: 'relative' }}>
            <Toast ref={toast} />
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: 3,
                justifyContent: 'space-between'
            }}>
                <div>
                    <label style={{ fontWeight: 600, fontSize: 17 }}>Servicios</label>
                </div>
                <div style={{ marginTop: 12 }}>
                    <Button
                        label="Agregar servicio"
                        icon="pi pi-calendar-plus"
                        style={{
                            height: 40,
                            minWidth: 200
                        }}
                        onClick={handleAgregarServicioUI}
                    />
                </div>
            </div>
            {(serviciosState.length === 0) ? (
                <div style={{ color: '#888', fontWeight: 500, padding: '16px 0', textAlign: 'center' }}>
                    No hay registro de servicios.
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
                            <th style={headerCellStyle}>Descansos</th>
                            <th style={headerCellStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(serviciosState ?? []).map((servicio, idx) => {
                            // Unifica los días de descanso de los tres turnos sin repetir
                            const descansosSet = new Set([
                                ...(servicio.turno_operadores?.['Turno 1']?.descansos ?? []),
                                ...(servicio.turno_operadores?.['Turno 2']?.descansos ?? []),
                                ...(servicio.turno_operadores?.['Turno 3']?.descansos ?? [])
                            ]);
                            const descansos = Array.from(descansosSet).join(', ') || '-'; // Muestra '-' si no hay descansos
                            return (
                                <tr key={idx} style={rowStyle(idx)}>
                                    <td style={cellStyle}>{idx + 1}</td>
                                    <td style={cellStyle}>{servicio.economico}</td>
                                    <td style={cellStyle}>{servicio.sistema}</td>
                                    <td style={cellStyle}>{servicio.turno_operadores?.['Turno 1']?.credencial ?? '-'}</td>
                                    <td style={cellStyle}>{servicio.turno_operadores?.['Turno 2']?.credencial ?? '-'}</td>
                                    <td style={cellStyle}>{servicio.turno_operadores?.['Turno 3']?.credencial ?? '-'}</td>
                                    <td style={cellStyle}>{descansos}</td>
                                    <td style={cellStyle}>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-text p-button-lg"
                                            tooltip="Editar"
                                            severity="info"
                                            onClick={() => handleEditarUI(servicio)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text p-button-lg"
                                            tooltip="Borrar"
                                            severity="danger"
                                            style={{ marginLeft: 8 }}
                                            onClick={() => {
                                                setServicioSeleccionado(servicio);
                                                handleConfirmarEliminar();
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* Modal para editar servicio */}
            <Dialog
                header="Editar Servicio"
                visible={modalVisible}
                style={{ width: '80vw', maxWidth: 1200 }}
                onHide={handleCerrarModalUI}
                modal
            >
                {servicioSeleccionado && (
                    <EditarServicioFormulario
                        servicio={servicioSeleccionado}
                        onCancel={handleCerrarModalUI}
                        onSave={handleGuardarUI} // Usa el handler único del hook
                    />
                )}
            </Dialog>
        </div>
    );
};

export default ServiciosTable;
