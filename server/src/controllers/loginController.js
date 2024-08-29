import { UserRepository } from "../repositories/userRepository.js";

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const ret = await UserRepository.login({ username, password });
    res.cookie(ret.name, ret.value, ret.options);

    res.json({ message: ret.message });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message ?? "Error" });
    }
  }
}

export async function getUserData(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) res.status(401).json({ message: "No token provided" });

  try {
    const user = await UserRepository.getUserLoged();
    res.json(user);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message ?? "Error" });
    }
  }
}
