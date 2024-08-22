import express from 'express';
import { getUserData } from '../controllers/loginController.js';
import { UserRepository } from '../repositories/user-repository.js';

const router = express.Router();

router.get('/login/user', getUserData);

router.post('/logout', (req, res) => {
    const val = UserRepository.logout();
    res.clearCookie(val.name, val.options);

    res.redirect('/login');
});

export default router;
