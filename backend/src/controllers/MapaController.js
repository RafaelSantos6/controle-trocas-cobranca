const TrocaService = require('../services/TrocaService');

const asyncHandler = (fn) => async (req, res) => {
  try {
    const resultado = await fn(req, res);
    return res.status(200).json(resultado);
  } catch (err) {
    console.error('[MapaController Error]:', err.message);
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
      erro: err.message || 'Erro interno no servidor.',
      message: err.message || 'Erro interno no servidor.',
    });
  }
};

const MapaController = {
  // GET /api/bancadas
  listarBancadas: asyncHandler(async () => {
    return TrocaService.listarBancadas();
  }),

  // GET /api/bancadas/:codigo
  obterBancada: asyncHandler(async (req) => {
    const { codigo } = req.params;
    return TrocaService.obterBancada(codigo);
  }),

  // POST /api/bancadas/alocar
  alocarOuMover: asyncHandler(async (req) => {
    return TrocaService.alocarOuMover(req.body);
  }),

  // PATCH /api/bancadas/status
  alterarStatusBancada: asyncHandler(async (req) => {
    return TrocaService.alterarStatusBancada(req.body);
  }),

  // POST /api/bancadas/swap
  realizarSwap: asyncHandler(async (req) => {
    const { codigoBancadaOrigem, codigoBancadaDestino, observacao } = req.body;
    return TrocaService.realizarSwap(codigoBancadaOrigem, codigoBancadaDestino, observacao);
  }),

  // GET /api/historico/:hostname
  obterHistoricoMaquina: asyncHandler(async (req) => {
    const { hostname } = req.params;
    return TrocaService.obterHistoricoMaquina(hostname);
  }),

  // GET /api/historico/bancada/:codigo
  obterHistoricoBancada: asyncHandler(async (req) => {
    const { codigo } = req.params;
    return TrocaService.obterHistoricoBancada(codigo);
  }),

  // GET /api/maquinas
  listarMaquinas: asyncHandler(async () => {
    return TrocaService.listarMaquinas();
  }),
};

module.exports = MapaController;
