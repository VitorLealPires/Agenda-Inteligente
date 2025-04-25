// models/Acao.js
const mongoose = require('mongoose');

const AcaoSchema = new mongoose.Schema({
  tipoAcao: { type: String, required: true },

  honorarios: { 
    valor: { type: Number, required: true },
    parcelamento: { type: String }
  },

  advogado: { type: String, required: true },
  porcentagemAdvogado: { type: Number, required: true },
  observacoes: { type: String }, // Campo opcional
  dataFechamentoContrato: { type: Date, required: true },

  // Relaciona a ação com um cliente
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true }
});

module.exports = mongoose.model('Acao', AcaoSchema);
