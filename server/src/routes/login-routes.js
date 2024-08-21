import express from 'express';
import { login, getUserData } from '../controllers/loginController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Rutas No portegidas
router.post('/', login);

router.use(authenticateToken);
// Ruta protegida por el middleware de JWT
router.get('/user', getUserData);

export default router;

