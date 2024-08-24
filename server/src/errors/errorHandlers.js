import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { fileFilterMiddleware } from '../middleware/filterMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __patherror = '../../../error-pages/public';

const router = express.Router();

router.use('/errors', fileFilterMiddleware);
router.use('/errors', express.static(path.resolve(__dirname, __patherror)));

router.use((req, res, next) => {
    const error = new Error('Página no encontrada');
    error.status = 404;
    throw error;
});

router.use((err, req, res, next) => {
    const statusCode = err.status || 500;

    switch (statusCode) {
        case 400:
            res.status(400).sendFile(path.resolve(__dirname, __patherror, '400.html'));
            break;
        case 401:
            res.status(401).sendFile(path.resolve(__dirname, __patherror, '401.html'));
            break;
        case 403:
            res.status(403).sendFile(path.resolve(__dirname, __patherror, '403.html'));
            break;
        case 404:
            res.status(404).sendFile(path.resolve(__dirname, __patherror, '404.html'));
            break;
        case 502:
            res.status(502).sendFile(path.resolve(__dirname, __patherror, '502.html'));
            break;
        case 503:
            res.status(503).sendFile(path.resolve(__dirname, __patherror, '503.html'));
            break;
        case 504:
            res.status(504).sendFile(path.resolve(__dirname, __patherror, '504.html'));
            break;
        default:
            res.status(500).sendFile(path.resolve(__dirname, __patherror, '500.html'));
            break;
    }
});

export default router;
