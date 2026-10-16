const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = Router();

// Autenticação pública
router.post('/login', AuthController.login);

// Validação de sessão ativa
router.get('/me', authMiddleware, AuthController.me);

// Gestão de Usuários (RBAC)
router.get(
  '/usuarios',
  authMiddleware,
  checkRole(['ADM', 'TI']),
  AuthController.listarUsuarios
);

router.post(
  '/usuarios',
  authMiddleware,
  checkRole(['ADM']),
  AuthController.criarUsuario
);

router.patch(
  '/usuarios/:id/reset-senha',
  authMiddleware,
  checkRole(['ADM', 'TI']),
  AuthController.resetarSenha
);

module.exports = router;

