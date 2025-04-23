// routes/clienteRoutes.js
const express = require('express');
const Cliente = require('../models/Cliente');
const router = express.Router();

// Criar um novo cliente
router.post('/', async (req, res) => {
  try {    
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {    
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error });
  }
});

// Buscar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error });
  }
});

// Buscar um cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error });
  }
});

// Atualizar um cliente por ID
router.put('/:id', async (req, res) => {
  try {
    const clienteAtualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clienteAtualizado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error });
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
    res.status(500).json({ message: 'Erro ao deletar cliente', error });
  }
});

module.exports = router;
