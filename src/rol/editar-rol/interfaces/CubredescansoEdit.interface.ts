// Tipo para los días de la semana
export type DiaSemana = 'L' | 'M' | 'Mi' | 'J' | 'V' | 'S' | 'D';

// Interfaz para la edición de cubredescanso
export interface CubredescansoEdit {
  No: string;
  Economico: number | string | null;
  Sistema: string | null;
  "1er Turno": number | null;
  "2do Turno": number | null;
  "3er Turno": number | null;
  L: string | number | null;
  M: string | number | null;
  Mi: string | number | null;
  J: string | number | null;
  V: string | number | null;
  S: string | number | null;
  D: string | number | null;
}
// Props para el diálogo de cubredescanso
export interface CubredescansoDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (cubredescanso: CubredescansoEdit) => void;
  initialData?: CubredescansoEdit;
}

// Props para el hook de validación de cubredescanso
export interface UseCubredescansoValidationProps {
  diasSemana: DiaSemana[];
  initialData?: CubredescansoEdit;
}