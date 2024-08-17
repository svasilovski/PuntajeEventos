import { useFetchUtils } from './fetchUtils';

export const useAuth = () => {
    const { postData } = useFetchUtils();

    const logout = async () => {
        try {
            const response = await postData('/api/logout', undefined, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            if (!response || !response.redirected) {
                window.location.href = '/login';
            }
        } catch (error) {
            window.location.href = '/login';
        }
    };

    return { logout };
};
