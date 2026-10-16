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
  Repeat,
  Users,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ROLE_BADGE_STYLES = {
  ADM: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40',
  TI: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/40',
  GESTOR: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
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
  const { isDark, toggleTema } = useTheme();

  const {
    total = 122,
    ocupadas = 0,
    reserva = 0,
    livres = 0,
    desativadas = 0,
    manutencao = 0,
  } = estatisticas || {};

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-800 dark:text-white shadow-md dark:shadow-xl transition-colors duration-200">
      <div className="w-full px-4 py-3 sm:px-6 2xl:px-8">
        {/* Linha 1: Identidade Visual (HENN + Consulth) e Barra de Ações Rápidas / Usuário */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          {/* Título e Identidade */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1 ring-2 ring-henn-500/40 shadow-sm shrink-0">
              <img
                src="/logo-henn.png"
                alt="HENN Tecnologia"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  Mapa de Alocação &amp; Trocas Mensais
                </h1>
                <span className="rounded-full bg-henn-50 dark:bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase text-henn-700 dark:text-blue-300 ring-1 ring-henn-500/40">
                  HENN TECNOLOGIA
                </span>
                <span className="hidden sm:inline-block rounded-full bg-amber-50 dark:bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/30">
                  CLIENTE: GRUPO CONSULTH SOLUÇÕES
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestão Operacional de TI · 10 Corredores · 122 Bancadas · Rastreabilidade de Ativos
              </p>
            </div>
          </div>

          {/* Ações Rápidas & Usuário */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Botão de Alternância de Tema Claro / Escuro */}
            <button
              type="button"
              onClick={toggleTema}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs"
              title={`Alternar para tema ${isDark ? 'Claro' : 'Escuro'}`}
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-henn-600" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleModoTroca}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold tracking-tight transition shadow-md ${
                modoTrocaAtivo
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'border border-amber-500/60 bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950'
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
                className="flex items-center gap-1.5 rounded-lg border border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
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
                className="flex items-center gap-1.5 rounded-lg border border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 transition hover:bg-purple-100 dark:hover:bg-purple-900/50"
                title="Gerenciar contas de usuários e resetar senhas"
              >
                <Users className="h-3.5 w-3.5" />
                <span>👥 Acessos</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRecarregar}
              disabled={carregando}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              title="Sincronizar planta com o servidor"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${carregando ? 'animate-spin text-henn-500' : ''}`}
              />
              <span>Atualizar</span>
            </button>

            {/* Card do Usuário Logado + Role Badge + Botão Sair */}
            {usuario && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 pl-2.5 pr-1.5 py-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-henn-600 dark:text-emerald-400 shrink-0" />
                  <span className="max-w-[130px] truncate font-semibold text-slate-800 dark:text-slate-200" title={usuario.nome}>
                    {usuario.nome}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      ROLE_BADGE_STYLES[usuario.role] ||
                      'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {usuario.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1 rounded-md border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/50 px-2 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 transition hover:bg-rose-600 hover:text-white"
                  title="Encerrar sessão (Logout)"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Linha 2: Barra de Pesquisa Ampla e Estatísticas de Bancadas */}
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Barra de Pesquisa Global em Tempo Real (Espaço Amplo com visualização garantida do texto digitado) */}
          <div className="relative w-full sm:max-w-md lg:max-w-xl shrink-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              placeholder="Pesquisar máquina (ex: COBCON220), colaboradora, equipe ou bancada..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-32 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm outline-none transition focus:border-henn-500 focus:bg-white dark:focus:border-amber-400 dark:focus:bg-slate-900 focus:ring-2 focus:ring-henn-500/20"
            />
            {busca && (
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-black shadow-xs ${
                    totalEncontradas > 0
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-500/40'
                      : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40'
                  }`}
                >
                  {totalEncontradas} {totalEncontradas === 1 ? 'achada' : 'achadas'}
                </span>
                <button
                  type="button"
                  onClick={() => onBuscaChange('')}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
                  title="Limpar pesquisa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Contadores de Bancadas */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-2.5 py-1.5 shadow-2xs"
              title="Total de bancadas no setor"
            >
              <Monitor className="h-3.5 w-3.5 text-henn-500 dark:text-sky-400" />
              <span className="text-slate-500 dark:text-slate-400">Total:</span>
              <span className="font-bold text-slate-800 dark:text-white">{total}</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1.5 shadow-2xs"
              title="Bancadas Ativas / Ocupadas (Verde)"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-200">Ocupadas:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{ocupadas}</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-lg border border-sky-300 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1.5 shadow-2xs"
              title="Bancadas em Reserva - Máquina pronta p/ uso sem operador (Azul/Ciano)"
            >
              <span className="text-[11px] leading-none">🔵</span>
              <span className="text-sky-800 dark:text-sky-200">Reserva:</span>
              <span className="font-bold text-sky-700 dark:text-sky-300">{reserva}</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-900/90 px-2.5 py-1.5 shadow-2xs"
              title="Bancadas Livres / Disponíveis (Cinza)"
            >
              <CircleDashed className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Livres:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{livres}</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1.5 shadow-2xs"
              title="Bancadas Desativadas / Com Defeito (Vermelho)"
            >
              <Ban className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span className="text-rose-800 dark:text-rose-200">Desativadas:</span>
              <span className="font-bold text-rose-700 dark:text-rose-400">{desativadas}</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 shadow-2xs"
              title="Bancadas em Manutenção Técnica (Âmbar)"
            >
              <Wrench className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-200">Manutenção:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{manutencao}</span>
            </div>
          </div>
        </div>

        {/* Linha 3: Legenda Visual dos Status e Dica Operacional */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-2 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Legenda de Status:
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-500 shadow-2xs shadow-emerald-500/50" />
              <span>
                <strong className="text-emerald-700 dark:text-emerald-300">Verde</strong> = Ocupada (Ativa)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-sky-400 bg-sky-500 shadow-2xs shadow-sky-500/50" />
              <span>
                <strong className="text-sky-700 dark:text-sky-300">Azul/Ciano (🔵)</strong> = Reserva (Pronta p/ Uso
                s/ Operador)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-slate-400 bg-slate-500" />
              <span>
                <strong className="text-slate-700 dark:text-slate-300">Cinza</strong> = Livre (Sem Máquina)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-rose-400 bg-rose-600 shadow-2xs shadow-rose-500/50" />
              <span>
                <strong className="text-rose-700 dark:text-rose-300">Vermelho</strong> = Desativada (Com Defeito)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-yellow-400 bg-yellow-400 animate-pulse shadow-2xs shadow-yellow-400/50" />
              <span>
                <strong className="text-amber-700 dark:text-yellow-300">Borda Amarela</strong> = Destaque da Busca
              </span>
            </span>
          </div>

          <div className="text-slate-500 dark:text-slate-400 hidden lg:block">
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
