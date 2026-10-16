import { Printer, CheckCircle2, X, Building2, FileSpreadsheet, ArrowRight } from 'lucide-react';

const formatarDataHora = (iso) => {
  if (!iso) return new Date().toLocaleString('pt-BR');
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
};

export default function DocumentoTrocaModal({ dadosRomaneio, onClose }) {
  if (!dadosRomaneio) return null;

  const {
    protocolo = 'ROM-0001',
    dataHora,
    gestor = 'Não informado',
    tecnico = 'Equipe de TI / Suporte',
    observacao = '',
    itensRomaneio = [],
  } = dadosRomaneio;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6 print:static print:bg-white print:p-0">
      <div className="print-only-container flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl print:border-none print:bg-white print:text-black">
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Romaneio de Movimentação de Ativos Emitido
              </h2>
              <p className="text-xs text-slate-400">
                Protocolo {protocolo} · Documento pronto para impressão ou exportação em PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleImprimir}
              className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-950 shadow-md transition hover:bg-sky-400"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Concluir e Fechar</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Folha do Romaneio (Visualização em Tela + Layout de Impressão A4) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 print:overflow-visible print:p-0">
          <div className="mx-auto rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-lg sm:p-8 print:border-none print:p-2 print:shadow-none">
            {/* Cabeçalho do Documento */}
            <div className="flex flex-col justify-between gap-4 border-b-2 border-slate-900 pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-amber-400 print:border print:border-slate-900">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                    CONSULT&apos;H COBRANÇA · GESTÃO DE ATIVOS DE TI
                  </div>
                  <h1 className="text-lg font-black uppercase tracking-tight text-slate-950 sm:text-xl">
                    Romaneio de Movimentação de Ativos (O.S.)
                  </h1>
                  <p className="text-xs text-slate-600">
                    Controle Físico de Trocas Mensais de Computadores e Postos de Atendimento
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-right font-mono text-xs">
                <div className="font-bold text-slate-900">PROTOCOLO: {protocolo}</div>
                <div className="text-slate-600">DATA/HORA: {formatarDataHora(dataHora)}</div>
              </div>
            </div>

            {/* Metadados da Ordem de Serviço */}
            <div className="my-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 text-xs sm:grid-cols-3">
              <div>
                <span className="block font-bold uppercase text-slate-500">
                  Gestor / Equipe Solicitante:
                </span>
                <span className="mt-0.5 block text-sm font-extrabold text-slate-900">{gestor}</span>
              </div>
              <div>
                <span className="block font-bold uppercase text-slate-500">
                  Técnico TI Responsável:
                </span>
                <span className="mt-0.5 block text-sm font-bold text-slate-900">{tecnico}</span>
              </div>
              <div>
                <span className="block font-bold uppercase text-slate-500">
                  Total de Movimentações:
                </span>
                <span className="mt-0.5 block text-sm font-bold text-slate-900">
                  {itensRomaneio.length}{' '}
                  {itensRomaneio.length === 1 ? 'ativo movimentado' : 'ativos movimentados'}
                </span>
              </div>
              {observacao && (
                <div className="sm:col-span-3 border-t border-slate-200 pt-2">
                  <span className="font-bold uppercase text-slate-500">Observação: </span>
                  <span className="text-slate-800">{observacao}</span>
                </div>
              )}
            </div>

            {/* Tabela Formatada de Movimentações */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white print:bg-slate-200 print:text-black">
                    <th className="border border-slate-300 px-3 py-2.5 font-bold uppercase">
                      Origem
                    </th>
                    <th className="border border-slate-300 px-3 py-2.5 font-bold uppercase">
                      Destino
                    </th>
                    <th className="border border-slate-300 px-3 py-2.5 font-bold uppercase">
                      Hostname
                    </th>
                    <th className="border border-slate-300 px-3 py-2.5 font-bold uppercase">
                      Colaborador(a)
                    </th>
                    <th className="border border-slate-300 px-3 py-2.5 font-bold uppercase">
                      Status Destino
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itensRomaneio.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}
                    >
                      <td className="border border-slate-300 px-3 py-2 font-mono font-bold text-slate-900">
                        {row.origem}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 font-mono font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight className="h-3 w-3 text-slate-500" />
                          <span>{row.destino}</span>
                        </span>
                      </td>
                      <td className="border border-slate-300 px-3 py-2 font-mono font-extrabold text-slate-950">
                        {row.hostname}
                        {row.patrimonioPc && row.patrimonioPc !== '—' && (
                          <span className="ml-1.5 text-[10px] font-normal text-slate-500">
                            ({row.patrimonioPc})
                          </span>
                        )}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                        <div>{row.colaborador}</div>
                        {row.equipe && row.equipe !== '—' && (
                          <div className="text-[10px] font-normal text-slate-500">
                            Equipe: {row.equipe}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-300 px-3 py-2">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                            row.statusDestino === 'RESERVA'
                              ? 'bg-sky-100 text-sky-900 border border-sky-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {row.statusDestino}
                        </span>
                        {row.modalidade && (
                          <div className="mt-0.5 text-[9px] font-medium text-slate-500">
                            {row.modalidade}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Termo de Conferência Técnica */}
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
              Declaro que os equipamentos listados acima (CPU, monitor, teclado, mouse e headset)
              foram movimentados, revisados e testados nos respectivos pontos de rede e energia das
              bancadas de destino, encontrando-se em pleno funcionamento.
            </div>

            {/* Rodapé com Linhas de Assinatura */}
            <div className="mt-14 grid grid-cols-1 gap-10 pt-4 text-center text-xs sm:grid-cols-2">
              <div>
                <div className="mx-auto w-72 border-b border-slate-900 pb-1 font-mono text-slate-400">
                  &nbsp;
                </div>
                <p className="mt-2 font-bold uppercase text-slate-900">Assinatura do Gestor</p>
                <p className="text-[11px] text-slate-600">{gestor}</p>
              </div>

              <div>
                <div className="mx-auto w-72 border-b border-slate-900 pb-1 font-mono text-slate-400">
                  &nbsp;
                </div>
                <p className="mt-2 font-bold uppercase text-slate-900">Assinatura do Técnico TI</p>
                <p className="text-[11px] text-slate-600">{tecnico}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

