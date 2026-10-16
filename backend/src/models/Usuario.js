const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADM', 'TI', 'GESTOR'),
      allowNull: false,
      defaultValue: 'GESTOR',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
  }
);

module.exports = Usuario;

