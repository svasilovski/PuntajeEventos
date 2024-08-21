import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { loginDbInitialized } from '../middleware/authMiddleware.js';
import { UserRepository } from '../repositories/user-repository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/api/logout', (req, res) => {
    const val = UserRepository.logout();
    res.clearCookie(val.name, val.options);

    res.redirect('/login');
});


router.get('/login', loginDbInitialized, (req, res, next) => {
    if (req.isAuthenticated) {
        const redirectTo = req.session.redirectTo || '/';
        return res.redirect(redirectTo);
    }
    next();
}, express.static(path.resolve(__dirname, '../../../login/build')));

router.use('/login',express.static(path.resolve(__dirname, '../../../login/build')));
router.use('/register',express.static(path.resolve(__dirname, '../../../login/build')));

/*
const logout = async () => {
    try {
        const response = await postData('/api/logout');

        if (!response || !response.redirected) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout Error:', error);
    }
};
*/

export default router;
