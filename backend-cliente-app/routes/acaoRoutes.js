// routes/acaoRoutes.js
const express = require('express');
const router = express.Router();
const Acao = require('../models/Acao');
const Cliente = require('../models/Cliente');
const mongoose = require('mongoose');

// Criar nova ação para um cliente
router.post('/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const {
      tipoAcao,
      advogado,
      porcentagemAdvogado,
      observacoes,
      dataFechamentoContrato,
      honorarios
    } = req.body;

    // Validação básica
    if (!tipoAcao || !advogado || !honorarios || !honorarios.valor) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const novaAcao = new Acao({
      tipoAcao,
      advogado,
      porcentagemAdvogado,
      observacoes,
      dataFechamentoContrato,
      honorarios,
      cliente: clienteId,
    });

    const acaoSalva = await novaAcao.save();

    // Adiciona a ação ao array de ações do cliente
    cliente.acoes.push(acaoSalva._id);
    await cliente.save();

    res.status(201).json(acaoSalva);
  } catch (error) {
    console.error('Erro ao criar ação:', error);
    res.status(500).json({ message: 'Erro ao criar ação', error: error.message });
  }
});

// Buscar todas as ações (com cliente populado)
router.get('/', async (req, res) => {
  try {
    const acoes = await Acao.find().populate('cliente');
    res.json(acoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ações', error: error.message });
  }
});

// Buscar ações de um cliente específico
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const acoes = await Acao.find({ cliente: clienteId }).populate('cliente');
    res.json(acoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ações do cliente', error: error.message });
  }
});

// Buscar uma ação por ID
router.get('/:id', async (req, res) => {
  try {
    const acao = await Acao.findById(req.params.id).populate('cliente');
    if (!acao) return res.status(404).json({ message: 'Ação não encontrada' });

    res.json(acao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ação', error: error.message });
  }
});

// Atualizar uma ação por ID
router.put('/:id', async (req, res) => {
  try {
    const acaoAtualizada = await Acao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!acaoAtualizada) return res.status(404).json({ message: 'Ação não encontrada' });

    res.json(acaoAtualizada);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar ação', error: error.message });
  }
});

// Deletar uma ação por ID
router.delete('/:id', async (req, res) => {
  try {
    const acaoDeletada = await Acao.findByIdAndDelete(req.params.id);
    if (!acaoDeletada) return res.status(404).json({ message: 'Ação não encontrada' });

    // Remove a referência da ação do cliente
    await Cliente.findByIdAndUpdate(acaoDeletada.cliente, {
      $pull: { acoes: acaoDeletada._id }
    });

    res.json({ message: 'Ação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar ação', error: error.message });
  }
});

module.exports = router;

