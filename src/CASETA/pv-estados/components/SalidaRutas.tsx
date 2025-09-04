import React, { useState, useContext, useRef} from 'react'
import { TablaCRUD } from '../../../shared/components/Tabla'
import { Button } from 'primereact/button'
import { useForm } from 'react-hook-form'
import { MiniFormMaker } from '../../../shared/components/FormMaker/MiniFormMaker'
import { GeneralContext } from '../../../shared/GeneralContext'
import { getReporteEcosBitacora } from '../../reportes/utilities/busesBitacora';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart } from 'primereact/chart';
import { ViewPV } from '../../reportes/utilities/viewPV'; 


// Interfaz para el formulario
interface FormFilters {
    fecha_ini: Date
    fecha_fin: Date
    modulo?: number
    ruta?: { nombre: string }
}



// Define las columnas de tu tabla
const columnas = [
    { field: 'id', header: '#' },
    { field: 'ruta', header: 'Rutas' },
    // { field: '', header: 'Descripción de Ruta' },
    { field: 'modalidad', header: 'Modalidad' },
    { field: 'total_salidas', header: 'Total de Economicos' },
]

const modulos = [
    { name: 'GENERAL', value: 0 },
    { name: 'MÓDULO 1', value: 1 },
    { name: 'MÓDULO 2', value: 2 },
    { name: 'MÓDULO 3', value: 3 },
    { name: 'MÓDULO 4', value: 4 },
    { name: 'MÓDULO 5', value: 5 },
    { name: 'MÓDULO 6', value: 6 },
    { name: 'MÓDULO 7', value: 7 },
]

