import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logoCdmx } from "../../utils/logos";

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

/************************* HEADER ******************************/
function agregarHeader(doc: jsPDF) {
    // LOGO Y TEXTO ENCABEZADO
    doc.addImage(logoCdmx, "JPEG", 9, 2, 80, 20);
    doc.setFontSize(7.8);
    const subtitle = "RED DE TRANSPORTE DE PASAJEROS DE LA CIUDAD DE MEXICO\nDIRECCION EJECUTIVA DE OPERACION Y MANTENIMIENTO\nGERENCIA DE OPERACION DEL SERVICIO";
    const x = doc.internal.pageSize.getWidth() - 101;
    let y = 8;
    const lines = subtitle.split('\n');
    doc.setFont("helvetica", "bold");
    doc.text(lines[0], x, y, { align: "left" });
    doc.setFont("helvetica", "normal");
    const lineHeight = 4;
    for (let i = 1; i < lines.length; i++) {
        y += lineHeight;
        doc.text(lines[i], x, y, { align: "left" });
    }

    // TITULO PRINCIPAL
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(
        "CONTROL DE SALIDAS DE AUTOBUSES",
        pageWidth / 2,
        28,
        { align: "center" }
    );

    const fechaHoy = new Date();
    const dia = String(fechaHoy.getDate()).padStart(2, "0");
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, "0");
    const anio = fechaHoy.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    // FECHA
    doc.setFontSize(7);
    doc.text(
        "FECHA: " + fechaFormateada,
        doc.internal.pageSize.getWidth() - 13,
        35,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");
}

/*************************************  FUNCION QUE CREA LAS TABLAS DEL PDF **********************************/
export const RepSalidas = () => {
    const TestData = [
        [23321, 12, 2365, "12:12", "23:13", "Observación 1skdjaskljdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssskladjsklajdskladjskladjsklajdsklajdsklajdsklajdskladjsklajdsklajdskladjaskldjsakldjsakldjsakljdsklajdsklajdsklajdsklajsklajsjklad"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1skdjaskljdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssskladjsklajdskladjskladjsklajdsklajdsklajdsklajdskladjsklajdsklajdskladjaskldjsakldjsakldjsakljdsklajdsklajdsklajdsklajsklajsjklad"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1skdjaskljdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssskladjsklajdskladjskladjsklajdsklajdsklajdsklajdskladjsklajdsklajdskladjaskldjsakldjsakldjsakljdsklajdsklajdsklajdsklajsklajsjklad"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],
        [23322, 12, 2366, "12:13", "23:14", "Observación 2"],
        [23321, 12, 2365, "12:12", "23:13", "Observación 1"],

    ];

    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait"
    });
    const startY = 42;

    (doc as any).autoTable({
        startY: startY,
        head: [
            [
                {
                    content: "SALIDAS DE AUTOBUSES",
                    colSpan: 6,
                    styles: {
                        halign: 'center',
                        fontSize: 9,
                        fontStyle: 'bold',
                        cellPadding: 3
                    }
                }
            ],
            [
                "N.ECONOMICO", "TURNO", "CREDENCIAL",
                "HOR DE PRE", "SALIDA REAL", "OBSERVACIONES"
            ]
        ],
        body: TestData,
        // Estilos generales
        styles: {
            fontSize: 8,
            cellPadding: 1.5,
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            overflow: 'linebreak',
            textColor: [0, 0, 0]
        },

        headStyles: {
            fillColor: 255,
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 7,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            cellPadding: 2
        },
        columnStyles: {
            0: { // N.ECONOMICO
                cellWidth: 25,
                halign: 'center'
            },
            1: { // TURNO
                cellWidth: 25,
                halign: 'center'
            },
            2: { // CREDENCIAL
                cellWidth: 25,
                halign: 'center'
            },
            3: { // HOR DE PRE
                cellWidth: 25,
                halign: 'center'
            },
            4: { // SALIDA REAL
                cellWidth: 25,
                halign: 'center'
            },
            5: { // OBSERVACIONES -
                cellWidth: 65,
                halign: 'center',
                valign: 'top',
                fontSize: 8,
                fontStyle: 'normal',
                cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
                minCellHeight: 8 // Altura mínima para celdas con texto
            }
        },
        // CONFIGURACIONES CLAVE PARA PAGINACIÓN AUTOMÁTICA
        pageBreak: 'auto', // Auto-detecta cuándo hacer saltos de página
        rowPageBreak: 'avoid', // Evita dividir una fila entre dos páginas
        showHead: 'everyPage', // Muestra el encabezado en cada página
        margin: {
            top: startY, // Margen superior igual al startY
            bottom: 20,  // Margen inferior para pie de página
            left: 10,
            right: 10
        },
        tableWidth: 'auto',
        // Hook para procesar cada celda
        didParseCell: function (data: any) {
            // Procesar encabezados multilínea
            if (data.section === 'head') {
                const raw = data.cell.raw;
                if (typeof raw === 'string') {
                    data.cell.text = raw.split('\n');
                }
            }

            if (data.section === 'body' && data.column.index === 5) {
                const texto = String(data.cell.raw);
                data.cell.styles.overflow = 'linebreak';
                if (texto.length > 100) {
                    data.cell.styles.minCellHeight = 12;
                }
                if (texto.length > 200) {
                    data.cell.styles.minCellHeight = 16;
                }
            }
            if (data.section === 'body') {
                if (typeof data.cell.raw !== 'string') {
                    data.cell.text = String(data.cell.raw);
                }
            }
        },
        didDrawPage: function (data: any) {
            agregarHeader(doc);
        },
        didDrawCell: function (data: any) {
        }
    });


    window.open(doc.output("bloburl"), "_blank");
};