import { jsPDF } from "jspdf"; // Importa la librería para generar PDFs
import autoTable from "jspdf-autotable"; // Importación obligatoria

// 1. Inicializa el documento PDF en orientación horizontal
//  orientation: "landscape" => horizontal
//  unit => unidad de medida (por defecto "mm")
//  format => tamaño del papel (por defecto "a4")

function generarTabla(
  doc: jsPDF,
  titulo: string,
  datos: string[],
  startY: number,
  mostrarTotal: boolean = true
) {
  // primera columna de tablas (RUTA, EXPRESOS, ATENEAS, GRAN TOTAL)
  const body = datos.map((item) => [item]);
  // agregar fila de total
  body.push(["TOTAL"]);

  autoTable(doc, {
    head: [[titulo]],
    body,
    // centrar la tabla
    startY: startY,
    // mover a la derecha o izquierda
    margin: { left: 10, right: 30 },
    // tamaño de la tabla
    tableWidth: 20,
    // estilos de la tabla
    styles: {
      fontSize: 5,
      halign: "center",
      minCellHeight: 1,
      cellPadding: 1.3,
    },
    headStyles: { fontStyle: "bold", fontSize: 8, cellPadding: 1 },
  });
}

// Segunda funcion de columna de tablas
function segundaColumnaTablaFlexible(
  doc: jsPDF,
  head: string[][],
  body: string[][],
  startY: number,
  marginLeft: number
) {
  autoTable(doc, {
    head,
    body,
    startY,
    margin: { left: marginLeft, right: 0 },
    tableWidth: 70,
    styles: {
      fontSize: 5,
      halign: "center",
      minCellHeight: 1,
      cellPadding: 0.8,
    },
    headStyles: { fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 12 },
    },
  });
}

export const ReportePVO = () => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.text("Reporte P.V.O", 10, 4);

  // PRIMERA COLUMNA DE TABLAS
  const datos_column = [
    { ordinarios: " 33" },
    { ordinarios: " 43" },
    { ordinarios: " 168" },
    { ordinarios: "" },
    { ordinarios: "" },
  ];
  const datos_column_2 = [
    { ordinarios: "11-A" },
    { ordinarios: "12" },
    { ordinarios: "37" },
    { ordinarios: "169" },
    { ordinarios: "200" },
    { ordinarios: "CEDA" },
    { ordinarios: "SEFI L-1" },
    { ordinarios: "" },
    { ordinarios: "" },
  ];

  const datos_column_3 = [
    { ordinarios: "33" },
    { ordinarios: "43" },
    { ordinarios: "168" },
    { ordinarios: "" },
    { ordinarios: "" },
  ];
  const datos_column_4 = [{ ordinarios: " 33" }];

  // SEGUNDA COLUMNA DE TABLAS

  const head = [
    ["REPORTA", "RECIBE", "", "", "", "", "", "", ""],
    ["", "", "08:00 HRS.", "", "", "", "", "", ""],
    ["PVRU", "PVO", "PVM", "PA", "T.Ext", "JLR", "VAL", "PIB"],
  ];

  const body = [
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
    // Puedes agregar más filas, pero todas deben tener 9 columnas para que la tabla esté alineada con el header.
  ];

  // Generar tablas columna 1
  generarTabla(
    doc,
    "Rutas Ordinarios",
    datos_column.map((d) => d.ordinarios),
    8
  );
  generarTabla(
    doc,
    "Expresos",
    datos_column_2.map((d) => d.ordinarios),
    46
  );
  generarTabla(
    doc,
    "ATENEAS",
    datos_column_3.map((d) => d.ordinarios),
    94
  );
  generarTabla(doc, "GRAN TOTAL", [], 130, false);

  // SEGUNDA COLUMNA
  const posicionesX = [40, 120, 200]; // márgenes izquierdos para las 3 columnas
  // Ajusta los valores para que la tercera fila esté más arriba
  const posicionesY = [8, 46, 95]; // filas más juntas y la tercera más arriba

  for (let i = 0; i < posicionesY.length; i++) {
    for (let j = 0; j < posicionesX.length; j++) {
      segundaColumnaTablaFlexible(
        doc,
        head,
        body,
        posicionesY[i],
        posicionesX[j]
      );
    }
  }

  window.open(doc.output("bloburl"), "_blank"); // Abre el PDF en una nueva pestaña
};
