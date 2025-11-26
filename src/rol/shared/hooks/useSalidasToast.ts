import { useState, useEffect, useRef } from "react";
import { getCasetaRegistros } from "../../shared/services/casetaService";

// Convierte "HH:mm:ss" a minutos desde medianoche
function horaToMinutos(hora: string): number {
    const [h, m, s] = hora.split(":").map(Number);
    return h * 60 + m + (s ? s / 60 : 0);
}

function getDiaSemana(): string {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];
    const hoy = new Date();
    return dias[hoy.getDay()];
}

// Helper: formatea Date a 'YYYY-MM-DD'
function formatFechaISO(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

// Ahora acepta data, opcionalmente periodo y un flag usarHoy
export const useSalidasToast = (data: any[], periodo?: any, usarHoy: boolean = false): { mensajesToast: string[], setMensajesToast: (msgs: string[]) => void } => {
    const [mensajesToast, setMensajesToast] = useState<string[]>([]);

    // Flag para evitar solapamiento y referencia al interval
    const isProcessingRef = useRef<boolean>(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const procesar = async () => {
            if (isProcessingRef.current) return; // ya está en curso
            isProcessingRef.current = true;
            try {
                const ahora = new Date();
                const horaActual = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}:${String(ahora.getSeconds()).padStart(2, "0")}`;
                const minutosActual = horaToMinutos(horaActual);
                const diaActual = getDiaSemana();

                // Map para asegurar un solo registro por económico (clave = economico)
                const economicosMap = new Map<string, { operador: any, ruta: string }>();

                if (!Array.isArray(data)) {
                    setMensajesToast([]);
                    return;
                }

                data.forEach((rol: any) => {
                    if (!rol.servicios || !Array.isArray(rol.servicios)) return;
                    const ruta = rol.RutaModalidade?.ruta?.ruta || '';
                    rol.servicios.forEach((servicio: any) => {
                        if (!servicio.horarios || !Array.isArray(servicio.horarios)) return;

                        const keyEconomico = String(servicio.economico ?? "").trim();
                        // Si ya registramos este económico, saltamos (evita duplicados entre roles/servicios)
                        if (economicosMap.has(keyEconomico)) return;

                        // Buscar operador si existe
                        let operador = null;
                        if (servicio.operadores_servicios && Array.isArray(servicio.operadores_servicios) && servicio.operadores_servicios.length > 0) {
                            operador = servicio.operadores_servicios[0].operador || servicio.operadores_servicios[0].nombre || servicio.operadores_servicios[0].id || null;
                            operador = operador !== null && operador !== undefined ? String(operador).trim() : null;
                        }

                        // Recorre horarios y si alguno cumple la condición, añade al Map y rompe
                        for (const horario of servicio.horarios) {
                            const horaInicio = horario.hora_inicio_turno;
                            const diasServicio = horario.dias_servicios;
                            if (!horaInicio || !diasServicio) continue;

                            const diasLower = String(diasServicio).toLowerCase();
                            const diaCoincide =
                                (diasLower.includes("lunes") && diaActual === "Lunes") ||
                                (diasLower.includes("martes") && diaActual === "Martes") ||
                                (diasLower.includes("miércoles") && diaActual === "Miércoles") ||
                                (diasLower.includes("jueves") && diaActual === "Jueves") ||
                                (diasLower.includes("viernes") && diaActual === "Viernes") ||
                                (diasLower.includes("sábado") && diaActual === "Sabado") ||
                                (diasLower.includes("domingo") && diaActual === "Domingo") ||
                                (diasLower.includes("lunes a viernes") && ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].includes(diaActual));

                            if (!diaCoincide) continue;

                            const minutosInicio = horaToMinutos(horaInicio);
                            if (minutosInicio < minutosActual) {
                                economicosMap.set(keyEconomico, { operador, ruta });
                                break; // un servicio sólo necesita un horario que cumpla
                            }
                        }
                    });
                });

                // Si se requiere usar hoy para la consulta, preparamos la fecha de hoy
                const hoy = new Date();
                const fechaHoyStr = formatFechaISO(hoy);

                // Si periodo válido lo dejamos, pero si usarHoy true, usaremos hoy como inicio/fin
                const periodoValido = periodo && periodo.fecha_inicio && periodo.fecha_fin;

                // Para cada económico en el Map, consultamos caseta (si hay periodo) y filtramos los que NO están capturados
                const mensajes: string[] = [];
                const entries = Array.from(economicosMap.entries());

                for (const [econ, info] of entries) {
                    let capturado = false;
                    if (periodoValido || usarHoy) {
                        try {
                            // construye parámetros condicionalmente para respetar tipos
                            // si usarHoy === true, pedimos solo los registros de hoy
                            const params: any = {
                                fecha_inicio: usarHoy ? fechaHoyStr : periodo.fecha_inicio,
                                fecha_fin: usarHoy ? fechaHoyStr : periodo.fecha_fin,
                                op_cred: info.operador ?? undefined,
                                tipo: 1
                            };
                            // convierte econ (string) a número solo si es válido
                            const ecoNum = parseInt(String(econ).trim(), 10);
                            if (!isNaN(ecoNum)) params.eco = ecoNum;

                            const regs = await getCasetaRegistros(params);
                            if (Array.isArray(regs) && regs.length > 0) capturado = true;
                        } catch (e) {
                            console.error("Error consultando caseta para economico", econ, e);
                        }
                    }

                    // Si NO está capturado, generar mensaje
                    if (!capturado) {
                        mensajes.push(
                            `El económico "${econ}"${info.operador ? ` con el operador "${info.operador}"` : ""} está saliendo tarde en la ruta "${info.ruta}".`
                        );
                    }
                }

                // Deduplicar mensajes (normalizando espacios) antes de actualizar el estado
                const mensajesUnicos = Array.from(new Set(mensajes.map(m => String(m).trim())));
                setMensajesToast(mensajesUnicos);
            } finally {
                isProcessingRef.current = false;
            }
        };

        // Ejecuta inmediatamente la primera vez
        procesar();

        // Programa reconsulta cada 5 minutos (300000 ms)
        // limpia interval previo si existe
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        intervalRef.current = window.setInterval(() => {
            if (!isProcessingRef.current) {
                procesar();
            }
        }, 300000) as unknown as number;

        // Cleanup al desmontar o cuando cambien data/periodo/usarHoy
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            isProcessingRef.current = false;
        };
    }, [data, periodo, usarHoy]);

    return {
        mensajesToast,
        setMensajesToast
    }
}