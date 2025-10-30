export interface RolesCargadosProps {
	periodo: any;
	reload?: number;
}

export interface ICubredescansoTurno {
	id: string;
	cubredescanso_id: string;
	turno: number;
	operador: number;
	servicios_a_cubrir: Record<string, string | number>;
	created_at: string;
	updated_at: string;
}

export interface IRolCargado {
	id: string;
	rol_id: string;
	economico: number;
	sistema: string;
	created_at: string;
	updated_at: string;
	cubredescansos_turnos: ICubredescansoTurno[];
}