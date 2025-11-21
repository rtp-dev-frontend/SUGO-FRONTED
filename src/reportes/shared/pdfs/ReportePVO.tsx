import { jsPDF } from "jspdf"; // Importa la librería para generar PDFs

export const ReportePVO = () => {
  // Si el valor es 1, genera el PDF 1
  const doc = new jsPDF();
  doc.text("Hello world! de gerardo", 10, 10);
  window.open(doc.output("bloburl"), "_blank"); // Abre el PDF en una nueva pestaña
};
