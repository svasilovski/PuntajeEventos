import React from 'react';
import { useAuth } from '../../server/useAuth';
import './AuthPage.css';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error durante el logout:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;
