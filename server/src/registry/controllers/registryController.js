import bcrypt from 'bcrypt';
import { getDbLogin, getDbUsers } from '../../infrastructure/database.js';

const SALT = process.env.SALT || 10;

export async function register(req, res) {
    const { username, password, name, surname, email } = req.body;

    if (!username || !password || !name || !surname || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const dbLogin = getDbLogin();
        const dbUsers = getDbUsers();

        const existingUser = await dbLogin.get('SELECT * FROM login WHERE username = ?', username);
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const _salt = bcrypt.genSaltSync(SALT);
        const hashedPassword = bcrypt.hashSync(password, _salt);

        const result = await dbLogin.run('INSERT INTO login (username, password) VALUES (?, ?)', [username, hashedPassword]);
        const loginId = result.lastID;

        await dbUsers.run('INSERT INTO users (id, name, surname, email) VALUES (?, ?, ?, ?)', [loginId, name, surname, email]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
