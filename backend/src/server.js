require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const mapaRoutes = require('./routes/mapa.routes');
const initBancadas = require('./seeders/initBancadas');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas principais da API
app.use('/api', mapaRoutes);

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = Number(process.env.PORT) || 3001;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await initBancadas({ closeConnection: false });

    app.listen(PORT, () => {
      console.log(`Servidor Backend rodando em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o servidor backend:', error);
    process.exit(1);
  }
}

iniciarServidor();
