// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Importando Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/auth');
const acaoRoutes = require('./routes/acaoRoutes');

// Usando Rotas (padronizado com /api)
app.use('/api/clientes', clienteRoutes);
app.use('/api/acoes', acaoRoutes);
app.use('/api/auth', authRoutes);

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
