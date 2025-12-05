import { Card } from "primereact/card";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState, useRef } from "react";
import { Turnos } from "../hook/Turnos";
import { Toast } from "primereact/toast";
import { validarCampos } from "../utils/validacion_inputs";
import { ReportePVO } from "../shared/pdfs/ReportePVO";
import { RepRegresoEco } from "../shared/pdfs/RepRegresoEco";
import { Reporte_GacetaDespacho } from "../shared/pdfs/Reporte_GacetaDespacho";

export const Formulario = () => {
  const toast = useRef<Toast>(null); // 1. Referencia para Toast
  const [mostrarPdf, setMostrarPdf] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState<Date | null>(null);
  const [pdfError, setPdfError] = useState(false);
  const [turnoError, setTurnoError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  // estado para el tipo de PDF seleccionado pasando como parametro el name y code
  const [selectedTipoPdf, setSelectedTipoPdf] = useState<{
    name: string;
    code: string;
  } | null>(null);

  // objeto con los tipos de PDF disponibles
  const tipoPDF = [
    { name: "Reporte del P.V.O en tres horarios", code: "1" },
    { name: "Reporte Telefonico de Siniestros", code: "2" },
    { name: "Reporte de Control de Radio", code: "3" },
    { name: "Reporte de Control de Expresos y Nochebus", code: "4" },
    { name: "Reporte de Control de Regresos de Autobuses", code: "5" },
    { name: "Reporte Gaceta de Despacho", code: "6" }, // ...
  ];

  // Usa el hook aquí
  const turnos = Turnos();

  // Los handles sirven para actualizar los estados y limpiar errores
  // Maneja el cambio de tipo de PDF
  const handleTipoPdfChange = (e: DropdownChangeEvent) => {
    setSelectedTipoPdf(e.value);
    setPdfError(false); // Limpia el error al seleccionar tipo de PDF
    // console.log(e.value);
  };

  // Maneja el cambio de turno
  const handleTurnoChange = (e: DropdownChangeEvent) => {
    setSelectedTurno(e.value);
    setTurnoError(false);
    // console.log(e.value);
  };

  // Maneja el cambio de fecha
  const handleFechaChange = (e: CalendarChangeEvent) => {
    setSelectedFecha(e.value as Date | null);
    setFechaError(false);
    // console.log(e.value);
  };

  // Funcion para validar los campos y mostrar el PDF
  const handleFiltrar = () => {
    if (
      validarCampos({
        selectedTipoPdf,
        setPdfError,
        selectedTurno,
        setTurnoError,
        selectedFecha,
        setFechaError,
        toast,
      })
    ) {
      setMostrarPdf(true);
    }
  };

  // const pdfGenerators: Record<string, () => void> = {
  //   "1": ReportePVO,
  //   "5": RepRegresoEco,
  //   "6": Reporte_GacetaDespacho,
  // };

  // const handleGenerarPDF = () => {
  //   if (selectedTipoPdf?.code && pdfGenerators[selectedTipoPdf.code]) {
  //     pdfGenerators[selectedTipoPdf.code]();
  //   }
  // };
    // AHORA SI RECIBE TURNO Y FECHA
  const pdfGenerators: Record<
    string,
    (turno: any, fecha: Date | null) => void
  > = {
    "1": ReportePVO,
    "5": RepRegresoEco,
    "6": Reporte_GacetaDespacho,
  };

  const handleGenerarPDF = () => {
    if (selectedTipoPdf?.code && pdfGenerators[selectedTipoPdf.code]) {
      pdfGenerators[selectedTipoPdf.code](selectedTurno, selectedFecha);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-content-center  align-content-center">
        <Card
          title="Filtro de Reportes"
          className="text-center"
          style={{ width: "38rem", backgroundColor: "#EEEEEE" }}
        >
          <div className="flex gap-2">
            <Dropdown
              value={selectedTipoPdf}
              onChange={handleTipoPdfChange}
              options={tipoPDF}
              optionLabel="name"
              placeholder="Tipo de pdf"
              className={
                pdfError ? "p-invalid w-full md:w-14rem" : "w-full md:w-14rem"
              }
            />
            <>
              <Dropdown
                value={selectedTurno}
                onChange={handleTurnoChange}
                options={turnos}
                optionLabel="label"
                placeholder="Turno"
                className={
                  turnoError
                    ? "p-invalid w-full md:w-14rem"
                    : "w-full md:w-14rem"
                }
              />
              <Calendar
                placeholder="Seleccione Fecha"
                value={selectedFecha}
                onChange={handleFechaChange}
                className={
                  fechaError
                    ? "p-invalid w-full md:w-14rem"
                    : "w-full md:w-14rem"
                }
              />
            </>
          </div>
          <div className="flex justify-content-center mt-4">
            <Button
              label="Filtrar"
              severity="success"
              icon="pi pi-search"
              onClick={handleFiltrar}
            />
          </div>
        </Card>
      </div>

      {mostrarPdf && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          <div className="text-center mt-4">
            <Button
              label={
                selectedTipoPdf ? `${selectedTipoPdf?.name}` : "Generar PDF"
              }
              severity="danger"
              icon="pi pi-file-pdf"
              onClick={handleGenerarPDF}
            />
          </div>
        </div>
      )}

      {/* validacion para mostrar PDFs  dependiendo del code*/}
      {/* {mostrarPdf &&
        selectedTipoPdf?.code &&
        (() => {
          const PdfComponent = pdfComponents[selectedTipoPdf.code];
          return PdfComponent ? <PdfComponent severity={severity} /> : null;
        })()} */}
    </>
  );
};
