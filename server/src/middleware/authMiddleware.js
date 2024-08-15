import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        if (req.originalUrl === '/login') {
            return res.redirect('/');
        }

        return next();
    }

    res.redirect('/login');
}
