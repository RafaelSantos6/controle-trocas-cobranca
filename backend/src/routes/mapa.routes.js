const { Router } = require('express');
const MapaController = require('../controllers/MapaController');

const router = Router();

// Bancadas
router.get('/bancadas', MapaController.listarBancadas);
router.get('/bancadas/:codigo', MapaController.obterBancada);
router.post('/bancadas/alocar', MapaController.alocarOuMover);
router.patch('/bancadas/status', MapaController.alterarStatusBancada);
router.post('/bancadas/swap', MapaController.realizarSwap);

// Histórico de Rastreabilidade
router.get('/historico/bancada/:codigo', MapaController.obterHistoricoBancada);
router.get('/historico/:hostname', MapaController.obterHistoricoMaquina);

// Máquinas
router.get('/maquinas', MapaController.listarMaquinas);

module.exports = router;

