// ---------------------------------------------
// Documentación de cambios y estructura actual
// ---------------------------------------------
// 1. Se modularizó el código separando la lógica de filtrado y helpers en el hook useRolesFiltrados.
// 2. El modal de detalle (ModalGlosario) se extrajo como componente propio y se mejoró su diseño visual.
// 3. Se agregó el componente TablasTurno para mostrar las tablas por turno y día, facilitando la visualización tipo Excel.
// 4. El botón de cerrar del modal se muestra como una "X" en la esquina superior derecha con sombra y borde verde.
// 5. El modal y los datos principales se centran y se muestran con estilos modernos y responsivos.
// 6. El código del componente principal RolesCargados quedó enfocado solo en la UI y manejo de estados visuales.
// 7. Se eliminaron duplicados y se mejoró la estructura para facilitar el mantenimiento y la comprensión.
// ---------------------------------------------

import React, { useState, useEffect } from 'react';
import { useRolesCargados } from '../hooks/useRolesCargados';
import { useRolesFiltrados } from '../hooks/useRolesFiltrados';
import { RolesCargadosProps } from '../interfaces/RolesCargados.interface';
import { getCasetaRegistros } from '../services/casetaService'; // Debes crear este servicio

const MODULOS = [1, 2, 3, 4, 5, 6, 7];

// Componente para mostrar las tablas de cada turno y día (visualización tipo Excel)
// Ahora incluye el chequeo de registros en caseta para mostrar si el operador/económico fue capturado en el periodo.
const TablasTurno: React.FC<{ data: any, turno: number, periodo: any }> = ({ data, turno, periodo }) => {
	// ...documentación: muestra los horarios por turno y por día en tablas separadas...
	const dias = ["Lunes a Viernes", "Sabado", "Domingo"];
	const encabezados = [
		{ key: "hora_inicio", label: "Hora inicio" },
		{ key: "hora_inicio_cc", label: "Hora inicio CC" },
		{ key: "lugar_inicio", label: "Lugar inicio" },
		{ key: "hora_termino", label: "Hora término" },
		{ key: "hora_termino_cc", label: "Hora término CC" },
		{ key: "termino_modulo", label: "Término módulo" },
		{ key: "lugar_termino_cc", label: "Lugar término CC" }
	];
	const operador = (data.operadores_servicios || []).find((op: any) => Number(op.turno) === turno);
	if (!operador) return null;

	// Estado para saber si hay registros en caseta (capturado/no-capturado)
	const [casetaCaptura, setCasetaCaptura] = useState<'capturado' | 'no-capturado' | null>(null);

	React.useEffect(() => {
		// Solo busca si hay operador y económico y periodo válido
		const eco = data.economico;
		const op_cred = operador.operador;
		if (!eco || !op_cred || !periodo?.fecha_inicio || !periodo?.fecha_fin) {
			setCasetaCaptura(null);
			return;
		}
		// Consulta registros de caseta para ese operador y eco en el rango de fechas
		getCasetaRegistros({
			fecha_inicio: periodo.fecha_inicio,
			fecha_fin: periodo.fecha_fin,
			eco,
			op_cred,
			tipo: 1
		}).then(registros => {
			// Si hay al menos un registro, se considera capturado
			setCasetaCaptura(registros.length > 0 ? 'capturado' : 'no-capturado');
		});
	}, [data.economico, operador.operador, periodo]);

	return (
		<div key={turno} style={{ marginBottom: 32 }}>
			<div style={{ fontWeight: 600, marginBottom: 8 }}>
				Turno {turno} — Operador: {operador.operador} — Descansos: {Array.isArray(operador.descansos) ? operador.descansos.join(', ') : '-'}
			</div>
			<div style={{ display: 'flex', gap: 16 }}>
				{dias.map(dia => {
					const horario = (data.horarios || []).find((h: any) => h.turno === turno && h.dias_servicios === dia);
					return (
						<table key={dia} style={{ width: 260, borderCollapse: 'collapse', fontSize: 13, marginBottom: 0 }}>
							<thead>
								<tr style={{ background: '#f7f7f7' }}>
									<th colSpan={encabezados.length} style={{ border: '1px solid #eee', padding: 6, textAlign: 'center' }}>{dia}</th>
								</tr>
								<tr>
									{encabezados.map(e => (
										<th key={e.key} style={{ border: '1px solid #eee', padding: 6 }}>{e.label}</th>
									))}
								</tr>
							</thead>
							<tbody>
								<tr>
									{encabezados.map(e => (
										<td key={e.key} style={{ border: '1px solid #eee', padding: 6 }}>{horario ? (horario[e.key] ?? '-') : '-'}</td>
									))}
								</tr>
							</tbody>
						</table>
					);
				})}
			</div>
			{/* Indicador de captura caseta debajo de la tabla */}
			<div style={{ marginTop: 8, textAlign: 'center', fontWeight: 600 }}>
				{casetaCaptura === 'capturado' && <span style={{ color: '#43a047' }}>Capturado en caseta</span>}
				{casetaCaptura === 'no-capturado' && <span style={{ color: '#d32f2f' }}>No capturado en caseta</span>}
				{casetaCaptura === null && <span style={{ color: '#888' }}>Sin información de caseta</span>}
			</div>
		</div>
	);
};

