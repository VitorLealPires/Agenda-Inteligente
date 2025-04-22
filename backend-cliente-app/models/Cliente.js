// models/Cliente.js
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true }, // Removido o unique: true
  telefone: { type: String, required: true },

  // Ações associadas a este cliente
  acoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Acao' }]
});

module.exports = mongoose.model('Cliente', ClienteSchema);
