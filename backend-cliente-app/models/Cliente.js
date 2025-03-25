// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  telefones: { type: [String], required: true },
  tipoAcao: { type: String, required: true },
  honorarios: {
    tipo: { type: String, enum: ['porcentagem', 'parcelas'], required: true },
    valor: { type: Number, required: true }
  },
  indicacao: {
    nome: { type: String },
    advogado: { type: String },
    porcentagem: { type: Number }
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);
