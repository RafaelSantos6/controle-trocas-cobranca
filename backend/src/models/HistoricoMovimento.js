const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistoricoMovimento = sequelize.define(
  'HistoricoMovimento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bancadaOrigem: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    bancadaDestino: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    colaboradorAnterior: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    colaboradorNovo: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    tipoEvento: {
      type: DataTypes.ENUM(
        'ALOCACAO',
        'TROCA_MENSAL',
        'SWAP',
        'DESATIVACAO_BANCADA',
        'DESLIGAMENTO_RESERVA'
      ),
      allowNull: false,
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'historico_movimentos',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = HistoricoMovimento;
