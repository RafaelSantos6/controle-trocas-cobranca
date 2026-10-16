import {
  Search,
  X,
  Monitor,
  CheckCircle2,
  CircleDashed,
  Ban,
  Wrench,
  RefreshCw,
  ArrowLeftRight,
  Building2,
  Repeat,
  Users,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const ROLE_BADGE_STYLES = {
  ADM: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  TI: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  GESTOR: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

export default function HeaderBusca({
  busca,
  onBuscaChange,
  estatisticas,
  totalEncontradas,
  carregando,
  onRecarregar,
  onAbrirSwapRapido,
  modoTrocaAtivo,
  onToggleModoTroca,
  totalTrocasPendentes = 0,
  onAbrirGestaoUsuarios,
}) {
  const {
    usuario,
    logout,
    podeGerenciarBancadas,
    podeGerenciarAcessos,
  } = useAuth();

  const {
    total = 122,
    ocupadas = 0,
    reserva = 0,
    livres = 0,
    desativadas = 0,
    manutencao = 0,
  } = estatisticas || {};

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md text-white shadow-xl">
      <div className="w-full px-4 py-3 sm:px-6 2xl:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Título e Identidade do Setor */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight sm:text-lg">
                    Mapa de Alocação &amp; Trocas Mensais
                  </h1>
                  <span className="hidden rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/30 sm:inline-block">
                    SETOR DE COBRANÇA · CONSULT&apos;H
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  10 Corredores · 122 Bancadas · Rastreabilidade Histórica de Ativos
                </p>
              </div>
            </div>

            {/* Ações compactas para telas menores */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                type="button"
                onClick={onToggleModoTroca}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition ${
                  modoTrocaAtivo
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                }`}
              >
                <span>🔄 {modoTrocaAtivo ? 'Modo Troca Ativo' : 'Iniciar Modo Troca'}</span>
              </button>

              {podeGerenciarAcessos && onAbrirGestaoUsuarios && (
                <button
                  type="button"
                  onClick={onAbrirGestaoUsuarios}
                  className="rounded-lg border border-purple-500/40 bg-purple-950/40 p-2 text-purple-300 hover:bg-purple-900/50 hover:text-white"
                  title="👥 Gerenciar Acessos"
                >
                  <Users className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onRecarregar}
                disabled={carregando}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                title="Atualizar mapa"
              >
                <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin text-sky-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-2 text-rose-300 hover:bg-rose-900/60 hover:text-white"
                title="Sair / Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa Global em Tempo Real */}
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              placeholder="Pesquisar por máquina (ex: COBCON220), colaboradora, equipe ou bancada (ex: C01-A01)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-10 pr-24 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-yellow-400 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400/20"
            />
            {busca && (
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                    totalEncontradas > 0
                      ? 'bg-yellow-400 text-slate-950'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {totalEncontradas} {totalEncontradas === 1 ? 'achada' : 'achadas'}
                </span>
                <button
                  type="button"
                  onClick={() => onBuscaChange('')}
                  className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Limpar pesquisa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Contadores e Ações Rápidas */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            {/* Contadores de Bancadas */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <div
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5"
                title="Total de bancadas no setor"
              >
                <Monitor className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-slate-400">Total:</span>
                <span className="font-bold text-white">{total}</span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1.5"
                title="Bancadas Ativas / Ocupadas (Verde)"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-200">Ocupadas:</span>
                <span className="font-bold text-emerald-400">{ocupadas}</span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-950/60 px-2.5 py-1.5"
                title="Bancadas em Reserva - Máquina pronta p/ uso sem operador (Azul/Ciano)"
              >
                <span className="text-[11px] leading-none">🔵</span>
                <span className="text-sky-200">Reserva:</span>
                <span className="font-bold text-sky-300">{reserva}</span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5"
                title="Bancadas Livres / Disponíveis (Cinza)"
              >
                <CircleDashed className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-400">Livres:</span>
                <span className="font-bold text-slate-200">{livres}</span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-950/50 px-2.5 py-1.5"
                title="Bancadas Desativadas / Com Defeito (Vermelho)"
              >
                <Ban className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-rose-200">Desativadas:</span>
                <span className="font-bold text-rose-400">{desativadas}</span>
              </div>

              {manutencao > 0 && (
                <div
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50 px-2.5 py-1.5"
                  title="Bancadas em Manutenção"
                >
                  <Wrench className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-amber-200">Manutenção:</span>
                  <span className="font-bold text-amber-400">{manutencao}</span>
                </div>
              )}
            </div>

            {/* Botões de Ação e Perfil Logado */}
            <div className="hidden items-center gap-2 xl:flex">
              <button
                type="button"
                onClick={onToggleModoTroca}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold tracking-tight transition shadow-md ${
                  modoTrocaAtivo
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                    : 'border border-amber-500/60 bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-slate-950'
                }`}
                title="Ativar Modo de Troca em Lote com emissão de Romaneio / O.S."
              >
                <Repeat className={`h-3.5 w-3.5 ${modoTrocaAtivo ? 'animate-spin' : ''}`} />
                <span>
                  {modoTrocaAtivo
                    ? `🔄 Modo Troca Ativo (${totalTrocasPendentes})`
                    : '🔄 Iniciar Modo Troca'}
                </span>
              </button>

              {podeGerenciarBancadas && onAbrirSwapRapido && !modoTrocaAtivo && (
                <button
                  type="button"
                  onClick={onAbrirSwapRapido}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-900/50 hover:text-white"
                  title="Inverter duas bancadas diretamente (Swap)"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Swap Rápido</span>
                </button>
              )}

              {podeGerenciarAcessos && onAbrirGestaoUsuarios && (
                <button
                  type="button"
                  onClick={onAbrirGestaoUsuarios}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50 hover:text-white"
                  title="Gerenciar contas de usuários e resetar senhas"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>👥 Gerenciar Acessos</span>
                </button>
              )}

              <button
                type="button"
                onClick={onRecarregar}
                disabled={carregando}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                title="Sincronizar planta com o servidor"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${carregando ? 'animate-spin text-sky-400' : ''}`}
                />
                <span>Atualizar</span>
              </button>

              {/* Card do Usuário Logado + Role Badge + Botão Sair */}
              {usuario && (
                <div className="ml-1 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 pl-2.5 pr-1.5 py-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="max-w-[130px] truncate font-semibold text-slate-200" title={usuario.nome}>
                      {usuario.nome}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        ROLE_BADGE_STYLES[usuario.role] ||
                        'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      {usuario.role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-950/50 px-2 py-1 text-[11px] font-bold text-rose-300 transition hover:bg-rose-600 hover:text-white"
                    title="Encerrar sessão (Logout)"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra Inferior: Legenda Visual dos Status + Perfil Mobile */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-[11px] text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold uppercase tracking-wider text-slate-400">
              Legenda de Status:
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span>
                <strong className="text-emerald-300">Verde</strong> = Ocupada (Ativa)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-sky-400 bg-sky-500 shadow-sm shadow-sky-500/50" />
              <span>
                <strong className="text-sky-300">Azul/Ciano (🔵)</strong> = Reserva (Pronta p/ Uso
                s/ Operador)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-slate-500 bg-slate-700" />
              <span>
                <strong className="text-slate-300">Cinza</strong> = Livre (Sem Máquina)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-rose-400 bg-rose-600 shadow-sm shadow-rose-500/50" />
              <span>
                <strong className="text-rose-300">Vermelho</strong> = Desativada (Com Defeito)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-yellow-300 bg-yellow-400 animate-pulse shadow-sm shadow-yellow-400/50" />
              <span>
                <strong className="text-yellow-300">Borda Amarela</strong> = Destaque da Busca
              </span>
            </span>
          </div>

          <div className="text-slate-400 hidden lg:block">
            {modoTrocaAtivo
              ? 'Modo Troca em Lote: clique na bancada de ORIGEM e depois na bancada de DESTINO.'
              : podeGerenciarBancadas
              ? 'Clique em qualquer bancada para alocar máquina, colocar em reserva, desativar ou ver histórico.'
              : 'Perfil GESTOR: clique em "🔄 Iniciar Modo Troca" para movimentar equipes ou clique em uma bancada para ver o histórico.'}
          </div>
        </div>
      </div>
    </header>
  );
}
