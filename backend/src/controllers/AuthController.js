const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const SENHA_RESET_PADRAO = 'Mudar@123';

const AuthController = {
  /**
   * POST /api/auth/login
   * Recebe username e senha, retorna token JWT e dados do usuário
   */
  async login(req, res) {
    try {
      const { username, senha } = req.body || {};

      if (!username || !senha) {
        return res.status(400).json({
          erro: 'Informe o usuário e a senha para entrar.',
        });
      }

      const usernameNorm = String(username).trim().toLowerCase();
      const usuario = await Usuario.findOne({
        where: { username: usernameNorm },
      });

      if (!usuario) {
        return res.status(401).json({
          erro: 'Usuário ou senha inválidos.',
        });
      }

      const senhaValida = await bcrypt.compare(String(senha), usuario.senhaHash);
      if (!senhaValida) {
        return res.status(401).json({
          erro: 'Usuário ou senha inválidos.',
        });
      }

      const payload = {
        id: usuario.id,
        nome: usuario.nome,
        username: usuario.username,
        role: usuario.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

      return res.status(200).json({
        token,
        usuario: payload,
      });
    } catch (err) {
      console.error('[AuthController.login Error]:', err);
      return res.status(500).json({
        erro: 'Erro interno ao processar o login.',
      });
    }
  },

  /**
   * GET /api/auth/me
   * Retorna os dados do usuário autenticado pelo token atual
   */
  async me(req, res) {
    return res.status(200).json({ usuario: req.usuario });
  },

  /**
   * GET /api/auth/usuarios
   * Lista usuários cadastrados (Apenas ADM e TI)
   */
  async listarUsuarios(_req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'username', 'role', 'createdAt', 'updatedAt'],
        order: [
          ['role', 'ASC'],
          ['nome', 'ASC'],
        ],
      });

      return res.status(200).json(usuarios);
    } catch (err) {
      console.error('[AuthController.listarUsuarios Error]:', err);
      return res.status(500).json({
        erro: 'Erro ao listar usuários.',
      });
    }
  },

  /**
   * POST /api/auth/usuarios
   * Cria novo usuário (Apenas ADM)
   */
  async criarUsuario(req, res) {
    try {
      const { nome, username, senha, role } = req.body || {};

      if (!nome || !String(nome).trim()) {
        return res.status(400).json({ erro: 'O nome completo do usuário é obrigatório.' });
      }
      if (!username || !String(username).trim()) {
        return res.status(400).json({ erro: 'O username (login) é obrigatório.' });
      }
      if (!senha || String(senha).length < 4) {
        return res
          .status(400)
          .json({ erro: 'A senha inicial deve possuir pelo menos 4 caracteres.' });
      }

      const rolesValidas = ['ADM', 'TI', 'GESTOR'];
      const roleFinal = role && rolesValidas.includes(role) ? role : 'GESTOR';
      const usernameNorm = String(username).trim().toLowerCase();

      const existente = await Usuario.findOne({ where: { username: usernameNorm } });
      if (existente) {
        return res.status(409).json({
          erro: `O username "${usernameNorm}" já está em uso por outro usuário.`,
        });
      }

      const senhaHash = await bcrypt.hash(String(senha), 10);

      const novoUsuario = await Usuario.create({
        nome: String(nome).trim(),
        username: usernameNorm,
        senhaHash,
        role: roleFinal,
      });

      return res.status(201).json({
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        username: novoUsuario.username,
        role: novoUsuario.role,
        createdAt: novoUsuario.createdAt,
      });
    } catch (err) {
      console.error('[AuthController.criarUsuario Error]:', err);
      return res.status(500).json({
        erro: 'Erro ao criar novo usuário.',
      });
    }
  },

  /**
   * PATCH /api/auth/usuarios/:id/reset-senha
   * Reseta a senha de um usuário para o padrão 'Mudar@123' (ou novaSenha enviada).
   * Permitido para ADM (qualquer conta) e TI (contas de GESTOR).
   */
  async resetarSenha(req, res) {
    try {
      const { id } = req.params;
      const { novaSenha } = req.body || {};

      const usuarioAlvo = await Usuario.findByPk(id);
      if (!usuarioAlvo) {
        return res.status(404).json({
          erro: 'Usuário não encontrado.',
        });
      }

      // Se o solicitante for TI, só pode resetar senhas de GESTOR (ou a própria)
      if (
        req.usuario.role === 'TI' &&
        usuarioAlvo.role !== 'GESTOR' &&
        usuarioAlvo.id !== req.usuario.id
      ) {
        return res.status(403).json({
          erro: 'Acesso negado: Técnicos de TI só podem resetar senhas de contas com perfil GESTOR.',
        });
      }

      const senhaDefinida =
        novaSenha && String(novaSenha).trim().length >= 4
          ? String(novaSenha).trim()
          : SENHA_RESET_PADRAO;

      const senhaHash = await bcrypt.hash(senhaDefinida, 10);
      await usuarioAlvo.update({ senhaHash });

      return res.status(200).json({
        mensagem: `Senha do usuário "${usuarioAlvo.username}" resetada com sucesso para: ${senhaDefinida}`,
        senhaTemporaria: senhaDefinida,
        usuario: {
          id: usuarioAlvo.id,
          nome: usuarioAlvo.nome,
          username: usuarioAlvo.username,
          role: usuarioAlvo.role,
        },
      });
    } catch (err) {
      console.error('[AuthController.resetarSenha Error]:', err);
      return res.status(500).json({
        erro: 'Erro ao resetar a senha do usuário.',
      });
    }
  },
};

module.exports = AuthController;

