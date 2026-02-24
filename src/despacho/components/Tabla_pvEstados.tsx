import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { usePvEstadosTabla } from "../hooks/tabla_pv_estados";
import { tabla_pv_estados } from "../models/columnas_pv.models";
import "../css/despacho.css";

// Función auxiliar para formatear fecha (como en la foto 2)
const formatearFecha = (fecha: string) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const Tabla_pvEstados = () => {
  const { data, loading, error } = usePvEstadosTabla();

  // Función para definir clases CSS según los datos de la fila
  const rowClassName = (data: any) => {
    // Ajusta la condición exacta según cómo venga tu backend (mayúsculas/minúsculas)
    const tipo = data.tipo_registro ? data.tipo_registro.toLowerCase() : "";

    if (tipo.includes("recepción") || tipo.includes("recepcion")) {
      return "fila-recepcion"; // Azul
    }
    if (tipo.includes("despacho")) {
      return "fila-despacho"; // Verde
    }
    return "";
  };

  return (
    <>
      <Divider className="mi-divider" />
      <div className="flex justify-content-center">
        {loading && <ProgressSpinner animationDuration="5s" strokeWidth="4" />}
        {error && <div className="error-message">Error: {error}</div>}
      </div>

      <div className="contenedor-tabla">
        <h1 className="titulo-tabla">
          Registros de actualizaciones realizados
        </h1>

        <DataTable
          value={data}
          paginator
          rows={10}
          dataKey="id"
          className="tabla-centro-datatable"
          emptyMessage="No hay datos"
          filterDisplay="row"
          scrollable
          scrollHeight="800px"
          rowClassName={rowClassName}
          stripedRows={false} // Desactivamos rayas para que se noten los colores de fila
        >
          {tabla_pv_estados.map((col: any, idx: number) => {
            // --- COLUMNA 1: ID (Arreglada) ---
            if (col.field === "id") {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  filter
                  filterPlaceholder="Buscar..."
                  style={{
                    minWidth: "80px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
              );
            }

            // --- COLUMNA 2: MOMENTO (Con formato de fecha) ---
            if (col.field === "momento") {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  body={(rowData) => formatearFecha(rowData.momento)}
                  style={{ minWidth: "160px", textAlign: "center" }}
                  // Asumiendo que no quieres filtrar por fecha texto, sino visualización
                />
              );
            }

            // --- COLUMNA 3: ESTATUS (Badges) ---
            if (col.field === "eco_estatus") {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  style={{ textAlign: "center", minWidth: "110px" }}
                  body={(row) => (
                    <span
                      className={`badge-estatus ${row.eco_estatus === 1 ? "disponible" : "no-disponible"}`}
                    >
                      {row.eco_estatus === 1 ? "Disponible" : "No disponible"}
                    </span>
                  )}
                />
              );
            }

            // --- COLUMNA 4: COLUMNAS ANGOSTAS (Puerta, Eco) ---
            if (["modulo_puerta", "eco"].includes(col.field)) {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  filter
                  filterPlaceholder="Buscar..."
                  style={{
                    minWidth: "90px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
              );
            }

            // --- COLUMNA 5: MODALIDAD ---
            if (col.field === "eco_modalidad") {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  style={{ textAlign: "center", minWidth: "100px" }}
                  body={(row) => row.eco_modalidad?.name || "-"}
                />
              );
            }

            // --- COLUMNAS SIN FILTRO ---
            const noFilterFields = [
              "tipo_registro",
              "ruta",
              "ruta_cc",
              "op_cred",
              "op_turno",
              "extintor",
              "createdBy",
            ];

            if (noFilterFields.includes(col.field)) {
              return (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  style={{ textAlign: "center", minWidth: "100px" }}
                />
              );
            }

            // --- DEFAULT (El resto de columnas) ---
            return (
              <Column
                key={idx}
                field={col.field}
                header={col.header}
                filter
                filterPlaceholder={`Buscar...`}
                style={{ textAlign: "center", minWidth: "120px" }}
              />
            );
          })}
        </DataTable>
      </div>
    </>
  );
};
