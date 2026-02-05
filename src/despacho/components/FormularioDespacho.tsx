import { Card } from "primereact/card";

export const FormularioDespacho = () => {
  return (
    <>
      <div className="flex justify-content-center mt-4">
        <Card
          title={
            <span className="titulo-caseta">
              Registrar Despacho del económico
            </span>
          }
          className="text-center"
          style={{
            backgroundColor: "#cac9c9be",
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
          ></span>
          <p className="m-0">Hoola mundo</p>
        </Card>
      </div>
    </>
  );
};
