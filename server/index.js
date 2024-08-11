import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { init } from './src/infrastructure/database.js';

import loginRoutes from './src/login/routes.js';
import registryRoutes from './src/registry/routes.js';

import { authenticateToken } from './src/middleware/authMiddleware.js';

const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;
const APIBASEURL = process.env.API_BASE_URL || `http://localhost`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

init().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

app.use(authenticateToken);

app.use('/api/login', loginRoutes);
app.use('/api/register', registryRoutes);

app.use('/login',express.static(path.resolve(__dirname, '../login/build')));
app.use('/client',express.static(path.resolve(__dirname, '../client/build')));

app.get('/', (req, res) => {
  if (req.isAuthenticated) {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  } else {
    res.sendFile(path.resolve(__dirname, '../login/build', 'index.html'));
  }
});

// Otras rutas después de autenticación

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

const startServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on('error', (err) => {
      if (port === PREFERRED_PORT) {
        console.log(`Port ${port} is in use. Trying a dynamic port...`);
        startServer(0).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

startServer(PORT)
  .then(server => {
    const port = server.address().port;
    console.log(`Server is running on ${APIBASEURL}:${port}`);
  })
  .catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
