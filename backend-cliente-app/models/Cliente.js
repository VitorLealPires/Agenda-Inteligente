// models/Cliente.js
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  telefones: [{ type: String, required: false }], // Alterado: permite vários números, não obrigatório

  // Ações associadas a este cliente
  acoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Acao' }]
});

module.exports = mongoose.model('Cliente', ClienteSchema);
