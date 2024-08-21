import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user-repository.js';

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
    if (req.isAuthenticated) {
        if (req.originalUrl === '/login') {
            console.log('/login to /')
            return res.redirect('/');
        }

        return next();
    }
    res.redirect('/login');
}

export async function loginDbInitialized(req, res, next) {
    const isAdmin = await UserRepository.checkAdmins();
    if(isAdmin === 0){
        return res.redirect('/register');
    }

    return next();
}
