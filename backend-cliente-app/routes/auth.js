const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

// Registro de usuário
router.post('/register', async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ login });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ login, senha: hashedPassword });
    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar usuário', error: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ login });
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
});

module.exports = router;

