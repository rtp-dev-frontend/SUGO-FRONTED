import { useState, useRef } from 'react';
import { ServicioEdit } from '../interfaces/ServicioEdit.interface';
import { guardarServicio, editarServicio, eliminarServicio } from '../services/servicioService';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

// Estilos para los inputs del formulario
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

// Objeto base para un servicio vacío
const servicioVacio: ServicioEdit = {
    economico: 0,
    sistema: '',
    operadores_servicios: [],
    horarios: [],
    turno_operadores: {},
    no: 0,
    'Lunes a Viernes': {},
    'Sabado': {},
    'Domingo': {}
};

/**
 * Hook para manejar toda la lógica de edición, creación y eliminación de servicios.
 */
export default function useEditarServicioForm(
    servicio: ServicioEdit | null | undefined,
    serviciosState: ServicioEdit[],
    setServiciosState: React.Dispatch<React.SetStateAction<ServicioEdit[]>>,
    setServicioSeleccionado: React.Dispatch<React.SetStateAction<ServicioEdit | null>>,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    onSave?: (servicio: ServicioEdit) => void,
    onDelete?: (economico: number) => void
) {
    // Usa el objeto base para inicializar
    const safeServicio: ServicioEdit = servicio ?? servicioVacio;

    // Estados internos del formulario
    const [form, setForm] = useState<ServicioEdit>(safeServicio);
    const [operadores, setOperadores] = useState<any[]>(
        safeServicio.operadores_servicios && safeServicio.operadores_servicios.length > 0
            ? safeServicio.operadores_servicios.slice(0, 3)
            : [{ turno: 1, operador: '' }]
    );
    const primerTurno = Object.keys(safeServicio.turno_operadores)[0];
    const [descansos, setDescansos] = useState<string[]>(
        safeServicio.turno_operadores[primerTurno]?.descansos ?? []
    );

    // Referencia para mostrar notificaciones
    const toast = useRef<Toast>(null);

    // Actualiza un campo del formulario
    const handleInputChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Actualiza los días de descanso seleccionados
    const handleMultiSelectChange = (e: any) => {
        if (e.value.length <= 2) setDescansos(e.value);
    };

    // Crea un nuevo servicio
    const handleCrear = async () => {
        try {
            const result = await guardarServicio(form);
            if (onSave) onSave(result);
            toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Servicio creado correctamente', life: 2500 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el servicio', life: 3000 });
            console.error('Error al crear servicio:', error);
        }
    };

    // Edita un servicio existente
    const handleEditar = async () => {
        if (form.economico == null) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo económico es requerido para editar.', life: 2500 });
            console.error('El campo económico es requerido para editar.');
            return;
        }
        try {
            const result = await editarServicio(form.economico, form);
            if (onSave) onSave(result);
            toast.current?.show({ severity: 'success', summary: 'Editado', detail: 'Servicio editado correctamente', life: 2500 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el servicio', life: 3000 });
            console.error('Error al editar servicio:', error);
        }
    };

    // Elimina un servicio (soft delete)
    const handleEliminar = async () => {
        if (form.economico == null) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo económico es requerido para eliminar.', life: 2500 });
            console.error('El campo económico es requerido para eliminar.');
            return;
        }
        try {
            await eliminarServicio(form.economico);
            if (onDelete) onDelete(form.economico);
            toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Servicio eliminado correctamente', life: 2500 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el servicio', life: 3000 });
            console.error('Error al eliminar servicio:', error);
        }
    };

    // Muestra el diálogo de confirmación antes de eliminar
    const handleConfirmarEliminar = () => {
        confirmDialog({
            message: `¿Estás seguro que deseas eliminar el servicio económico ${form.economico}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            style: { width: 400 },
            accept: handleEliminar
        });
    };

    // Handlers para la UI del modal
    const handleEditarUI = (servicio: ServicioEdit) => {
        setServicioSeleccionado(servicio);
        setModalVisible(true);
    };

    // Handler para abrir el modal en modo creación
    const handleAgregarServicioUI = () => {
        setServicioSeleccionado(servicioVacio);
        setModalVisible(true);
    };

    // Handler para cerrar el modal
    const handleCerrarModalUI = () => {
        setModalVisible(false);
        setServicioSeleccionado(null);
    };

    // Handler para guardar (crear o editar) desde el componente
    const handleGuardarUI = async () => {
        if (form.economico && form.economico !== 0) {
            // Editar
            try {
                const result = await editarServicio(form.economico, form);
                if (onSave) onSave(result);
                toast.current?.show({ severity: 'success', summary: 'Editado', detail: 'Servicio editado correctamente', life: 2500 });
                if (setModalVisible) setModalVisible(false);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el servicio', life: 3000 });
            }
        } else {
            // Crear
            try {
                const result = await guardarServicio(form);
                if (onSave) onSave(result);
                toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Servicio creado correctamente', life: 2500 });
                if (setModalVisible) setModalVisible(false);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el servicio', life: 3000 });
            }
        }
    };

    // Exponer estados y handlers
    return {
        form,
        setForm,
        operadores,
        setOperadores,
        descansos,
        setDescansos,
        handleInputChange,
        handleMultiSelectChange,
        handleCrear,           // Crear servicio
        handleEditar,          // Editar servicio
        handleConfirmarEliminar, // Confirmar y eliminar servicio
        handleEditarUI,        // Abrir modal para editar
        handleAgregarServicioUI, // Abrir modal para crear
        handleCerrarModalUI,   // Cerrar modal
        handleGuardarUI,       // Guardar servicio (crear o editar)
        inputStyle,
        toast
    };
}
