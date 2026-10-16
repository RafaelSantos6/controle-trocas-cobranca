const { Router } = require('express');
const MapaController = require('../controllers/MapaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = Router();

// Todas as rotas do mapa exigem usuário autenticado
router.use(authMiddleware);

// Rotas de consulta (abertas a todos os perfis logados: ADM, TI e GESTOR)
router.get(
  '/bancadas',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.listarBancadas
);

router.get(
  '/bancadas/:codigo',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.obterBancada
);

router.get(
  '/historico/bancada/:codigo',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.obterHistoricoBancada
);

router.get(
  '/historico/:hostname',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.obterHistoricoMaquina
);

router.get(
  '/maquinas',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.listarMaquinas
);

// Rota de Troca em Lote (permitida para ADM, TI e GESTOR)
router.post(
  '/bancadas/troca-em-lote',
  checkRole(['ADM', 'TI', 'GESTOR']),
  MapaController.realizarTrocaEmLote
);

// Rotas restritas de operação individual de TI (Apenas ADM e TI — GESTOR recebe 403 Forbidden)
router.post(
  '/bancadas/alocar',
  checkRole(['ADM', 'TI']),
  MapaController.alocarOuMover
);

router.patch(
  '/bancadas/status',
  checkRole(['ADM', 'TI']),
  MapaController.alterarStatusBancada
);

router.post(
  '/bancadas/swap',
  checkRole(['ADM', 'TI']),
  MapaController.realizarSwap
);

module.exports = router;
