// models/Cliente.js
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    trim: true
    // Você pode adicionar uma regex de validação de CPF aqui se quiser
  },
  telefones: {
    type: [String],
    validate: {
      validator: function (array) {
        return Array.isArray(array) && array.every(tel => typeof tel === 'string');
      },
      message: 'Todos os telefones devem ser strings'
    },
    required: false
  },

  // Relacionamento com ações (cada cliente pode ter várias ações)
  acoes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Acao'
  }],

  // Campos obsoletos, mantidos para exibição de clientes antigos
  tipoAcao: { type: String },
  valorHonorarios: { type: String },
  parcelamentoHonorario: { type: String },
  porcentagemAdvogado: { type: String },
  dataFechamentoContrato: { type: String },
  advogadoResponsavel: { type: String },
  observacoes: { type: String }

}, {
  timestamps: true // adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Cliente', ClienteSchema);
