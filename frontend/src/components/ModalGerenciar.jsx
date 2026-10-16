import { useEffect, useState } from 'react';
import {
  X,
  Monitor,
  User,
  Users,
  Network,
  AlertTriangle,
  History,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Ban,
  Wrench,
  Save,
  Search,
  Calendar,
  FileText,
  Cpu,
  Circle,
  UserMinus,
} from 'lucide-react';
import { api } from '../services/api.js';

const formatarData = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const BADGE_EVENTO = {
  ALOCACAO: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
  TROCA_MENSAL: 'bg-sky-950/60 text-sky-300 border-sky-700/60',
  SWAP: 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60',
  DESATIVACAO_BANCADA: 'bg-rose-950/60 text-rose-300 border-rose-700/60',
  DESLIGAMENTO_RESERVA: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/60',
};

export default function ModalGerenciar({
  bancada,
  todasBancadas = [],
  abaInicial = 'alocacao',
  onClose,
  onSuccess,
  onError,
}) {
  const [abaAtiva, setAbaAtiva] = useState(abaInicial);
  const [salvando, setSalvando] = useState(false);
  const [erroLocal, setErroLocal] = useState('');

  // Campos de Alocação / Movimentação
  const [hostname, setHostname] = useState(bancada.maquina?.hostname || '');
  const [colaborador, setColaborador] = useState(bancada.colaborador || '');
  const [equipe, setEquipe] = useState(bancada.equipe || '');
  const [pontoRede, setPontoRede] = useState(bancada.pontoRede || '');
  const [patrimonioPc, setPatrimonioPc] = useState(bancada.maquina?.patrimonioPc || '');
  const [patrimonioMonitor, setPatrimonioMonitor] = useState(
    bancada.maquina?.patrimonioMonitor || ''
  );
  const [kitPerifericos, setKitPerifericos] = useState(
    bancada.maquina?.kitPerifericos || 'Teclado + Mouse + Headset'
  );
  const [emReserva, setEmReserva] = useState(false);
  const [observacao, setObservacao] = useState('');

  // Campos de Status / Bloqueio / Reserva da Bancada
  const [novoStatus, setNovoStatus] = useState(bancada.status || 'LIVRE');
  const [motivoBloqueio, setMotivoBloqueio] = useState(bancada.motivoBloqueio || '');

  // Campos de Swap Direto
  const [codigoBancadaSwap, setCodigoBancadaSwap] = useState('');
  const [observacaoSwap, setObservacaoSwap] = useState('');

  // Estados de Histórico de Rastreabilidade
  const [modoHistorico, setModoHistorico] = useState(
    bancada.maquina?.hostname ? 'maquina' : 'bancada'
  );
  const [hostnameConsulta, setHostnameConsulta] = useState(bancada.maquina?.hostname || '');
  const [historicoMaquina, setHistoricoMaquina] = useState([]);
  const [historicoBancada, setHistoricoBancada] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  // Carrega histórico automaticamente quando abre a aba de rastreabilidade ou muda a máquina
  useEffect(() => {
    const carregarDadosHistorico = async () => {
      setCarregandoHistorico(true);
      try {
        const promessas = [api.obterHistoricoBancada(bancada.codigo)];
        const hostAlvo = (hostnameConsulta || bancada.maquina?.hostname || '').trim();
        if (hostAlvo) {
          promessas.push(api.obterHistoricoMaquina(hostAlvo));
        }
        const [histBanc, histMaq] = await Promise.all(promessas);
        setHistoricoBancada(histBanc || []);
        if (histMaq) setHistoricoMaquina(histMaq);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setCarregandoHistorico(false);
      }
    };

    carregarDadosHistorico();
  }, [bancada.codigo, bancada.maquina?.hostname, abaAtiva]);

  const consultarHostnameManual = async (e) => {
    if (e) e.preventDefault();
    const termo = hostnameConsulta.trim().toUpperCase();
    if (!termo) return;
    setCarregandoHistorico(true);
    setModoHistorico('maquina');
    try {
      const dados = await api.obterHistoricoMaquina(termo);
      setHistoricoMaquina(dados || []);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao buscar histórico da máquina.';
      setErroLocal(msg);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  // Salvar alocação ou movimentação de máquina/colaboradora
  const handleAlocarOuMover = async (e) => {
    e.preventDefault();
    setErroLocal('');

    if (!hostname.trim()) {
      setErroLocal('Informe o Hostname da máquina (ex: COBCON220).');
      return;
    }

    setSalvando(true);
    try {
      if (bancada.status === 'DESATIVADA') {
        await api.alterarStatus({
          codigoBancada: bancada.codigo,
          status: 'LIVRE',
          motivoBloqueio: null,
        });
      }

      await api.alocarOuMover({
        codigoBancada: bancada.codigo,
        hostname: hostname.trim().toUpperCase(),
        colaborador: emReserva ? null : colaborador.trim(),
        equipe: equipe.trim(),
        pontoRede: pontoRede.trim(),
        patrimonioPc: patrimonioPc.trim(),
        patrimonioMonitor: patrimonioMonitor.trim(),
        kitPerifericos: kitPerifericos.trim(),
        observacao: observacao.trim(),
        emReserva,
      });

      onSuccess(
        emReserva
          ? `Máquina ${hostname.trim().toUpperCase()} configurada em RESERVA na bancada ${bancada.codigo}!`
          : `Máquina ${hostname.trim().toUpperCase()} alocada com sucesso na bancada ${bancada.codigo}!`
      );
      onClose();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Não foi possível concluir a alocação.';
      setErroLocal(msg);
      if (onError) onError(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Atalho rápido para desligamento de colaborador -> Colocar bancada em RESERVA
  const handleColocarEmReservaRapido = async () => {
    setErroLocal('');
    if (!bancada.maquina?.hostname) {
      setErroLocal('Esta bancada não possui máquina associada para ficar em RESERVA.');
      return;
    }

    setSalvando(true);
    try {
      await api.alterarStatus({
        codigoBancada: bancada.codigo,
        status: 'RESERVA',
        observacao:
          observacao.trim() ||
          (bancada.colaborador
            ? `Desligamento/saída de ${bancada.colaborador} — Máquina ${bancada.maquina.hostname} mantida em RESERVA`
            : `Bancada ${bancada.codigo} colocada em RESERVA`),
      });

      onSuccess(
        `Bancada ${bancada.codigo} colocada em RESERVA (máquina ${bancada.maquina.hostname} pronta p/ uso)!`
      );
      onClose();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao colocar bancada em reserva.';
      setErroLocal(msg);
      if (onError) onError(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Salvar alteração de status da bancada (LIVRE, OCUPADA, RESERVA, DESATIVADA, MANUTENCAO)
  const handleAlterarStatus = async (e) => {
    e.preventDefault();
    setErroLocal('');

    if (
      (novoStatus === 'DESATIVADA' || novoStatus === 'MANUTENCAO') &&
      !motivoBloqueio.trim()
    ) {
      setErroLocal('Informe o motivo de bloqueio/desativação da bancada.');
      return;
    }

    setSalvando(true);
    try {
      await api.alterarStatus({
        codigoBancada: bancada.codigo,
        status: novoStatus,
        motivoBloqueio: motivoBloqueio.trim(),
      });

      onSuccess(`Status da bancada ${bancada.codigo} atualizado para ${novoStatus}!`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao alterar o status da bancada.';
      setErroLocal(msg);
      if (onError) onError(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Realizar Swap entre duas bancadas
  const handleRealizarSwap = async (e) => {
    e.preventDefault();
    setErroLocal('');

    if (!codigoBancadaSwap) {
      setErroLocal('Selecione a bancada de destino para realizar a inversão (Swap).');
      return;
    }

    setSalvando(true);
    try {
      await api.realizarSwap({
        codigoBancadaOrigem: bancada.codigo,
        codigoBancadaDestino: codigoBancadaSwap,
        observacao: observacaoSwap.trim(),
      });

      onSuccess(`Swap realizado com sucesso entre ${bancada.codigo} e ${codigoBancadaSwap}!`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao realizar o swap entre as bancadas.';
      setErroLocal(msg);
      if (onError) onError(msg);
    } finally {
      setSalvando(false);
    }
  };

  const bancadasParaSwap = todasBancadas.filter(
    (b) => b.codigo !== bancada.codigo && b.status !== 'DESATIVADA'
  );

  const listaHistoricoExibida =
    modoHistorico === 'maquina' ? historicoMaquina : historicoBancada;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 text-white">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-sky-500 px-2.5 py-1 text-sm font-black tracking-tight text-slate-950">
                {bancada.codigo}
              </span>
              <h2 className="text-lg font-bold">
                Corredor {String(bancada.corredor).padStart(2, '0')} · Fileira Lado {bancada.lado} ·
                Posição {String(bancada.posicao).padStart(2, '0')}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  bancada.status === 'OCUPADA'
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                    : bancada.status === 'RESERVA'
                    ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/50'
                    : bancada.status === 'DESATIVADA'
                    ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                    : bancada.status === 'MANUTENCAO'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {bancada.status === 'RESERVA' ? '🔵 RESERVA' : bancada.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {bancada.status === 'RESERVA'
                ? `Máquina pronta p/ uso sem operador: ${bancada.maquina?.hostname || '—'}`
                : bancada.maquina?.hostname
                ? `Ativo atual: ${bancada.maquina.hostname} (${
                    bancada.colaborador || 'Sem colaborador vinculado'
                  })`
                : bancada.status === 'DESATIVADA'
                ? `Motivo do bloqueio: ${bancada.motivoBloqueio || 'Não informado'}`
                : 'Bancada livre pronta para alocação'}
              {bancada.pontoRede ? ` · Ponto de Rede: ${bancada.pontoRede}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Fechar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegação de Abas */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/80 px-6 pt-2 text-xs font-semibold sm:text-sm">
          <button
            type="button"
            onClick={() => {
              setErroLocal('');
              setAbaAtiva('alocacao');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
              abaAtiva === 'alocacao'
                ? 'border-sky-500 bg-slate-900 text-sky-400 rounded-t-lg font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Alocar / Mover Máquina</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErroLocal('');
              setAbaAtiva('status');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
              abaAtiva === 'status'
                ? 'border-sky-500 bg-slate-900 text-sky-400 rounded-t-lg font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Ban className="h-4 w-4" />
            <span>Status / Reserva ({bancada.status})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErroLocal('');
              setAbaAtiva('swap');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
              abaAtiva === 'swap'
                ? 'border-sky-500 bg-slate-900 text-sky-400 rounded-t-lg font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Swap de Postos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErroLocal('');
              setAbaAtiva('historico');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
              abaAtiva === 'historico'
                ? 'border-sky-500 bg-slate-900 text-sky-400 rounded-t-lg font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Histórico de Rastreabilidade</span>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {erroLocal && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-800/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{erroLocal}</span>
            </div>
          )}

          {/* ABA 1: ALOCAR OU MOVER MÁQUINA E COLABORADORA */}
          {abaAtiva === 'alocacao' && (
            <form onSubmit={handleAlocarOuMover} className="space-y-4">
              <div className="rounded-xl border border-sky-500/30 bg-sky-950/30 p-3.5 text-xs text-sky-200">
                <strong className="text-sky-300">Rastreabilidade Automática:</strong> Se o hostname
                informado (ex: <code className="font-mono font-bold text-sky-300">COBCON220</code>)
                já estiver alocado em outra bancada, o sistema liberará automaticamente a bancada de
                origem (definindo-a como <span className="font-bold text-emerald-400">LIVRE</span>)
                e transferirá a máquina para{' '}
                <span className="font-bold text-sky-300">{bancada.codigo}</span>, gravando a
                movimentação no histórico.
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Monitor className="h-3.5 w-3.5 text-sky-400" />
                    Hostname da Máquina *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value.toUpperCase())}
                    placeholder="Ex: COBCON220"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm font-bold uppercase text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-emerald-400" />
                      Colaborador(a)
                    </span>
                    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold normal-case text-sky-300">
                      <input
                        type="checkbox"
                        checked={emReserva}
                        onChange={(e) => setEmReserva(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-900 text-sky-500"
                      />
                      <span>🔵 Deixar em Reserva (s/ operador)</span>
                    </label>
                  </label>
                  <input
                    type="text"
                    disabled={emReserva}
                    value={emReserva ? '' : colaborador}
                    onChange={(e) => setColaborador(e.target.value)}
                    placeholder={
                      emReserva
                        ? '[RESERVA - PRONTA P/ USO SEM OPERADOR]'
                        : 'Nome da colaboradora ou operador'
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-sky-950/30 disabled:text-sky-300"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    Equipe / Carteira
                  </label>
                  <input
                    type="text"
                    value={equipe}
                    onChange={(e) => setEquipe(e.target.value)}
                    placeholder="Ex: Negociação Especial, Preventiva..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Network className="h-3.5 w-3.5 text-slate-400" />
                    Ponto de Rede
                  </label>
                  <input
                    type="text"
                    value={pontoRede}
                    onChange={(e) => setPontoRede(e.target.value)}
                    placeholder="Ex: PR-01A01"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Detalhes de Patrimônio do Computador */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Cpu className="h-3.5 w-3.5 text-sky-400" />
                  <span>Dados de Patrimônio &amp; Periféricos (Opcional)</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-400">
                      Patrimônio PC
                    </label>
                    <input
                      type="text"
                      value={patrimonioPc}
                      onChange={(e) => setPatrimonioPc(e.target.value)}
                      placeholder="Ex: PAT-PC-9220"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-400">
                      Patrimônio Monitor
                    </label>
                    <input
                      type="text"
                      value={patrimonioMonitor}
                      onChange={(e) => setPatrimonioMonitor(e.target.value)}
                      placeholder="Ex: PAT-MON-4220"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-400">
                      Kit Periféricos
                    </label>
                    <input
                      type="text"
                      value={kitPerifericos}
                      onChange={(e) => setKitPerifericos(e.target.value)}
                      placeholder="Teclado + Mouse + Headset"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Observação da Movimentação / Troca Mensal
                </label>
                <input
                  type="text"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Rodízio mensal de outubro / Contratação nova colaboradora"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                <div>
                  {bancada.maquina?.hostname && bancada.status === 'OCUPADA' && (
                    <button
                      type="button"
                      disabled={salvando}
                      onClick={handleColocarEmReservaRapido}
                      className="flex items-center gap-1.5 rounded-lg border border-sky-500/50 bg-sky-950/60 px-3.5 py-2 text-xs font-bold text-sky-300 transition hover:bg-sky-900/80 hover:text-white disabled:opacity-50"
                      title="Mantém a máquina atual na bancada, remove o colaborador e marca como RESERVA"
                    >
                      <UserMinus className="h-4 w-4 text-sky-400" />
                      <span>🔵 Desligamento (Colocar em Reserva)</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{salvando ? 'Salvando...' : 'Salvar Alocação / Movimentação'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ABA 2: ALTERAR STATUS / RESERVA / DESATIVAR BANCADA COM DEFEITO */}
          {abaAtiva === 'status' && (
            <form onSubmit={handleAlterarStatus} className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {[
                  {
                    valor: 'OCUPADA',
                    titulo: 'Ocupada',
                    desc: 'Posto ativo com operador',
                    cor: 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/50',
                    icone: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
                  },
                  {
                    valor: 'RESERVA',
                    titulo: 'Reserva',
                    desc: 'Mantém PC s/ operador',
                    cor: 'border-sky-500 bg-sky-950/60 text-sky-200 ring-2 ring-sky-500/50',
                    icone: <span className="text-xs leading-none">🔵</span>,
                  },
                  {
                    valor: 'LIVRE',
                    titulo: 'Livre',
                    desc: 'Desvincula PC e libera mesa',
                    cor: 'border-slate-500 bg-slate-800/80 text-slate-200 ring-2 ring-slate-500/50',
                    icone: <Circle className="h-4 w-4 text-slate-400" />,
                  },
                  {
                    valor: 'DESATIVADA',
                    titulo: 'Desativada',
                    desc: 'Bloqueia mesa com defeito',
                    cor: 'border-rose-500 bg-rose-950/40 text-rose-200 ring-2 ring-rose-500/50',
                    icone: <Ban className="h-4 w-4 text-rose-400" />,
                  },
                  {
                    valor: 'MANUTENCAO',
                    titulo: 'Manutenção',
                    desc: 'Em reparo pela TI / Predial',
                    cor: 'border-amber-500 bg-amber-950/40 text-amber-200 ring-2 ring-amber-500/50',
                    icone: <Wrench className="h-4 w-4 text-amber-400" />,
                  },
                ].map((op) => (
                  <button
                    key={op.valor}
                    type="button"
                    onClick={() => setNovoStatus(op.valor)}
                    className={`flex flex-col items-start rounded-xl border-2 p-3 text-left transition ${
                      novoStatus === op.valor
                        ? op.cor
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="mb-1 flex w-full items-center justify-between">
                      <span className="text-xs font-extrabold uppercase">{op.titulo}</span>
                      {op.icone}
                    </div>
                    <span className="text-[11px] leading-snug opacity-80">{op.desc}</span>
                  </button>
                ))}
              </div>

              {novoStatus === 'RESERVA' && (
                <div className="space-y-3 rounded-xl border border-sky-500/40 bg-sky-950/30 p-4 text-xs text-sky-200">
                  <div className="font-bold text-sky-300">
                    🔵 Modo RESERVA (Desligamento / Máquina Pronta p/ Uso):
                  </div>
                  <p>
                    A bancada <strong>{bancada.codigo}</strong> manterá a máquina física associada (
                    <strong>{bancada.maquina?.hostname || 'Nenhuma máquina'}</strong>, monitor e
                    periféricos), limpando o campo <strong>colaborador(a)</strong> e gravando o
                    evento <code className="font-mono text-sky-300">DESLIGAMENTO_RESERVA</code> no
                    histórico.
                  </p>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-sky-300">
                      Observação do Desligamento / Reserva (Opcional)
                    </label>
                    <input
                      type="text"
                      value={motivoBloqueio}
                      onChange={(e) => setMotivoBloqueio(e.target.value)}
                      placeholder="Ex: Desligamento da colaboradora — Kit higienizado e testado pronto para uso"
                      className="w-full rounded-lg border border-sky-700/60 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
              )}

              {(novoStatus === 'DESATIVADA' || novoStatus === 'MANUTENCAO') && (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-rose-400">
                    Motivo da Desativação / Bloqueio *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={motivoBloqueio}
                    onChange={(e) => setMotivoBloqueio(e.target.value)}
                    placeholder="Descreva o defeito da bancada (ex: Ponto de rede inoperante, tomada sem energia, cadeira quebrada...)"
                    className="w-full rounded-lg border border-rose-800/70 bg-rose-950/30 p-3 text-sm text-rose-100 placeholder-rose-400/50 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Ao confirmar, qualquer máquina atualmente na bancada será desvinculada e o
                    evento <code className="font-mono text-rose-300">DESATIVACAO_BANCADA</code> será
                    registrado no histórico.
                  </p>
                </div>
              )}

              {novoStatus === 'LIVRE' && bancada.maquina && (
                <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-3 text-xs text-amber-200">
                  A máquina <strong>{bancada.maquina.hostname}</strong> e o(a) colaborador(a){' '}
                  <strong>{bancada.colaborador || 'atual'}</strong> serão desvinculados desta
                  bancada, tornando o posto <strong>LIVRE</strong>.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white shadow-sm transition disabled:opacity-50 ${
                    novoStatus === 'DESATIVADA'
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-sky-600 hover:bg-sky-500'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  <span>{salvando ? 'Aplicando...' : `Confirmar Status: ${novoStatus}`}</span>
                </button>
              </div>
            </form>
          )}

          {/* ABA 3: INVERSÃO DIRETA DE POSTOS (SWAP) */}
          {abaAtiva === 'swap' && (
            <form onSubmit={handleRealizarSwap} className="space-y-4">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 text-xs text-indigo-200">
                <strong className="text-indigo-300">Inversão Direta de Postos (Swap):</strong> Troca
                simultaneamente os computadores e colaboradores entre a bancada{' '}
                <strong>{bancada.codigo}</strong> e outra bancada ativa do setor em uma única
                transação atômica.
              </div>

              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Bancada de Origem
                  </div>
                  <div className="mt-0.5 text-base font-black text-white">{bancada.codigo}</div>
                  <div className="mt-1 text-xs font-mono font-semibold text-emerald-400">
                    {bancada.maquina?.hostname || 'Sem máquina'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {bancada.status === 'RESERVA'
                      ? '[RESERVA - PRONTA P/ USO]'
                      : bancada.colaborador || 'Sem colaborador'}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-700/60 bg-indigo-950/80 text-indigo-400">
                    <ArrowLeftRight className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Bancada de Destino *
                  </label>
                  <select
                    required
                    value={codigoBancadaSwap}
                    onChange={(e) => setCodigoBancadaSwap(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-medium text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Selecione a outra bancada...</option>
                    {bancadasParaSwap.map((b) => (
                      <option key={b.codigo} value={b.codigo}>
                        {b.codigo} — {b.maquina?.hostname || 'LIVRE'}{' '}
                        {b.status === 'RESERVA'
                          ? '([RESERVA])'
                          : b.colaborador
                          ? `(${b.colaborador})`
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Observação do Swap
                </label>
                <input
                  type="text"
                  value={observacaoSwap}
                  onChange={(e) => setObservacaoSwap(e.target.value)}
                  placeholder="Ex: Inversão mensal de postos entre operadoras"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando || !codigoBancadaSwap}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>{salvando ? 'Invertendo...' : 'Executar Swap de Bancadas'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ABA 4: HISTÓRICO DE RASTREABILIDADE */}
          {abaAtiva === 'historico' && (
            <div className="space-y-4">
              {/* Filtro entre Histórico da Máquina e Histórico da Bancada */}
              <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModoHistorico('maquina')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      modoHistorico === 'maquina'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Por Máquina ({hostnameConsulta || 'Hostname'})
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoHistorico('bancada')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      modoHistorico === 'bancada'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Por Bancada ({bancada.codigo})
                  </button>
                </div>

                <form onSubmit={consultarHostnameManual} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hostnameConsulta}
                    onChange={(e) => setHostnameConsulta(e.target.value.toUpperCase())}
                    placeholder="Consultar outro ex: COBCON220"
                    className="w-48 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs uppercase text-white placeholder-slate-500 outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-500"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Buscar</span>
                  </button>
                </form>
              </div>

              {/* Linha do Tempo */}
              {carregandoHistorico ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  Carregando linha do tempo de rastreabilidade...
                </div>
              ) : listaHistoricoExibida.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-400">
                  Nenhuma movimentação registrada para{' '}
                  {modoHistorico === 'maquina'
                    ? `a máquina ${hostnameConsulta || '(nenhuma máquina vinculada)'}`
                    : `a bancada ${bancada.codigo}`}
                  .
                </div>
              ) : (
                <div className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-slate-800">
                  {listaHistoricoExibida.map((item) => (
                    <div key={item.id} className="relative pl-10">
                      <span className="absolute left-2.5 top-3.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-sky-500 ring-2 ring-sky-900" />
                      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                                BADGE_EVENTO[item.tipoEvento] ||
                                'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {item.tipoEvento}
                            </span>
                            {item.hostname && (
                              <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-slate-200">
                                {item.hostname}
                              </span>
                            )}
                          </div>

                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatarData(item.createdAt)}
                          </span>
                        </div>

                        <div className="mt-2.5 grid grid-cols-1 gap-2 rounded-lg border border-slate-800/80 bg-slate-900/80 p-2.5 text-xs sm:grid-cols-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400">Bancadas:</span>
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono font-bold text-slate-200 border border-slate-700">
                              {item.bancadaOrigem || 'Estoque / Inicial'}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                            <span className="rounded bg-emerald-950/80 border border-emerald-700/60 px-1.5 py-0.5 font-mono font-bold text-emerald-300">
                              {item.bancadaDestino || 'Estoque / Desvinculada'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400">Usuários:</span>
                            <span className="truncate text-slate-300">
                              {item.colaboradorAnterior || '—'}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                            <span className="truncate font-semibold text-white">
                              {item.colaboradorNovo || '[RESERVA / SEM OPERADOR]'}
                            </span>
                          </div>
                        </div>

                        {item.observacao && (
                          <p className="mt-2 text-xs text-slate-400">
                            <strong className="text-slate-300">Obs:</strong> {item.observacao}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
