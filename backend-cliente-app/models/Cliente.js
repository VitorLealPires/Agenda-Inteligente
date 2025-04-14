const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  telefone: { type: String, required: true },
  tipoAcao: { type: String, required: true },
  honorarios: { 
    valor: { type: Number, required: true },       // Exemplo: 5000
    parcelamento: { type: String, required: false } // Exemplo: "10x", "3x"
  },
  advogado: { type: String, required: true },
  porcentagemAdvogado: { type: Number, required: true },
  observacoes: { type: String }, // Campo opcional

  // Novo campo para data de fechamento do contrato
  dataFechamentoContrato: { type: Date, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
