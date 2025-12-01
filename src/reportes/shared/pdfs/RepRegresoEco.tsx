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
  doc.addImage(logoCdmx, "JPEG", 30, -2, 85, 20);
  doc.setFontSize(8);
  const subtitle = "RED DE TRANSPORTE DE PASAJEROS DE LA CIUDAD DE MEXICO\nDIRECCION EJECUTIVA DE OPERACION Y MANTENIMIENTO\nGERENCIA DE OPERACION DEL SERVICIO";
  const x = doc.internal.pageSize.getWidth() - 101;
  let y = 4;
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
    "CONTROL DE REGRESOS Y REINCORPORACIONES DE AUTOBUSES",
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
    doc.internal.pageSize.getWidth() - 30,
    35,
    { align: "right" }
  );
  doc.setFont("helvetica", "normal");
}
/*************************************  FUNCION QUE CREA LAS TABLAS DEL PDF **********************************/
export const RepRegresoEco = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  agregarHeader(doc);

  const headerHeight = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const edgeMargin = 10;
  const gapBetween = 6;
  const availableWidth = pageWidth - edgeMargin * 2 - gapBetween;
  const leftTableWidth = Math.floor(availableWidth * 0.58);
  const rightTableWidth = availableWidth - leftTableWidth;
  const startY = headerHeight + 2;

  /*************************************************CREAR ESTILOS DE BORDES PARA TODAS LAS TABLAS QUE SE GENEREN ***************************************/
  const commonStyles = {
    fontSize: 6,
    cellPadding: 1.5,
    valign: 'middle',
    halign: 'center',
    lineWidth: 0.1,
    lineColor: [0, 0, 0]
  };

  const commonHeadStyles = {
    fillColor: 255,
    textColor: [0, 0, 0],
    fontStyle: 'bold',
    fontSize: 6,
    lineWidth: 0.1,
    lineColor: [0, 0, 0]
  };

  // GENERAR DATOS DE PRUEBA
  const generateTestData = (count: number, tableType: 'left' | 'right') => {
    const data = [];
    for (let i = 1; i <= count; i++) {
      if (tableType === 'left') {
        data.push([
          `${1000 + i}`,
          `14:${30 + i}`,
          `${2000 + i}`,
          `R-${i % 50}`,
          `15:${i % 60}`,
          `16:${i % 60}`,
          `Modulo ${String.fromCharCode(65 + (i % 5))}`,
          i % 3 === 0 ? "Fin de turno" : i % 3 === 1 ? "Emergencia" : "Averia",
          `Firma${i}`
        ]);
      } else {
        data.push([
          `R-${i % 50}`,
          `Destino ${String.fromCharCode(65 + (i % 5))}`,
          `${3000 + i}`,
          `16:${15 + (i % 45)}`,
          `Firma${i}`
        ]);
      }
    }
    return data;
  };

  const leftTestData = generateTestData(80, 'left');
  const rightTestData = generateTestData(80, 'right');
  const rowsFirstPage = 25;

  //TABLA IZQUIERDA
  const leftTable = (doc as any).autoTable({
    startY,
    margin: { left: edgeMargin },
    tableWidth: leftTableWidth,
    head: [
      [
        { content: "DESINCORPORACION DE RUTA O SEFI", colSpan: 9, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } }
      ],
      [
        "CONS", "ECO", "CRED", "RUTA", "HORA\nDESINCOR.\nDE RUTA",
        "HORA DE LLEGADA AL MODULO", "LUGAR\nDONDE\nDESINCORP.", "MOTIVO",
        "FIRMA Y CREDENCIAL DEL QUE SUPERVISA LOS REGRESOS"
      ]
    ],
    body: leftTestData.slice(0, rowsFirstPage),
    styles: commonStyles,
    headStyles: commonHeadStyles,
    showHead: 'everyPage',
    pageBreak: 'avoid',
    didParseCell: function (data: any) {
      if (data.section === 'head') {
        const raw = data.cell.raw;
        if (typeof raw === 'string') data.cell.text = raw.split('\n');
      }
    }
  });

  //TABLA DERECHA
  const rightTableLeft = edgeMargin + leftTableWidth + gapBetween;
  const rightTable = (doc as any).autoTable({
    startY: startY,
    margin: { left: rightTableLeft },
    tableWidth: rightTableWidth,
    head: [
      [{ content: "REINCORPORACIONES A RUTA", colSpan: 5, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } }],
      [
        "RUTA A\nSALIR",
        "DESTINO",
        "CRED",
        "HORA DE SALIDA DEL MÓDULO",
        "FIRMA Y CREDENCIAL DE QUIEN DA SALIDA A \nOPERADOR Y AUTOBUS"
      ]
    ],
    body: rightTestData.slice(0, rowsFirstPage),
    styles: commonStyles,
    headStyles: commonHeadStyles,
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 15 },
      3: { cellWidth: 20 },
      4: { cellWidth: 35 }
    },
    showHead: 'everyPage',
    pageBreak: 'avoid',
    didParseCell: function (data: any) {
      if (data.section === 'head') {
        const raw = data.cell.raw;
        if (typeof raw === 'string') data.cell.text = raw.split('\n');
      }
    }
  });

  /***************************************** HACER QUE SE REPITAN LAS TABLAS Y NO SE ROMPA EL FORMATO SI SON MUCHOS DATOS **********************************************/
  let currentLeftIndex = rowsFirstPage;
  let currentRightIndex = rowsFirstPage;
  let currentPage = 1;

  while (currentLeftIndex < leftTestData.length || currentRightIndex < rightTestData.length) {
    doc.addPage();
    currentPage++;

    // Header para página nueva
    agregarHeader(doc);

    const remainingLeft = leftTestData.slice(currentLeftIndex, currentLeftIndex + rowsFirstPage);
    const remainingRight = rightTestData.slice(currentRightIndex, currentRightIndex + rowsFirstPage);

    if (remainingLeft.length > 0) {
      (doc as any).autoTable({
        startY,
        margin: { left: edgeMargin },
        tableWidth: leftTableWidth,
        head: [
          [
            { content: "DESINCORPORACION DE RUTA O SEFI", colSpan: 9, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } }
          ],
          [
            "CONS", "ECO", "CRED", "RUTA", "HORA\nDESINCOR.\nDE RUTA",
            "HORA DE LLEGADA AL MODULO", "LUGAR\nDONDE\nDESINCORP.", "MOTIVO",
            "FIRMA Y CREDENCIAL DEL QUE SUPERVISA LOS REGRESOS"
          ]
        ],
        body: remainingLeft,
        styles: commonStyles,
        headStyles: commonHeadStyles,
        showHead: 'everyPage',
        didParseCell: function (data: any) {
          if (data.section === 'head') {
            const raw = data.cell.raw;
            if (typeof raw === 'string') data.cell.text = raw.split('\n');
          }
        }
      });
      currentLeftIndex += remainingLeft.length;
    }

    if (remainingRight.length > 0) {
      (doc as any).autoTable({
        startY,
        margin: { left: rightTableLeft },
        tableWidth: rightTableWidth,
        head: [
          [{ content: "REINCORPORACIONES A RUTA", colSpan: 5, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } }],
          [
            "RUTA A\nSALIR",
            "DESTINO",
            "CRED",
            "HORA DE SALIDA DEL MÓDULO",
            "FIRMA Y CREDENCIAL DE QUIEN DA SALIDA A \nOPERADOR Y AUTOBUS"
          ]
        ],
        body: remainingRight,
        styles: commonStyles,
        headStyles: commonHeadStyles,
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 15 },
          3: { cellWidth: 20 },
          4: { cellWidth: 35 }
        },
        showHead: 'everyPage',
        didParseCell: function (data: any) {
          if (data.section === 'head') {
            const raw = data.cell.raw;
            if (typeof raw === 'string') data.cell.text = raw.split('\n');
          }
        }
      });
      currentRightIndex += remainingRight.length;
    }
  }

  // Dibujar header en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    agregarHeader(doc);
  }

  window.open(doc.output("bloburl"), "_blank");
};