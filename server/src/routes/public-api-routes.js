import express from 'express';
import { login } from '../controllers/loginController.js';
import { register } from '../controllers/registryController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

export default router;

