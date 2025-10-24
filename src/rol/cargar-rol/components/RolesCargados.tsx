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

	const [casetaCaptura, setCasetaCaptura] = useState<'capturado' | 'no-capturado' | null>(null);
	const [casetaRegistros, setCasetaRegistros] = useState<any[]>([]);

	React.useEffect(() => {
		const eco = data.economico;
		const op_cred = operador.operador;
		if (!eco || !op_cred || !periodo?.fecha_inicio || !periodo?.fecha_fin) {
			setCasetaCaptura(null);
			setCasetaRegistros([]);
			return;
		}
		getCasetaRegistros({
			fecha_inicio: periodo.fecha_inicio,
			fecha_fin: periodo.fecha_fin,
			eco,
			op_cred,
			tipo: 1
		}).then(registros => {
			setCasetaCaptura(registros.length > 0 ? 'capturado' : 'no-capturado');
			setCasetaRegistros(registros);
		});
	}, [data.economico, operador.operador, periodo]);

	const descansos = Array.isArray(operador.descansos) ? operador.descansos.map((d: string) => d.trim().toLowerCase()) : [];
	const descansaSabado = descansos.includes('s') || descansos.includes('sábado') || descansos.includes('sabado');
	const descansaDomingo = descansos.includes('d') || descansos.includes('domingo');

	// Helper para obtener día de la semana en español
	const getDiaSemana = (fecha: string) => {
		const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		const d = new Date(fecha);
		return dias[d.getDay()];
	};

	// Helper para comparar hora de salida vs hora inicio (tolerancia 5 minutos, amarillo hasta 20 min, rojo después)
	const compararHoraSalida = (horaInicio: string, momento: string) => {
		if (!horaInicio || !momento) return { status: 'sin-dato', minutos: null };
		const fechaSalida = new Date(momento);
		const horaInicioArr = horaInicio.split(':');
		const fechaComparar = new Date(fechaSalida);
		fechaComparar.setHours(Number(horaInicioArr[0]), Number(horaInicioArr[1]), 0, 0);

		const diffMs = fechaSalida.getTime() - fechaComparar.getTime();
		const diffMin = Math.round(diffMs / 60000);

		if (diffMin < -5) return { status: 'adelantado', minutos: diffMin }; // Azul
		if (diffMin <= 5) return { status: 'a-tiempo', minutos: diffMin }; // Verde
		if (diffMin > 5 && diffMin <= 20) return { status: 'retraso-moderado', minutos: diffMin }; // Amarillo
		if (diffMin > 20) return { status: 'retraso', minutos: diffMin }; // Rojo
		return { status: 'sin-dato', minutos: diffMin };
	};

	// Calcular días laborados del periodo (mes completo menos sábados y domingos)
	const getDiasLaborados = () => {
		if (!periodo?.fecha_inicio || !periodo?.fecha_fin) return 0;
		const fechaIni = new Date(periodo.fecha_inicio);
		const fechaFin = new Date(periodo.fecha_fin);

		// Normaliza a año, mes, día
		const y1 = fechaIni.getFullYear(), m1 = fechaIni.getMonth(), d1 = fechaIni.getDate();
		const y2 = fechaFin.getFullYear(), m2 = fechaFin.getMonth(), d2 = fechaFin.getDate();

		let diasLaborados = 0;
		let d = new Date(y1, m1, d1);
		const end = new Date(y2, m2, d2);

		while (d <= end) {
			const dia = d.getDay(); // 0=Domingo, 6=Sábado
			if (dia !== 0 && dia !== 6) {
				diasLaborados++;
			}
			d.setDate(d.getDate() + 1);
		}
		return diasLaborados;
	};

	// Contar días únicos con registro en caseta
	const getDiasCumplidos = () => {
		const diasUnicos = new Set(
			casetaRegistros.map(reg => {
				const fecha = new Date(reg.momento);
				fecha.setHours(0,0,0,0);
				return fecha.getTime();
			})
		);
		return diasUnicos.size;
	};

	const diasLaborados = getDiasLaborados();
	const diasCumplidos = getDiasCumplidos();
	const porcentaje = diasLaborados > 0 ? Math.round((diasCumplidos / diasLaborados) * 100) : 0;

	return (
		<div key={turno} style={{ marginBottom: 32 }}>
			<div style={{ fontWeight: 600, marginBottom: 8 }}>
				Turno {turno} — Operador: {operador.operador} — Descansos: {Array.isArray(operador.descansos) ? operador.descansos.join(', ') : '-'}
				{diasLaborados > 0 && (
					<span style={{ marginLeft: 16, fontWeight: 400, color: '#1976d2', fontSize: 15 }}>
						Cumplimiento: <b>{porcentaje}%</b> ({diasCumplidos}/{diasLaborados} días)
					</span>
				)}
			</div>
			{/* Centralizar tablas aunque falte alguna */}
			<div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
				{dias.map(dia => {
					if (
						(dia === "Sabado" && descansaSabado) ||
						(dia === "Domingo" && descansaDomingo)
					) {
						return null;
					}
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
			{/* Indicador de captura caseta debajo de las tablas de horarios */}
			<div style={{ marginTop: 8, textAlign: 'center', fontWeight: 600 }}>
				{casetaCaptura === 'capturado' && <span style={{ color: '#43a047' }}>Capturado en caseta</span>}
				{casetaCaptura === 'no-capturado' && <span style={{ color: '#d32f2f' }}>No capturado en caseta</span>}
				{casetaCaptura === null && <span style={{ color: '#888' }}>Sin información de caseta</span>}
			</div>
			{/* Segunda tabla: registros de caseta, abajo y con formato solicitado */}
			{casetaRegistros.length > 0 && (
				<div style={{ marginTop: 16 }}>
					<table style={{ width: 800, borderCollapse: 'collapse', fontSize: 13, background: '#f9f9f9', margin: '0 auto' }}>
						<thead>
							<tr style={{ background: '#f7f7f7' }}>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Día</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Fecha</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Hora salida</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Ruta</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Ruta modalidad</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>Turno</th>
								<th style={{ border: '1px solid #eee', padding: 6 }}>¿Salió a tiempo?</th>
							</tr>
						</thead>
						<tbody>
							{casetaRegistros.map((reg, idx) => {
								const fechaObj = reg.momento ? new Date(reg.momento) : null;
								const diaSemana = fechaObj ? getDiaSemana(reg.momento) : '-';
								const fecha = fechaObj ? fechaObj.toLocaleDateString() : '-';
								const horaSalida = fechaObj ? fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

								// Buscar horario de ese día
								let horarioDia = null;
								if (diaSemana === 'Domingo') {
									horarioDia = (data.horarios || []).find((h: any) => h.turno === turno && h.dias_servicios === 'Domingo');
								} else if (diaSemana === 'Sabado' || diaSemana === 'Sábado') {
									horarioDia = (data.horarios || []).find((h: any) => h.turno === turno && h.dias_servicios === 'Sabado');
								} else {
									horarioDia = (data.horarios || []).find((h: any) => h.turno === turno && h.dias_servicios === 'Lunes a Viernes');
								}
								const horaInicio = horarioDia ? horarioDia.hora_inicio : null;
								const comparacion = compararHoraSalida(horaInicio, reg.momento);

								let color = '#888';
								let texto = 'Sin dato';
								if (comparacion.status === 'a-tiempo') {
									color = '#43a047'; // Verde
									texto = 'A tiempo';
								} else if (comparacion.status === 'retraso-moderado') {
									color = '#fbc02d'; // Amarillo
									texto = `Retraso moderado (${comparacion.minutos} min)`;
								} else if (comparacion.status === 'retraso') {
									color = '#d32f2f'; // Rojo
									texto = `Retraso (${comparacion.minutos} min)`;
								} else if (comparacion.status === 'adelantado') {
									color = '#1976d2'; // Azul
									texto = `Adelantado (${comparacion.minutos} min)`;
								}

								return (
									<tr key={idx}>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{diaSemana}</td>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{fecha}</td>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{horaSalida}</td>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{reg.ruta || '-'}</td>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{reg.ruta_modalidad || '-'}</td>
										<td style={{ border: '1px solid #eee', padding: 6 }}>{reg.op_turno || '-'}</td>
										<td style={{ border: '1px solid #eee', padding: 6, color, fontWeight: 600 }}>{texto}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
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
				width: '90vw',
				maxHeight: '90vh',
				overflowY: 'auto', // Habilita scroll vertical interno
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