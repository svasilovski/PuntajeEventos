import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../server/server';
import './AuthPage.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [formValid, setFormValid] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const passwordsMatch = password === confirmPassword;
        setPasswordMatch(passwordsMatch);
        setFormValid(
            name && surname && email && username && password && confirmPassword && passwordsMatch
        );
    }, [name, surname, email, username, password, confirmPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!formValid) {
            return;
        }

        try {
            await register(name, surname, email, username, password);
            navigate('/login');
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
                        type="text"
                        placeholder="Apellido"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
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
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={!formValid}>Regístrate</button>
                    {!passwordMatch && <p className="error-message">Las contraseñas no coinciden.</p>}
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
