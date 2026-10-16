const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('../models');

const CONTAS_INICIAIS = [
  {
    nome: 'Administrador Geral',
    username: 'admin',
    senhaPlana: 'admin123',
    role: 'ADM',
  },
  {
    nome: 'Rafael Suporte TI',
    username: 'ti',
    senhaPlana: 'ti123',
    role: 'TI',
  },
  {
    nome: 'Gestor Carlos (Carteira 60+)',
    username: 'gestor',
    senhaPlana: 'gestor123',
    role: 'GESTOR',
  },
];

/**
 * Cria o usuário administrador padrão ('admin' / 'admin123') e contas iniciais de demonstração
 * caso não existam no banco.
 */
async function initAdmin({ closeConnection = false } = {}) {
  await sequelize.sync();

  const totalUsuarios = await Usuario.count();
  if (totalUsuarios === 0) {
    console.log('[Seeder Admin] Criando usuários iniciais (admin, ti, gestor)...');
    for (const conta of CONTAS_INICIAIS) {
      const senhaHash = await bcrypt.hash(conta.senhaPlana, 10);
      await Usuario.create({
        nome: conta.nome,
        username: conta.username,
        senhaHash,
        role: conta.role,
      });
    }
    console.log('[Seeder Admin] Usuários criados: admin (admin123), ti (ti123), gestor (gestor123).');
  } else {
    // Garante que o usuário 'admin' exista mesmo se o banco já tiver registros
    const adminExistente = await Usuario.findOne({ where: { username: 'admin' } });
    if (!adminExistente) {
      const senhaHash = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nome: 'Administrador Geral',
        username: 'admin',
        senhaHash,
        role: 'ADM',
      });
      console.log('[Seeder Admin] Usuário padrão admin (admin123) criado.');
    }
  }

  if (closeConnection) {
    await sequelize.close();
  }
}

if (require.main === module) {
  initAdmin({ closeConnection: true }).catch((err) => {
    console.error('[Seeder Admin Error]:', err);
    process.exit(1);
  });
}

module.exports = initAdmin;