export const SalidaRutas = () => {
    // Estado para el módulo seleccionado en la gráfica general
    const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(null);
    const chartRef = useRef<any>(null);
    const [data, setData] = useState<(TableData & { id: number, detalles?: any[] })[]>([]);
    const [detallesRuta, setDetallesRuta] = useState<any[]>([]);
    const [showDetalles, setShowDetalles] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [filtrosActuales, setFiltrosActuales] = useState<FormFilters | null>(null);
    const [selectKey, setSelectKey] = useState(0);
    const form = useForm<FormFilters>();
    const { OPTS_RUTA } = useContext(GeneralContext);

    // Nuevo estado para los datos de la tercera función
    const [terceraFuncionData, setTerceraFuncionData] = useState<any[]>([]);
    const [loadingTercera, setLoadingTercera] = useState(false);


    // Función para exportar todas las gráficas visibles a PDF
    const exportarGraficaPDF = async () => {
        // Selecciona todas las gráficas visibles
        const graficas = document.querySelectorAll('.mi-grafica, .grafica-extra');
        if (graficas.length === 0) return;

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [900, 600]
        });

        let y = 30;
        let titulo = '';
        if (filtrosActuales) {
            const moduloSeleccionado = filtrosActuales.modulo;
            const moduloObj = modulos.find(m => m.value === moduloSeleccionado);
            const moduloTexto = moduloObj ? moduloObj.value : '';
            const fechaIni = filtrosActuales.fecha_ini ? filtrosActuales.fecha_ini.toLocaleDateString() : '';
            const fechaFin = filtrosActuales.fecha_fin ? filtrosActuales.fecha_fin.toLocaleDateString() : '';
            titulo = `Total de salidas en módulo ${moduloTexto} de fecha ${fechaIni}${fechaFin ? ' a ' + fechaFin : ''}`;
            pdf.setFontSize(18);
            pdf.text(titulo, 20, y);
            y += 20;
        }

        for (let i = 0; i < graficas.length; i++) {
            const grafica = graficas[i] as HTMLElement;
            const canvas = await html2canvas(grafica);
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 20, y, canvas.width * 0.7, canvas.height * 0.7);
            y += canvas.height * 0.7 + 30;
            // Si hay más gráficas, agrega una nueva página si se pasa del tamaño
            if (i < graficas.length - 1 && y + 300 > pdf.internal.pageSize.getHeight()) {
                pdf.addPage();
                y = 30;
            }
        }
        pdf.save('grafica_salidas.pdf');
    };


    // Función para manejar el envío del formulario usando getReporteEcosBitacora
    const onSubmit = async (formData: FormFilters) => {
        setLoading(true)
        try {
            if (formData.fecha_ini) formData.fecha_ini.setHours(0, 0, 0, 0);
            if (formData.fecha_fin) formData.fecha_fin.setHours(23, 59, 59, 999);
            const res = await getReporteEcosBitacora({
                dates: [formData.fecha_ini, formData.fecha_fin],
                modulo: formData.modulo!,
                tipo: [1],
                eco: undefined,
                cred: undefined,
                ruta: formData.ruta ? formData.ruta.nombre : undefined,
                motivo: undefined
            })
            let dataAgrupada: (TableData & { id: number, modulo?: number })[] = [];
            // Filtrar por motivo y modalidad para ambos filtros
            const filtrados = res.data.filter(reg => reg.motivo1 === 'SERVICIO' && reg.modalidad1 !== 'METROBÚS');
            if (formData.modulo === 0) {
                // Agrupar por modulo
                const agrupadoModulo: { [modulo: string]: any[] } = {};
                filtrados.forEach(reg => {
                    const modulo = reg.modulo;
                    if (modulo !== undefined && modulo !== null && modulo !== '') {
                        if (!agrupadoModulo[modulo]) agrupadoModulo[modulo] = [];
                        agrupadoModulo[modulo].push(reg);
                    }
                });
                // Asegurar que siempre estén los 7 módulos
                const modulosBase = [1,2,3,4,5,6,7];
                dataAgrupada = modulosBase.map((modulo, idx) => {
                    const registros = agrupadoModulo[modulo] || [];
                    return {
                        id: idx + 1,
                        ruta: `Módulo ${modulo}`,
                        modalidad: registros[0]?.modalidad1 || '',
                        modulo: Number(modulo),
                        total_salidas: registros.length,
                        detalles: registros
                    };
                });
            } else {
                // Agrupar por ruta
                const agrupado: { [ruta: string]: any[] } = {};
                filtrados.forEach(reg => {
                    const ruta = reg.ruta1;
                    if (ruta) {
                        if (!agrupado[ruta]) agrupado[ruta] = [];
                        agrupado[ruta].push(reg);
                    }
                });
                dataAgrupada = Object.entries(agrupado).map(([ruta, registros], idx) => ({
                    id: idx + 1,
                    ruta,
                    modalidad: registros[0].modalidad1,
                    modulo: registros[0].modulo,
                    total_salidas: registros.length,
                    detalles: registros
                }));
            }
            setData(dataAgrupada)
            setError('')
            setBusquedaRealizada(true)
            setFiltrosActuales({ ...formData })
            form.reset()
            setSelectKey(k => k + 1)
        } catch (error) {
            console.error('Error al cargar datos:', error)
            setError('Error al cargar los datos')
            setData([])
            setBusquedaRealizada(true)
        } finally {
            setLoading(false)
        }
    }

    // Nueva función para consumir la otra API
    const obtenerDatosTerceraFuncion = async (modulo: number) => {
        setLoadingTercera(true);
        try {
            const res = await ViewPV(modulo);
            // Filtra todos los elementos que cumplen la condición
            const filtrados = (res.data || []).filter(item => item.estado_fisico == 1);
            setTerceraFuncionData(filtrados);
        } catch (err) {
            setTerceraFuncionData([]);
        } finally {
            setLoadingTercera(false);
        }
    };


    return (
        <div className="card">

            <h2 className='text-center'>Salidas por Ruta</h2>

            {/* Formulario de filtros */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex-center gap-3 mt-5'>
                <MiniFormMaker
                    form={form}
                    inputs={[
                        {
                            name: 'modulo',
                            label: 'Módulo',
                            type: 'select',
                            options: modulos,
                            rules: { required: 'Selecciona un módulo' }
                        },
                        {
                            name: 'fecha_ini',
                            label: 'Fecha inicial',
                            type: 'calendar',
                            showButtonBar: true,
                            rules: { required: 'Selecciona una fecha inicial' }
                        },
                        {
                            name: 'fecha_fin',
                            label: 'Fecha final',
                            type: 'calendar',
                            showButtonBar: true
                        },
                        {
                            name: 'ruta',
                            label: 'Ruta',
                            type: 'select',
                            options: OPTS_RUTA,
                            filter: true,
                            key: selectKey
                        },
                    ]}
                />

                <div className='w-12 flex-center'>
                    <Button
                        type='submit'
                        label='Buscar'
                        icon='pi pi-search'
                        loading={loading}
                        rounded
                    />
                </div>
            </form>


            {error ? (
                <div className="text-red-500 text-center p-3">{error}</div>
            ) : (
                busquedaRealizada && data.length > 0 && (
                    <>
                        {/* Título descriptivo dinámico */}
                        <h3 className="text-center mb-4">
                            {(() => {
                                if (!filtrosActuales) return '';
                                const fechaIni = filtrosActuales.fecha_ini ? filtrosActuales.fecha_ini.toLocaleDateString() : '';
                                if (filtrosActuales.modulo === 0) {
                                    return `Total de económicos en salida a nivel general al día de ${fechaIni}`;
                                }
                                const moduloSeleccionado = filtrosActuales.modulo;
                                const moduloObj = modulos.find(m => m.value === moduloSeleccionado);
                                const moduloTexto = moduloObj ? moduloObj.value : '';
                                const fechaFin = filtrosActuales.fecha_fin ? filtrosActuales.fecha_fin.toLocaleDateString() : '';
                                return `Total de salidas en módulo ${moduloTexto} de fecha ${fechaIni}${fechaFin ? ' a ' + fechaFin : ''}`;
                            })()}
                        </h3>
                        {/* Botón para exportar la gráfica a PDF */}
                        <div className="flex justify-content-end mb-2">
                            <Button label="Exportar gráfica a PDF" icon="pi pi-file-pdf" onClick={exportarGraficaPDF} size="small" />
                        </div>
                        {/* Gráfica de barras */}
                        {filtrosActuales?.modulo === 0 ? (
                            <>
                                <Chart
                                    ref={chartRef}
                                    type="bar"
                                    data={{
                                        labels: data.map((d, idx) => `Módulo ${d.modulo ?? d.ruta}`),
                                        datasets: [
                                            {
                                                label: 'Total por Módulo',
                                                data: data.map(d => d.total_salidas),
                                                backgroundColor: '#42A5F5',
                                                // Agregar valores extra del 1 al 7 (asumiendo que hay 7 barras) 
                                                extraValues: [1,2,3,4,5,6,7].slice(0, data.length)
                                            }
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: false }
                                        },
                                        scales: {
                                            x: { title: { display: true, text: 'Módulo' } },
                                            y: { title: { display: true, text: 'Total de Económicos' }, beginAtZero: true }
                                        }
                                    }}
                                    className="mb-5 mi-grafica"
                                    style={{ maxWidth: '800px', margin: '0 auto' }}
                                    onClick={(event: any) => {
                                        const chartInstance = chartRef.current?.getChart?.() || chartRef.current?.chart;
                                        if (chartInstance) {
                                            // Usar el método correcto para Chart.js v3+
                                            const points = chartInstance.getElementsAtEventForMode(
                                                event.nativeEvent,
                                                'nearest',
                                                { intersect: true },
                                                false
                                            );
                                            if (points && points.length > 0) {
                                                const idx = points[0].index;
                                                const extraValue = chartInstance.data.datasets[0].extraValues[idx];
                                                setModuloSeleccionado(extraValue);
                                                // Llamar la tercera función al hacer clic
                                                obtenerDatosTerceraFuncion(extraValue);
                                            }
                                        }
                                    }}
                                />
                                {/* Subtítulo del total general debajo de la gráfica */}
                                <div className="text-center mb-3" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Total de Salidas de Económicos en General: {data.reduce((acc, curr) => acc + curr.total_salidas, 0)}
                                </div>
                            </>
                        ) : (
                            <Chart
                                ref={chartRef}
                                type="bar"
                                data={{
                                    labels: data.map(d => d.ruta),
                                    datasets: [
                                        {
                                            label: 'Total de Económicos',
                                            data: data.map(d => d.total_salidas),
                                            backgroundColor: '#42A5F5'
                                        }
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: false }
                                    },
                                    scales: {
                                        x: { title: { display: true, text: 'Ruta' } },
                                        y: { title: { display: true, text: 'Total de Económicos' }, beginAtZero: true }
                                    }
                                }}
                                className="mb-5 mi-grafica"
                                style={{ maxWidth: '800px', margin: '0 auto' }}
                            />
                        )}

                        {/* Segunda gráfica por rutas del módulo seleccionado */}
                        {moduloSeleccionado !== null && filtrosActuales?.modulo === 0 && (
                            <div className="mt-5" style={{ display: 'flex', justifyContent: 'flex-start', gap: '2rem' }}>
                                <div style={{ width: '800px' }}>
                                    {/* Mostrar subtítulo solo si el filtro principal es GENERAL */}
                                    {filtrosActuales?.modulo === 0 && (
                                        <h4 className="text-center mb-3">Salidas por Ruta en Módulo {moduloSeleccionado}</h4>
                                    )}
                                    {/* Agrupar los detalles del módulo seleccionado por ruta */}
                                    {(() => {
                                        // Buscar el objeto del módulo seleccionado
                                        const moduloObj = data.find(d => d.modulo === moduloSeleccionado);
                                        if (!moduloObj || !moduloObj.detalles) return null;
                                        // Agrupar detalles por ruta
                                        const agrupado: { [ruta: string]: any[] } = {};
                                        moduloObj.detalles.forEach((detalle: any) => {
                                            const ruta = detalle.ruta1;
                                            if (!agrupado[ruta]) agrupado[ruta] = [];
                                            agrupado[ruta].push(detalle);
                                        });
                                        const labels = Object.keys(agrupado);
                                        const totals = Object.values(agrupado).map(arr => arr.length);
                                        return (
                                            <>
                                                <Chart
                                                    type="bar"
                                                    data={{
                                                        labels: labels,
                                                        datasets: [
                                                            {
                                                                label: 'Total de Económicos',
                                                                data: totals,
                                                                backgroundColor: '#66BB6A'
                                                            }
                                                        ]
                                                    }}
                                                    options={{
                                                        plugins: {
                                                            legend: { display: false },
                                                            title: { display: false }
                                                        },
                                                        scales: {
                                                            x: { title: { display: true, text: 'Ruta' } },
                                                            y: { title: { display: true, text: 'Total de Económicos' }, beginAtZero: true }
                                                        }
                                                    }}
                                                    className="mb-5 grafica-extra"
                                                    style={{ maxWidth: '800px', height: '400px', marginLeft: 0 }}
                                                />
                                                <div className="text-center mb-3" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Total de Salidas de Económicos en Módulo {moduloSeleccionado}: {totals.reduce((acc, curr) => acc + curr, 0)}
                                                </div>
                                                <div className="flex justify-content-center mb-2">
                                                    <Button label="Cerrar gráfica" icon="pi pi-times" size="small" onClick={() => setModuloSeleccionado(null)} />
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                {/* Solo muestra la gráfica de comparación si el filtro principal es GENERAL y hay datos */}
                                {terceraFuncionData.length > 0 && (
                                    <div style={{
                                        maxWidth: '400px',
                                        minWidth: '300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginLeft: 'auto',
                                        marginRight: '12rem'
                                    }}>
                                        <h4 className="text-center mb-2">Comparación Económicos en módulo</h4>
                                        <Chart
                                            type="doughnut"
                                            data={{
                                                labels: [
                                                    'En Ruta',
                                                    'Sin Asignar'
                                                ],
                                                datasets: [
                                                    {
                                                        data: [
                                                            (() => {
                                                                const moduloObj = data.find(d => d.modulo === moduloSeleccionado);
                                                                return moduloObj ? moduloObj.total_salidas : 0;
                                                            })(),
                                                            (() => {
                                                                const totalModulo = terceraFuncionData.length;
                                                                const moduloObj = data.find(d => d.modulo === moduloSeleccionado);
                                                                const totalRuta = moduloObj ? moduloObj.total_salidas : 0;
                                                                return totalModulo - totalRuta;
                                                            })()
                                                        ],
                                                        backgroundColor: [
                                                            '#42A5F5', // En Ruta
                                                            '#FFA726'  // Sin Asignar
                                                        ]
                                                    }
                                                ]
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: { display: true, position: 'bottom' }
                                                }
                                            }}
                                            className="grafica-extra"
                                        />
                                        <div className="text-center mt-2">
                                            <span style={{ fontWeight: 'bold' }}>Total de Económicos en módulo {moduloSeleccionado}: </span>
                                            {terceraFuncionData.length}
                                            <br />
                                            <span style={{ fontWeight: 'bold' }}>Total en Ruta: </span>
                                            {(() => {
                                                const moduloObj = data.find(d => d.modulo === moduloSeleccionado);
                                                return moduloObj ? moduloObj.total_salidas : 0;
                                            })()}
                                            <span style={{ marginLeft: '2rem', fontWeight: 'bold' }}>Total sin asignar: </span>
                                            {(() => {
                                                const totalModulo = terceraFuncionData.length;
                                                const moduloObj = data.find(d => d.modulo === moduloSeleccionado);
                                                const totalRuta = moduloObj ? moduloObj.total_salidas : 0;
                                                return totalModulo - totalRuta;
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {(() => {
                            // Calcular total de económicos
                            const totalSalidas = data.reduce((acc, curr) => acc + curr.total_salidas, 0);
                            // Agregar fila de total
                            const dataConTotal = [
                                ...data,
                                {
                                    id: '',
                                    ruta: 'TOTAL',
                                    total_salidas: totalSalidas,
                                    detalles: []
                                }
                            ];
                            // Columnas para filtro GENERAL
                            const columnasGeneral = [
                                { field: 'id', header: '#' },
                                { field: 'ruta', header: 'Módulos' },
                                { field: 'total_salidas', header: 'Total de Economicos' },
                                {
                                    field: 'detalles',
                                    header: 'Ver detalles',
                                    body: (rowData: any) => (
                                        rowData.ruta !== 'TOTAL' ? (
                                            <Button label="Detalles" icon="pi pi-eye" size="small" onClick={() => {
                                                setDetallesRuta(rowData.detalles);
                                                setShowDetalles(true);
                                            }} />
                                        ) : null
                                    )
                                }
                            ];
                            // Columnas normales
                            const columnasNormales = [
                                ...columnas,
                                {
                                    field: 'detalles',
                                    header: 'Ver detalles',
                                    body: (rowData: any) => (
                                        rowData.ruta !== 'TOTAL' ? (
                                            <Button label="Detalles" icon="pi pi-eye" size="small" onClick={() => {
                                                setDetallesRuta(rowData.detalles);
                                                setShowDetalles(true);
                                            }} />
                                        ) : null
                                    )
                                }
                            ];
                            // Renderizar tabla con columnas según filtro
                            return (
                                <TablaCRUD
                                    data={dataConTotal}
                                    cols={filtrosActuales?.modulo === 0 ? columnasGeneral : columnasNormales}
                                    className='mt-3'
                                    accion={false}
                                    dataTableProps={{
                                        loading: loading,
                                        resizableColumns: true,
                                        rowClassName: (rowData: any) => rowData.ruta === 'TOTAL' ? 'bg-green-100 font-bold' : ''
                                    }}
                                />
                            );
                        })()}
                        {/* Modal de detalles */}
                        {showDetalles && (
                            <div className="p-dialog-mask p-component-overlay p-dialog-visible" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000 }}>
                                <div className="p-dialog p-component" style={{ width: '40vw', margin: '5vh auto', background: '#fff', padding: '2rem', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                                    <Button
                                        icon="pi pi-times"
                                        size="small"
                                        style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}
                                        className='p-button-rounded p-button-text'
                                        onClick={() => setShowDetalles(false)}
                                    />
                                    <h3 className='mb-3 text-center'>
                                        {(() => {
                                            const total = detallesRuta.length;
                                            const modulo = detallesRuta[0]?.modulo ?? '';
                                            const ruta = detallesRuta[0]?.ruta1 || '';
                                            // Obtener todas las fechas únicas de los detalles
                                            const fechasUnicas = Array.from(new Set(detallesRuta.map(row => {
                                                const raw = row.time1 || '';
                                                return raw.split(' ')[0];
                                            }))).filter(f => !!f);
                                            // Ordenar fechas ascendente y limpiar comas
                                            fechasUnicas.sort((a, b) => {
                                                const [da, ma, ya] = a.replace(/,/g, '').split('/');
                                                const [db, mb, yb] = b.replace(/,/g, '').split('/');
                                                const fechaA = new Date(`${ya}-${ma}-${da}`);
                                                const fechaB = new Date(`${yb}-${mb}-${db}`);
                                                return fechaA.getTime() - fechaB.getTime();
                                            });
                                            let fecha1 = (fechasUnicas[0] || '').replace(/,/g, '').trim();
                                            let fecha2 = (fechasUnicas[fechasUnicas.length - 1] || '').replace(/,/g, '').trim();

                                            // Mostrar título según filtro
                                            if (filtrosActuales?.modulo === 0) {
                                                // Por módulo
                                                return `Módulo ${modulo} tuvo un total de ${total} económicos al día de ${fecha1}`;
                                            } else {
                                                // General
                                                if (fecha1 === fecha2) {
                                                    return `Ruta ${ruta} tuvo un total de ${total} económicos el día ${fecha1}`;
                                                } else {
                                                    return `Ruta ${ruta} tuvo un total de ${total} económicos del día ${fecha1} al día ${fecha2}`;
                                                }
                                            }
                                        })()}
                                    </h3>
                                    <TablaCRUD
                                        data={detallesRuta.map((row, idx) => ({
                                            consecutivo: idx + 1,
                                            economico: row.eco1,
                                            operador: row.op_cred1,
                                            fecha_hora: row.time1,
                                            turno: row.op_turno1,
                                            extintor: row.extintor1,
                                            ruta: row.ruta1,
                                            modalidad: row.modalidad1,
                                            CC: row.cc1,
                                            Motivo: row.motivo1,
                                            modulo: row.modulo,
                                        }))}
                                        cols={[
                                            { field: 'consecutivo', header: '#', className: 'text-center' },
                                            { field: 'economico', header: 'Económico', className: 'text-center' },
                                            { field: 'operador', header: 'Operador', className: 'text-center' },
                                            { field: 'fecha_hora', header: 'Fecha/Hora', className: 'text-center' },
                                            { field: 'turno', header: 'Turno', className: 'text-center' },
                                            { field: 'extintor', header: 'Extintor', className: 'text-center' },
                                            { field: 'ruta', header: 'Ruta', className: 'text-center' },
                                            { field: 'modalidad', header: 'Modalidad', className: 'text-center' },
                                            { field: 'CC', header: 'CC', className: 'text-center' },
                                            { field: 'Motivo', header: 'Motivo', className: 'text-center' },
                                            { field: 'modulo', header: 'Modulo', className: 'text-center' },
                                        ]}
                                        accion={false}
                                        className='mt-2'
                                    />
                                </div>
                            </div>
                        )}
                      
                    </>
                )
            )}
        </div>
    )
}

