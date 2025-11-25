import { useState, useEffect } from 'react';
import { JornadaEdit } from '../interfaces/JornadaEdit.interface';

export function useJornadaValidation(initialData?: JornadaEdit) {
  const diasSemana = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
  const [form, setForm] = useState<JornadaEdit>(initialData ?? {
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

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
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

  return {
    form,
    setForm,
    handleChange,
    handleDiaChange,
    descansoDias,
    descansoError,
    handleDescansoChange,
  };
}
