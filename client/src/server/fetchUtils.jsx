import { useError } from '../contexts/ErrorContext';
import applyHeaders from '../middleware/applyHeaders.js';

export const useFetchUtils = () => {
    const { showError } = useError();

    /**
     * Realiza una solicitud POST a la ruta especificada con los datos proporcionados.
     * @param {string} endpoint - La ruta relativa a la que se realiza la solicitud.
     * @param {Object} data - Los datos a enviar en el cuerpo de la solicitud.
     * @returns {Promise<Object>} - Una promesa que se resuelve con la respuesta en formato JSON.
     */
    const postData = async (endpoint, data, customHeaders = {}) => {
        try {
            const options = applyHeaders({
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
                headers: customHeaders
            });

            const response = await fetch(endpoint, options);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 204) {
                return undefined;
            }

            if (response.status >= 300 && response.status < 400) {
                return response.text();
            }

            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Realiza una solicitud GET a la ruta especificada.
     * @param {string} endpoint - La ruta relativa a la que se realiza la solicitud.
     * @returns {Promise<Object>} - Una promesa que se resuelve con la respuesta en formato JSON.
     */
    const getData = async (endpoint) => {
        try {
            const options = applyHeaders({
                method: 'GET'
            });

            const response = await fetch(endpoint, options);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    return { postData, getData };
};
