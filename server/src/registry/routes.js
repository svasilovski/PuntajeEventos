import express from 'express';
import { register } from './controllers/registryController.js';

const router = express.Router();

router.post('/register', register);

export default router;
