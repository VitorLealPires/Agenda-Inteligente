// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Permitir todos os domínios. Para produção, restrinja as origens permitidas

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));

// Importando Rotas
const clienteRoutes = require('./routes/clienteRoutes');

// Usando as rotas para o prefixo '/clientes'
app.use('/clientes', clienteRoutes);

// Definir a porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

