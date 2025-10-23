/**
 * Servicio para manejar la descarga de plantillas de Excel
 */

/**
 * Descarga la plantilla de Excel para el módulo de roles
 * @returns Promise<void>
 */
export const descargarPlantillaExcel = async (): Promise<void> => {
    try {
        // Usar ruta relativa que se adapte al entorno
        const response = await fetch('/api/rol/plantilla', {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        if (response.ok) {
            // Verificar que es el tipo de contenido correcto
            const contentType = response.headers.get('content-type');
            
            const blob = await response.blob();
            
            if (blob.size === 0) {
                throw new Error('El archivo descargado está vacío');
            }
            
            // Crear el blob con el tipo correcto si no lo tiene
            const correctBlob = new Blob([blob], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            const url = window.URL.createObjectURL(correctBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'programacion_del_servicio.xlsx';
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
        } else {
            const errorText = await response.text();
            throw new Error(`Error al obtener la plantilla del servidor: ${response.status}`);
        }
    } catch (error) {
        console.error('Error al descargar la plantilla:', error);
        throw error;
    }
};