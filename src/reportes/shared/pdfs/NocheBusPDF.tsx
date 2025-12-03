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
    doc.setFontSize(7);
    doc.text(
      "FECHA: " + fechaFormateada,
      doc.internal.pageSize.getWidth() - 30,
      35,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  agregarHeader(doc);
  // Puedes agregar más contenido aquí
  window.open(doc.output("bloburl"), "_blank");
};
