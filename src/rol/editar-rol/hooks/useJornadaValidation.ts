import { useState, useEffect, useRef } from 'react';
import { JornadaEdit } from '../interfaces/JornadaEdit.interface';
import { guardarJornada, editarJornada, eliminarJornada } from '../services/jornadaService';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

export function useJornadaValidation(
  initialData?: JornadaEdit,
  onSave?: (jornada: JornadaEdit) => void,
  onDelete?: (id: string) => void,
  setDialogVisible?: (visible: boolean) => void,
  setEditData?: (data: JornadaEdit | undefined) => void,
  data?: JornadaEdit[],
  setData?: React.Dispatch<React.SetStateAction<JornadaEdit[]>>
) {
  const diasSemana = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
  // Asegura que el campo id esté presente en el estado
  const [form, setForm] = useState<JornadaEdit>(initialData ?? {
    id: '', // <-- agrega id vacío por defecto
    operador: 0,
    lugar: '',
    hora_inicio: '',
    hora_termino: '',
    dias_servicio: { L: '', M: '', Mi: '', J: '', V: '', S: '', D: '' }
  });
  const [descansoDias, setDescansoDias] = useState<string[]>(() => {
    if (initialData) {
      return diasSemana.filter(dia => initialData.dias_servicio[dia] === 'D');
    }
    return [];
  });
  const [descansoError, setDescansoError] = useState('');
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData); // Si initialData tiene id, se mantiene
      setDescansoDias(diasSemana.filter(dia => initialData.dias_servicio[dia] === 'D'));
    }
  }, [initialData]);

  const handleChange = (field: keyof JornadaEdit, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleDiaChange = (dia: string, value: string) => {
    setForm({ ...form, dias_servicio: { ...form.dias_servicio, [dia]: value } });
  };

  const handleDescansoChange = (diasSeleccionados: string[]) => {
    if (diasSeleccionados.length > 2) {
      setDescansoError('Solo puedes seleccionar hasta 2 días de descanso.');
      return;
    } else {
      setDescansoError('');
    }
    setDescansoDias(diasSeleccionados);
    setForm(prev => {
      const nuevo = { ...prev };
      diasSemana.forEach(dia => {
        if (diasSeleccionados.includes(dia)) {
          nuevo.dias_servicio[dia] = 'D';
        } else if (typeof nuevo.dias_servicio[dia] === 'string' && nuevo.dias_servicio[dia] === 'D') {
          nuevo.dias_servicio[dia] = '';
        }
      });
      return nuevo;
    });
  };

  // Guardar nueva jornada
  const handleCrear = async () => {
    try {
      const result = await guardarJornada(form);
      if (onSave) onSave(result);
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Jornada creada correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la jornada', life: 3000 });
      console.error('Error al crear jornada:', error);
    }
  };

  // Editar jornada existente
  const handleEditar = async () => {
    if (!form.id) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo id es requerido para editar.', life: 2500 });
      console.error('El campo id es requerido para editar.');
      return;
    }
    try {
      const result = await editarJornada(form.id, form);
      if (onSave) onSave(result);
      toast.current?.show({ severity: 'success', summary: 'Editado', detail: 'Jornada editada correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo editar la jornada', life: 3000 });
      console.error('Error al editar jornada:', error);
    }
  };

  // Eliminar jornada
  const handleEliminar = async () => {
    if (!form.id) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo id es requerido para eliminar.', life: 2500 });
      console.error('El campo id es requerido para eliminar.');
      return;
    }
    try {
      await eliminarJornada(form.id);
      if (onDelete) onDelete(form.id);
      toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Jornada eliminada correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la jornada', life: 3000 });
      console.error('Error al eliminar jornada:', error);
    }
  };

  // Confirmar antes de eliminar
  const handleConfirmarEliminar = () => {
    confirmDialog({
      message: `¿Estás seguro que deseas eliminar la jornada?`,
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
  const handleEditarUI = (jornada: JornadaEdit) => {
    if (setEditData) setEditData(jornada);
    if (setDialogVisible) setDialogVisible(true);
  };

  const handleAgregarJornadaUI = () => {
    if (setEditData) setEditData(undefined);
    if (setDialogVisible) setDialogVisible(true);
  };

  const handleCerrarModalUI = () => {
    if (setDialogVisible) setDialogVisible(false);
    if (setEditData) setEditData(undefined);
  };

  // Handler para guardar (crear o editar) desde el componente
  const handleGuardarUI = async () => {
    // Si el form tiene id y no es vacío, edita; si no, crea
    if (form.id && form.id !== '') {
      await handleEditar();
    } else {
      await handleCrear();
    }
  };

  return {
    form,
    setForm,
    handleChange,
    handleDiaChange,
    descansoDias,
    descansoError,
    handleDescansoChange,
    handleCrear,
    handleEditar,
    handleEliminar,
    handleConfirmarEliminar,
    handleEditarUI,
    handleAgregarJornadaUI,
    handleCerrarModalUI,
    handleGuardarUI,
    toast
  };
}
