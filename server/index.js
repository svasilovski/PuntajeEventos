import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { init } from './src/infrastructure/database.js';

import authRoutes from './src/routes/auth-routes.js';
import loginRoutes from './src/routes/login-routes.js';
import registryRoutes from './src/routes/registry-routes.js';

import { authenticateToken, ensureAuthenticated, loginDbInitialized } from './src/middleware/authMiddleware.js';

import { UserRepository } from './src/repositories/user-repository.js';

const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;
const APIBASEURL = process.env.API_BASE_URL || `http://localhost`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas Públicas
app.use('/api/login', loginRoutes);
app.use('/api/register', registryRoutes);
app.use('/', authRoutes);


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

app.use(authenticateToken);

// Rutas Protegidas
app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'), (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(err.status || 500).end();
    }
  });
});

app.use(express.static(path.resolve(__dirname, '../client/build')));

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

// Cuando termino de iniciar la base dedatos, levanto el servicio.
init()
  .then(() => {
    startServer(PORT)
    .then(server => {
      const port = server.address().port;
      console.log(`Server is running on ${APIBASEURL}:${port}`);
    })
    .catch(err => {
      console.error('Error starting server:', err);
      process.exit(1);
    });
  })
  .catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
