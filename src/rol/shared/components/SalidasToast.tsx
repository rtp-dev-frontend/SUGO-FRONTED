import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

// Componente para mostrar mensajes toast de salidas a ruta
const SalidasToast: React.FC<{ mensajes: string[] }> = ({ mensajes }) => {
    const toast = useRef<Toast>(null);
    const mostradosRef = useRef<Set<string>>(new Set());
    const timeoutsRef = useRef<number[]>([]); // guarda ids de timeouts

    useEffect(() => {
        // limpia timeouts previos
        timeoutsRef.current.forEach(id => clearTimeout(id));
        timeoutsRef.current = [];

        if (!mensajes || mensajes.length === 0) {
            mostradosRef.current.clear();
            if (toast.current) toast.current.clear();
            return;
        }

        // Mostrar solo mensajes nuevos, espaciados cada 5000ms
        mensajes.forEach((msg, i) => {
            if (!mostradosRef.current.has(msg)) {
                const delay = i * 2000; // 2 segundos entre toasts
                const id = window.setTimeout(() => {
                    if (toast.current) {
                        toast.current.show({
                            severity: "error",
                            summary: "SALIDA A RUTA",
                            detail: msg,
                            life: 10000
                        });
                        mostradosRef.current.add(msg);
                    }
                }, delay) as unknown as number;
                timeoutsRef.current.push(id);
            }
        });

        // cleanup al desmontar o cuando mensajes cambian
        return () => {
            timeoutsRef.current.forEach(id => clearTimeout(id));
            timeoutsRef.current = [];
        };
    }, [mensajes]);

    return <Toast ref={toast} />;
};

export default SalidasToast;
