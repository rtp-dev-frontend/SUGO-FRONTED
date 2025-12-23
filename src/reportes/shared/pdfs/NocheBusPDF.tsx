import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { logoCdmx } from "../../utils/logos";

export const NocheBusPDF = () => {
  function agregarHeader(doc: jsPDF) {
    // LOGO Y TEXTO ENCABEZADO
    doc.addImage(logoCdmx, "JPEG", 15, 5, 55, 15);
    doc.setFontSize(8);
    const subtitle =
      "RED DE TRANSPORTE DE PASAJEROS DE LA CIUDAD DE MEXICO\nDIRECCION EJECUTIVA DE OPERACION Y MANTENIMIENTO\nGERENCIA DE OPERACION DEL SERVICIO";
    const x = doc.internal.pageSize.getWidth() - 100;
    let y = 7;
    const lines = subtitle.split("\n");
    doc.setFont("helvetica", "bold");
    doc.text(lines[0], x, y, { align: "left" });
    doc.setFont("helvetica", "normal");
    const lineHeight = 4;
    for (let i = 1; i < lines.length; i++) {
      y += lineHeight;
      doc.text(lines[i], x, y, { align: "left" });
    }

    // TITULO PRINCIPAL
    doc.setFontSize(8);
    doc.setFont("helvetica");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("CONTROL DE EXPRESOS Y NOCHEBUS", pageWidth / 2, 30, {
      align: "center",
    });

    const fechaHoy = new Date();
    const dia = String(fechaHoy.getDate()).padStart(2, "0");
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, "0");
    const anio = fechaHoy.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    // FECHA
    doc.setFontSize(8);
    doc.text(
      "FECHA: " + fechaFormateada,
      doc.internal.pageSize.getWidth() - 30,
      30,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");
  }

  // Encabezado con 'VUELTAS' como celda combinada (colSpan: 2)
  const headRows = [
    [
      { content: "ECO", rowSpan: 2 },
      { content: "", rowSpan: 2 },
      { content: "VUELTAS", colSpan: 2, styles: { halign: "center" } },
      { content: "", rowSpan: 2 },
      { content: "", rowSpan: 2 },
    ],
  ];

  // Cada fila tiene dos valores para 'VUELTAS'
  const filas = Array.from({ length: 25 }, (_, i) => [
    1001 + i, // ECO
    `${" "}`, // RUTA
    `${i + 1}-1`, // VUELTAS 1
    `${i + 1}-2`, // VUELTAS 2
    `${" "}`, // HORA DESINCORP. DE RUTA
    `${" "}`, // HORA DE LLEGADA AL MODULO
  ]);

  function agregarTabla(doc, titulos, filas, startY = 40) {
    autoTable(doc, {
      startY,
      head: headRows,
      body: filas,
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        textColor: 0,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontStyle: "bold",
        fontSize: 8,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      theme: "grid",
      margin: { left: 5, right: 5 },
      tableWidth: "auto",
    });
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  agregarHeader(doc);
  agregarTabla(doc, null, filas, 40); // Dibuja la tabla en el PDF
  window.open(doc.output("bloburl"), "_blank");
};
