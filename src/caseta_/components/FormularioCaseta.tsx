import { Button } from "primereact/button"; // Botones de PrimeReact
import { Card } from "primereact/card"; // Tarjeta de PrimeReact
import { Dropdown } from "primereact/dropdown"; // Dropdown de PrimeReact
import { InputText } from "primereact/inputtext"; // Input de texto de PrimeReact
import { SelectButton } from "primereact/selectbutton"; // Botón de selección múltiple de PrimeReact
import { useFormularioCaseta } from "../hooks/useFormulario"; // Hook personalizado con la lógica del formulario
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
    motivos, // Lista de motivos obtenidos
    motivosOptions, // Opciones para el dropdown de motivos
    setMotivos, // Función para cambiar la lista de motivos
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
          title="Registrar nuevo estado del económico"
          className="text-center"
          style={{
            backgroundColor: color,
            fontSize: "14px",
            padding: "2rem",
            position: "relative",
            maxWidth: "600px",
          }}
        >
          {/* Etiqueta en la esquina superior derecha */}
          <span
            style={{
              position: "absolute",
              top: ".5rem",
              right: ".5rem",
              background: "#4caf50",
              color: "#fff",
              padding: "0.3rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.6rem",
              fontWeight: "bold",
            }}
          >
            {text}
          </span>

          {/* Inputs alineados horizontalmente */}
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

            {/* Input de texto para "Económico" con label dentro */}
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
          </div>

          {/* SelectButton para elegir el estado */}
          <div className="mt-3">
            <SelectButton
              value={estado}
              onChange={(e) => {
                handleEstadoYTextoChange(e);
                handleEnableMotivos(); // Habilitar el Dropdown al cambiar el estado
              }}
              options={[
                { label: "Despacho", value: "Despacho" },
                { label: "Actualización", value: "Actualización" },
              ]}
              className="w-full"
            />
          </div>

          {/* Dropdown deshabilitado como placeholder */}
          <div className="flex-1">
            <Dropdown
              disabled={motivosDisabled}
              placeholder="Motivo"
              className="w-full md:w-14rem mt-3"
              inputId="Motivos"
              value={motivos}
              onChange={(e) => setMotivos(e.value)}
              options={motivosOptions}
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
