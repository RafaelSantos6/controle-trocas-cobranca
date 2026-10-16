import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import HeaderBusca from './components/HeaderBusca.jsx';
import PlantaSetor from './components/PlantaSetor.jsx';
import ModalGerenciar from './components/ModalGerenciar.jsx';
import { api } from './services/api.js';

export default function App() {
  const [bancadas, setBancadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [busca, setBusca] = useState('');
  const [modalState, setModalState] = useState({ bancada: null, abaInicial: 'alocacao' });
  const [toast, setToast] = useState(null);

  const exibirToast = useCallback((mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const carregarBancadas = useCallback(async () => {
    setCarregando(true);
    setErroCarregamento('');
    try {
      const dados = await api.listarBancadas();
      setBancadas(Array.isArray(dados) ? dados : []);
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        'Não foi possível conectar ao servidor backend em http://localhost:3001/api.';
      setErroCarregamento(msg);
      exibirToast(msg, 'erro');
    } finally {
      setCarregando(false);
    }
  }, [exibirToast]);

  useEffect(() => {
    carregarBancadas();
  }, [carregarBancadas]);

  // Estatísticas globais das 122 bancadas
  const estatisticas = useMemo(() => {
    const total = bancadas.length;
    let ocupadas = 0;
    let livres = 0;
    let desativadas = 0;
    let manutencao = 0;

    for (const b of bancadas) {
      if (b.status === 'OCUPADA') ocupadas++;
      else if (b.status === 'DESATIVADA') desativadas++;
      else if (b.status === 'MANUTENCAO') manutencao++;
      else livres++;
    }

    return { total, ocupadas, livres, desativadas, manutencao };
  }, [bancadas]);

  // Pesquisa em tempo real por hostname (COBCON...), colaboradora, equipe ou código da bancada (C01-A01)
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

      if (matchCodigo || matchHostname || matchColaborador || matchEquipe || matchPontoRede) {
        encontrados.add(b.codigo);
      }
    }
    return encontrados;
  }, [bancadas, busca]);

  const handleAbrirBancada = (bancada, abaInicial = 'alocacao') => {
    setModalState({ bancada, abaInicial });
  };

  const handleAbrirSwapRapido = () => {
    const primeiraOcupada = bancadas.find((b) => b.status === 'OCUPADA') || bancadas[0];
    if (primeiraOcupada) {
      setModalState({ bancada: primeiraOcupada, abaInicial: 'swap' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      {/* Notificação Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all duration-200 bg-slate-900 text-white border-slate-700">
          {toast.tipo === 'erro' ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          )}
          <span className="text-xs font-medium sm:text-sm">{toast.mensagem}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho com Busca Global, Legenda e Contadores */}
      <HeaderBusca
        busca={busca}
        onBuscaChange={setBusca}
        estatisticas={estatisticas}
        totalEncontradas={codigosDestacados.size}
        carregando={carregando}
        onRecarregar={carregarBancadas}
        onAbrirSwapRapido={handleAbrirSwapRapido}
      />

      {/* Estado de Erro de Conexão */}
      {erroCarregamento && (
        <div className="mx-auto mt-4 max-w-[1600px] px-4 sm:px-6">
          <div className="flex items-center justify-between rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
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
        <div className="flex h-96 flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          <p className="text-sm font-medium">
            Carregando planta das 122 bancadas do setor de cobrança...
          </p>
        </div>
      ) : (
        <PlantaSetor
          bancadas={bancadas}
          codigosDestacados={codigosDestacados}
          onSelectBancada={(b) => handleAbrirBancada(b, 'alocacao')}
        />
      )}

      {/* Modal de Gerenciamento e Rastreabilidade */}
      {modalState.bancada && (
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
    </div>
  );
}
