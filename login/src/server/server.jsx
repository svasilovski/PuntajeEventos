import { useFetchUtils } from './fetchUtils';

export const useAuth = () => {
    const { postData } = useFetchUtils();

    const login = async (email, password) => {
        return await postData('/api/login', { email, password });
    };

    const register = async (name, email, password) => {
        return await postData('/api/register', { name, email, password });
    };

    return { login, register };
};


