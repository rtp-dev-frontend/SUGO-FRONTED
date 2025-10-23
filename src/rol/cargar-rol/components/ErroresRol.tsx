import React from 'react';
import { Divider } from 'primereact/divider';
import { LoadingDialog } from '../../../shared/components/Loaders';
import { ProgressBar } from 'primereact/progressbar';
import { ErroresRolProps } from '../interfaces/ErroresRolProps';

export const ErroresRol: React.FC<ErroresRolProps> = ({ errores, showErr, isLoading, validatingData, cont }) => (
    <>
        {(!showErr)
            ? null
            : errores.length === 0
                ? <p className='my-6 px-3 mx-auto w-12 sm:w-max p-tag bg-green-500' style={{ fontSize: '40px' }}>
                    <span className='mx-2'>Todo Ok</span>
                    &#128076;
                </p>
                : <>
                    <Divider className='mt-6' align='center'>
                        <span className="p-tag bg-red-500">Notas</span>
                    </Divider>
                    {/* Muestra los errores recibidos del backend */}
                    <ul style={{ color: 'red', fontSize: '18px', margin: '1em 0' }}>
                        {errores.map((err: any, idx: number) => (
                            <li key={idx}>{err.message || err}</li>
                        ))}
                    </ul>
                </>
        }
        <LoadingDialog isVisible={isLoading || validatingData}>
            <h2> {validatingData ? 'Verificando Rol' : 'Cargando...'} </h2>
            <ProgressBar value={cont} />
        </LoadingDialog>
    </>
);
