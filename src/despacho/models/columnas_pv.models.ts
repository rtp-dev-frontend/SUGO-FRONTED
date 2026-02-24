import { ColumnapvEstados } from "../interfaces/columnasTabla_pv.interfaces";

export const tabla_pv_estados: ColumnapvEstados[] = [
  { field: "id", header: "ID" },
  { field: "modulo_puerta", header: "Puerta" },
  { field: "eco", header: "Eco" },
  { field: "eco_estatus", header: "Estado del economico" },
  { field: "momento", header: "Momento" },
  { field: "tipo_registro", header: "Tipo de registro" },
  { field: "motivo_id", header: "Motivo" },
  { field: "modulo", header: "Módulo" },
  { field: "ruta_modalidad", header: "Modalidad" },
  { field: "ruta", header: "Ruta" },
  { field: "ruta_cc", header: "CC" },
  { field: "op_cred", header: "Operador" },
  { field: "op_turno", header: "Turno" },
  { field: "extintor", header: "Extintor" },
  { field: "createdBy", header: "Creado por" },
  { field: "eco_modalidad", header: "Modalidad Eco" },
];
