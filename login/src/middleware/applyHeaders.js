/**
 * Aplica encabezados a una solicitud.
 * @param {RequestInit} options - Las opciones de la solicitud.
 * @returns {RequestInit} - Las opciones de la solicitud con los encabezados aplicados.
 */
function applyHeaders(options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    return { ...options, headers };
}

export default applyHeaders;
