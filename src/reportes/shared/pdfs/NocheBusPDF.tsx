import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// import { logo_2024 } from "../../utils/logos";

export const NocheBusPDF = () => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  // Agrega el logo: (imagen, tipo, x, y, ancho, alto)
  //   doc.addImage(logo_2024, "JPEG", 14, 5, 40, 15);
  doc.setFontSize(8);
  doc.text("CONTROL DE EXPRESOS Y NOCHEBUS", 50, 25);
  doc.setFontSize(8);
  doc.text(`FECHA: 26/10/2025`, 170, 25, { align: "left" });
  // Tabla con header y títulos de columnas
  // Encabezado: fila de título y fila de columnas

  // Datos de ejemplo
  const bodyData = Array.from({ length: 20 }, (_, i) => [
    `ECO-${i + 1}`,
    `${Math.floor(Math.random() * 10)}`,
    `Conductor ${i + 1}`,
    "Observación ejemplo",
  ]);

  autoTable(doc, {
    startY: 42,
    head: [
      [
        {
          content: "TABLA DE NOCHEBUS",
          colSpan: 4,
          styles: {
            halign: "center",
            fontSize: 10,
            fontStyle: "bold",
            cellPadding: 3,
          },
        },
      ],
      ["ECO", "VUELTAS", "CONDUCTOR", "OBSERVACIONES"],
    ],
    body: bodyData,
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      halign: "center",
      valign: "middle",
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      overflow: "linebreak",
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 50, halign: "center" },
      3: { cellWidth: 60, halign: "center" },
    },
    theme: "grid",
    pageBreak: "auto",
    rowPageBreak: "avoid",
    showHead: "everyPage",
    margin: { top: 42, bottom: 20, left: 10, right: 10 },
    tableWidth: "auto",
    didDrawPage: function (data: any) {
      //   NocheBusPDF(doc);
    },
  });

  // Puedes agregar más contenido aquí
  window.open(doc.output("bloburl"), "_blank");
};