// Modal para mostrar el detalle de servicio/cubredescanso/jornada
const ModalGlosario: React.FC<{ open: boolean, onClose: () => void, data: any, tipo: string, periodo: any }> = ({ open, onClose, data, tipo, periodo }) => {
	if (!open) return null;
	const turnos = [1, 2, 3];
	return (
		<div style={{
			position: 'fixed',
			top: 0, left: 0, right: 0, bottom: 0,
			background: 'rgba(0,0,0,0.25)',
			zIndex: 9999,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<div style={{
				background: '#fff',
				borderRadius: 8,
				padding: 24,
				minWidth: 900,
				maxWidth: 1400,
				boxShadow: '0 2px 24px 0 rgba(0, 255, 42, 0.25)',
				border: '2px solid #3c873fff',
				position: 'relative'
			}}>
				<button
					onClick={onClose}
					aria-label="Cerrar"
					style={{
						position: 'absolute',
						top: 12,
						right: 16,
						background: 'transparent',
						border: 'none',
						fontSize: 22,
						fontWeight: 700,
						color: '#43a047',
						cursor: 'pointer',
						lineHeight: 1
					}}
				>
					&#10005;
				</button>
				<div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18, textAlign: 'center' }}>
					{tipo === 'servicio' && 'Detalle de Servicio'}
					{tipo === 'cubredescanso' && 'Detalle de Cubredescanso'}
					{tipo === 'jornada' && 'Detalle de Jornada'}
				</div>
				{tipo === 'servicio' ? (
					<>
						<div style={{ marginBottom: 12, textAlign: 'center' }}>
							<strong>ID:</strong> {data.id} &nbsp;
							<strong>Económico:</strong> {data.economico} &nbsp;
							<strong>Sistema:</strong> {data.sistema}
						</div>
						{turnos.map(turno => (
							<TablasTurno key={turno} data={data} turno={turno} periodo={periodo} />
						))}
					</>
				) : (
					<pre style={{ fontSize: 13, background: '#f7f7f7', padding: 12, borderRadius: 6, maxHeight: 300, overflow: 'auto' }}>
						{JSON.stringify(data, null, 2)}
					</pre>
				)}
			</div>
		</div>
	);
};

