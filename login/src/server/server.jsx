import { useFetchUtils } from './fetchUtils';

export const useAuth = () => {
    const { postData } = useFetchUtils();

    const login = async (username, password) => {
        const response =  await postData('/api/login', { username, password });

        if (!response || !response.redirected) {
            window.location.href = '/';
        }
    };

    const register = async (name, surname, email, username, password) => {
        return await postData('/api/register', { name, surname, email, username, password });
    };

    return { login, register };
};


