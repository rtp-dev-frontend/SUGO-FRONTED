import { useState } from "react"; // Hook de React para manejar el estado del formulario
import { Card } from "primereact/card"; // Tarjeta de PrimeReact para el contenedor principal
import { Dropdown } from "primereact/dropdown"; // Dropdown de PrimeReact para selects
import { InputText } from "primereact/inputtext"; // Input de texto de PrimeReact
import { Button } from "primereact/button"; // Botones de PrimeReact
import { useFormularioDespacho } from "../hooks/useFormulario"; // Hook personalizado para obtener opciones de módulos y motivos
import { InputMask } from "primereact/inputmask"; // InputMask de PrimeReact para campos con formato específico
import { Checkbox } from "primereact/checkbox"; // Checkbox de PrimeReact para opciones booleanas
import { useDateNow } from "../hooks/useDateNow"; // importa el hook directamente
import { useEcoEstado } from "../hooks/useEco"; // Hook personalizado para obtener el estado del eco
import { Tabla_pvEstados } from "./Tabla_pvEstados";
import "../css/despacho.css";

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

  const estado_eco = {
    1: "Disponible",
    2: "No disponible",
  };

  // Obtiene las opciones de módulos y motivos desde el hook personalizado
  const { modulosOptions, motivosOptions, modalidadesOptions, rutasOptions } =
    useFormularioDespacho();

  // Estado para el módulo seleccionado en el dropdown
  const [selectModulo, setSelectModulo] = useState(null);

  // Estado para el motivo seleccionado (guarda el id del motivo)
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<number | null>(
    null,
  );

  // estado para las modadlidades
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<
    number | null
  >(null);

  // estado para el tipo de planta o postura
  const [plantaPostura, setPlantaPostura] = useState<string | null>(null);

  // estado para habilitar o deshabilitar los inputs de fecha y hora
  const [activoInput, setActivoInput] = useState(false);

  // estado para la hora y fecha actual, se actualiza cada segundo si el input está activo
  const { hora, fecha } = useDateNow(activoInput);

  // estado para la ruta seleccionada
  const [rutas_autorizadas, setrutas_autorizadas] = useState<number | null>(
    null,
  );

  // estado para el eco ingresado
  const [eco, setEco] = useState<number | null>(null);
  // estado para los datos del eco obtenidos desde el hook useEcoEstado
  const { estado, loading, error } = useEcoEstado(eco);
  // Función para manejar el cambio del checkbox que habilita o deshabilita los inputs de fecha y hora
  const handleChangeInput = () => {
    setActivoInput(!activoInput);
  };

  // Busca el objeto motivo seleccionado a partir del id
  const motivoObj = motivosOptions.find((m) => m.value === motivoSeleccionado);

  return (
    <>
      <div className="contenedor-formulario-despacho">
        {/* Estado fuera del flex, centrado */}
        {estado && (
          <div
            style={{
              position: "absolute",
              left: "120px", // Ajusta según tu diseño
              top: "50px",
              zIndex: 2,
            }}
          >
            <div
              style={{
                background: "#bad3f0",
                padding: "1.5rem 1rem",
                borderRadius: "10px",
                minWidth: "300px",
                fontSize: "1.1rem",
                fontWeight: 500,
              }}
            >
              <div>{}</div>
              <b className="eco"> {estado.eco} </b>
              <br />
              <div className="ruta_modalidad">{estado.ruta_modalidad}</div>
              <div className="eco_estatus">
                {estado_eco[Number(estado.eco_estatus)]}
              </div>
              <b className="modulo_puerta">En SERVICIO por </b>
              {estado.modulo_puerta} <br />
              <b className="modulo_puerta">Desde: {estado.momento}</b> <br />
              <b className="motivo">
                Motivo: {estado.motivo_desc || "Sin motivo"}
              </b>
            </div>
          </div>
        )}
        <div className="flex justify-content-center">
          <Card
            title={
              <span className="titulo-caseta">
                Registrar Despacho del económico
              </span>
            }
            className="text-center"
            style={{
              backgroundColor: "#d4d4d4f1",
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
                  <InputText
                    value={eco !== null ? String(eco) : ""} // <-- aquí el cambio
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEco(isNaN(val) || val <= 0 ? null : val);
                    }}
                    placeholder="Económico"
                  />
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
                      value={modalidadSeleccionada}
                      onChange={(e) => setModalidadSeleccionada(e.value)}
                      options={modalidadesOptions}
                      filter
                      optionLabel="label"
                      optionValue="value"
                      className="w-full md:w-14rem"
                    />
                    <label htmlFor="dd-city">Modalidad</label>
                  </span>

                  <span className="p-float-label">
                    <Dropdown
                      value={rutas_autorizadas}
                      onChange={(e) => setrutas_autorizadas(e.value)}
                      options={rutasOptions}
                      optionLabel="label"
                      filter
                      className="w-full md:w-14rem"
                      panelStyle={{ maxWidth: "500px" }}
                    />
                    <label htmlFor="dd-city">Ruta</label>
                  </span>
                </div>

                <div className="flex justify-content-center gap-4 mt-5">
                  <span className="p-float-label">
                    <Dropdown
                      value={rutas_autorizadas}
                      onChange={(e) => setrutas_autorizadas(e.value)}
                      options={rutasOptions}
                      optionLabel="label"
                      filter
                      className="w-full md:w-14rem"
                      panelStyle={{ maxWidth: "500px" }}
                    />
                    <label htmlFor="credencial">CC</label>
                  </span>
                </div>
              </>
            )}

            {/* Inputs de checkbox, hora y fecha: SIEMPRE visibles debajo de módulo, eco y motivo */}
            <div className="flex justify-content-center gap-4 mt-5 align-items-end">
              <div
                className="flex flex-column align-items-center"
                style={{ minWidth: 60 }}
              >
                <label style={{ fontSize: 13, marginBottom: 2 }}>Editar</label>
                <Checkbox
                  onChange={handleChangeInput}
                  checked={activoInput}
                ></Checkbox>
              </div>
              <span className="p-float-label" style={{ minWidth: 180 }}>
                <InputMask
                  value={hora}
                  mask="99:99:99"
                  disabled={!activoInput}
                  style={{ width: "100%" }}
                />
                <label htmlFor="credencial">Hora</label>
              </span>
              <span className="p-float-label" style={{ minWidth: 180 }}>
                <InputMask
                  value={fecha}
                  mask="99/99/9999"
                  disabled={!activoInput}
                  style={{ width: "100%" }}
                />
                <label htmlFor="credencial">Fecha</label>
              </span>
            </div>

            {/* Botones de acción */}
            <div className="mt-5 gap-4 flex justify-content-center">
              <Button label="Enviar" raised />
              <Button label="Limpiar" severity="danger" />
            </div>
          </Card>
        </div>
      </div>

      {/* tabla de pv estados traida como componente */}
      <Tabla_pvEstados />
    </>
  );
};
