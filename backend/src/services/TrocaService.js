const { Op } = require('sequelize');
const { sequelize, Bancada, Maquina, HistoricoMovimento } = require('../models');

const criarErro = (mensagem, status = 400) => {
  const err = new Error(mensagem);
  err.status = status;
  return err;
};

async function buscarBancadaPorCodigo(codigo, transaction = null) {
  if (!codigo) throw criarErro('Código da bancada é obrigatório.', 400);
  const codigoNorm = String(codigo).trim().toUpperCase();
  const bancada = await Bancada.findOne({
    where: { codigo: codigoNorm },
    include: [{ model: Maquina, as: 'maquina' }],
    transaction,
  });
  if (!bancada) {
    throw criarErro(`Bancada ${codigoNorm} não encontrada.`, 404);
  }
  return bancada;
}

const TrocaService = {
  /**
   * Lista todas as 122 bancadas com suas máquinas associadas
   */
  async listarBancadas() {
    return Bancada.findAll({
      include: [{ model: Maquina, as: 'maquina' }],
      order: [
        ['corredor', 'ASC'],
        ['lado', 'DESC'], // Lado B em cima, Lado A embaixo em cada corredor
        ['posicao', 'ASC'],
      ],
    });
  },

  /**
   * Detalhes de uma bancada específica pelo código (ex: C01-A01)
   */
  async obterBancada(codigo) {
    const bancada = await buscarBancadaPorCodigo(codigo);
    const historicoBancada = await HistoricoMovimento.findAll({
      where: {
        [Op.or]: [{ bancadaOrigem: bancada.codigo }, { bancadaDestino: bancada.codigo }],
      },
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      limit: 30,
    });

    let historicoMaquina = [];
    if (bancada.maquina?.hostname) {
      historicoMaquina = await HistoricoMovimento.findAll({
        where: { hostname: bancada.maquina.hostname },
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
      });
    }

    return {
      ...bancada.toJSON(),
      historicoBancada,
      historicoMaquina,
    };
  },

  /**
   * Aloca ou move uma máquina para uma bancada com transação ACID.
   * Se a máquina já estiver alocada em outra bancada, libera a bancada de origem (status = LIVRE)
   * e aloca na nova, registrando o movimento em HistoricoMovimento.
   */
  async alocarOuMover({
    codigoBancada,
    hostname,
    colaborador,
    equipe,
    observacao,
    patrimonioPc,
    patrimonioMonitor,
    kitPerifericos,
    pontoRede,
    tipoEvento,
  }) {
    if (!codigoBancada) {
      throw criarErro('O código da bancada é obrigatório.', 400);
    }
    if (!hostname || !String(hostname).trim()) {
      throw criarErro('O hostname da máquina (ex: COBCON220) é obrigatório.', 400);
    }

    const hostnameNorm = String(hostname).trim().toUpperCase();

    return sequelize.transaction(async (t) => {
      const bancadaDestino = await buscarBancadaPorCodigo(codigoBancada, t);

      if (bancadaDestino.status === 'DESATIVADA') {
        throw criarErro(
          `A bancada ${bancadaDestino.codigo} está DESATIVADA (${
            bancadaDestino.motivoBloqueio || 'sem motivo'
          }). Reative-a antes de alocar um computador.`,
          400
        );
      }

      // Busca ou cria a máquina pelo hostname
      let [maquina, criada] = await Maquina.findOrCreate({
        where: { hostname: hostnameNorm },
        defaults: {
          hostname: hostnameNorm,
          patrimonioPc: patrimonioPc || `PAT-PC-${hostnameNorm.replace(/\D/g, '') || '001'}`,
          patrimonioMonitor: patrimonioMonitor || `PAT-MON-${hostnameNorm.replace(/\D/g, '') || '001'}`,
          kitPerifericos: kitPerifericos || 'Teclado + Mouse + Headset',
          statusMaquina: 'ATIVA',
        },
        transaction: t,
      });

      if (!criada) {
        const camposAtualizar = { statusMaquina: 'ATIVA' };
        if (patrimonioPc !== undefined && patrimonioPc !== '') camposAtualizar.patrimonioPc = patrimonioPc;
        if (patrimonioMonitor !== undefined && patrimonioMonitor !== '')
          camposAtualizar.patrimonioMonitor = patrimonioMonitor;
        if (kitPerifericos !== undefined && kitPerifericos !== '')
          camposAtualizar.kitPerifericos = kitPerifericos;
        await maquina.update(camposAtualizar, { transaction: t });
      }

      // Verifica se a máquina já está alocada em outra bancada
      const bancadaOrigem = await Bancada.findOne({
        where: { maquinaId: maquina.id },
        transaction: t,
      });

      let codigoOrigem = null;
      let colaboradorAnterior = bancadaDestino.colaborador || null;

      if (bancadaOrigem && bancadaOrigem.codigo !== bancadaDestino.codigo) {
        codigoOrigem = bancadaOrigem.codigo;
        colaboradorAnterior = bancadaOrigem.colaborador || null;

        // Libera a bancada de origem
        await bancadaOrigem.update(
          {
            status: 'LIVRE',
            maquinaId: null,
            colaborador: null,
            equipe: null,
            motivoBloqueio: null,
          },
          { transaction: t }
        );
      } else if (bancadaOrigem && bancadaOrigem.codigo === bancadaDestino.codigo) {
        codigoOrigem = bancadaDestino.codigo;
      }

      // Caso a bancada de destino já possuísse OUTRA máquina diferente desta, registra a saída da anterior
      if (bancadaDestino.maquinaId && bancadaDestino.maquinaId !== maquina.id) {
        const maquinaAntiga = await Maquina.findByPk(bancadaDestino.maquinaId, { transaction: t });
        if (maquinaAntiga) {
          await maquinaAntiga.update({ statusMaquina: 'ESTOQUE' }, { transaction: t });
          await HistoricoMovimento.create(
            {
              hostname: maquinaAntiga.hostname,
              bancadaOrigem: bancadaDestino.codigo,
              bancadaDestino: null,
              colaboradorAnterior: bancadaDestino.colaborador || null,
              colaboradorNovo: null,
              tipoEvento: 'TROCA_MENSAL',
              observacao: `Desvinculada da bancada ${bancadaDestino.codigo} por substituição pela máquina ${hostnameNorm}`,
            },
            { transaction: t }
          );
        }
      }

      const novoColaborador =
        colaborador !== undefined ? (String(colaborador).trim() || null) : bancadaDestino.colaborador;
      const novaEquipe =
        equipe !== undefined ? (String(equipe).trim() || null) : bancadaDestino.equipe;
      const novoPontoRede =
        pontoRede !== undefined && String(pontoRede).trim()
          ? String(pontoRede).trim()
          : bancadaDestino.pontoRede;

      await bancadaDestino.update(
        {
          status: 'OCUPADA',
          maquinaId: maquina.id,
          colaborador: novoColaborador,
          equipe: novaEquipe,
          pontoRede: novoPontoRede,
          motivoBloqueio: null,
        },
        { transaction: t }
      );

      const eventosValidos = ['ALOCACAO', 'TROCA_MENSAL', 'SWAP', 'DESATIVACAO_BANCADA'];
      const eventoFinal =
        tipoEvento && eventosValidos.includes(tipoEvento)
          ? tipoEvento
          : codigoOrigem && codigoOrigem !== bancadaDestino.codigo
          ? 'TROCA_MENSAL'
          : 'ALOCACAO';

      const obsPadrao =
        codigoOrigem && codigoOrigem !== bancadaDestino.codigo
          ? `Movimentação da bancada ${codigoOrigem} para ${bancadaDestino.codigo}`
          : `Alocação na bancada ${bancadaDestino.codigo}`;

      await HistoricoMovimento.create(
        {
          hostname: maquina.hostname,
          bancadaOrigem: codigoOrigem,
          bancadaDestino: bancadaDestino.codigo,
          colaboradorAnterior,
          colaboradorNovo: novoColaborador,
          tipoEvento: eventoFinal,
          observacao: observacao ? String(observacao).trim() : obsPadrao,
        },
        { transaction: t }
      );

      return buscarBancadaPorCodigo(bancadaDestino.codigo, t);
    });
  },

  /**
   * Altera o status de uma bancada ('LIVRE', 'OCUPADA', 'DESATIVADA', 'MANUTENCAO').
   * Se DESATIVADA ou LIVRE (ou MANUTENCAO), desvincula a máquina e registra no histórico.
   */
  async alterarStatusBancada({ codigoBancada, status, motivoBloqueio }) {
    const statusValidos = ['LIVRE', 'OCUPADA', 'DESATIVADA', 'MANUTENCAO'];
    if (!status || !statusValidos.includes(status)) {
      throw criarErro(`Status inválido. Use um dos seguintes: ${statusValidos.join(', ')}.`, 400);
    }

    return sequelize.transaction(async (t) => {
      const bancada = await buscarBancadaPorCodigo(codigoBancada, t);
      const maquinaAtual = bancada.maquina;
      const colaboradorAnterior = bancada.colaborador;

      if (status === 'DESATIVADA' || status === 'LIVRE' || status === 'MANUTENCAO') {
        if (status === 'DESATIVADA' && (!motivoBloqueio || !String(motivoBloqueio).trim())) {
          throw criarErro('Informe o motivo do bloqueio/desativação da bancada.', 400);
        }

        if (maquinaAtual) {
          await maquinaAtual.update(
            {
              statusMaquina: status === 'MANUTENCAO' ? 'MANUTENCAO' : 'ESTOQUE',
            },
            { transaction: t }
          );
        }

        const motivoFinal =
          status === 'DESATIVADA' || status === 'MANUTENCAO'
            ? String(motivoBloqueio || 'Em manutenção / bloqueada').trim()
            : null;

        await bancada.update(
          {
            status,
            maquinaId: null,
            colaborador: null,
            equipe: null,
            motivoBloqueio: motivoFinal,
          },
          { transaction: t }
        );

        await HistoricoMovimento.create(
          {
            hostname: maquinaAtual ? maquinaAtual.hostname : null,
            bancadaOrigem: bancada.codigo,
            bancadaDestino: null,
            colaboradorAnterior,
            colaboradorNovo: null,
            tipoEvento: 'DESATIVACAO_BANCADA',
            observacao:
              motivoFinal ||
              (maquinaAtual
                ? `Bancada ${bancada.codigo} liberada (máquina ${maquinaAtual.hostname} recolhida ao estoque)`
                : `Bancada ${bancada.codigo} definida como ${status}`),
          },
          { transaction: t }
        );
      } else if (status === 'OCUPADA') {
        await bancada.update(
          {
            status: 'OCUPADA',
            motivoBloqueio: null,
          },
          { transaction: t }
        );
      }

      return buscarBancadaPorCodigo(bancada.codigo, t);
    });
  },

  /**
   * Inversão direta de postos (Swap) entre duas bancadas.
   * Aceita (codigoBancadaOrigem, codigoBancadaDestino, observacao) ou objeto.
   */
  async realizarSwap(arg1, arg2, arg3) {
    let codigoBancadaOrigem = arg1;
    let codigoBancadaDestino = arg2;
    let observacao = arg3;

    if (typeof arg1 === 'object' && arg1 !== null) {
      codigoBancadaOrigem = arg1.codigoBancadaOrigem || arg1.origem;
      codigoBancadaDestino = arg1.codigoBancadaDestino || arg1.destino;
      observacao = arg1.observacao || arg1.motivo;
    }

    if (!codigoBancadaOrigem || !codigoBancadaDestino) {
      throw criarErro('Informe os códigos da bancada de origem e da bancada de destino para o swap.', 400);
    }

    const codOrigemNorm = String(codigoBancadaOrigem).trim().toUpperCase();
    const codDestinoNorm = String(codigoBancadaDestino).trim().toUpperCase();

    if (codOrigemNorm === codDestinoNorm) {
      throw criarErro('Selecione duas bancadas diferentes para realizar o swap.', 400);
    }

    return sequelize.transaction(async (t) => {
      const bancadaOrigem = await buscarBancadaPorCodigo(codOrigemNorm, t);
      const bancadaDestino = await buscarBancadaPorCodigo(codDestinoNorm, t);

      if (bancadaOrigem.status === 'DESATIVADA' || bancadaDestino.status === 'DESATIVADA') {
        throw criarErro('Não é possível realizar swap envolvendo uma bancada DESATIVADA.', 400);
      }

      const maqOrigem = bancadaOrigem.maquina;
      const maqDestino = bancadaDestino.maquina;
      const colabOrigem = bancadaOrigem.colaborador;
      const colabDestino = bancadaDestino.colaborador;
      const equipeOrigem = bancadaOrigem.equipe;
      const equipeDestino = bancadaDestino.equipe;

      if (!maqOrigem && !maqDestino && !colabOrigem && !colabDestino) {
        throw criarErro('Ambas as bancadas selecionadas estão vazias.', 400);
      }

      // Desvincula temporariamente para evitar conflito de integridade
      await bancadaOrigem.update({ maquinaId: null }, { transaction: t });
      await bancadaDestino.update({ maquinaId: null }, { transaction: t });

      // Inverte máquinas, colaboradores, equipes e status
      await bancadaOrigem.update(
        {
          maquinaId: maqDestino ? maqDestino.id : null,
          colaborador: colabDestino,
          equipe: equipeDestino,
          status: maqDestino || colabDestino ? 'OCUPADA' : 'LIVRE',
          motivoBloqueio: null,
        },
        { transaction: t }
      );

      await bancadaDestino.update(
        {
          maquinaId: maqOrigem ? maqOrigem.id : null,
          colaborador: colabOrigem,
          equipe: equipeOrigem,
          status: maqOrigem || colabOrigem ? 'OCUPADA' : 'LIVRE',
          motivoBloqueio: null,
        },
        { transaction: t }
      );

      const obsTexto =
        observacao && String(observacao).trim()
          ? String(observacao).trim()
          : `Swap direto entre ${bancadaOrigem.codigo} e ${bancadaDestino.codigo}`;

      const movimentos = [];

      if (maqOrigem) {
        movimentos.push({
          hostname: maqOrigem.hostname,
          bancadaOrigem: bancadaOrigem.codigo,
          bancadaDestino: bancadaDestino.codigo,
          colaboradorAnterior: colabOrigem,
          colaboradorNovo: colabOrigem,
          tipoEvento: 'SWAP',
          observacao: obsTexto,
        });
      }

      if (maqDestino) {
        movimentos.push({
          hostname: maqDestino.hostname,
          bancadaOrigem: bancadaDestino.codigo,
          bancadaDestino: bancadaOrigem.codigo,
          colaboradorAnterior: colabDestino,
          colaboradorNovo: colabDestino,
          tipoEvento: 'SWAP',
          observacao: obsTexto,
        });
      }

      if (movimentos.length > 0) {
        await HistoricoMovimento.bulkCreate(movimentos, { transaction: t });
      }

      return {
        bancadaOrigem: await buscarBancadaPorCodigo(codOrigemNorm, t),
        bancadaDestino: await buscarBancadaPorCodigo(codDestinoNorm, t),
      };
    });
  },

  /**
   * Retorna a linha do tempo de movimentações de uma máquina pelo hostname
   */
  async obterHistoricoMaquina(hostname) {
    if (!hostname) throw criarErro('Hostname é obrigatório.', 400);
    const hostnameNorm = String(hostname).trim().toUpperCase();

    const historico = await HistoricoMovimento.findAll({
      where: { hostname: hostnameNorm },
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    return historico;
  },

  /**
   * Retorna o histórico de eventos de uma bancada específica
   */
  async obterHistoricoBancada(codigo) {
    if (!codigo) throw criarErro('Código da bancada é obrigatório.', 400);
    const codigoNorm = String(codigo).trim().toUpperCase();

    return HistoricoMovimento.findAll({
      where: {
        [Op.or]: [{ bancadaOrigem: codigoNorm }, { bancadaDestino: codigoNorm }],
      },
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });
  },

  /**
   * Lista todas as máquinas cadastradas e sua bancada atual (se houver)
   */
  async listarMaquinas() {
    return Maquina.findAll({
      include: [{ model: Bancada, as: 'bancada' }],
      order: [['hostname', 'ASC']],
    });
  },
};

module.exports = TrocaService;
