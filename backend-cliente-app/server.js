// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// Configuração de CORS para produção (Vercel) e local
const allowedOrigins = [
  "https://agenda-inteligente.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Middleware de autenticação JWT
const authMiddleware = require('./middlewares/authMiddleware');

// Importando Rotas protegidas com try-catch para facilitar debug
try {
  const clienteRoutes = require('./routes/clienteRoutes');
  app.use('/clientes', authMiddleware, clienteRoutes);
} catch (err) {
  console.error('Erro ao carregar clienteRoutes:', err);
}

try {
  const acaoRoutes = require('./routes/acaoRoutes');
  app.use('/acoes', authMiddleware, acaoRoutes);
} catch (err) {
  console.error('Erro ao carregar acaoRoutes:', err);
}

try {
  const authRoutes = require('./routes/auth');
  app.use('/auth', authRoutes);
} catch (err) {
  console.error('Erro ao carregar authRoutes:', err);
}

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

