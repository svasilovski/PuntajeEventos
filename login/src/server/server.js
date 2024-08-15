const API_BASE_URL = 'https://your-api-domain.com/api'; // Cambia esto a la URL de tu API

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
}

export async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de registro');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en registerUser:', error);
        throw error;
    }
}
