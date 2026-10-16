import { useState } from 'react';
import {
  Repeat,
  UserCheck,
  Wrench,
  FileText,
  Trash2,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeftRight,
  MousePointerClick,
  AlertCircle,
} from 'lucide-react';

export default function ModoTrocaBarra({
  gestor,
  onGestorChange,
  tecnico,
  onTecnicoChange,
  observacaoLote,
  onObservacaoLoteChange,
  origemSelecionada,
  onCancelarOrigem,
  movimentacoesPendentes,
  onRemoverMovimentacao,
  onLimparMovimentacoes,
  onConfirmarLote,
  onCancelarModoTroca,
  salvandoLote,
}) {
  const [painelAberto, setPainelAberto] = useState(true);

  return (
    <>
      {/* Barra Superior de Contexto do Modo Troca em Lote */}
      <div className="no-print border-b-2 border-amber-500/60 bg-amber-50/95 dark:bg-gradient-to-r dark:from-amber-950/90 dark:via-slate-900 dark:to-amber-950/90 px-4 py-3 text-slate-900 dark:text-white shadow-xl transition-colors sm:px-6 2xl:px-8">
        <div className="flex flex-col gap-3">
          {/* Linha 1: Título, Instrução de Clique Passo a Passo e Botões Principais */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-black shadow-md">
                <Repeat className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black uppercase tracking-wide text-amber-800 dark:text-amber-300">
                    Modo Troca em Lote (Rascunho / Staging)
                  </h2>
                  <span className="rounded-full bg-amber-200 dark:bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/40">
                    {movimentacoesPendentes.length}{' '}
                    {movimentacoesPendentes.length === 1 ? 'troca na fila' : 'trocas na fila'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ao mover uma máquina, o(a) colaborador(a) vai junto automaticamente. Se o destino
                  estiver ocupado, o sistema fará o <strong>Swap automático</strong>.
                </p>
              </div>
            </div>

            {/* Indicador de Passo Atual (Origem -> Destino) */}
            <div className="flex flex-wrap items-center gap-2">
              {!origemSelecionada ? (
                <div className="flex items-center gap-2 rounded-xl border border-amber-400/50 bg-white/90 dark:bg-slate-950/80 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
                  <MousePointerClick className="h-4 w-4 text-amber-500 dark:text-amber-400 animate-bounce" />
                  <span>
                    <strong>1º Passo:</strong> Clique na <strong>Bancada de Origem</strong> no mapa
                    abaixo
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-100 dark:bg-amber-500/20 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white shadow-lg">
                  <span className="rounded bg-amber-500 dark:bg-amber-400 px-1.5 py-0.5 font-mono font-black text-white dark:text-slate-950">
                    ORIGEM: {origemSelecionada.codigo}
                  </span>
                  <span className="font-mono text-amber-900 dark:text-amber-200 font-semibold">
                    ({origemSelecionada.maquina?.hostname || 'S/ PC'} ·{' '}
                    {origemSelecionada.colaborador || 'Reserva'})
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
                  <strong className="text-amber-800 dark:text-amber-300">
                    2º Passo: Clique na Bancada de Destino!
                  </strong>
                  <button
                    type="button"
                    onClick={onCancelarOrigem}
                    className="ml-1 rounded bg-slate-200 dark:bg-slate-900/80 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                    title="Desmarcar bancada de origem"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Linha 2: Inputs de Gestor Solicitante, Técnico TI, Observação e Botões de Confirmação */}
          <div className="grid grid-cols-1 items-end gap-3 border-t border-amber-500/20 pt-2.5 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <UserCheck className="h-3.5 w-3.5" />
                Nome do Gestor / Equipe Solicitante *
              </label>
              <input
                type="text"
                value={gestor}
                onChange={(e) => onGestorChange(e.target.value)}
                placeholder="Ex: Gestor Carlos - Carteira 60+"
                className="w-full rounded-lg border border-amber-500/50 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 shadow-xs"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Wrench className="h-3.5 w-3.5 text-henn-blue" />
                Técnico TI Responsável
              </label>
              <input
                type="text"
                value={tecnico}
                onChange={(e) => onTecnicoChange(e.target.value)}
                placeholder="Ex: Rafael - Suporte TI"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-henn-blue shadow-xs"
              />
            </div>

            <div className="md:col-span-5 flex flex-wrap items-center justify-end gap-2">
              <div className="flex-1 min-w-[160px]">
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Observação do Romaneio
                </label>
                <input
                  type="text"
                  value={observacaoLote}
                  onChange={(e) => onObservacaoLoteChange(e.target.value)}
                  placeholder="Ex: Virada mensal de campanha"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-henn-blue shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={onConfirmarLote}
                disabled={salvandoLote || movimentacoesPendentes.length === 0}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-tight text-white dark:text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 dark:hover:bg-emerald-400 disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {salvandoLote
                    ? 'Efetivando...'
                    : `Confirmar e Salvar Trocas (${movimentacoesPendentes.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={onCancelarModoTroca}
                disabled={salvandoLote}
                className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs"
              >
                <X className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Painel Inferior Retrátil com a Lista de Trocas Pendentes da Sessão */}
      <div className="no-print fixed bottom-4 right-4 left-4 z-40 mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white shadow-2xl backdrop-blur-md transition-colors">
          {/* Barra de Título do Painel Retrátil */}
          <div
            onClick={() => setPainelAberto((v) => !v)}
            className="flex cursor-pointer items-center justify-between bg-amber-50/90 dark:bg-slate-900/90 px-4 py-2.5 border-b border-amber-200 dark:border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-slate-950 shadow-xs">
                {movimentacoesPendentes.length}
              </span>
              <span className="uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Fila de Movimentações Pendentes (Rascunho do Lote)
              </span>
              {!gestor.trim() && movimentacoesPendentes.length > 0 && (
                <span className="hidden items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-500/40 sm:inline-flex">
                  <AlertCircle className="h-3 w-3" />
                  Preencha o Nome do Gestor no topo antes de confirmar
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {movimentacoesPendentes.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLimparMovimentacoes();
                  }}
                  className="rounded border border-rose-500/40 bg-rose-100 dark:bg-rose-950/50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 shadow-xs"
                >
                  Limpar Fila
                </button>
              )}
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <span>{painelAberto ? 'Recolher' : 'Expandir'}</span>
                {painelAberto ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Lista de Trocas */}
          {painelAberto && (
            <div className="max-h-56 overflow-y-auto p-3">
              {movimentacoesPendentes.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Nenhuma troca adicionada ainda. Clique em uma <strong>Bancada de Origem</strong> e
                  depois na <strong>Bancada de Destino</strong> no mapa para adicionar ao lote.
                </p>
              ) : (
                <div className="space-y-2">
                  {movimentacoesPendentes.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-3 py-2 text-xs shadow-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-400">
                          #{idx + 1}
                        </span>

                        {/* Origem */}
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1">
                          <span className="font-mono font-extrabold text-amber-700 dark:text-amber-300">
                            {item.origemCodigo}
                          </span>
                          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                            {item.origemHostname || 'S/ PC'}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            ({item.origemColaborador || '[RESERVA]'})
                          </span>
                        </div>

                        {/* Indicador de Transferência ou Swap Automático */}
                        {item.isSwap ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-100 dark:bg-indigo-950/70 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300">
                            <ArrowLeftRight className="h-3 w-3" />
                            <span>Swap Automático</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                            <ArrowRight className="h-3 w-3" />
                            <span>Transferência</span>
                          </span>
                        )}

                        {/* Destino */}
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1">
                          <span className="font-mono font-extrabold text-sky-700 dark:text-sky-300">
                            {item.destinoCodigo}
                          </span>
                          {item.isSwap ? (
                            <>
                              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                                {item.destinoHostname || 'S/ PC'}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300">
                                ({item.destinoColaborador || '[RESERVA]'})
                              </span>
                            </>
                          ) : (
                            <span className="italic text-slate-500 dark:text-slate-400">(Bancada Livre)</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoverMovimentacao(item.id)}
                        className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-300 transition hover:bg-rose-600 hover:text-white"
                        title="Remover esta movimentação do lote"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

