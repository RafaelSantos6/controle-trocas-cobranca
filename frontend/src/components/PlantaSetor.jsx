import { useMemo } from 'react';
import { Wind, Snowflake, Sun, Compass, ArrowUpDown, Layers } from 'lucide-react';
import CardBancada from './CardBancada.jsx';

const pad = (n) => String(n).padStart(2, '0');

export default function PlantaSetor({ bancadas, codigosDestacados, onSelectBancada }) {
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
    <main className="mx-auto max-w-[1600px] px-3 py-5 sm:px-6">
      {/* Moldura Arquitetônica da Planta Baixa no Tema Escuro */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-sm">
        <div className="min-w-[1120px]">
          {/* Cabeçalho de Orientação Espacial da Planta */}
          <div className="mb-4 grid grid-cols-[120px_1fr_210px] items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-2.5 text-xs text-white">
            <div className="flex items-center gap-2 font-semibold text-sky-400">
              <Snowflake className="h-4 w-4 shrink-0" />
              <span>JANELAS / A.C.</span>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>PLANTA FÍSICA DO SETOR DE COBRANÇA · 10 CORREDORES HORIZONTAIS</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Posições 01 → 06 (Corredores 01 a 09)</span>
                <span>·</span>
                <span>Posições 01 → 07 (Corredor 10)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 font-semibold text-amber-400">
              <ArrowUpDown className="h-4 w-4 shrink-0" />
              <span>CIRCULAÇÃO &amp; TESTEIRAS</span>
            </div>
          </div>

          {/* Lista dos 10 Corredores Horizontais */}
          <div className="space-y-4">
            {corredores.map(({ corredor, ladoB, ladoA }) => {
              const todasCorredor = [...ladoB, ...ladoA];
              const ocupadasCorredor = todasCorredor.filter((b) => b.status === 'OCUPADA').length;
              const desativadasCorredor = todasCorredor.filter(
                (b) => b.status === 'DESATIVADA'
              ).length;
              const isCorredor10 = corredor === 10;
              const temArCondicionado = corredor % 2 === 1;

              return (
                <div
                  key={corredor}
                  className="grid grid-cols-[120px_1fr_210px] items-stretch gap-3"
                >
                  {/* ESQUERDA: Janelas e Aparelhos de Ar-Condicionado */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-sky-500/20 bg-slate-950/80 p-2 text-center shadow-inner">
                    {temArCondicionado ? (
                      <>
                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">
                          <Wind className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                          Ar-Cond. #{pad(Math.ceil(corredor / 2))}
                        </span>
                        <span className="text-[9px] text-sky-400/80">Split Climatizado</span>
                      </>
                    ) : (
                      <>
                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
                          <Sun className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          Janela #{pad(corredor / 2)}
                        </span>
                        <span className="text-[9px] text-slate-400">Fachada Externa</span>
                      </>
                    )}
                    <div className="mt-2 w-full rounded border border-slate-800 bg-slate-900/90 py-0.5 text-[9px] font-semibold text-slate-400">
                      Parede Oeste
                    </div>
                  </div>

                  {/* CENTRO: Ilha Horizontal do Corredor (Lado B em cima, Lado A embaixo) */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-inner">
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

                      <div className="grid grid-cols-7 gap-2">
                        {ladoB.map((bancada) => (
                          <CardBancada
                            key={bancada.codigo}
                            bancada={bancada}
                            destacada={codigosDestacados.has(bancada.codigo)}
                            onSelect={onSelectBancada}
                          />
                        ))}
                        {!isCorredor10 && (
                          <div className="flex h-[78px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-1 text-center text-[10px] text-slate-500">
                            <Layers className="mb-0.5 h-3.5 w-3.5 opacity-40" />
                            <span>Recuo / Pilar</span>
                          </div>
                        )}
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
                      <div className="grid grid-cols-7 gap-2">
                        {ladoA.map((bancada) => (
                          <CardBancada
                            key={bancada.codigo}
                            bancada={bancada}
                            destacada={codigosDestacados.has(bancada.codigo)}
                            onSelect={onSelectBancada}
                          />
                        ))}
                        {!isCorredor10 && (
                          <div className="flex h-[78px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-1 text-center text-[10px] text-slate-500">
                            <Layers className="mb-0.5 h-3.5 w-3.5 opacity-40" />
                            <span>Recuo / Pilar</span>
                          </div>
                        )}
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
                        {desativadasCorredor > 0 ? (
                          <span className="text-rose-400 font-semibold">
                            ● {desativadasCorredor} bloq.
                          </span>
                        ) : (
                          <span className="text-neutral-400">
                            {todasCorredor.length - ocupadasCorredor} livres
                          </span>
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
