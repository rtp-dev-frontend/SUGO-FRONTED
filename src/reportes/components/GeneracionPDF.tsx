// import { jsPDF } from "jspdf"; // Importa la librería para generar PDFs
// import { Button } from "primereact/button";

// // Componente que recibe el valor seleccionado y genera el PDF correspondiente
// export const GenerarPDF = ({ valorSelect }: { valorSelect: string }) => {
//   // Función que decide qué PDF generar según el valor seleccionado
//   const handlePDF = () => {
//     if (valorSelect === "1") {
//       // Si el valor es 1, genera el PDF 1
//       //   const doc = new jsPDF();
//       //   doc.text("Hello world! de gerardo", 10, 10);
//       //   window.open(doc.output("bloburl"), "_blank"); // Abre el PDF en una nueva pestaña
//     } else if (valorSelect === "2") {
//       //   // Si el valor es 2, genera el PDF 2
//       //   const doc = new jsPDF();
//       //   doc.text("Este es el PDF de Mauricio", 10, 10);
//       //   window.open(doc.output("bloburl"), "_blank");
//     } else {
//       // Si no hay selección válida, muestra una alerta
//       alert("Selecciona un turno válido para generar el PDF.");
//     }
//   };
// // 

//   return (
//     <>
//       <div className="d-flex justify-content-center gap-2 mt-3">
//         {/* Botón que genera el PDF correspondiente al valor seleccionado */}
//         <div className="text-center mt-4">
//           <Button
//             className="btn btn-primary"
//             severity={severity}
//             onClick={handlePDF}
//           >
//             Generar PDF
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };
