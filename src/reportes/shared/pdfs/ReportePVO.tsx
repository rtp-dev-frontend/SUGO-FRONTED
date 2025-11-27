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
  customStyles?: object // <-- nuevo parámetro opcional
) {
  const body = datos.map((item) => [item]);
  if (mostrarTotal && datos.length > 0) {
    body.push(["TOTAL"]);
  }

  autoTable(doc, {
    head: [[titulo]],
    body,
    startY: startY,
    margin: { left: 10, right: 30 },
    tableWidth: 18,
    styles: {
      fontSize: 5,
      halign: "center",
      minCellHeight: 4,
      cellPadding: 1.1,
      ...customStyles, // <-- aplica estilos personalizados si existen
    },
    headStyles: {
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 1.5,
      fillColor: [41, 128, 185],
      textColor: 255,
    },
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
    "Ruta Ordinarios",
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

  // ****Segunda columna de tablas****

  tablaReportaRecibe(doc, head, body, 12, 30, {
    fontSize: 7, //fuente más grande
    minCellHeight: 3, //celdas más altas
    cellPadding: 1, //menos espacio interno
  });
  tablaReportaRecibe(doc, head, body2, 53, 30, {
    fontSize: 7, //fuente más grande
    minCellHeight: 0.66, //celdas más altas
    cellPadding: 0.66, //menos espacio interno
  });

  // Tabla horizontal alineada a la derecha de la vertical
  tablaReportaRecibe(doc, head, body3, 106, 30, {
    fontSize: 7, // ejemplo: fuente más grande
    minCellHeight: 3.2, // ejemplo: celdas más altas
    cellPadding: 0.95, // ejemplo: menos espacio interno
  });

  // SEGUNDO BLOQUE (duplicado a la derecha)
  tablaReportaRecibe(doc, head, body, 12, 105, {
    fontSize: 7,
    minCellHeight: 3,
    cellPadding: 1,
  });
  tablaReportaRecibe(doc, head, body2, 53, 105, {
    fontSize: 7,
    minCellHeight: 0.66,
    cellPadding: 0.66,
  });
  tablaReportaRecibe(doc, head, body3, 106, 105, {
    fontSize: 7,
    minCellHeight: 3.2,
    cellPadding: 0.95,
  });

  // TERCER BLOQUE (duplicado más a la derecha)
  tablaReportaRecibe(doc, head, body, 12, 180, {
    fontSize: 7,
    minCellHeight: 3,
    cellPadding: 1,
  });
  tablaReportaRecibe(doc, head, body2, 53, 180, {
    fontSize: 7,
    minCellHeight: 0.66,
    cellPadding: 0.66,
  });
  tablaReportaRecibe(doc, head, body3, 106, 180, {
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
    margin: { left: 30 }, // posición horizontal (ajusta para mover a la derecha/izquierda)
    tableWidth: 80, // ancho de la tabla (opcional)
    styles: {
      minCellHeight: 6, // altura de celda
      cellPadding: 0.8,
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255] }, // sin color en encabezado
    theme: "grid",
  });

  window.open(doc.output("bloburl"), "_blank"); // Abre el PDF en una nueva pestaña
};
