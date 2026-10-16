const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bancada = sequelize.define(
  'Bancada',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      comment: 'PK lógica, ex: C01-A01',
    },
    corredor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    lado: {
      type: DataTypes.ENUM('A', 'B'),
      allowNull: false,
    },
    posicao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 7,
      },
    },
    status: {
      type: DataTypes.ENUM('LIVRE', 'OCUPADA', 'RESERVA', 'DESATIVADA', 'MANUTENCAO'),
      allowNull: false,
      defaultValue: 'LIVRE',
    },
    colaborador: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    equipe: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    motivoBloqueio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pontoRede: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    maquinaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'maquinas',
        key: 'id',
      },
    },
  },
  {
    tableName: 'bancadas',
    timestamps: true,
  }
);

module.exports = Bancada;
