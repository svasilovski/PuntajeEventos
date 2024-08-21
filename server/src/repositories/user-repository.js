import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { init, getDbLogin, getDbUsers } from '../infrastructure/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT = process.env.SALT || 10;
const NAME_TOKEN = 'authToken'

export class UserRepository {
    static async login({ username, password }) {
        try {
            const dbLogin = getDbLogin();
            const user = await dbLogin.get('SELECT * FROM login WHERE username = ?', username);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                let error =  new Error ('Invalid credentials');
                error.statusCode = 401;
                error.local = true;
                throw error;
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

            return {
                name: NAME_TOKEN,
                value: token,
                options: {
                    httpOnly: true, // Impide el acceso al token desde JavaScript
                    secure: process.env.NODE_ENV === 'production', // Solo enviar la cookie en HTTPS en producción
                    maxAge: 3600000 // Duración de la cookie en milisegundos (1 hora en este caso)
                },
                message: 'Logged in successfully'
            };
        }catch (err) {
            if(err.local) throw err;

            let error =  new Error ('Internal Server Error');
            error.statusCode = 500;
            throw error;
        }
    }

    static logout() {
        return {
            name: NAME_TOKEN,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                path: '/'
            }
        };
    }

    static async create({ username, password, name, surname, email }) {
        if (!username || !password || !name || !surname || !email) {
            let error =  new Error ('All fields are required');
            error.statusCode = 400;
            error.local = true;
            throw error;
        }

        try {
            const dbLogin = getDbLogin();
            const dbUsers = getDbUsers();

            const existingUser = await dbLogin?.get('SELECT * FROM login WHERE username = ?', username);
            if (existingUser) {
                let error =  new Error ('Username already exists');
                error.statusCode = 400;
                error.local = true;
                throw error;
            }
            const isAdmin = await dbUsers?.get('SELECT 1 AS has_admin FROM users WHERE role = ? LIMIT 1',['A']);

            const _salt = await bcrypt.genSalt(SALT);
            const hashedPassword = await bcrypt.hash(password, _salt);

            const result = await dbLogin?.run('INSERT INTO login (username, password) VALUES (?, ?)', [username, hashedPassword]);
            const loginId = result.lastID;

            let role = isAdmin ? 'V': 'A';
            await dbUsers.run('INSERT INTO users (id, name, surname, email, role) VALUES (?, ?, ?, ?, ?)', [loginId, name, surname, email, role]);

            return {
                message: 'User registered successfully',
                statusCode: 201
            }
        } catch (err) {
            if(err.local) throw err;

            let error =  new Error ('Internal Server Error');
            error.statusCode = 500;
            throw error;
        }
    }

    static async getUserLoged(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const dbUsers = getDbUsers();
            const user = await dbUsers?.get('SELECT * FROM users WHERE id = ?', decoded.id);

            if (!user) {
                let error =  new Error ('User not found');
                error.statusCode = 404;
                error.local = true;
                throw error;
            }

            return user;
        } catch (err) {
            if(err.local) throw err;

            let error =  new Error ('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
    }

    static async checkAdmins() {
        try {
            const dbUsers = getDbUsers();
            const result = await dbUsers?.get(
                'SELECT 1 AS has_admin FROM users WHERE role = ? LIMIT 1',
                ['A']
            );
            return result ? 1 : 0;
        } catch (err) {
            console.error('Error al consultar la base de datos:', err);

            let error =  new Error ('Error al consultar la base de datos:');
            error.statusCode = 500;
            throw error;
        }
    }

    static async updateUserData(userId, name, surname, email) {
        try {
            const dbUsers = getDbUsers();
            await dbUsers.run(
                'UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?',
                [name, surname, email, userId]
            );

            return {
                message: 'Datos del usuario actualizados correctamente.',
                statusCode: 201
            }
        } catch (err) {
            if(err.local) throw err;

            let error =  new Error ('Internal Server Error. \r\nError al actualizar los datos del usuario.');
            error.statusCode = 500;
            throw error;
        }
    }

    static async updateUserRole(userId, newRole) {
        try {
            const dbUsers = getDbUsers();
            await dbUsers.run(
                'UPDATE users SET role = ? WHERE id = ?',
                [newRole, userId]
            );

            return {
                message: 'Rol del usuario actualizado correctamente.',
                statusCode: 201
            }
        } catch (err) {
            if(err.local) throw err;

            let error =  new Error ('Internal Server Error. \r\nError al actualizar el rol del usuario.');
            error.statusCode = 500;
            throw error;
        }
    }
}
