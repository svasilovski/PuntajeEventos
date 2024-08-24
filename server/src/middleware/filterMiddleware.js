import path from 'path';

const allowedExtensions = ['.css', '.svg'];

export const fileFilterMiddleware = (req, res, next) => {
    const extname = path.extname(req.url);

    if (allowedExtensions.includes(extname)) {
        next();
    } else {
        const error = new Error('Forbidden');
        error.status = 403;
        throw error;
    }
};;
