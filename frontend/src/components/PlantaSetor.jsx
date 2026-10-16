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
  // Agrupa as 122 bancadas nos 10 corredores horizontais, separando Fileira Lado B e Fileira Lado A
  const corredores = useMemo(() => {
    const mapa = new Map();
    for (let c = 1; c <= 10; c++) {
      mapa.set(c, { corredor: c, ladoB: [], ladoA: [] });
    }

    for (const b of bancadas) {
      const grupo = mapa.get(b.corredor);
      if (!grupo) continue;
      if (b.lado === 'B') {
        grupo.ladoB.push(b);
      } else {
        grupo.ladoA.push(b);
      }
    }

    for (const grupo of mapa.values()) {
      grupo.ladoB.sort((a, b) => a.posicao - b.posicao);
      grupo.ladoA.sort((a, b) => a.posicao - b.posicao);
    }

    return Array.from(mapa.values());
  }, [bancadas]);

  return (
    <main className="no-print w-full px-3 py-4 sm:px-6 2xl:px-8">
      {/* Moldura da Planta Baixa preenchendo a tela toda */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-sm">
        <div className="w-full min-w-[960px]">
          {/* Cabeçalho da Planta */}
          <div className="mb-4 grid grid-cols-[1fr_210px] items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-2.5 text-xs text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>PLANTA FÍSICA DO SETOR DE COBRANÇA · 10 CORREDORES (122 BANCADAS)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Corredores 01 a 09: 12 bancadas (6 Lado B + 6 Lado A)</span>
                <span>·</span>
                <span>Corredor 10: 14 bancadas (7 Lado B + 7 Lado A)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 font-semibold text-amber-400">
              <ArrowUpDown className="h-4 w-4 shrink-0" />
              <span>CIRCULAÇÃO &amp; TESTEIRAS</span>
            </div>
          </div>

          {/* Lista dos 10 Corredores Horizontais preenchendo o espaço */}
          <div className="space-y-4">
            {corredores.map(({ corredor, ladoB, ladoA }) => {
              const todasCorredor = [...ladoB, ...ladoA];
              const ocupadasCorredor = todasCorredor.filter((b) => b.status === 'OCUPADA').length;
              const reservaCorredor = todasCorredor.filter((b) => b.status === 'RESERVA').length;
              const desativadasCorredor = todasCorredor.filter(
                (b) => b.status === 'DESATIVADA'
              ).length;
              const isCorredor10 = corredor === 10;

              return (
                <div
                  key={corredor}
                  className="grid grid-cols-[1fr_210px] items-stretch gap-3 w-full"
                >
                  {/* Ilha Horizontal do Corredor (Lado B em cima, Lado A embaixo) - Ocupa 100% da largura */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-inner w-full">
                    {/* Fileira Superior: LADO B */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                          Corredor {pad(corredor)} · Fileira Lado B
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {ladoB.length} posições (B01–B{pad(ladoB.length)})
                        </span>
                      </div>

                      <div
                        className={`grid ${
                          isCorredor10 ? 'grid-cols-7' : 'grid-cols-6'
                        } gap-2.5 w-full`}
                      >
                        {ladoB.map((bancada) => (
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

                    {/* Divisória Central da Ilha (Calha de Rede e Energia) */}
                    <div className="my-2.5 flex items-center gap-2">
                      <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />
                      <span className="rounded-md border border-slate-700/80 bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Divisória Central · Calha de Rede &amp; Elétrica · C{pad(corredor)}
                      </span>
                      <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />
                    </div>

                    {/* Fileira Inferior: LADO A */}
                    <div>
                      <div
                        className={`grid ${
                          isCorredor10 ? 'grid-cols-7' : 'grid-cols-6'
                        } gap-2.5 w-full`}
                      >
                        {ladoA.map((bancada) => (
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

                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-xs shadow-sky-400/50" />
                          Corredor {pad(corredor)} · Fileira Lado A
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {ladoA.length} posições (A01–A{pad(ladoA.length)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DIREITA: Corredor de Circulação Principal + Testeira Preta CONSULT'H */}
                  <div className="flex items-stretch gap-2">
                    {/* Faixa do Corredor de Circulação Principal */}
                    <div className="flex w-9 flex-col items-center justify-between rounded-lg border-x-2 border-dashed border-amber-500/40 bg-amber-950/20 py-2 text-amber-400">
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
                          CORREDOR {pad(corredor)}
                        </div>
                        {isCorredor10 && (
                          <span className="mt-0.5 inline-block rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 border border-sky-500/30">
                            CORREDOR EXPANDIDO (14)
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