// Componente principal para visualizar roles cargados y su glosario
export const RolesCargados: React.FC<RolesCargadosProps> = ({ periodo }) => {
	// ...documentación: se usan hooks personalizados para obtener roles y lógica de filtrado...
	const { roles, loading, error, fetchRoles } = useRolesCargados();
	const {
		filter, setFilter,
		rolesPorModuloFiltrados,
		resumenRol,
		limpiarNotas
	} = useRolesFiltrados(roles);

	const [openModulo, setOpenModulo] = useState<number | null>(null);
	const [expandedRole, setExpandedRole] = useState<number | null>(null);
	const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);

	// Estado para modal glosario
	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState<any>(null);
	const [modalTipo, setModalTipo] = useState<string>('');

	useEffect(() => {
		if (periodo && periodo.id) {
			fetchRoles(periodo.id);
		}
	}, [periodo]);

	const toggleModulo = (m: number) => setOpenModulo(openModulo === m ? null : m);
	const toggleRole = (id: number) => setExpandedRole(expandedRole === id ? null : id);

	// Funciones para abrir/cerrar el modal glosario
	const abrirModalGlosario = (data: any, tipo: string) => {
		setModalData(data);
		setModalTipo(tipo);
		setModalOpen(true);
	};

	const cerrarModalGlosario = () => {
		setModalOpen(false);
		setModalData(null);
		setModalTipo('');
	};

	return (
		<div style={{ flex: 1, width: '100%', maxWidth: 1300, margin: '0 auto' }}>
			<h2>Roles cargados por módulo</h2>
			{/* Filtro activo */}
			{filter && (
				<div style={{ marginBottom: 12 }}>
					<div>Filtrando por: <strong>{filter.kind}</strong> — <code>{String(filter.value)}</code> <button onClick={() => setFilter(null)} style={{ marginLeft: 8 }}>Limpiar</button></div>
				</div>
			)}
			{error && <div style={{ color: 'red' }}>Error: {String(error)}</div>}
			{loading && <div style={{ color: '#61895e' }}>Cargando roles...</div>}
			{MODULOS.map((m) => (
				<div key={m} style={{ marginBottom: 16, border: '1px solid #ddd', borderRadius: 8 }}>
					<div
						onClick={() => toggleModulo(m)}
						style={{
							cursor: 'pointer',
							background: '#f0f4f2',
							padding: '12px 16px',
							fontWeight: 700,
							borderRadius: '8px 8px 0 0',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<div>Módulo {m}</div>
						<div style={{ fontSize: 12, color: '#666' }}>{rolesPorModuloFiltrados(m).length} roles</div>
					</div>
					{openModulo === m && (
						<div style={{ padding: 12, background: '#fff' }}>
							{/* Glosario del módulo: servicios / cubredescansos / jornadas */}
							{rolesPorModuloFiltrados(m).length === 0 ? (
								<div style={{ color: '#888' }}>Sin datos cargados para este módulo.</div>
							) : (
								<div style={{ display: 'grid', gap: 12 }}>
									{rolesPorModuloFiltrados(m).map((r: any) => (
										<div
											key={r.id}
											style={{
												border: '1px solid #eee',
												borderRadius: 6,
												padding: 12,
												boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
											}}
										>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<div>
													<strong>
														{r.Ruta?.ruta || `Rol #${r.id}`}
													</strong>
													{r.Ruta &&
														<div style={{ color: '#666', fontSize: 13 }}>
															{r.Ruta.origen} - {r.Ruta.destino}
														</div>
													}
													{!r.Ruta &&
														<div style={{ color: '#666', fontSize: 13 }}>
															{r.ruta ? `Ruta: ${r.ruta}` : 'Sin ruta'}
														</div>
													}
												</div>
												<div style={{ textAlign: 'right' }}>
													<div style={{ fontSize: 13, color: '#444' }}>{resumenRol(r)}</div>
													<div style={{ marginTop: 8 }}>
														<button
															onClick={() => toggleRole(r.id)}
															style={{
																padding: '6px 10px',
																borderRadius: 6,
																border: '1px solid #ccc',
																background: expandedRole === r.id ? '#e8f5e9' : '#fff',
																cursor: 'pointer'
															}}
														>
															{expandedRole === r.id ? 'Ocultar detalles' : 'Ver detalles'}
														</button>
													</div>
												</div>
											</div>
											{expandedRole === r.id && (
												<div style={{ marginTop: 12, borderTop: '1px dashed #eee', paddingTop: 12 }}>
													<div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
														{/* Columna izquierda: Glosario */}
														<div style={{ minWidth: 660, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
															<div style={{ minWidth: 180 }}>
																<strong style={{ display: 'block', marginBottom: 4 }}>Servicios ({(r.servicios || []).length})</strong>
																<div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
																	{(r.servicios || []).map((s: any, i: number) => {
																		const key = s.economico ? String(s.economico) : String(s.id || i);
																		return (
																			<button key={key} onClick={() => abrirModalGlosario(s, 'servicio')}
																				style={{ textAlign: 'left', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
																				{s.economico ? `Economico ${s.economico}` : s.sistema || `Servicio ${s.id || i}`}
																			</button>
																		);
																	})}
																</div>
															</div>
															<div style={{ minWidth: 180 }}>
																<strong style={{ display: 'block', marginBottom: 4 }}>Cubredescansos ({(r.cubredescansos || []).length})</strong>
																<div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
																	{(r.cubredescansos || []).map((c: any, i: number) => {
																		const key = c.economico ? String(c.economico) : String(c.id || i);
																		return (
																			<button key={key} onClick={() => abrirModalGlosario(c, 'cubredescanso')}
																				style={{ textAlign: 'left', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
																				{c.economico || c.sistema || `Cub ${c.id || i}`}
																			</button>
																		);
																	})}
																</div>
															</div>
															<div style={{ minWidth: 180 }}>
																<strong style={{ display: 'block', marginBottom: 4 }}>Jornadas Excepcionales({(r.jornadas_excepcionales || []).length})</strong>
																<div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
																	{(r.jornadas_excepcionales || []).map((j: any, i: number) => {
																		const key = j.operador ? String(j.operador) : String(j.id || i);
																		return (
																			<button key={key} onClick={() => abrirModalGlosario(j, 'jornada')}
																				style={{ textAlign: 'left', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
																				{j.operador || j.lugar || `Jornada ${j.id || i}`}
																			</button>
																		);
																	})}
																</div>
															</div>
														</div>
														{/* Columna derecha: Notas */}
														<div style={{ minWidth: 320, maxWidth: 600 }}>
															{r.notas && (
																<div>
																	<strong style={{ display: 'block', marginBottom: 4 }}>Notas:</strong>
																	<div
																		style={{
																			whiteSpace: 'pre-wrap',
																			color: '#333',
																			marginTop: 0,
																			textAlign: 'left',
																			fontSize: 14,
																			lineHeight: 1.5
																		}}
																	>
																		{limpiarNotas(r.notas)}
																	</div>
																</div>
															)}
														</div>
													</div>
													{/* Modal glosario */}
													<ModalGlosario open={modalOpen} onClose={cerrarModalGlosario} data={modalData} tipo={modalTipo} periodo={periodo} />
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			))}
		</div>
	);
}