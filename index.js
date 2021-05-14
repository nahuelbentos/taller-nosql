const express = require('express');

const cors = require('cors');

const serverPort = process.env.PORT || 5000;

// Servidor Express para el backend
const app = express();

// Lectura y parseo del body
app.use(express.json());

const { dbConnectionMongo, dbConnectionRedis } = require('./database/config');

//Configurar CORS
app.use(cors());

// Base de Datos Mongo
dbConnectionMongo();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pokemon', require('./routes/pokemon'));
app.use('/api/comentarios', require('./routes/comentarios'));

app.listen(serverPort, () => console.log(`Server running on Port ${serverPort}`));