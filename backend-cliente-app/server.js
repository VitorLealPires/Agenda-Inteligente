// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Importando Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/auth');
const acaoRoutes = require('./routes/acaoRoutes');

// Usando Rotas
app.use('/clientes', clienteRoutes);
app.use('/acoes', acaoRoutes);
app.use('/auth', authRoutes);

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
