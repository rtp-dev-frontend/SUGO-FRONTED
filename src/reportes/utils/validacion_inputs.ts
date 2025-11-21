export function validarCampos({
  selectedTipoPdf,
  setPdfError,
  selectedTurno,
  setTurnoError,
  selectedFecha,
  setFechaError,
  toast,
}: {
  selectedTipoPdf: any;
  setPdfError: (v: boolean) => void;
  selectedTurno: any;
  setTurnoError: (v: boolean) => void;
  selectedFecha: any;
  setFechaError: (v: boolean) => void;
  toast: React.RefObject<any>;
}) {
  let error = false;

  if (selectedTipoPdf === null) {
    setPdfError(true);
    error = true;
  } else {
    setPdfError(false);
  }

  if (selectedTurno === null) {
    setTurnoError(true);
    error = true;
  } else {
    setTurnoError(false);
  }

  if (selectedFecha === null) {
    setFechaError(true);
    error = true;
  } else {
    setFechaError(false);
  }

  if (error) {
    toast.current?.show({
      severity: "error",
      summary: "Campos incompletos",
      detail: "Por favor, complete todos los campos del formulario.",
      life: 3000,
    });
    return false;
  }
  return true;
}
