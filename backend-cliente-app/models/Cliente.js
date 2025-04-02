const mongoose = require('mongoose');

// Função para validar CPF
const validaCPF = (cpf) => {
  // Aqui você pode adicionar uma validação mais robusta, dependendo do formato que deseja aceitar
  return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf); // Valida o formato xxx.xxx.xxx-xx
};

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { 
    type: String, 
    required: true, 
    validate: {
      validator: validaCPF,
      message: props => `${props.value} não é um CPF válido!`
    }
  },
  telefone: { 
    type: String, 
    required: true, 
    match: [/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Por favor, insira um número de telefone válido.'] // Exemplo: (99) 99999-9999
  },
  tipoAcao: { type: String, required: true },
  honorarios: { 
    tipo: { type: String, required: true },  // Exemplo: "porcentagem" ou "parcelas"
    valor: { 
      type: Number, 
      required: true,
      min: [0, 'O valor dos honorários não pode ser negativo.'] // Garantir que o valor dos honorários seja positivo
    } 
  },
  advogado: { type: String, required: true },
  porcentagemAdvogado: { 
    type: Number, 
    required: true,
    min: [0, 'A porcentagem do advogado não pode ser negativa.'],
    max: [100, 'A porcentagem do advogado não pode ser superior a 100%.']
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema);


