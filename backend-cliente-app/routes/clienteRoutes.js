// routes/clienteRoutes.js
const express = require('express');
const Cliente = require('../models/Cliente');
const router = express.Router();

// Criar um novo cliente
router.post('/', async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);

    // Validar os dados antes de salvar
    const error = novoCliente.validateSync();
    if (error) {
      return res.status(400).json({ message: 'Dados inválidos', error: error.message });
    }

    await novoCliente.save();
    res.status(201).json({ message: 'Cliente criado com sucesso', cliente: novoCliente });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error: error.message });
  }
});

// Buscar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json({ message: 'Clientes encontrados com sucesso', clientes });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
  }
});

// Buscar um cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente encontrado', cliente });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

// Atualizar um cliente por ID
router.put('/:id', async (req, res) => {
  try {
    const clienteAtualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!clienteAtualizado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Validar os dados antes de salvar
    const error = clienteAtualizado.validateSync();
    if (error) {
      return res.status(400).json({ message: 'Dados inválidos', error: error.message });
    }

    res.json({ message: 'Cliente atualizado com sucesso', cliente: clienteAtualizado });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

// Deletar um cliente por ID
router.delete('/:id', async (req, res) => {
  try {
    const clienteDeletado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteDeletado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar cliente', error: error.message });
  }
});

module.exports = router;

