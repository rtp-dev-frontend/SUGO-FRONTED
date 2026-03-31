import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from 'react';
import { useFormularioDespacho } from "../../despacho/hooks/useFormulario"; // Hook personalizado para obtener opciones de módulos y motivos
import "../css/recepcion.css";


export const FormularioRecepcion = () => {
    // Obtiene las opciones de módulos y motivos desde el hook personalizado
    const { modulosOptions } =
        useFormularioDespacho();

    // Estado para el módulo seleccionado en el dropdown
    const [selectModulo, setSelectModulo] = useState(null);

    return (
        <>
            <div className='contenedor-formulario-recepcion'>
                <div className='flex justify-content-center'>
                    <Card
                        title={
                            <span className="titulo-caseta ">
                                Registro de Recepcion del económico
                            </span>
                        }
                        className="text-center card"
                    >
                        <div className="flex gap-4 mt-4">
                            <Dropdown value={selectModulo} onChange={(e) => setSelectModulo(e.value)} options={modulosOptions} optionLabel="label"
                                placeholder="Modulos" className="w-full md:w-14rem" />
                        </div>
                    </Card>
                </div>

            </div>
        </>
    )
}
