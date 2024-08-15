import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../server/server';
import './AuthPage.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const data = await registerUser(name, email, password);
            console.log('Registration successful', data);
        } catch (error) {
            setError('Error en el registro. Intenta de nuevo.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Regístrate</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <button type="submit">Regístrate</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login">
                        <button className="auth-button">Inicia sesión</button>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
