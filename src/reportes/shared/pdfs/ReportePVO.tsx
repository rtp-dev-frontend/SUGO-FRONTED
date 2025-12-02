import { jsPDF } from "jspdf"; // Importa la librería para generar PDFs
import autoTable from "jspdf-autotable"; // Importación obligatoria
import { capital_humano } from "../../utils/logos";
import { red_texto } from "../../utils/logos";

// 1. Inicializa el documento PDF en orientación horizontal
//  orientation: "landscape" => horizontal
//  unit => unidad de medida (por defecto "mm")
//  format => tamaño del papel (por defecto "a4")

// Función para agregar header con logos y títulos
function agregarHeader(doc: jsPDF) {
  // Logo 1
  doc.addImage(capital_humano, "JPEG", 9, 3, 20, 7);
  // doc.addImage(red_texto, "JPEG", 40, 3, 20, 7);
  // Logo 2 (ajusta la posición y tamaño según lo que necesites)

  // Título centrado (ajusta el texto y posición)
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(
    "REPORTE DEL P.V.O EN TRES HORARIOS",
    doc.internal.pageSize.getWidth() - 65,
    4,
    {
      align: "left",
    }
  );

  // Subtítulo (opcional)

  doc.setFontSize(7);
  doc.text(
    "FECHA: _________________",
    doc.internal.pageSize.getWidth() - 28,
    8, // Y mayor que el título
    { align: "right" }
  );
  doc.setFont("helvetica", "normal");
}

