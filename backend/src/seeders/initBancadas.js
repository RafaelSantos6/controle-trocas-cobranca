const { sequelize, Bancada, Maquina, HistoricoMovimento } = require('../models');

const pad = (n) => String(n).padStart(2, '0');

const DADOS_INICIAIS_OCUPACAO = [
  {
    codigoBancada: 'C01-B01',
    hostname: 'COBCON201',
    colaborador: 'Amanda Oliveira',
    equipe: 'Cobrança Preventiva',
    patrimonioPc: 'PAT-PC-9201',
    patrimonioMonitor: 'PAT-MON-4201',
  },
  {
    codigoBancada: 'C01-B03',
    hostname: 'COBCON203',
    colaborador: 'Beatriz Santos',
    equipe: 'Cobrança Preventiva',
    patrimonioPc: 'PAT-PC-9203',
    patrimonioMonitor: 'PAT-MON-4203',
  },
  {
    codigoBancada: 'C01-A02',
    hostname: 'COBCON205',
    colaborador: 'Camila Ferreira',
    equipe: 'Cobrança Preventiva',
    patrimonioPc: 'PAT-PC-9205',
    patrimonioMonitor: 'PAT-MON-4205',
  },
  {
    codigoBancada: 'C02-B02',
    hostname: 'COBCON210',
    colaborador: 'Daniela Costa',
    equipe: 'Recuperação Crédito',
    patrimonioPc: 'PAT-PC-9210',
    patrimonioMonitor: 'PAT-MON-4210',
  },
  {
    codigoBancada: 'C02-A04',
    hostname: 'COBCON212',
    colaborador: 'Eduarda Lima',
    equipe: 'Recuperação Crédito',
    patrimonioPc: 'PAT-PC-9212',
    patrimonioMonitor: 'PAT-MON-4212',
  },
  {
    codigoBancada: 'C03-B01',
    hostname: 'COBCON220',
    colaborador: 'Fernanda Souza',
    equipe: 'Negociação Especial',
    patrimonioPc: 'PAT-PC-9220',
    patrimonioMonitor: 'PAT-MON-4220',
  },
  {
    codigoBancada: 'C03-A05',
    hostname: 'COBCON221',
    colaborador: 'Gabriela Rocha',
    equipe: 'Negociação Especial',
    patrimonioPc: 'PAT-PC-9221',
    patrimonioMonitor: 'PAT-MON-4221',
  },
  {
    codigoBancada: 'C04-B04',
    hostname: 'COBCON225',
    colaborador: 'Helena Martins',
    equipe: 'Acordos Judiciais',
    patrimonioPc: 'PAT-PC-9225',
    patrimonioMonitor: 'PAT-MON-4225',
  },
  {
    codigoBancada: 'C04-A01',
    hostname: 'COBCON228',
    colaborador: 'Isabela Almeida',
    equipe: 'Acordos Judiciais',
    patrimonioPc: 'PAT-PC-9228',
    patrimonioMonitor: 'PAT-MON-4228',
  },
  {
    codigoBancada: 'C05-B02',
    hostname: 'COBCON230',
    colaborador: 'Juliana Pereira',
    equipe: 'Retenção & Acordos',
    patrimonioPc: 'PAT-PC-9230',
    patrimonioMonitor: 'PAT-MON-4230',
  },
  {
    codigoBancada: 'C05-A06',
    hostname: 'COBCON234',
    colaborador: 'Karina Gomes',
    equipe: 'Retenção & Acordos',
    patrimonioPc: 'PAT-PC-9234',
    patrimonioMonitor: 'PAT-MON-4234',
  },
  {
    codigoBancada: 'C06-B05',
    hostname: 'COBCON240',
    colaborador: 'Larissa Ribeiro',
    equipe: 'Cobrança Ativa',
    patrimonioPc: 'PAT-PC-9240',
    patrimonioMonitor: 'PAT-MON-4240',
  },
  {
    codigoBancada: 'C06-A03',
    hostname: 'COBCON242',
    colaborador: 'Mariana Carvalho',
    equipe: 'Cobrança Ativa',
    patrimonioPc: 'PAT-PC-9242',
    patrimonioMonitor: 'PAT-MON-4242',
  },
  {
    codigoBancada: 'C07-B01',
    hostname: 'COBCON250',
    colaborador: 'Natália Araújo',
    equipe: 'Cobrança Ativa',
    patrimonioPc: 'PAT-PC-9250',
    patrimonioMonitor: 'PAT-MON-4250',
  },
  {
    codigoBancada: 'C08-A02',
    hostname: 'COBCON260',
    colaborador: 'Patrícia Melo',
    equipe: 'Grandes Contas',
    patrimonioPc: 'PAT-PC-9260',
    patrimonioMonitor: 'PAT-MON-4260',
  },
  {
    codigoBancada: 'C09-B06',
    hostname: 'COBCON270',
    colaborador: 'Renata Cardoso',
    equipe: 'Grandes Contas',
    patrimonioPc: 'PAT-PC-9270',
    patrimonioMonitor: 'PAT-MON-4270',
  },
  {
    codigoBancada: 'C10-B03',
    hostname: 'COBCON280',
    colaborador: 'Sabrina Teixeira',
    equipe: 'Supervisão / Apoio',
    patrimonioPc: 'PAT-PC-9280',
    patrimonioMonitor: 'PAT-MON-4280',
  },
  {
    codigoBancada: 'C10-A07',
    hostname: 'COBCON285',
    colaborador: 'Tatiane Moreira',
    equipe: 'Supervisão / Apoio',
    patrimonioPc: 'PAT-PC-9285',
    patrimonioMonitor: 'PAT-MON-4285',
  },
];

