// errorHandlers.js
import express from 'express';
const router = express.Router();

// Manejar errores 404
router.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Manejar errores generales
router.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(err.status || 500).send('Error del servidor');
});

export default router;
