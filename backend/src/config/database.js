require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');

const dialect = (process.env.DB_DIALECT || 'sqlite').toLowerCase();

let sequelize;

if (dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'sistema_mapa_cobranca',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
      },
    }
  );
} else {
  const storagePath = process.env.DB_STORAGE
    ? path.resolve(process.cwd(), process.env.DB_STORAGE)
    : path.resolve(__dirname, '../../database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
    define: {
      timestamps: true,
    },
  });
}

module.exports = sequelize;
