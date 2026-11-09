const express = require('express');
const mongoose = require('mongoose');
const Cliente = require('../models/Cliente');
const router = express.Router();

// Rota GET para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().populate('acoes');
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error });
  }
});

// Rota GET para buscar um cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const cliente = await Cliente.findById(id).populate('acoes');
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

// Rota POST para cadastrar cliente
router.post('/', async (req, res) => {
  try {
    const { nome, cpf, telefones, telefone, observacoes } = req.body;

    let numerosFormatados = [];

    if (Array.isArray(telefones)) {
      numerosFormatados = telefones.map(num => formatarNumero(num)).filter(Boolean);
    } else if (typeof telefones === 'string' && telefones.trim() !== '') {
      numerosFormatados = [formatarNumero(telefones)].filter(Boolean);
    } else if (typeof telefone === 'string' && telefone.trim() !== '') {
      numerosFormatados = [formatarNumero(telefone)].filter(Boolean);
    }

    const novoCliente = new Cliente({
      nome,
      cpf,
      telefones: numerosFormatados,
      observacoes
    });

    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error });
  }
});

// Rota PUT para atualizar cliente por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const { nome, cpf, telefones, telefone, observacoes } = req.body;

    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (observacoes !== undefined) updateData.observacoes = observacoes;

    if (telefones !== undefined || telefone !== undefined) {
      let numerosFormatados = [];
      if (Array.isArray(telefones)) {
        numerosFormatados = telefones.map(num => formatarNumero(num)).filter(Boolean);
      } else if (typeof telefones === 'string' && telefones.trim() !== '') {
        numerosFormatados = [formatarNumero(telefones)].filter(Boolean);
      } else if (typeof telefone === 'string' && telefone.trim() !== '') {
        numerosFormatados = [formatarNumero(telefone)].filter(Boolean);
      }
      updateData.telefones = numerosFormatados;
    }

    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('acoes');

    if (!clienteAtualizado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

// Rota DELETE para excluir um cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const cliente = await Cliente.findByIdAndDelete(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir cliente', error });
  }
});

// Função para formatar o número no padrão internacional
function formatarNumero(numero) {
  if (!numero) return null;

  const apenasNumeros = numero.replace(/\D/g, '');

  if (apenasNumeros.length === 11 && apenasNumeros.startsWith('0')) {
    return `+55${apenasNumeros.substring(1)}`;
  }

  if (apenasNumeros.length === 11) {
    return `+55${apenasNumeros}`;
  }

  if (apenasNumeros.length === 13 && apenasNumeros.startsWith('55')) {
    return `+${apenasNumeros}`;
  }

  return null;
}

module.exports = router;