const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'consulth-cobranca-jwt-secret-key-2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Autenticação necessária. Token não fornecido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = {
      id: payload.id,
      nome: payload.nome,
      username: payload.username,
      role: payload.role,
    };
    return next();
  } catch (_err) {
    return res.status(401).json({
      erro: 'Sessão expirada ou token inválido. Faça login novamente.',
    });
  }
}

authMiddleware.JWT_SECRET = JWT_SECRET;

module.exports = authMiddleware;

