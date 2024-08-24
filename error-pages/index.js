import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Servidor de páginas de error corriendo en http://localhost:${port}`);
});
