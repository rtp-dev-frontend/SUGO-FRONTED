import { useState, useEffect, useRef } from 'react';
import { CubredescansoEdit, DiaSemana, UseCubredescansoValidationProps } from '../interfaces/CubredescansoEdit.interface';
import { guardarCubredescanso, editarCubredescanso, eliminarCubredescanso } from '../services/cubredescansoService';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

// Objeto base para un cubredescanso vacío
const cubredescansoVacio: CubredescansoEdit = {
  No: '',
  Economico: '',
  Sistema: '',
  '1er Turno': null,
  '2do Turno': null,
  '3er Turno': null,
  L: '',
  M: '',
  Mi: '',
  J: '',
  V: '',
  S: '',
  D: ''
};

// Normaliza los datos iniciales para el formulario
function normalizeInitialForm(diasSemana: DiaSemana[], initialData?: CubredescansoEdit): CubredescansoEdit {
  if (initialData) {
    const normalizado: CubredescansoEdit = { ...initialData };
    diasSemana.forEach((dia: DiaSemana) => {
      if (initialData[dia] === 'D') {
        normalizado[dia] = 'D';
      } else if (typeof initialData[dia] === 'number' || !isNaN(Number(initialData[dia]))) {
        normalizado[dia] = Number(initialData[dia]);
      } else {
        normalizado[dia] = '';
      }
    });
    return normalizado;
  }
  return { ...cubredescansoVacio };
}

/**
 * Hook para manejar la lógica de edición, creación y eliminación de cubredescansos.
 */
export function useCubredescansoValidation({
  diasSemana,
  initialData,
  onSave,
  onDelete,
  setDialogVisible,
  setEditData,
  data,
  setData
}: UseCubredescansoValidationProps & {
  onSave?: (cubredescanso: CubredescansoEdit) => void,
  onDelete?: (No: string) => void,
  setDialogVisible?: (visible: boolean) => void,
  setEditData?: (data: CubredescansoEdit | undefined) => void,
  data?: CubredescansoEdit[],
  setData?: React.Dispatch<React.SetStateAction<CubredescansoEdit[]>>
}) {
  const [form, setForm] = useState<CubredescansoEdit>(normalizeInitialForm(diasSemana, initialData));
  const [descansoDias, setDescansoDias] = useState<DiaSemana[]>(
    diasSemana.filter((dia: DiaSemana) => (initialData ? initialData[dia] === 'D' : false))
  );
  const [descansoError, setDescansoError] = useState('');
  const toast = useRef<Toast>(null);

  // Actualiza el estado cuando cambie initialData
  useEffect(() => {
    setForm(normalizeInitialForm(diasSemana, initialData));
    setDescansoDias(diasSemana.filter((dia: DiaSemana) => (initialData ? initialData[dia] === 'D' : false)));
  }, [initialData]); // Solo depende de initialData

  // Actualiza los días de descanso
  const handleDescansoChange = (diasSeleccionados: DiaSemana[]) => {
    if (diasSeleccionados.length > 2) {
      setDescansoError('Solo puedes seleccionar hasta 2 días de descanso.');
      return;
    } else {
      setDescansoError('');
    }
    setDescansoDias(diasSeleccionados);
    setForm(prev => {
      const nuevo = { ...prev };
      diasSemana.forEach((dia: DiaSemana) => {
        if (diasSeleccionados.includes(dia)) {
          nuevo[dia] = 'D';
        } else if (typeof nuevo[dia] === 'string' && nuevo[dia] === 'D') {
          nuevo[dia] = '';
        }
      });
      return nuevo;
    });
  };

  // Actualiza un campo del formulario
  const handleChange = (field: keyof CubredescansoEdit, value: string | number | null) => {
    setForm({ ...form, [field]: value });
  };

  // Crea un nuevo cubredescanso
  const handleCrear = async () => {
    try {
      const result = await guardarCubredescanso(form);
      if (onSave) onSave(result);
      toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Cubredescanso creado correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cubredescanso', life: 3000 });
      console.error('Error al crear cubredescanso:', error);
    }
  };

  // Edita un cubredescanso existente
  const handleEditar = async () => {
    if (!form.No) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo No es requerido para editar.', life: 2500 });
      console.error('El campo No es requerido para editar.');
      return;
    }
    try {
      const result = await editarCubredescanso(form.No, form);
      if (onSave) onSave(result);
      toast.current?.show({ severity: 'success', summary: 'Editado', detail: 'Cubredescanso editado correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el cubredescanso', life: 3000 });
      console.error('Error al editar cubredescanso:', error);
    }
  };

  // Elimina un cubredescanso
  const handleEliminar = async () => {
    if (!form.No) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El campo No es requerido para eliminar.', life: 2500 });
      console.error('El campo No es requerido para eliminar.');
      return;
    }
    try {
      await eliminarCubredescanso(form.No);
      if (onDelete) onDelete(form.No);
      toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Cubredescanso eliminado correctamente', life: 2500 });
      if (setDialogVisible) setDialogVisible(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cubredescanso', life: 3000 });
      console.error('Error al eliminar cubredescanso:', error);
    }
  };

  // Muestra el diálogo de confirmación antes de eliminar
  const handleConfirmarEliminar = () => {
    confirmDialog({
      message: `¿Estás seguro que deseas eliminar el cubredescanso No ${form.No}?`,
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
  const handleEditarUI = (cubredescanso: CubredescansoEdit) => {
    if (setEditData) setEditData(cubredescanso);
    if (setDialogVisible) setDialogVisible(true);
  };

  const handleAgregarCubredescansoUI = () => {
    if (setEditData) setEditData(undefined);
    if (setDialogVisible) setDialogVisible(true);
  };

  const handleCerrarModalUI = () => {
    if (setDialogVisible) setDialogVisible(false);
    if (setEditData) setEditData(undefined);
  };

  // Handler para guardar (crear o editar) desde el componente
  const handleGuardarUI = async () => {
    if (form.No) {
      await handleEditar();
    } else {
      await handleCrear();
    }
  };

  return {
    form,
    setForm,
    descansoDias,
    setDescansoDias,
    descansoError,
    handleDescansoChange,
    handleChange,
    handleCrear,
    handleEditar,
    handleEliminar,
    handleConfirmarEliminar,
    handleEditarUI,
    handleAgregarCubredescansoUI,
    handleCerrarModalUI,
    handleGuardarUI,
    toast
  };
}
