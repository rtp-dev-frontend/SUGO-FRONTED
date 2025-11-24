// Definición de la interfaz para editar una jornada
export interface JornadaEdit {
  id?: string;
  rol_id?: string;
  operador: number;
  lugar: string;
  hora_inicio: string;
  hora_termino: string;
  dias_servicio: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}


// Props para el diálogo de jornada
export interface JornadaDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (jornada: JornadaEdit) => void;
  initialData?: JornadaEdit;
}
