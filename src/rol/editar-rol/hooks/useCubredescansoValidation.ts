import { useState, useEffect } from 'react';
import { CubredescansoEdit, DiaSemana, UseCubredescansoValidationProps } from '../interfaces/CubredescansoEdit.interface';


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
  return {
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
}

export function useCubredescansoValidation({ diasSemana, initialData }: UseCubredescansoValidationProps) {
  const [form, setForm] = useState<CubredescansoEdit>(normalizeInitialForm(diasSemana, initialData));
  const [descansoDias, setDescansoDias] = useState<DiaSemana[]>(
    diasSemana.filter((dia: DiaSemana) => (initialData ? initialData[dia] === 'D' : false))
  );

  // Actualiza el estado cuando cambie initialData
  useEffect(() => {
    setForm(normalizeInitialForm(diasSemana, initialData));
    setDescansoDias(diasSemana.filter((dia: DiaSemana) => (initialData ? initialData[dia] === 'D' : false)));
  }, [initialData, diasSemana]);
  const [descansoError, setDescansoError] = useState('');

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

  const handleChange = (field: keyof CubredescansoEdit, value: string | number | null) => {
    setForm({ ...form, [field]: value });
  };

  return {
    form,
    setForm,
    descansoDias,
    setDescansoDias,
    descansoError,
    handleDescansoChange,
    handleChange,
  };
}
