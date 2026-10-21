const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Maquina = sequelize.define(
  'Maquina',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    patrimonioPc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    patrimonioMonitor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cpu: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ram: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    hd: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sistemaOp: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kaspersky: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kitPerifericos: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: 'Teclado + Mouse + Headset',
    },
    statusMaquina: {
      type: DataTypes.ENUM('ATIVA', 'ESTOQUE', 'MANUTENCAO', 'INATIVA'),
      allowNull: false,
      defaultValue: 'ATIVA',
    },
  },
  {
    tableName: 'maquinas',
    timestamps: true,
  }
);

module.exports = Maquina;
