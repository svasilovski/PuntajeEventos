import express from 'express';
import { login, getUserData } from './controllers/loginController.js';
import authenticateToken from '../middleware/authenticateToken.js';
// import jwt from 'jsonwebtoken';

const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Debes asegurar este valor a través de variables de entorno

/*
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};
*/

// Rutas No portegidas
router.post('/', login);

router.use(authenticateToken);
// Ruta protegida por el middleware de JWT
router.get('/user', getUserData);

export default router;

