import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../server/server';
import './AuthPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [formValid, setFormValid] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        setFormValid(
            username && password
        );
    }, [username, password]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!formValid) {
            return;
        }

        try {
            await login(username, password);
        } catch (error) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={!formValid}>Iniciar sesión</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <p>
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register">
                        <button className="auth-button">Regístrate</button>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
