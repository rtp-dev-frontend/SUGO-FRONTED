import { Button } from "primereact/button"; // Botones de PrimeReact
import { Card } from "primereact/card"; // Tarjeta de PrimeReact
import { Dropdown } from "primereact/dropdown"; // Dropdown de PrimeReact
import { InputText } from "primereact/inputtext"; // Input de texto de PrimeReact
import { SelectButton } from "primereact/selectbutton"; // Botón de selección múltiple de PrimeReact
import { useFormularioCaseta } from "../hooks/useFormulario"; // Hook personalizado con la lógica del formulario
import { RadioButton } from "primereact/radiobutton"; // RadioButton de PrimeReact
import { Checkbox } from "primereact/checkbox"; // Checkbox de PrimeReact
import { InputMask } from "primereact/inputmask"; // InputMask de PrimeReact

import "../styles/caseta_.css"; // Estilos personalizados

export const FormularioCaseta = () => {
  const {
    modulosOptions, // Opciones para el dropdown de módulos
    selectedModulo, // Módulo seleccionado
    setSelectedModulo, // Función para cambiar el módulo seleccionado
    economico, // Valor del input "Económico"
    setEconomico, // Función para cambiar el valor de "Económico"
    estado, // Valor seleccionado en el SelectButton
    handleEstadoYTextoChange, // Función para cambiar el estado
    color, // Color de fondo de la Card
    text, // Texto de la etiqueta en la esquina superior derecha
    handleEnableMotivos, // Función para habilitar el dropdown de motivos
    motivosDisabled, // Estado de si el dropdown de motivos está deshabilitado
    motivosOptions, // Opciones para el dropdown de motivos
    motivoSeleccionado, // Motivo seleccionado
    setMotivoSeleccionado, // Función para cambiar el motivo seleccionado
  } = useFormularioCaseta();

  return (
    <>
      {/* Botones de acciones en la parte superior derecha */}
      <div className="flex justify-content-end mb-3">
        <Button label="Motivos" className="mr-2" severity="help" raised />
        <Button label="Reportes" severity="secondary" raised />
      </div>

      {/* Contenedor principal centrado */}
      <div className="flex justify-content-center">
        <Card
          title={
            <span className="titulo-caseta">
              Registrar nuevo estado del <br />
              económico
            </span>
          }
          className="text-center"
          style={{
            backgroundColor: color,
            fontSize: "14px",
            padding: "0rem 2rem 2rem 2rem",
            position: "relative",
            maxWidth: "600px",
            borderRadius: "20px",
            width: "100%",
          }}
        >
          {/* Etiqueta en la esquina superior derecha */}
          <span
            style={{
              position: "absolute",
              top: ".5rem",
              right: ".5rem",
              background: "#5a5858ff",
              color: "#fff",
              padding: "0.3rem 0.8rem",
              borderRadius: "3px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              marginTop: "0.8rem",
            }}
          >
            {text}
          </span>

          <div className="flex flex-row gap-3 align-items-center">
            {/* Dropdown de módulos */}
            <div className="flex-1">
              <span className="p-float-label w-full">
                <Dropdown
                  inputId="modulo"
                  value={selectedModulo}
                  onChange={(e) => setSelectedModulo(e.value)}
                  options={modulosOptions}
                  optionLabel="label"
                  optionValue="value"
                  className="w-full"
                  placeholder="Selecciona un módulo"
                />
                <label htmlFor="modulo">Módulo</label>
              </span>
            </div>

            {/* Input de texto para "Económico" */}
            <div className="flex-1">
              <span className="p-float-label w-full">
                <InputText
                  id="economico"
                  value={economico}
                  onChange={(e) => setEconomico(e.target.value)}
                  className="w-full"
                />
                <label htmlFor="economico">Económico</label>
              </span>
            </div>

            {/* Radio buttons verticales a la derecha */}
            <div className="flex flex-column radio-container gap-1 ml-1">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="estado"
                  value="Despacho"
                  checked={estado === "Despacho"}
                  onChange={(e) => {
                    handleEstadoYTextoChange(e);
                    handleEnableMotivos();
                  }}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Despacho
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="estado"
                  value="Actualización"
                  checked={estado === "Actualización"}
                  onChange={(e) => {
                    handleEstadoYTextoChange(e);
                    handleEnableMotivos();
                  }}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  Actualización
                </label>
              </div>
            </div>
          </div>

          {/* Dropdown deshabilitado como placeholder */}
          <div className="flex-1">
            <Dropdown
              disabled={motivosDisabled}
              placeholder="Motivo"
              className="w-full md:w-14rem mt-3"
              inputId="Motivos"
              value={motivoSeleccionado}
              onChange={(e) => setMotivoSeleccionado(e.value)}
              options={motivosOptions}
            />
            <div className="p-checkbox gap-2 ">
              <Checkbox
                style={{
                  marginLeft: "1rem",
                }}
              ></Checkbox>
            </div>
            <InputMask
              mask="99-999999"
              placeholder="99-999999"
              className=""
              disabled
              style={{ marginLeft: "2rem", width: "150px" }}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-content-center gap-3 mt-4">
            <Button label="Enviar" severity="success" />
            <Button label="Cancelar" severity="danger" />
          </div>
        </Card>
      </div>
    </>
  );
};
