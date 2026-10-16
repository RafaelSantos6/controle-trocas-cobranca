const sequelize = require('../config/database');
const Bancada = require('./Bancada');
const Maquina = require('./Maquina');
const HistoricoMovimento = require('./HistoricoMovimento');

// Relacionamentos entre Bancada e Maquina
Bancada.belongsTo(Maquina, {
  foreignKey: 'maquinaId',
  as: 'maquina',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Maquina.hasOne(Bancada, {
  foreignKey: 'maquinaId',
  as: 'bancada',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

// Relacionamento lógico entre Maquina e HistoricoMovimento via hostname
Maquina.hasMany(HistoricoMovimento, {
  sourceKey: 'hostname',
  foreignKey: 'hostname',
  as: 'historico',
  constraints: false,
});

HistoricoMovimento.belongsTo(Maquina, {
  targetKey: 'hostname',
  foreignKey: 'hostname',
  as: 'maquina',
  constraints: false,
});

module.exports = {
  sequelize,
  Bancada,
  Maquina,
  HistoricoMovimento,
};
