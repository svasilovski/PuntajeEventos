const path = require('path');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true })); // analiza datos codificados en la URL application/x-www-form-urlencoded
app.use(express.json()); // analizar datos en formato JSON en el cuerpo de la solicitud
// app.use('/', userRoutes);

// Hace que node sirva los archivos de la app cliente
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
  res.json({ message: "En está ruta estaran los endpoint al servidor!" });
});

// Todas las peticiones GET que no hayamos manejado retornamos a la app cliente.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


