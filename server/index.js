import "./src/extensions/dateExtensions.js";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";
import { init } from "./src/infrastructure/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import publicApiRoutes from "./src/routes/public-apiRoutes.js";
import protectedApiRoutes from "./src/routes/protected-apiRoutes.js";
import protectedClientRoutes from "./src/routes/protected-clientRoutes.js";
import errorHandlers from "./src/errors/errorHandlers.js";

import {
  authenticateToken,
  ensureAuthenticated,
  loginDbInitialized,
} from "./src/middleware/authMiddleware.js";

import { UserRepository } from "./src/repositories/userRepository.js";

const environment = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3001;
const APIBASEURL = process.env.API_BASE_URL || `http://localhost`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas Públicas
app.use("/api", publicApiRoutes);
app.use("/", authRoutes);

app.use(authenticateToken);

app.use("/api", protectedApiRoutes);
app.use("/", protectedClientRoutes);

app.use(errorHandlers);

const startServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (err) => {
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
      .then((server) => {
        const port = server.address().port;
        console.log(`Server is running on ${APIBASEURL}:${port}`);
      })
      .catch((err) => {
        console.error("Error starting server:", err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
