import { useState } from "react"; // Hook de React para manejar el estado del formulario
import { Card } from "primereact/card"; // Tarjeta de PrimeReact para el contenedor principal
import { Dropdown } from "primereact/dropdown"; // Dropdown de PrimeReact para selects
import { InputText } from "primereact/inputtext"; // Input de texto de PrimeReact
import { Button } from "primereact/button"; // Botones de PrimeReact
import { useFormularioDespacho } from "../hooks/useFormulario"; // Hook personalizado para obtener opciones de módulos y motivos
import { InputMask } from "primereact/inputmask"; // InputMask de PrimeReact para campos con formato específico
export const FormularioDespacho = () => {
  // Definición del tipo para las opciones de motivo
  type MotivoOption = {
    id: number;
    desc: string;
    tipo: number;
    eco_disponible: boolean;
    estatus?: number;
    label: string;
    value: number;
  };

  // planta y postura
  const plantaPosturaOptions = [
    { label: "Planta", value: "planta" },
    { label: "Postura", value: "postura" },
  ];

  // Obtiene las opciones de módulos y motivos desde el hook personalizado
  const { modulosOptions, motivosOptions } = useFormularioDespacho();

  // Estado para el módulo seleccionado en el dropdown
  const [selectModulo, setSelectModulo] = useState(null);

  // Estado para el motivo seleccionado (guarda el id del motivo)
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<number | null>(
    null,
  );

  // estado para el tipo de planta o postura
  const [plantaPostura, setPlantaPostura] = useState<string | null>(null);

  // Busca el objeto motivo seleccionado a partir del id
  const motivoObj = motivosOptions.find((m) => m.value === motivoSeleccionado);

  return (
    <>
      <div className="flex justify-content-center mt-4 mb-5">
        <Card
          title={
            <span className="titulo-caseta">
              Registrar Despacho del económico
            </span>
          }
          className="text-center"
          style={{
            backgroundColor: "#bae4b1d7",
            fontSize: "14px",
            padding: "0rem 2rem 2rem 2rem",
            position: "relative",
            maxWidth: "800px",
            borderRadius: "20px",
            width: "100%",
          }}
        >
          {/* Primera fila: Módulo, Económico y Motivo */}
          <div className="flex gap-4">
            {/* Dropdown para seleccionar el módulo */}
            <span className="p-float-label">
              <Dropdown
                inputId="dd-city"
                value={selectModulo}
                onChange={(e) => setSelectModulo(e.value)}
                options={modulosOptions}
                optionLabel="label"
                className="w-full md:w-14rem"
              />
              <label htmlFor="dd-city">Modulo</label>
            </span>

            {/* Input para el campo "Económico" */}
            <div className="flex align-items-center gap-3">
              <span className="p-float-label">
                <InputText id="username" className="w-full md:w-14rem" />
                <label htmlFor="username">Economico</label>
              </span>
            </div>

            {/* Dropdown para seleccionar el motivo */}
            <span className="p-float-label">
              <Dropdown
                value={motivoSeleccionado}
                onChange={(e) => setMotivoSeleccionado(e.value)}
                options={motivosOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Motivo"
                className="w-full md:w-14rem"
              />
              <label htmlFor="dd-city">Motivo</label>
            </span>
          </div>

          {/* Inputs adicionales que solo aparecen si el motivo es "SERVICIO" */}
          {motivoObj?.desc?.trim().toUpperCase() === "SERVICIO" && (
            <>
              <div className="flex gap-4 mt-5">
                {/* Input para "Credencial" */}
                <span className="p-float-label">
                  <InputText id="credencial" className="w-full md:w-14rem" />
                  <label htmlFor="credencial">Credencial</label>
                </span>
                {/* Input para "Turno" */}
                <span className="p-float-label">
                  <InputText id="credencial" className="w-full md:w-14rem" />
                  <label htmlFor="credencial">Turno</label>
                </span>
                {/* Otro dropdown de motivo (parece un error, podrías cambiarlo por otro campo si es necesario) */}
                <span className="p-float-label">
                  <Dropdown
                    value={plantaPostura}
                    onChange={(e) => setPlantaPostura(e.value)}
                    options={plantaPosturaOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Motivo"
                    className="w-full md:w-14rem"
                  />
                  <label htmlFor="dd-city">Eco de</label>
                </span>
              </div>

              <div className="flex gap-4 mt-5">
                <span className="p-float-label">
                  <InputText id="credencial" className="w-full md:w-14rem" />
                  <label htmlFor="credencial">No. Extintor</label>
                </span>

                <span className="p-float-label">
                  <Dropdown
                    value={plantaPostura}
                    onChange={(e) => setPlantaPostura(e.value)}
                    options={plantaPosturaOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Motivo"
                    className="w-full md:w-14rem"
                  />
                  <label htmlFor="dd-city">Modalidad</label>
                </span>

                <span className="p-float-label">
                  <Dropdown
                    value={plantaPostura}
                    onChange={(e) => setPlantaPostura(e.value)}
                    options={plantaPosturaOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Motivo"
                    className="w-full md:w-14rem"
                  />
                  <label htmlFor="dd-city">Ruta</label>
                </span>
              </div>

              <div className="flex justify-content-center gap-4 mt-5">
                <span className="p-float-label">
                  <InputText id="credencial" className="w-full md:w-14rem" />
                  <label htmlFor="credencial">CC</label>
                </span>

                <span className="p-float-label">
                  <InputMask
                    mask="12:00:00 pm"
                    placeholder="Entrada de Operador"
                  />{" "}
                  <label htmlFor="credencial">Entrada de Operador</label>
                </span>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="mt-5 gap-4 flex justify-content-center">
            <Button label="Enviar" />
            <Button label="Limpiar" severity="danger" />
          </div>
        </Card>
      </div>
    </>
  );
};
