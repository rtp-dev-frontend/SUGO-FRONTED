/**
 * Hook principal para la gestión del formulario de carga de roles.
 *
 * Maneja los estados de selección de periodo, módulo, archivo Excel, validación, errores,
 * carga de catálogos y lógica de envío de datos.
 *
 * Devuelve el estado completo del formulario y setters para su uso en el componente principal.
 */
import { useState, useEffect } from "react";
import { fetchPeriodos } from "../services/periodoService";
import { fetchModulos } from "../services/moduloService";
import { RolFormularioState } from "../interfaces/RolFormularioState";
import { estructurarDatosDesdeFilas, parsearHojaCompleta } from "../utils";
import { cargarRolCompleto } from "../services/cargaRolService";
import useAuthStore from "../../../shared/auth/useAuthStore";

export function useRolFormulario(): RolFormularioState {
  // Estados para mostrar errores visuales en los selects de periodo y módulo
  const [periodoError, setPeriodoError] = useState(false);
  const [moduloError, setModuloError] = useState(false);
  const [periodo, setPeriodo] = useState<any>(null); // Estado para el periodo seleccionado
  const [periodos, setPeriodos] = useState<any[]>([]); // Opciones disponibles de periodo
  const [modulo, setModulo] = useState<any>(null); // Estado para el módulo seleccionado
  const [modulos, setModulos] = useState<any[]>([]); // Opciones disponibles de módulos
  const [excel, setExcel] = useState<any>(null); // Estado para el archivo seleccionado (no usado)
  const [servicios, setServicios] = useState<any[]>([]);
  const [cubredescansos, setCubredescansos] = useState<Record<string, any[]>>( {}); // Estado para los cubredescansos 
  const [jornadasExcepcionales, setJornadasExcepcionales] = useState<any[]>([]); // Estado para las jornadas excepcionales
  const [infoGeneral, setInfoGeneral] = useState<Record<string, any>>({});
  const [resultadosPorHoja, setResultadosPorHoja] = useState<any[]>([]);
  const [errores, setErrores] = useState<any[]>([]); // Array de errores de validación
  const [error, setError] = useState<string>(""); // Mensaje de error general
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga (loading)
  const [validatingData, setValidatingData] = useState<boolean>(false); // Estado de validación de datos
  const [canUpload, setCanUpload] = useState<boolean>(false); // Indica si se puede subir el archivo
  const [showErr, setShowErr] = useState<boolean>(false); // Indica si se deben mostrar errores
  const [cont, setCont] = useState<number>(0); // Contador auxiliar
  const [rolesSended, setRolesSended] = useState<any[]>([]); // Array de roles enviados
  const { credencial: credencial_usuario, modulo: modulo_usuario } = useAuthStore((store) => store.user); //obtienne credencial y modulo del usuario autenticado

  // Cargar opciones del módulo usando el servicio
  useEffect(() => {
    const loadModulos = async () => {
      const data = await fetchModulos();
      // Formatea para el selector: label = descripcion, value = id
      const formattedData = data.map((item: any) => ({
        label: item.name, // item.descripcion
        value: item.id, // item.id
      }));
      setModulos(formattedData);
    };
    loadModulos();
  }, []);

  // Cargar opciones del periodo usando el servicio
  useEffect(() => {
    const loadPeriodos = async () => {
      const data = await fetchPeriodos(); // Llama al servicio
      // Transforma los datos al formato esperado
      const formattedData = data.map((item: any) => ({
        label: item.name,
        value: item.self,
      }));
      setPeriodos(formattedData); // Asigna las opciones transformadas

      // Seleccionar automáticamente el periodo actual
      const hoy = new Date();
      const periodoActual = formattedData.find((p: any) => {
        // Suponiendo que value.fecha_inicio y value.fecha_fin están en formato dd/mm/aaaa
        const [diaIni, mesIni, anioIni] = p.value.fecha_inicio.split("/");
        const [diaFin, mesFin, anioFin] = p.value.fecha_fin.split("/");
        const ini = new Date(`${anioIni}-${mesIni}-${diaIni}`);
        const fin = new Date(`${anioFin}-${mesFin}-${diaFin}`);
        return ini <= hoy && hoy <= fin;
      });
      if (periodoActual) {
        setPeriodo(periodoActual.value);
      }
    };

    loadPeriodos();
  }, []); // Se ejecuta una vez al montar el componente


  // Envia el rol completo al backend
  const sendData = async (excelData?: any) => {
    try {
      setError("");
      setErrores([]);
      setShowErr(false);
      setValidatingData(true);
      // Procesar por hoja y guardar en un array
      const hojas = await parsearHojaCompleta(excelData ?? excel, true);
      const hojasEstructuradas = hojas.map(({ nombre, filas }) => {
        const estructuraHoja = estructurarDatosDesdeFilas(filas);
        return {
          nombre,
          encabezado: estructuraHoja.encabezado,
          servicios: estructuraHoja.servicios,
          cubredescansos: estructuraHoja.cubredescansos,
          jornadasExcepcionales: estructuraHoja.jornadasExcepcionales,
        };
      });

      await cargarRolCompleto({
        nombre_archivo: excel?.name,
        subido_por: credencial_usuario,
        hojas: hojasEstructuradas,
        periodo,
        modulo
      });
      // Si no hay error, limpiar errores y mostrar ok
      setErrores([]);
      setShowErr(true);
    } catch (e: any) {
      if (e.errores) {
        setErrores(e.errores); // Muestra todos los errores del backend
      } else {
        setErrores([{ message: e.message }]);
      }
      setError(String(e.message || e)); // Mensaje de error general
      setShowErr(true); // Muestra la sección de errores
    } finally {
      setValidatingData(false); // Termina la validación
    }
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setPeriodo(null);
    setModulo(null);
    setExcel(null);
    setPeriodoError(false);
    setModuloError(false);
  };

  return {
    // Retorna todo el estado y funciones necesarias
    periodo,
    setPeriodo,
    periodos,
    modulo,
    setModulo,
    modulos,
    excel,
    setExcel,
    infoGeneral,
    servicios,
    errores,
    error,
    isLoading,
    validatingData,
    canUpload,
    showErr,
    cont,
    sendData,
    limpiarFormulario,
    rolesSended,
    // getHeaderForPrint: devuelve infoGeneral plano
    getHeaderForPrint: () => Object.assign({}, infoGeneral),
    periodoError,
    setPeriodoError,
    moduloError,
    setModuloError,
  };
}