function generarTabla(
  doc: jsPDF,
  titulo: string,
  datos: string[],
  startY: number,
  mostrarTotal: boolean = true,
  customStyles?: object, // <-- nuevo parámetro opcional
  marginLeft: number = 10 // <-- nuevo parámetro
) {
  const body = datos.map((item) => [item]);
  if (mostrarTotal && datos.length > 0) {
    body.push(["TOTAL"]);
  }

  autoTable(doc, {
    head: [[titulo]],
    body,
    startY: startY,
    margin: { left: marginLeft, right: 30 },
    tableWidth:
      customStyles && customStyles.tableWidth ? customStyles.tableWidth : 14,
    styles: {
      fontSize: 5,
      halign: "center",
      minCellHeight: 4,
      cellPadding: 1.1,
      ...customStyles,
    },
    headStyles: {
      fontStyle: "bold",
      fontSize: 6,
      cellPadding: 1.5,
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    columnStyles:
      customStyles && customStyles.columnStyles
        ? customStyles.columnStyles
        : undefined,
    theme: "grid",
  });
}

function tablaReportaRecibe(
  doc: jsPDF,
  head: any[][],
  body: string[][],
  startY: number,
  marginLeft: number = 15,
  customStyles?: object // <-- nuevo parámetro opcional
) {
  autoTable(doc, {
    head,
    body,
    startY,
    margin: { left: marginLeft },
    tableWidth: 12,
    styles: {
      fontSize: 5,
      halign: "center",
      minCellHeight: 2,
      cellPadding: 1,
      ...customStyles,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 5,
      cellPadding: 0.5,
      minCellHeight: 1,
    },
    columnStyles: {
      0: { cellWidth: 9 },
      1: { cellWidth: 9 },
      2: { cellWidth: 9 },
      3: { cellWidth: 9 },
      4: { cellWidth: 9 },
      5: { cellWidth: 9 },
      6: { cellWidth: 9 },
      7: { cellWidth: 9 },
    },
    theme: "grid",
  });
}

export const ReportePVO = () => {
  // Tablas verticales de 5 filas junto al bloque de 10 filas

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  agregarHeader(doc);

  // PRIMERA COLUMNA DE TABLAS
  const datos_column = [
    { ordinarios: " 33" },
    { ordinarios: " 43" },
    { ordinarios: " 168" },
    { ordinarios: "" },
    { ordinarios: "" },
    { ordinarios: "" }, // Ahora hay 6 filas
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
  const head = [
    [
      { content: "REPORTA", colSpan: 4, styles: { halign: "center" } },
      { content: "RECIBE", colSpan: 4, styles: { halign: "center" } }, // colSpan 4
    ],
    [
      { content: "", colSpan: 2 },
      { content: "09:00 HRS.", colSpan: 2, styles: { halign: "center" } },
    ],
    ["PVRU", "PVO", "PVM", "PA", "T.Ext", "JLR", "VAL", "PIB"], // solo 8 columnas
  ];

  const body = [
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "0"],
  ];

  // NUEVO: body2 con 10 filas
  const body2 = [
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ];

  const body3 = [
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "0"],
    ["", "", "", "", "", "", "", "1"],
    ["", "", "", "", "", "", "", "1"],
  ];

  // Generar tablas columna 1
  generarTabla(
    doc,
    "Ruta   Ordinarios",
    datos_column.map((d) => d.ordinarios),
    12
  );
  generarTabla(
    doc,
    "Expresos",
    datos_column_2.map((d) => d.ordinarios),
    53,
    true,
    {
      fontSize: 5, // ejemplo: fuente más grande
      minCellHeight: 1.2, // ejemplo: celdas más altas
      cellPadding: 1.2, // ejemplo: más espacio interno
    }
  );

  generarTabla(
    doc,
    "ATENEAS",
    datos_column_3.map((d) => d.ordinarios),
    106,
    true,
    {
      fontSize: 5, // ejemplo: fuente más grande
      minCellHeight: 1.2, // ejemplo: celdas más altas
      cellPadding: 1.2, // ejemplo: más espacio interno
    }
  );

  // una columna: solo 6 filas y sin TOTAL
  generarTabla(
    doc,
    "P.V.\nASG",
    ["", "", "", "", "", ""],
    12,
    false, // no mostrar total
    {
      tableWidth: 8,
      minCellHeight: 4.6,
      columnStyles: { 0: { cellWidth: 7 } },
    },
    250
  );

  // una columna: solo 6 filas y sin TOTAL
  generarTabla(
    doc,
    "P.V.\nAUT",
    ["", "", "", "", "", ""],
    12,
    false, // no mostrar total
    {
      tableWidth: 7,
      minCellHeight: 5,
      columnStyles: { 0: { cellWidth: 7 } },
    },
    259
  );

  // una columna: solo 6 filas y sin TOTAL
  generarTabla(
    doc,
    "PROMT PV\n. X RUTA",
    ["", "", "", "", "", ""],
    12,
    false, // no mostrar total
    {
      tableWidth: 30,
      minCellHeight: 5,
      cellPadding: 0.2, //espacio interno
      columnStyles: { 0: { cellWidth: 14 } },
    },
    268
  );

  // Segundo bloque (más abajo, 10 filas)
  const diezFilasVacias = Array(10).fill("");
  generarTabla(
    doc,
    "P.V.\nASG",
    diezFilasVacias,
    53,
    false,
    {
      tableWidth: 7,
      minCellHeight: 1,
      cellPadding: 1,
      columnStyles: { 0: { cellWidth: 7 } },
    },
    250
  );
  generarTabla(
    doc,
    "P.V.\nAUT",
    diezFilasVacias,
    53,
    false,
    { tableWidth: 7, minCellHeight: 1, columnStyles: { 0: { cellWidth: 7 } } },
    259
  );
  generarTabla(
    doc,
    "PROMT PV\n. X RUTA",
    diezFilasVacias,
    53,
    false,
    {
      tableWidth: 30,
      minCellHeight: 2.2,
      cellPadding: 1.1, //espacio interno
      columnStyles: { 0: { cellWidth: 14 } },
    },
    268
  );

  // Tablas verticales de 5 filas debajo del bloque de 10 filas
  const cincoFilasVaciasJunto = Array(5).fill("");
  generarTabla(
    doc,
    "P.V.\nASG",
    cincoFilasVaciasJunto,
    106,
    false,
    {
      tableWidth: 7,
      minCellHeight: 1,
      cellPadding: 1.2,
      columnStyles: { 0: { cellWidth: 7 } },
    },
    250
  );
  generarTabla(
    doc,
    "P.V.\nAUT",
    cincoFilasVaciasJunto,
    106,
    false,
    {
      tableWidth: 7,
      minCellHeight: 1,
      cellPadding: 1.4,
      columnStyles: { 0: { cellWidth: 7 } },
    },
    259
  );
  generarTabla(
    doc,
    "PROMT PV\n. X RUTA",
    cincoFilasVaciasJunto,
    106,
    false,
    {
      tableWidth: 30,
      minCellHeight: 2.2,
      cellPadding: 1.4,
      columnStyles: { 0: { cellWidth: 14 } },
    },
    268
  );

  // *! una sola celda
  autoTable(doc, {
    head: [[""]],
    startY: 141, // 106 (startY de las tablas) + 5*2.2 (minCellHeight aprox) = 117
    margin: { left: 250 },
    tableWidth: 7,
    styles: {
      minCellHeight: 0.8,
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] },
    theme: "grid",
  });
  autoTable(doc, {
    head: [[""]],
    startY: 141,
    margin: { left: 259 },
    tableWidth: 7,
    styles: {
      minCellHeight: 0.8,
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] },
    theme: "grid",
  });
  autoTable(doc, {
    head: [[""]],
    startY: 141,
    margin: { left: 268 },
    tableWidth: 14,
    styles: {
      minCellHeight: 0.8,
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] },
    theme: "grid",
  });

  // ****Segunda columna de tablas****

  tablaReportaRecibe(doc, head, body, 12, 27, {
    fontSize: 7, //fuente más grande
    minCellHeight: 3, //celdas más altas
    cellPadding: 1, //menos espacio interno
  });
  tablaReportaRecibe(doc, head, body2, 53, 27, {
    fontSize: 7, //fuente más grande
    minCellHeight: 0.66, //celdas más altas
    cellPadding: 0.66, //menos espacio interno
  });

  // Tabla horizontal alineada a la derecha de la vertical
  tablaReportaRecibe(doc, head, body3, 106, 27, {
    fontSize: 7, // ejemplo: fuente más grande
    minCellHeight: 3.2, // ejemplo: celdas más altas
    cellPadding: 0.95, // ejemplo: menos espacio interno
  });

  // SEGUNDO BLOQUE (duplicado a la derecha)
  tablaReportaRecibe(doc, head, body, 12, 101, {
    fontSize: 7,
    minCellHeight: 3,
    cellPadding: 1,
  });
  tablaReportaRecibe(doc, head, body2, 53, 101, {
    fontSize: 7,
    minCellHeight: 0.66,
    cellPadding: 0.66,
  });
  tablaReportaRecibe(doc, head, body3, 106, 101, {
    fontSize: 7,
    minCellHeight: 3.2,
    cellPadding: 0.95,
  });

  // TERCER BLOQUE (duplicado más a la derecha)
  tablaReportaRecibe(doc, head, body, 12, 175, {
    fontSize: 7,
    minCellHeight: 3,
    cellPadding: 1,
  });
  tablaReportaRecibe(doc, head, body2, 53, 175, {
    fontSize: 7,
    minCellHeight: 0.66,
    cellPadding: 0.66,
  });
  tablaReportaRecibe(doc, head, body3, 106, 175, {
    fontSize: 7,
    minCellHeight: 3.2,
    cellPadding: 0.95,
  });

  generarTabla(
    doc,
    "TOTAL",
    [],
    141, // Cambia este valor para subir o bajar la tabla (más chico = más arriba)
    false,
    {
      fontSize: 5, // Tamaño de fuente más grande
      minCellHeight: 2, // Altura mínima de la celda
      cellPadding: 1, // Espaciado interno
      halign: "center", // Centra el texto
    }
  );

  // Fila de 4 celdas vacías
  autoTable(doc, {
    head: [["", "", "", "", "", "", "", "1"]], // o sin head si no quieres encabezado
    startY: 141, // posición vertical (ajusta para subir/bajar)
    margin: { left: 27 }, // posición horizontal (ajusta para mover a la derecha/izquierda)
    tableWidth: 72, // ancho de la tabla (opcional)
    styles: {
      minCellHeight: 4, // altura de celda
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] }, // sin color en encabezado
    theme: "grid",
  });
  // Fila de 4 celdas vacías
  autoTable(doc, {
    head: [["", "", "", "", "", "", "", "1"]], // o sin head si no quieres encabezado
    startY: 141, // posición vertical (ajusta para subir/bajar)
    margin: { left: 101 }, // posición horizontal (ajusta para mover a la derecha/izquierda)
    tableWidth: 72, // ancho de la tabla (opcional)
    styles: {
      minCellHeight: 4, // altura de celda
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] }, // sin color en encabezado
    theme: "grid",
  });
  // Fila de 4 celdas vacías
  autoTable(doc, {
    head: [["", "", "", "", "", "", "", "1"]], // o sin head si no quieres encabezado
    startY: 141, // posición vertical (ajusta para subir/bajar)
    margin: { left: 175 }, // posición horizontal (ajusta para mover a la derecha/izquierda)
    tableWidth: 72, // ancho de la tabla (opcional)
    styles: {
      minCellHeight: 4, // altura de celda
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] }, // sin color en encabezado
    theme: "grid",
  });

  window.open(doc.output("bloburl"), "_blank"); // Abre el PDF en una nueva pestaña
};
