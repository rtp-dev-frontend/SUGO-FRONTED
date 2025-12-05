import { jsPDF } from "jspdf";
import {capital_transformacion} from "../../../assets/LogoHeader";

// pasamos como parametro a nuestra funcion flecha el turno y la fecha 
export const Reporte_GacetaDespacho = (turno: any, fecha: Date | null) => {
  const doc = new jsPDF();
  
  function dibujaEncabezado(doc: jsPDF){ 
      // la imagen la convertimos a base64 y la colocamos en nuestro archivo logoHeader.ts
      //                                   formato   x   y  anch  alt
      doc.addImage(capital_transformacion,  "JPG",  10,  5,  30,  20);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold"); //texto en negritas
      doc.text("RED DE TRANSPORTE DE PASAJEROS DE LA CIUDAD DE MÉXICO", 60, 10);
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      doc.text("DIRECCIÓN EJECUTIVA DE OPERACIÓN Y MANTENIMIENTO", 60, 13);
      doc.text("GERENCIA MODULAR", 60, 16);
  }
  dibujaEncabezado(doc);  
//------------------------------------BODY DEL PDF-----------------------------------------//  
  // FECHA FORMATEADA
  const fechaFormateada = fecha
    ? fecha.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).replace("de ", "de ").replace(/\b(\d{4})$/, "del $1") // agrega "del"
    : "Sin fecha";

  // DIA DE LA SEMANA
  const diaSemana = fecha
    ? fecha.toLocaleDateString("es-MX", { weekday: "long" })
    : "Sin dia";
    
    function dibujaFecha(doc: jsPDF) {
        doc.setFontSize(9);

        doc.text("FECHA", 125, 29);
        // doc.text("19 de Noviembre del 2025", 150, 29);
        doc.text(fechaFormateada, 150, 29);
        doc.rect(140, 25, 60, 6.5, "S");  // celda

        doc.text("HORA              17:00", 108, 38);
        doc.line(120, 39, 150, 39); 

        doc.text("DÍA", 163, 38);
        doc.text(diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), 180, 38);
        doc.line(170, 39, 200, 39); // linea de abajo
    }
    dibujaFecha(doc);

    function dibujaTablas(doc: jsPDF) {
      doc.setFontSize(7);

      const X = 10;
      const espacio = 19;
      const y = 43;
      const anchoCelda = 15;

      const tablas = [
        { titulo: "ORDINARIO", ruta: "RUTA 33" },
        { titulo: "EXPRESO", ruta: "RUTA 12" },
        { titulo: "EXPRESO", ruta: "RUTA 169" },
        { titulo: "ATENEA", ruta: "RUTA 33" },
        { titulo: "ESCOLAR", ruta: "RUTA 33" },
      ];

      tablas.forEach((t, i) => {
        const x = X + i * espacio;

        // CENTRAR TITULO
        const wTitulo = doc.getTextWidth(t.titulo);
        const xTitulo = x + (anchoCelda - wTitulo) / 2;

        // CENTRAR RUTA
        const wRuta = doc.getTextWidth(t.ruta);
        const xRuta = x + (anchoCelda - wRuta) / 2;

        // Numero
        doc.text("1", x - 2, y + 11);
        doc.text(t.titulo, xTitulo, y + 3);
        doc.rect(x, y, anchoCelda, 4);

        doc.text(t.ruta, xRuta, y + 7.3);
        doc.rect(x, y + 4, anchoCelda, 4);

        doc.rect(x, y + 8, anchoCelda, 4);
      });

      const X2 = 110;
      const y2 = 43;
      const espacio2 = 8;

      const tablas2 = [
        {
          titulo: "ORDINARIO",
          ruta: ["33", "43", "168"],
        },
        // {
        //   titulo: "EXPRESO",
        //   ruta: ["11-A", "12", "37", "169", "200", "CEDA", "L-1"],
        // },
      ];

      tablas2.forEach((t, i) => {
        const altoFila = 4;

        // ===============================
        // CALCULAR NUEVA POSICION EN Y
        // ===============================
        // y base + (altura total de tablas previas)
        let yBase = y2;

        for (let k = 0; k < i; k++) {
          const filas = tablas2[k].ruta.length + 2; // rutas + encabezado + total
          yBase += filas * altoFila + espacio2;
        }

        // Todas las tablas en el MISMO X
        const x = X2;

        // DEFINIMOS LAS COLUMNAS DEL ENCABEZADO
        const columnas = [
          { label: "RUTA", w: 11 },
          { label: "P.V.R", w: 9 },
          { label: "DISP.", w: 9 },
          { label: "MTTO.", w: 9 },
          { label: "P/A.", w: 9 },
          { label: "T.EXT.", w: 9 },
          { label: "JUR.", w: 9 },
          { label: "VAL.", w: 9 },
          { label: "P/B", w: 16 },
        ];

        // ---------------------------------------------
        // TITULO CENTRADO
        // ---------------------------------------------
        const wTitulo = doc.getTextWidth(t.titulo);
        const xTitulo = x + (74 - wTitulo) / 2;
        doc.text(t.titulo, xTitulo, yBase + 3);
        doc.rect(x, yBase, 74, altoFila);

        const texto29 = "29";
        const w29 = doc.getTextWidth(texto29);
        const x29 = x + 74 + (16 - w29) / 2;
        doc.text(texto29, x29, yBase + 3);
        doc.rect(x + 74, yBase, 16, altoFila);

        // ---------------------------------------------
        // ENCABEZADOS — CENTRADOS
        // ---------------------------------------------
        let xCol = x;

        columnas.forEach((col) => {
          const wText = doc.getTextWidth(col.label);
          const xCentered = xCol + (col.w - wText) / 2;

          doc.text(col.label, xCentered, yBase + 7);
          doc.rect(xCol, yBase + 4, col.w, altoFila);

          xCol += col.w;
        });

        // ---------------------------------------------
        // FILAS DE RUTAS
        // ---------------------------------------------
        t.ruta.forEach((numRuta, index) => {
          const filaY = yBase + 8 + index * altoFila;

          let xColumna = x;

          columnas.forEach((col, colIndex) => {
            let texto = colIndex === 0 ? numRuta : "";

            const wText = doc.getTextWidth(texto);
            const xCentered = xColumna + (col.w - wText) / 2;

            doc.text(texto, xCentered, filaY + 3);
            doc.rect(xColumna, filaY, col.w, altoFila);

            xColumna += col.w;
          });
        });

        // ---------------------------------------------
        // FILA TOTAL
        // ---------------------------------------------
        const filaTotalY = yBase + 8 + t.ruta.length * altoFila;

        let xTotalCol = x;

        const textoTotal = "TOTAL";
        const colTotal = columnas[0]; // primera columna
        const wTotal = doc.getTextWidth(textoTotal);
        const xTotalCenter = xTotalCol + (colTotal.w - wTotal) / 2;

        doc.text(textoTotal, xTotalCenter, filaTotalY + 3);
        doc.rect(xTotalCol, filaTotalY, colTotal.w, altoFila);

        xTotalCol += colTotal.w;

        columnas.slice(1).forEach((col) => {
          doc.rect(xTotalCol, filaTotalY, col.w, altoFila);
          xTotalCol += col.w;
        });
      });
    }
    dibujaTablas(doc);
    










  // abrir PDF
  window.open(doc.output("bloburl"), "_blank");
};
