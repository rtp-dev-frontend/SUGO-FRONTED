import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export const FormularioCaseta = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "Ciudad de México", code: "CDMX" },
    { name: "Guadalajara", code: "GDL" },
    { name: "Monterrey", code: "MTY" },
  ];
  return (
    <>
      <div className="flex justify-content-end">
        <Button label="Motivos" className=" m-2" severity="help" raised />
        <Button label="Reportes" className=" m-2" severity="secondary" raised />
      </div>

      <div
        className="flex justify-content-center"
        style={{ minHeight: "200px" }}
      >
        <Card
          title="Filtro de Reportes"
          className="text-center"
          style={{ width: "38rem", backgroundColor: "#EEEEEE" }}
        >
          <Dropdown
            inputId="dd-city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={cities}
            optionLabel="name"
            className="w-full"
            placeholder="Selecciona una ciudad"
          />
        </Card>
      </div>
    </>
  );
};
