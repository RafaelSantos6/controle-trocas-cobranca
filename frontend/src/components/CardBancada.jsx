import { Monitor, User, Ban, Wrench, CheckCircle2, Circle } from 'lucide-react';

const ESTILOS_STATUS = {
  OCUPADA: {
    card: 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 hover:bg-emerald-900/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/50',
    headerBadge: 'bg-emerald-600 text-white shadow-xs',
    hostnameBox: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    iconeStatus: <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />,
    labelStatus: 'OCUPADA',
  },
  LIVRE: {
    card: 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-500 hover:shadow-md',
    headerBadge: 'bg-slate-700 text-slate-200',
    hostnameBox: 'bg-slate-800/70 text-slate-400 border-slate-700/70',
    iconeStatus: <Circle className="h-3 w-3 text-slate-500 shrink-0" />,
    labelStatus: 'LIVRE',
  },
  DESATIVADA: {
    card: 'bg-rose-950/40 border-rose-600/70 text-rose-100 hover:bg-rose-900/40 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-950/50',
    headerBadge: 'bg-rose-600 text-white shadow-xs',
    hostnameBox: 'bg-rose-900/40 text-rose-300 border-rose-700/50',
    iconeStatus: <Ban className="h-3 w-3 text-rose-400 shrink-0" />,
    labelStatus: 'DESATIVADA',
  },
  MANUTENCAO: {
    card: 'bg-amber-950/40 border-amber-600/70 text-amber-100 hover:bg-amber-900/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/50',
    headerBadge: 'bg-amber-600 text-white shadow-xs',
    hostnameBox: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    iconeStatus: <Wrench className="h-3 w-3 text-amber-400 shrink-0" />,
    labelStatus: 'MANUTENÇÃO',
  },
};

export default function CardBancada({ bancada, destacada, onSelect }) {
  const status = bancada.status || 'LIVRE';
  const estilo = ESTILOS_STATUS[status] || ESTILOS_STATUS.LIVRE;
  const hostname = bancada.maquina?.hostname || null;
  const colaborador = bancada.colaborador || null;

  const classeDestaque = destacada
    ? 'ring-4 ring-yellow-400 !border-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.95)] animate-pulse z-20 scale-[1.04]'
    : '';

  return (
    <button
      type="button"
      onClick={() => onSelect(bancada)}
      title={[
        `Bancada: ${bancada.codigo} (${ estilo.labelStatus })`,
        hostname ? `Máquina: ${hostname}` : 'Sem máquina alocada',
        colaborador ? `Colaborador(a): ${colaborador}` : '',
        bancada.equipe ? `Equipe: ${bancada.equipe}` : '',
        bancada.motivoBloqueio ? `Bloqueio: ${bancada.motivoBloqueio}` : '',
        bancada.pontoRede ? `Ponto de Rede: ${bancada.pontoRede}` : '',
      ]
        .filter(Boolean)
        .join(' | ')}
      className={`group relative flex h-[78px] w-full flex-col justify-between rounded-lg border-2 p-1.5 text-left transition-all duration-150 focus:outline-none ${estilo.card} ${classeDestaque}`}
    >
      {/* Topo do Card: Código da Bancada + Indicador de Status */}
      <div className="flex w-full items-center justify-between gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-extrabold tracking-tight ${estilo.headerBadge}`}
        >
          {bancada.codigo}
        </span>
        <div className="flex items-center gap-1">
          {bancada.pontoRede && (
            <span className="hidden text-[9px] font-mono text-slate-400 xl:inline">
              {bancada.pontoRede}
            </span>
          )}
          {estilo.iconeStatus}
        </div>
      </div>

      {/* Centro: Hostname da Máquina ou Status */}
      <div
        className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-bold leading-none ${estilo.hostnameBox}`}
      >
        <Monitor className="h-3 w-3 shrink-0 opacity-80" />
        <span className="truncate font-mono">
          {status === 'DESATIVADA'
            ? 'BLOQUEADA'
            : status === 'MANUTENCAO'
            ? 'MANUTENÇÃO'
            : hostname || 'LIVRE'}
        </span>
      </div>

      {/* Rodapé: Colaboradora ou Motivo de Bloqueio */}
      <div className="flex items-center gap-1 text-[10px] leading-tight">
        {status === 'DESATIVADA' || status === 'MANUTENCAO' ? (
          <span className="truncate font-medium text-rose-300" title={bancada.motivoBloqueio || ''}>
            {bancada.motivoBloqueio || 'Indisponível'}
          </span>
        ) : colaborador ? (
          <>
            <User className="h-2.5 w-2.5 shrink-0 opacity-80 text-slate-300" />
            <span className="truncate font-semibold text-slate-200">{colaborador}</span>
          </>
        ) : (
          <span className="truncate italic text-slate-500">Posto disponível</span>
        )}
      </div>
    </button>
  );
}
