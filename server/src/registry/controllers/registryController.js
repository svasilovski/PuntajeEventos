import { UserRepository } from '../../repositories/user-repository.js';

export async function register(req, res) {
    const { username, password, name, surname, email } = req.body;

    try {
        const ret = await UserRepository.create({ username, password, name, surname, email });

        res.status(ret.statusCode).json({ message: ret.message });
    } catch (error) {
        if(error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
