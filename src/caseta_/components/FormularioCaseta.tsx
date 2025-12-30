import { Button } from "primereact/button"; // Botones de PrimeReact
import { Card } from "primereact/card"; // Tarjeta de PrimeReact
import { Dropdown } from "primereact/dropdown"; // Dropdown de PrimeReact
import { InputText } from "primereact/inputtext"; // Input de texto de PrimeReact
import { SelectButton } from "primereact/selectbutton"; // Botón de selección múltiple de PrimeReact
import { useFormularioCaseta } from "../hooks/useFormulario"; // Hook personalizado con la lógica del formulario
import "../styles/caseta_.css"; // Estilos personalizados

export const FormularioCaseta = () => {
  // Desestructuramos los estados y funciones del hook personalizado
  const {
    modulosOptions, // Opciones para el dropdown de módulos
    selectedModulo, // Módulo seleccionado
    setSelectedModulo, // Función para cambiar el módulo seleccionado
    loading, // Estado de carga de los módulos
    economico, // Valor del input "Económico"
    setEconomico, // Función para cambiar el valor de "Económico"
    estado, // Valor seleccionado en el SelectButton
    handleEstadoYTextoChange, // Función para cambiar el estado (no se usa aquí)
    color, // Color de fondo de la Card
    text, // Texto de la etiqueta en la esquina superior derecha
    // Función para cambiar el texto y el estado
  } = useFormularioCaseta();

  // Si los módulos están cargando, mostramos un mensaje
  if (loading) {
    return <div>Cargando modulos...</div>;
  }

  return (
    <>
      {/* Botones de acciones en la parte superior derecha */}
      <div className="flex justify-content-end">
        <Button label="Motivos" className=" m-2" severity="help" raised />
        <Button label="Reportes" className=" m-2" severity="secondary" raised />
      </div>

      {/* Contenedor principal centrado */}
      <div
        className="flex justify-content-center"
        style={{ minHeight: "auto", maxWidth: "auto" }}
      >
        {/* Card principal del formulario */}
        <Card
          title="Registrar nuevo estado del economico"
          className="text-center"
          style={{
            backgroundColor: color, // Color dinámico según el estado
            fontSize: "14px",
            padding: "2rem",
            position: "relative", // Necesario para posicionar el span
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
            {text} {/* Texto dinámico según el estado */}
          </span>
          {/* Fila de inputs alineados horizontalmente */}
          <div
            className="flex align-items-end gap-6 mb-0"
            style={{ width: "0 auto", margin: "0 auto" }}
          >
            {/* Dropdown de módulos */}
            <div style={{ width: "180px" }}>
              <label htmlFor="modulo" className="form-label mb-1">
                Modulo
              </label>
              <Dropdown
                inputId="modulo"
                value={selectedModulo}
                onChange={(e) => setSelectedModulo(e.value)}
                options={modulosOptions}
                optionLabel="label"
                optionValue="value"
                className="w-100"
                style={{ height: "2.2rem" }}
                placeholder="Selecciona un modulo"
              />
            </div>
            {/* Input de texto para "Económico" */}
            <div style={{ width: "170px" }}>
              <span className="p-float-label w-100">
                <InputText
                  id="username"
                  value={economico}
                  onChange={(e) => setEconomico(e.target.value)}
                  style={{ height: "2.2rem" }}
                />
                <label htmlFor="username">Economico</label>
              </span>
            </div>
            {/* SelectButton para elegir el estado */}
            <div style={{ width: "175px" }}>
              <SelectButton
                value={estado}
                onChange={handleEstadoYTextoChange}
                options={[
                  { label: "Recepción", value: "Recepción" },
                  { label: "Actualizacion", value: "Actualizacion" },
                ]}
                className="select-btn-small"
                style={{ height: "2.2rem", width: "100%", fontSize: "20px" }}
              />
            </div>
          </div>
          <div className="flex justify-content-center align-items-center mt-7 gap-3">
            <Button label="Enviar" severity="success" />
            <Button label="Cancelar" severity="danger" />
          </div>
        </Card>
      </div>
    </>
  );
};
