import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { PeriodoSelector } from './PeriodoSelector';
import { ModuloSelector } from './ModuloSelector';
import { ErroresRol } from './ErroresRol';
import { BotonesFormulario } from './BotonesFormulario';
import { BotonDescargaPlantilla } from './BotonDescargaPlantilla';
import { useRolFormulario } from '../hooks/useRolFormulario';
import { useArchivoHandlers } from '../hooks/useArchivoHandlers';
import { useSelectorHandlers } from '../hooks/useSelectorHandlers';
import { RolesCargados } from './RolesCargados';



/**
 * Componente principal para el formulario de carga de roles.
 * Flujo: Cargar archivo → Llenar formulario → Enviar → Mostrar recuadro → Clic recuadro → Modal completo
 */

export const RolFormulario = () => {
    // Hook personalizado que gestiona el estado y lógica del formulario
    const {
        periodo, setPeriodo, periodos,        // Estado y opciones para el periodo
        modulo, setModulo, modulos,           // Estado y opciones para el módulo
        errores, error, isLoading, validatingData, // Estados de validación y errores
        canUpload, showErr, cont,             // Estados auxiliares para la UI
        sendData, limpiarFormulario,          // Funciones para enviar y limpiar el formulario
        rolesSended,                         // Estado para roles enviados
        periodoError, setPeriodoError, moduloError, setModuloError, // Estados visuales de error
        excel, setExcel                      // Estado y setter del archivo Excel
    } = useRolFormulario();


    // Referencia para el input file oculto
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Procesa el archivo solo al cargar, no al enviar
    const handleSendData = () => {
        sendData();
    };

    // Estado para forzar el reset visual del input
    const [fileInputKey, setFileInputKey] = useState(0);
    // Restaurar handlers para validación al seleccionar archivo
    const { handleSelectArchivo, handleFileSelect } = useArchivoHandlers(
        periodo, modulo, setPeriodoError, setModuloError, fileInputRef, setExcel
    );
    const { handlePeriodoChange, handleModuloChange } = useSelectorHandlers(
        setPeriodo, setModulo, setPeriodoError, setModuloError
    );

    // Solo muestra el botón "Enviar" si todos los campos requeridos están completos y hay archivo
    const canSend = periodo && modulo && excel;

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <div className="w-3">
                    {/* Selector de periodo, muestra mensaje de error si corresponde */}
                    <PeriodoSelector
                        periodo={periodo}
                        setPeriodo={handlePeriodoChange}
                        opciones={periodos}
                        hasError={periodoError}
                    />
                    {periodoError && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            Selecciona un periodo
                        </span>
                    )}
                </div>

                <div className="w-2">
                    {/* Selector de módulo, muestra mensaje de error si corresponde */}
                    <ModuloSelector
                        modulo={modulo}
                        setModulo={handleModuloChange}
                        opciones={modulos}
                        hasError={moduloError}
                    />
                    {moduloError && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            Selecciona un módulo
                        </span>
                    )}
                </div>
                <Button
                    label={excel ? `${excel.name}` : "Seleccionar Archivo"}
                    icon="pi pi-upload"
                    iconPos="left"
                    onClick={handleSelectArchivo}
                    className="btn-form"
                    style={{ width: 'auto', maxWidth: '100%', height: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '32px', paddingLeft: '16px' }}
                />
                {/* Input básico para seleccionar archivo */}
                <input
                    key={fileInputKey}
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />


                {/* Botones del formulario */}
                <BotonesFormulario
                    sendData={handleSendData}
                    limpiarFormulario={() => {
                        limpiarFormulario();
                        setExcel(null);
                        setFileInputKey(prev => prev + 1);
                    }}
                    canSend={!!canSend}
                />
                {/* Botón para descargar plantilla */}
                <BotonDescargaPlantilla />
            </div>

            <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
                {/* Componente para mostrar roles cargados por módulo */}
                <div style={{ flex: 1 }}>
                    <RolesCargados periodo={periodo} />
                </div>
                {/* Componente para mostrar errores y estado de validación */}
                <div style={{ maxWidth: 700, flex: 0.6 }}>
                    <ErroresRol
                        errores={errores}
                        showErr={showErr}
                        isLoading={isLoading}
                        validatingData={validatingData}
                        cont={cont}
                    />
                </div>

            </div>
        </div>
    );
};