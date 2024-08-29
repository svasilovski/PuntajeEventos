import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __pathclient = '../../../client/build';

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname, __pathclient, 'index.html'), (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(err.status || 500).end();
        }
    });
});

router.use(express.static(path.resolve(__dirname, __pathclient)));

export default router;
