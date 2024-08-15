import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../server/server';
import './AuthPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const data = await loginUser(email, password);
            console.log('Login successful', data);
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
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Iniciar sesión</button>
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
