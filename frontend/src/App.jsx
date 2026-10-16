import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import HeaderBusca from './components/HeaderBusca.jsx';
import ModoTrocaBarra from './components/ModoTrocaBarra.jsx';
import PlantaSetor from './components/PlantaSetor.jsx';
import ModalGerenciar from './components/ModalGerenciar.jsx';
import DocumentoTrocaModal from './components/DocumentoTrocaModal.jsx';
import ModalUsuarios from './components/ModalUsuarios.jsx';
import Login from './components/Login.jsx';
import { api } from './services/api.js';
import { useAuth } from './contexts/AuthContext.jsx';

export default function App() {
  const {
    usuario,
    autenticado,
    carregandoAuth,
    podeGerenciarBancadas,
    podeGerenciarAcessos,
  } = useAuth();

  const [bancadas, setBancadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [busca, setBusca] = useState('');
  const [modalState, setModalState] = useState({ bancada: null, abaInicial: 'alocacao' });
  const [modalUsuariosAberto, setModalUsuariosAberto] = useState(false);
  const [toast, setToast] = useState(null);

  // Estados do Modo Troca em Lote (Staging / Rascunho) e Romaneio
  const [modoTrocaAtivo, setModoTrocaAtivo] = useState(false);
  const [gestorLote, setGestorLote] = useState('');
  const [tecnicoLote, setTecnicoLote] = useState('');
  const [observacaoLote, setObservacaoLote] = useState('');
  const [origemSelecionada, setOrigemSelecionada] = useState(null);
  const [movimentacoesPendentes, setMovimentacoesPendentes] = useState([]);
  const [salvandoLote, setSalvandoLote] = useState(false);
  const [dadosRomaneio, setDadosRomaneio] = useState(null);

  const exibirToast = useCallback((mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const carregarBancadas = useCallback(async () => {
    if (!autenticado) return;
    setCarregando(true);
    setErroCarregamento('');
    try {
      const dados = await api.listarBancadas();
      setBancadas(Array.isArray(dados) ? dados : []);
    } catch (err) {
      if (err.response?.status === 401) return;
      const msg =
        err.response?.data?.erro ||
        'Não foi possível conectar ao servidor backend em http://localhost:3001/api.';
      setErroCarregamento(msg);
      exibirToast(msg, 'erro');
    } finally {
      setCarregando(false);
    }
  }, [autenticado, exibirToast]);

  useEffect(() => {
    if (autenticado) {
      carregarBancadas();
    } else {
      setBancadas([]);
      setModoTrocaAtivo(false);
      setModalState({ bancada: null, abaInicial: 'alocacao' });
      setModalUsuariosAberto(false);
      setDadosRomaneio(null);
    }
  }, [autenticado, carregarBancadas]);

  // Estatísticas globais das 122 bancadas (incluindo RESERVA)
  const estatisticas = useMemo(() => {
    const total = bancadas.length;
    let ocupadas = 0;
    let reserva = 0;
    let livres = 0;
    let desativadas = 0;
    let manutencao = 0;

    for (const b of bancadas) {
      if (b.status === 'OCUPADA') ocupadas++;
      else if (b.status === 'RESERVA') reserva++;
      else if (b.status === 'DESATIVADA') desativadas++;
      else if (b.status === 'MANUTENCAO') manutencao++;
      else livres++;
    }

    return { total, ocupadas, reserva, livres, desativadas, manutencao };
  }, [bancadas]);

  // Pesquisa em tempo real por hostname (COBCON...), colaboradora, equipe, status (RESERVA) ou código da bancada (C01-A01)
  const codigosDestacados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return new Set();

    const encontrados = new Set();
    for (const b of bancadas) {
      const matchCodigo = b.codigo?.toLowerCase().includes(termo);
      const matchHostname = b.maquina?.hostname?.toLowerCase().includes(termo);
      const matchColaborador = b.colaborador?.toLowerCase().includes(termo);
      const matchEquipe = b.equipe?.toLowerCase().includes(termo);
      const matchPontoRede = b.pontoRede?.toLowerCase().includes(termo);
      const matchStatus = b.status?.toLowerCase().includes(termo);

      if (
        matchCodigo ||
        matchHostname ||
        matchColaborador ||
        matchEquipe ||
        matchPontoRede ||
        matchStatus
      ) {
        encontrados.add(b.codigo);
      }
    }
    return encontrados;
  }, [bancadas, busca]);

  // Mapa de badges das bancadas envolvidas em trocas pendentes no Modo Troca em Lote
  const mapaTrocasPendentes = useMemo(() => {
    const mapa = {};
    for (const mov of movimentacoesPendentes) {
      if (mov.isSwap) {
        mapa[mov.origemCodigo] = {
          badgeTexto: `⇄ ${mov.destinoCodigo}`,
          tipo: 'SWAP',
        };
        mapa[mov.destinoCodigo] = {
          badgeTexto: `⇄ ${mov.origemCodigo}`,
          tipo: 'SWAP',
        };
      } else {
        mapa[mov.origemCodigo] = {
          badgeTexto: `➔ ${mov.destinoCodigo}`,
          tipo: 'ORIGEM',
        };
        mapa[mov.destinoCodigo] = {
          badgeTexto: `⬅ DE ${mov.origemCodigo}`,
          tipo: 'DESTINO',
        };
      }
    }
    return mapa;
  }, [movimentacoesPendentes]);

  // Alternar Modo Troca em Lote
  const handleToggleModoTroca = () => {
    if (modoTrocaAtivo) {
      setModoTrocaAtivo(false);
      setOrigemSelecionada(null);
      setMovimentacoesPendentes([]);
    } else {
      setModalState({ bancada: null, abaInicial: 'alocacao' });
      // Preenche automaticamente o nome do Gestor ou Técnico com base no usuário logado
      if (usuario?.role === 'GESTOR' && !gestorLote.trim()) {
        setGestorLote(usuario.nome);
      } else if ((usuario?.role === 'TI' || usuario?.role === 'ADM') && !tecnicoLote.trim()) {
        setTecnicoLote(usuario.nome);
      }
      setModoTrocaAtivo(true);
      setOrigemSelecionada(null);
      exibirToast(
        'Modo Troca em Lote ativado! Selecione a bancada de Origem e depois a de Destino.',
        'sucesso'
      );
    }
  };

  // Clique em uma bancada (Modo Normal vs Modo Troca em Lote)
  const handleSelectBancada = (bancada) => {
    if (!modoTrocaAtivo) {
      setModalState({
        bancada,
        abaInicial: podeGerenciarBancadas ? 'alocacao' : 'historico',
      });
      return;
    }

    // Regra no Modo Troca em Lote:
    if (bancada.status === 'DESATIVADA') {
      exibirToast(
        `A bancada ${bancada.codigo} está DESATIVADA e não pode participar de trocas em lote.`,
        'erro'
      );
      return;
    }

    // 1º Clique: Selecionar Bancada de Origem
    if (!origemSelecionada) {
      if (!bancada.maquina && !bancada.colaborador) {
        exibirToast(
          `Selecione como ORIGEM uma bancada que possua máquina ou colaborador (${bancada.codigo} está livre).`,
          'erro'
        );
        return;
      }
      setOrigemSelecionada(bancada);
      return;
    }

    // Se clicou na mesma bancada de origem, desmarca
    if (origemSelecionada.codigo === bancada.codigo) {
      setOrigemSelecionada(null);
      return;
    }

    // 2º Clique: Selecionar Bancada de Destino e adicionar à fila de staging
    const isSwap = Boolean(bancada.maquina || bancada.colaborador);

    const novaMovimentacao = {
      id: `${origemSelecionada.codigo}-${bancada.codigo}-${Date.now()}`,
      origemCodigo: origemSelecionada.codigo,
      origemHostname: origemSelecionada.maquina?.hostname || null,
      origemColaborador: origemSelecionada.colaborador || null,
      origemEquipe: origemSelecionada.equipe || null,
      destinoCodigo: bancada.codigo,
      destinoHostname: bancada.maquina?.hostname || null,
      destinoColaborador: bancada.colaborador || null,
      destinoEquipe: bancada.equipe || null,
      isSwap,
    };

    setMovimentacoesPendentes((prev) => [...prev, novaMovimentacao]);
    setOrigemSelecionada(null);

    exibirToast(
      isSwap
        ? `Swap automático agendado: ${novaMovimentacao.origemCodigo} ⇄ ${novaMovimentacao.destinoCodigo}`
        : `Transferência agendada: ${novaMovimentacao.origemCodigo} ➔ ${novaMovimentacao.destinoCodigo}`,
      'sucesso'
    );
  };

  const handleRemoverMovimentacao = (id) => {
    setMovimentacoesPendentes((prev) => prev.filter((m) => m.id !== id));
  };

  // Efetivar o lote no backend e abrir o Romaneio de Movimentação
  const handleConfirmarLote = async () => {
    if (!gestorLote.trim()) {
      exibirToast('Informe o Nome do Gestor / Equipe Solicitante na barra superior.', 'erro');
      return;
    }
    if (movimentacoesPendentes.length === 0) {
      exibirToast('Adicione pelo menos uma movimentação antes de confirmar.', 'erro');
      return;
    }

    setSalvandoLote(true);
    try {
      const resposta = await api.realizarTrocaEmLote({
        gestor: gestorLote.trim(),
        tecnico: tecnicoLote.trim() || 'Suporte TI',
        observacao: observacaoLote.trim(),
        movimentacoes: movimentacoesPendentes.map((m) => ({
          origemCodigo: m.origemCodigo,
          destinoCodigo: m.destinoCodigo,
        })),
      });

      setDadosRomaneio(resposta);
      setMovimentacoesPendentes([]);
      setOrigemSelecionada(null);
      await carregarBancadas();
      exibirToast('Trocas em lote efetivadas com sucesso! Romaneio gerado.', 'sucesso');
    } catch (err) {
      const msg =
        err.response?.data?.erro || 'Erro ao processar a troca em lote no servidor.';
      exibirToast(msg, 'erro');
    } finally {
      setSalvandoLote(false);
    }
  };

  const handleFecharRomaneio = () => {
    setDadosRomaneio(null);
    setModoTrocaAtivo(false);
    setOrigemSelecionada(null);
    setMovimentacoesPendentes([]);
    carregarBancadas();
  };

  const handleAbrirSwapRapido = () => {
    if (!podeGerenciarBancadas) return;
    const primeiraOcupada = bancadas.find((b) => b.status === 'OCUPADA') || bancadas[0];
    if (primeiraOcupada) {
      setModalState({ bancada: primeiraOcupada, abaInicial: 'swap' });
    }
  };

  // Verificação inicial do token salvo
  if (carregandoAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors">
        <Loader2 className="h-8 w-8 animate-spin text-henn-blue" />
        <p className="text-sm font-medium">Validando sessão de acesso...</p>
      </div>
    );
  }

  // Se não houver token válido, redireciona para a tela de Login
  if (!autenticado) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-200">
      {/* Notificação Toast */}
      {toast && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white border-slate-200 dark:border-slate-700/80">
          {toast.tipo === 'erro' ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
          )}
          <span className="text-xs font-medium sm:text-sm">{toast.mensagem}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho com Busca Global, Legenda, Contadores, Modo Troca e RBAC */}
      <HeaderBusca
        busca={busca}
        onBuscaChange={setBusca}
        estatisticas={estatisticas}
        totalEncontradas={codigosDestacados.size}
        carregando={carregando}
        onRecarregar={carregarBancadas}
        onAbrirSwapRapido={podeGerenciarBancadas ? handleAbrirSwapRapido : null}
        modoTrocaAtivo={modoTrocaAtivo}
        onToggleModoTroca={handleToggleModoTroca}
        totalTrocasPendentes={movimentacoesPendentes.length}
        onAbrirGestaoUsuarios={
          podeGerenciarAcessos ? () => setModalUsuariosAberto(true) : null
        }
      />

      {/* Barra de Contexto e Painel Retrátil do Modo Troca em Lote */}
      {modoTrocaAtivo && (
        <ModoTrocaBarra
          gestor={gestorLote}
          onGestorChange={setGestorLote}
          tecnico={tecnicoLote}
          onTecnicoChange={setTecnicoLote}
          observacaoLote={observacaoLote}
          onObservacaoLoteChange={setObservacaoLote}
          origemSelecionada={origemSelecionada}
          onCancelarOrigem={() => setOrigemSelecionada(null)}
          movimentacoesPendentes={movimentacoesPendentes}
          onRemoverMovimentacao={handleRemoverMovimentacao}
          onLimparMovimentacoes={() => {
            setMovimentacoesPendentes([]);
            setOrigemSelecionada(null);
          }}
          onConfirmarLote={handleConfirmarLote}
          onCancelarModoTroca={() => {
            setModoTrocaAtivo(false);
            setOrigemSelecionada(null);
            setMovimentacoesPendentes([]);
          }}
          salvandoLote={salvandoLote}
        />
      )}

      {/* Estado de Erro de Conexão */}
      {erroCarregamento && (
        <div className="no-print w-full mt-4 px-4 sm:px-6 2xl:px-8">
          <div className="flex items-center justify-between rounded-xl border border-rose-800/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              <span>{erroCarregamento}</span>
            </div>
            <button
              type="button"
              onClick={carregarBancadas}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Planta Baixa do Setor ou Indicador de Carregamento */}
      {carregando && bancadas.length === 0 ? (
        <div className="no-print flex h-96 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-henn-blue" />
          <p className="text-sm font-medium">
            Carregando planta das 122 bancadas do setor de cobrança...
          </p>
        </div>
      ) : (
        <PlantaSetor
          bancadas={bancadas}
          codigosDestacados={codigosDestacados}
          onSelectBancada={handleSelectBancada}
          modoTrocaAtivo={modoTrocaAtivo}
          origemSelecionada={origemSelecionada}
          mapaTrocasPendentes={mapaTrocasPendentes}
        />
      )}

      {/* Modal Individual de Gerenciamento e Rastreabilidade */}
      {modalState.bancada && !modoTrocaAtivo && (
        <ModalGerenciar
          bancada={modalState.bancada}
          todasBancadas={bancadas}
          abaInicial={modalState.abaInicial}
          onClose={() => setModalState({ bancada: null, abaInicial: 'alocacao' })}
          onSuccess={(mensagem) => {
            exibirToast(mensagem, 'sucesso');
            carregarBancadas();
          }}
          onError={(mensagem) => exibirToast(mensagem, 'erro')}
        />
      )}

      {/* Modal de Gestão de Acessos / Usuários (ADM e TI) */}
      {modalUsuariosAberto && podeGerenciarAcessos && (
        <ModalUsuarios
          onClose={() => setModalUsuariosAberto(false)}
          onNotificar={(mensagem, tipo) => exibirToast(mensagem, tipo)}
        />
      )}

      {/* Modal do Romaneio de Movimentação de Ativos (Pronto para Impressão / PDF) */}
      {dadosRomaneio && (
        <DocumentoTrocaModal
          dadosRomaneio={dadosRomaneio}
          onClose={handleFecharRomaneio}
        />
      )}

      {/* Rodapé Institucional: HENN Tecnologia + Grupo Consulth Soluções */}
      <footer className="no-print mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-4 text-center text-xs text-slate-600 dark:text-slate-500 backdrop-blur-sm transition-colors">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4">
          <img
            src="/logo-henn.png"
            alt="HENN Tecnologia"
            className="h-4 w-auto object-contain rounded bg-white p-0.5 shadow-xs"
          />
          <span>
            Desenvolvido com excelência por <strong className="text-slate-800 dark:text-slate-300">HENN Tecnologia</strong>
          </span>
          <span>·</span>
          <span>
            Prestação de Serviços de TI para o <strong className="text-slate-800 dark:text-slate-300">Grupo Consulth Soluções</strong>
          </span>
          <span>·</span>
          <span>Setor de Cobrança (122 Bancadas)</span>
        </div>
      </footer>
    </div>
  );
}

