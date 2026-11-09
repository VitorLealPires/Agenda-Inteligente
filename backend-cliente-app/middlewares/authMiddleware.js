const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
