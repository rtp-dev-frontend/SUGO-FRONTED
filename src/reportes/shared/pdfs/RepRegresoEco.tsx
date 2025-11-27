import { jsPDF } from "jspdf";
import "jspdf-autotable";
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const RepRegresoEco = () => {

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const text = "CONTROL DE REGRESOS Y REINCORPORACIONES DE AUTOBUSES";
  doc.text(text, doc.internal.pageSize.width / 2, 10, { align: 'center' });

  const text2 = "FECHA: ______________________";
  doc.text(text2, doc.internal.pageSize.width - 10, 15, { align: 'right' });


  // TABLA IZQUIERDA
  doc.autoTable({
    startY: 20,
    margin: { left: 10 },
    head: [
      [
        {
          content: "DESINCORPORACION DE RUTA O SEFI",
          colSpan: 8,
          styles: {
            halign: 'center', fontSize: 8, fontStyle: 'bold'
          }
        }
      ],
      [
        "CONS", "ECO", "CRED", "RUTA", "HORA\nDESINCOR.\nDE RUTA",
        "HORA DE LLEGADA AL MODULO", "LUGAR\nDONDE\nDESINCORP.", "MOTIVO",
        "FIRMA Y CREDENCIAL DEL QUE SUPERVISA LOS REGRESOS"
      ]],
    body: [
      [
        "5565", "14:30", "1234", "R-45", "15:00",
        "16:00", "Modulo A", "Fin de turno", "Firma1"
      ],
      [
        "6677", "15:00", "5678", "R-32", "15:30",
        "16:30", "Modulo B", "Emergencia", "Firma2"
      ],
      [
        "7788", "15:30", "9101", "R-12", "16:00",
        "17:00", "Modulo C", "Averia", "Firma3"
      ],
      [
        "7788", "15:30", "9101", "R-12", "16:00",
        "17:00", "Modulo C", "Averia", "Firma3"
      ],
      [
        "7788", "15:30", "9101", "R-12", "16:00",
        "17:00", "Modulo C", "Averia", "Firma3"
      ],
      [
        "7788", "15:30", "9101", "R-12", "16:00",
        "17:00", "Modulo C", "Averia", "Firma3"
      ],
      [
        "7788", "15:30", "9101", "R-12", "16:00",
        "17:00", "Modulo C", "Averia", "Firma3"
      ],
    ],
    styles: {
      fontSize: 6,
      cellPadding: 2,
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: 255,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 6,
      cellPadding: 3,
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    tableWidth: 150,
    didParseCell: function (data) {
      if (data.section === 'head') {
        // Solo dividir si la celda es texto o si es un objeto con 'content'
        if (typeof data.cell.raw === 'string') {
          data.cell.text = data.cell.raw.split('\n');
        } else if (data.cell.raw && typeof data.cell.raw.content === 'string') {
          data.cell.text = data.cell.raw.content.split('\n');
        }
      }
    }
  });

  // TABLA DERECHA CON SALTOS DE LÍNEA
  doc.autoTable({
    startY: 20,
    margin: { left: 165 },
    head: [[
      {
        content: "REINCORPORACIONES A RUTA",
        colSpan: 5,
        styles: {
          halign: 'center', fontSize: 8, fontStyle: 'bold'
        }
      }
    ],
    [
      "RUTA A\nSALIR",
      "DESTINO",
      "CRED",
      "HORA DE SALIDA DEL MÓDULO",
      "FIRMA Y CREDENCIAL DE QUIEN DA SALIDA A \nOPERADOR Y AUTOBUS"
    ]],
    body: [
      ["R-45", "Destino A", "1234", "16:15", "FirmaA"],
      ["R-32", "Destino B", "5678", "16:45", "FirmaB"],
      ["R-12", "Destino C", "9101", "17:15", "FirmaC"],
      ["R-12", "Destino C", "9101", "17:15", "FirmaC"],
      ["R-12", "Destino C", "9101", "17:15", "FirmaC"],
      ["R-12", "Destino C", "9101", "17:15", "FirmaC"],
      ["R-12", "Destino C", "9101", "17:15", "FirmaC"],
    ],
    styles: {
      fontSize: 6,
      cellPadding: 2,
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: 255,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 6,
      cellPadding: 3,
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 15 },
      3: { cellWidth: 20 },
      4: { cellWidth: 35 }
    },
    tableWidth: 130,
    didParseCell: function (data) {
      if (data.section === 'head') {
        // Solo dividir si la celda es texto o si es un objeto con 'content'
        if (typeof data.cell.raw === 'string') {
          data.cell.text = data.cell.raw.split('\n');
        } else if (data.cell.raw && typeof data.cell.raw.content === 'string') {
          data.cell.text = data.cell.raw.content.split('\n');
        }
      }
    }
  });

  window.open(doc.output("bloburl"), "_blank");
};