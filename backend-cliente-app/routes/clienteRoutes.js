// routes/clienteRoutes.js
const express = require('express');
const Cliente = require('../models/Cliente');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nome, cpf, telefones } = req.body;

    // Se o campo 'telefones' vier como string simples, transforma em array
    let numerosFormatados = [];

    if (Array.isArray(telefones)) {
      numerosFormatados = telefones.map(num => formatarNumero(num)).filter(Boolean);
    } else if (typeof telefones === 'string' && telefones.trim() !== '') {
      numerosFormatados = [formatarNumero(telefones)].filter(Boolean);
    }

    const novoCliente = new Cliente({
      nome,
      cpf,
      telefones: numerosFormatados
    });

    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error });
  }
});

// Função para formatar o número no padrão internacional
function formatarNumero(numero) {
  if (!numero) return null;

  const apenasNumeros = numero.replace(/\D/g, '');

  if (apenasNumeros.length === 11 && apenasNumeros.startsWith('0')) {
    // Remove o zero inicial se existir (ex: 011999999999)
    return `+55${apenasNumeros.substring(1)}`;
  }

  if (apenasNumeros.length === 11) {
    return `+55${apenasNumeros}`;
  }

  if (apenasNumeros.length === 13 && apenasNumeros.startsWith('55')) {
    return `+${apenasNumeros}`;
  }

  return null; // Ignora número inválido
}

module.exports = router;