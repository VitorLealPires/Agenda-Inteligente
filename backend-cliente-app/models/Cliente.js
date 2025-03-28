const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  telefone: { type: String, required: true },
  tipoAcao: { type: String, required: true },
  honorarios: { 
    tipo: { type: String, required: true },  // Exemplo: "porcentagem" ou "parcelas"
    valor: { type: Number, required: true }  // Exemplo: 5000 ou 10%
  },
  advogado: { type: String, required: true },
  porcentagemAdvogado: { type: Number, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);

