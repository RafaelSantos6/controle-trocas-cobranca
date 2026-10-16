import { Monitor, User, Ban, Wrench, CheckCircle2, Circle } from 'lucide-react';

const ESTILOS_STATUS = {
  OCUPADA: {
    card: 'bg-emerald-50/95 border-emerald-500 text-emerald-950 hover:bg-emerald-100 hover:shadow-md',
    headerBadge: 'bg-emerald-600 text-white',
    hostnameBox: 'bg-emerald-600/15 text-emerald-900 border-emerald-500/30',
    iconeStatus: <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />,
    labelStatus: 'OCUPADA',
  },
  LIVRE: {
    card: 'bg-slate-100/90 border-slate-300 text-slate-600 hover:bg-slate-200/80 hover:border-slate-400',
    headerBadge: 'bg-slate-500 text-white',
    hostnameBox: 'bg-slate-200/80 text-slate-500 border-slate-300',
    iconeStatus: <Circle className="h-3 w-3 text-slate-400 shrink-0" />,
    labelStatus: 'LIVRE',
  },
  DESATIVADA: {
    card: 'bg-rose-50/95 border-rose-500 text-rose-950 hover:bg-rose-100 hover:shadow-md',
    headerBadge: 'bg-rose-600 text-white',
    hostnameBox: 'bg-rose-600/15 text-rose-800 border-rose-500/30',
    iconeStatus: <Ban className="h-3 w-3 text-rose-600 shrink-0" />,
    labelStatus: 'DESATIVADA',
  },
  MANUTENCAO: {
    card: 'bg-amber-50/95 border-amber-500 text-amber-950 hover:bg-amber-100 hover:shadow-md',
    headerBadge: 'bg-amber-600 text-white',
    hostnameBox: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    iconeStatus: <Wrench className="h-3 w-3 text-amber-600 shrink-0" />,
    labelStatus: 'MANUTENÇÃO',
  },
};

export default function CardBancada({ bancada, destacada, onSelect }) {
  const status = bancada.status || 'LIVRE';
  const estilo = ESTILOS_STATUS[status] || ESTILOS_STATUS.LIVRE;
  const hostname = bancada.maquina?.hostname || null;
  const colaborador = bancada.colaborador || null;

  const classeDestaque = destacada
    ? 'ring-4 ring-yellow-400 !border-yellow-400 shadow-[0_0_22px_rgba(250,204,21,0.95)] animate-pulse z-20 scale-[1.04]'
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
            <span className="hidden text-[9px] font-mono opacity-60 xl:inline">
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
          <span className="truncate font-medium text-rose-700" title={bancada.motivoBloqueio || ''}>
            {bancada.motivoBloqueio || 'Indisponível'}
          </span>
        ) : colaborador ? (
          <>
            <User className="h-2.5 w-2.5 shrink-0 opacity-70" />
            <span className="truncate font-semibold">{colaborador}</span>
          </>
        ) : (
          <span className="truncate italic opacity-60">Posto disponível</span>
        )}
      </div>
    </button>
  );
}
