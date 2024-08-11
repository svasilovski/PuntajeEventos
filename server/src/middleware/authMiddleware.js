import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Utiliza variables de entorno para seguridad

export function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        req.isAuthenticated = false;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.isAuthenticated = false;
        } else {
            req.isAuthenticated = true;
            req.user = user;
        }
        next();
    });
}