const BANCADAS_DESATIVADAS_INICIAIS = [
  {
    codigo: 'C02-A06',
    motivoBloqueio: 'Ponto de rede sem sinal (Chamado TI #4812)',
  },
  {
    codigo: 'C06-B02',
    motivoBloqueio: 'Tomada elétrica da bancada em curto — aguardando manutenção predial',
  },
  {
    codigo: 'C09-A04',
    motivoBloqueio: 'Suporte ergonômico e calha de cabos danificados',
  },
];

/**
 * Popula as 122 bancadas automaticamente caso a tabela esteja vazia:
 * - Corredores 1 a 9: 12 bancadas cada (6 Lado A e 6 Lado B) = 108 bancadas
 * - Corredor 10: 14 bancadas (7 Lado A e 7 Lado B) = 14 bancadas
 * Total = 122 bancadas.
 */
async function initBancadas({ closeConnection = false } = {}) {
  await sequelize.sync();

  const totalExistente = await Bancada.count();
  if (totalExistente > 0) {
    console.log(`[Seeder] ${totalExistente} bancadas já cadastradas no banco.`);
    if (closeConnection) await sequelize.close();
    return;
  }

  console.log('[Seeder] Populando as 122 bancadas do setor de cobrança...');
  const bancadasParaCriar = [];

  for (let corredor = 1; corredor <= 10; corredor++) {
    const posicoesPorLado = corredor === 10 ? 7 : 6;
    const lados = ['A', 'B'];

    for (const lado of lados) {
      for (let posicao = 1; posicao <= posicoesPorLado; posicao++) {
        const codigo = `C${pad(corredor)}-${lado}${pad(posicao)}`;
        bancadasParaCriar.push({
          codigo,
          corredor,
          lado,
          posicao,
          status: 'LIVRE',
          colaborador: null,
          equipe: null,
          motivoBloqueio: null,
          pontoRede: `PR-${pad(corredor)}${lado}${pad(posicao)}`,
          maquinaId: null,
        });
      }
    }
  }

  await Bancada.bulkCreate(bancadasParaCriar);
  console.log(`[Seeder] ${bancadasParaCriar.length} bancadas criadas com sucesso.`);

  // Popula máquinas e alocações iniciais de demonstração se não houver máquinas
  const totalMaquinas = await Maquina.count();
  if (totalMaquinas === 0) {
    for (const item of DADOS_INICIAIS_OCUPACAO) {
      const maquina = await Maquina.create({
        hostname: item.hostname,
        patrimonioPc: item.patrimonioPc,
        patrimonioMonitor: item.patrimonioMonitor,
        kitPerifericos: 'Teclado + Mouse + Headset QD',
        statusMaquina: 'ATIVA',
      });

      await Bancada.update(
        {
          status: 'OCUPADA',
          maquinaId: maquina.id,
          colaborador: item.colaborador,
          equipe: item.equipe,
        },
        { where: { codigo: item.codigoBancada } }
      );

      // Histórico base
      if (item.hostname === 'COBCON220') {
        const d1 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
        const d2 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
        const d3 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2);

        await HistoricoMovimento.bulkCreate([
          {
            hostname: 'COBCON220',
            bancadaOrigem: null,
            bancadaDestino: 'C01-A04',
            colaboradorAnterior: null,
            colaboradorNovo: 'Lucas Mendonça',
            tipoEvento: 'ALOCACAO',
            observacao: 'Alocação inicial de inventário no corredor 01',
            createdAt: d1,
          },
          {
            hostname: 'COBCON220',
            bancadaOrigem: 'C01-A04',
            bancadaDestino: 'C02-B05',
            colaboradorAnterior: 'Lucas Mendonça',
            colaboradorNovo: 'Vanessa Prado',
            tipoEvento: 'TROCA_MENSAL',
            observacao: 'Rodízio mensal de campanha de cobrança',
            createdAt: d2,
          },
          {
            hostname: 'COBCON220',
            bancadaOrigem: 'C02-B05',
            bancadaDestino: 'C03-B01',
            colaboradorAnterior: 'Vanessa Prado',
            colaboradorNovo: 'Fernanda Souza',
            tipoEvento: 'TROCA_MENSAL',
            observacao: 'Transferência para célula de Negociação Especial',
            createdAt: d3,
          },
        ]);
      } else {
        await HistoricoMovimento.create({
          hostname: item.hostname,
          bancadaOrigem: null,
          bancadaDestino: item.codigoBancada,
          colaboradorAnterior: null,
          colaboradorNovo: item.colaborador,
          tipoEvento: 'ALOCACAO',
          observacao: `Alocação inicial do ativo ${item.hostname} na bancada ${item.codigoBancada}`,
        });
      }
    }

    for (const bloq of BANCADAS_DESATIVADAS_INICIAIS) {
      await Bancada.update(
        {
          status: 'DESATIVADA',
          motivoBloqueio: bloq.motivoBloqueio,
          maquinaId: null,
          colaborador: null,
        },
        { where: { codigo: bloq.codigo } }
      );

      await HistoricoMovimento.create({
        hostname: null,
        bancadaOrigem: bloq.codigo,
        bancadaDestino: null,
        colaboradorAnterior: null,
        colaboradorNovo: null,
        tipoEvento: 'DESATIVACAO_BANCADA',
        observacao: bloq.motivoBloqueio,
      });
    }

    console.log('[Seeder] Alocações iniciais e histórico de rastreabilidade criados.');
  }

  if (closeConnection) {
    await sequelize.close();
  }
}

if (require.main === module) {
  initBancadas({ closeConnection: true }).catch((err) => {
    console.error('[Seeder Error]:', err);
    process.exit(1);
  });
}

module.exports = initBancadas;

