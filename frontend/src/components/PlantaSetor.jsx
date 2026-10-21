import { useMemo } from 'react';
import { Compass, ArrowUpDown } from 'lucide-react';
import CardBancada from './CardBancada.jsx';

const pad = (n) => String(n).padStart(2, '0');

export default function PlantaSetor({
  bancadas,
  codigosDestacados,
  onSelectBancada,
  modoTrocaAtivo = false,
  origemSelecionada = null,
  mapaTrocasPendentes = {},
}) {
  // Agrupa as 126 bancadas nos corredores:
  // Renderiza do Meio Corredor 11 descendo até o Corredor 01 para que comecem de forma crescente a partir da base:
  // Base do site = Corredor 01 | Topo da tela = Meio Corredor 11
  // Em cada corredor: Lado D em cima (superior) e Lado E embaixo (inferior)
  const corredores = useMemo(() => {
    const mapa = new Map();
    for (let c = 11; c >= 1; c--) {
      mapa.set(c, { corredor: c, ladoD: [], ladoE: [] });
    }

    for (const b of bancadas) {
      if (b.posicao > 6) continue;
      const grupo = mapa.get(b.corredor);
      if (!grupo) continue;
      if (b.lado === 'D' || b.lado === 'B') {
        grupo.ladoD.push(b);
      } else {
        grupo.ladoE.push(b);
      }
    }

    for (const grupo of mapa.values()) {
      grupo.ladoD.sort((a, b) => b.posicao - a.posicao);
      grupo.ladoE.sort((a, b) => b.posicao - a.posicao);
    }

    return Array.from(mapa.values());
  }, [bancadas]);

  return (
    <main className="no-print w-full px-3 py-4 sm:px-6 2xl:px-8">
      {/* Moldura da Planta Baixa preenchendo a tela toda */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-4 shadow-md dark:shadow-2xl backdrop-blur-sm transition-colors duration-200">
        <div className="w-full min-w-[960px]">
          {/* Cabeçalho da Planta */}
          <div className="mb-4 grid grid-cols-[1fr_210px] items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 px-4 py-2.5 text-xs text-slate-800 dark:text-white shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200">
                <Compass className="h-4 w-4 text-henn-500 dark:text-emerald-400" />
                <span>PLANTA FÍSICA DO SETOR DE COBRANÇA · 126 BANCADAS (10 CORREDORES + MEIO CORREDOR 11)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                <span>C01 na base até Meio Corredor 11 no topo</span>
                <span>·</span>
                <span>Lado D em cima e Lado E embaixo</span>
                <span>·</span>
                <span>Posições 01 junto ao corredor de circulação (à direita)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 font-bold text-amber-600 dark:text-amber-400">
              <ArrowUpDown className="h-4 w-4 shrink-0" />
              <span>CIRCULAÇÃO &amp; TESTEIRAS</span>
            </div>
          </div>

          {/* Lista dos Corredores Horizontais (C01 na base até Meio Corredor 11 no topo) */}
          <div className="space-y-4">
            {corredores.map(({ corredor, ladoD, ladoE }) => {
              const todasCorredor = [...ladoD, ...ladoE];
              const ocupadasCorredor = todasCorredor.filter((b) => b.status === 'OCUPADA').length;
              const reservaCorredor = todasCorredor.filter((b) => b.status === 'RESERVA').length;
              const desativadasCorredor = todasCorredor.filter(
                (b) => b.status === 'DESATIVADA'
              ).length;
              const isMeioCorredor = corredor === 11;
              const isCorredor1 = corredor === 1;

              return (
                <div
                  key={corredor}
                  className="grid grid-cols-[1fr_210px] items-stretch gap-3 w-full"
                >
                  {/* Ilha Horizontal do Corredor - Lado D em cima e Lado E embaixo */}
                  <div
                    className={`flex flex-col justify-between rounded-xl border ${
                      isCorredor1
                        ? 'border-rose-300/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20'
                        : isMeioCorredor
                        ? 'border-indigo-300/60 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70'
                    } p-3 shadow-2xs w-full transition-colors duration-200`}
                  >
                    {/* Fileira Superior: LADO D (presente nos Corredores 01 a 10; omitido no Meio Corredor 11) */}
                    {!isMeioCorredor && (
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-2xs shadow-indigo-400/50" />
                            Corredor {pad(corredor)} · Fileira Lado D (Superior)
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                            {ladoD.length} posições (D06 na parede ← D01 no corredor)
                          </span>
                        </div>

                        <div className="grid grid-cols-6 gap-2.5 w-full">
                          {ladoD.map((bancada) => (
                            <CardBancada
                              key={bancada.codigo}
                              bancada={bancada}
                              destacada={codigosDestacados.has(bancada.codigo)}
                              onSelect={onSelectBancada}
                              modoTrocaAtivo={modoTrocaAtivo}
                              isOrigemSelecionada={origemSelecionada?.codigo === bancada.codigo}
                              infoTrocaPendente={mapaTrocasPendentes[bancada.codigo] || null}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Divisória Central da Ilha (presente nos corredores completos 01 a 10) */}
                    {!isMeioCorredor && (
                      <div className="my-2.5 flex items-center gap-2">
                        <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-600 dark:to-slate-800" />
                        <span className="rounded-md border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 shadow-2xs">
                          Divisória Central · Calha de Rede &amp; Elétrica · C{pad(corredor)}
                        </span>
                        <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-600 dark:to-slate-800" />
                      </div>
                    )}

                    {/* Fileira Inferior: LADO E (sempre embaixo do Lado D) */}
                    <div>
                      {isMeioCorredor && (
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-2xs shadow-indigo-400/50" />
                            Meio Corredor 11 · Fileira Lado E (Única / 6 Postos)
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                            6 posições (E06 na parede ← E01 no corredor)
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-6 gap-2.5 w-full">
                        {ladoE.map((bancada) => (
                          <CardBancada
                            key={bancada.codigo}
                            bancada={bancada}
                            destacada={codigosDestacados.has(bancada.codigo)}
                            onSelect={onSelectBancada}
                            modoTrocaAtivo={modoTrocaAtivo}
                            isOrigemSelecionada={origemSelecionada?.codigo === bancada.codigo}
                            infoTrocaPendente={mapaTrocasPendentes[bancada.codigo] || null}
                          />
                        ))}
                      </div>

                      {!isMeioCorredor && (
                        <div className="mt-1.5 flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-henn-500 dark:bg-sky-400 shadow-2xs shadow-sky-400/50" />
                            Corredor {pad(corredor)} · Fileira Lado E (Inferior)
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                            {ladoE.length} posições (E06 na parede ← E01 no corredor)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DIREITA: Corredor de Circulação Principal + Testeira Preta CONSULT'H */}
                  <div className="flex items-stretch gap-2">
                    {/* Faixa do Corredor de Circulação Principal */}
                    <div className="flex w-9 flex-col items-center justify-between rounded-lg border-x-2 border-dashed border-amber-400 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/20 py-2 text-amber-700 dark:text-amber-400">
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
                      <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-extrabold uppercase tracking-widest opacity-80">
                        CIRCULAÇÃO
                      </span>
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
                    </div>

                    {/* Testeira Preta ("CONSULT'H") do Corredor */}
                    <div className="flex flex-1 flex-col justify-between rounded-xl border-2 border-neutral-800 bg-neutral-950 p-3 text-white shadow-xl">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                        <span className="text-[10px] font-black tracking-widest text-amber-400">
                          CONSULT&apos;H
                        </span>
                        <span className="rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-300 border border-neutral-800">
                          {todasCorredor.length} POSTOS
                        </span>
                      </div>

                      <div className="my-auto py-2 text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                          TESTEIRA
                        </div>
                        <div className="text-base font-black tracking-tight text-white">
                          {isMeioCorredor ? 'MEIO CORREDOR 11' : `CORREDOR ${pad(corredor)}`}
                        </div>
                        {isCorredor1 && (
                          <span className="mt-0.5 inline-block rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-300 border border-rose-500/30">
                            CORREDOR DESATIVADO
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-800 pt-1.5 text-[10px]">
                        <span className="text-emerald-400 font-semibold">
                          ● {ocupadasCorredor} ativas
                        </span>
                        {reservaCorredor > 0 && (
                          <span className="text-sky-400 font-semibold">
                            🔵 {reservaCorredor} res.
                          </span>
                        )}
                        {desativadasCorredor > 0 ? (
                          <span className="text-rose-400 font-semibold">
                            ● {desativadasCorredor} bloq.
                          </span>
                        ) : (
                          reservaCorredor === 0 && (
                            <span className="text-neutral-400">
                              {todasCorredor.length - ocupadasCorredor} livres
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
