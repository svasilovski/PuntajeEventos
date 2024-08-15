import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDbLogin, getDbUsers } from '../../infrastructure/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function login(req, res) {
    const { username, password } = req.body;

    const dbLogin = getDbLogin();
    const user = await dbLogin.get('SELECT * FROM login WHERE username = ?', username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('authToken', token, {
        httpOnly: true, // Impide el acceso al token desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo enviar la cookie en HTTPS en producción
        maxAge: 3600000 // Duración de la cookie en milisegundos (1 hora en este caso)
    });

    res.json({ message: 'Logged in successfully' });
}

export async function getUserData(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const dbUsers = getDbUsers();
        const user = await dbUsers.get('SELECT * FROM users WHERE id = ?', decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
