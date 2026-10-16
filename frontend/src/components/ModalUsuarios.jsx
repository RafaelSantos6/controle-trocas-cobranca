import { useCallback, useEffect, useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Wrench,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const ROLE_BADGE = {
  ADM: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40',
  TI: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/40',
  GESTOR: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
};

const ROLE_LABEL = {
  ADM: 'Administrador (Acesso Total)',
  TI: 'Técnico de TI (Planta + Reset Gestor)',
  GESTOR: 'Gestor de Cobrança (Troca em Lote)',
};

export default function ModalUsuarios({ onClose, onNotificar }) {
  const { usuario: usuarioLogado, isAdmin, isTI } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [resetandoId, setResetandoId] = useState(null);
  const [erroLocal, setErroLocal] = useState('');
  const [sucessoLocal, setSucessoLocal] = useState('');

  // Campos do formulário de Criação de Usuário (apenas ADM)
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('GESTOR');

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    setErroLocal('');
    try {
      const lista = await api.listarUsuarios();
      setUsuarios(Array.isArray(lista) ? lista : []);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar a lista de usuários.';
      setErroLocal(msg);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    setErroLocal('');
    setSucessoLocal('');

    if (!nome.trim() || !username.trim() || !senha.trim()) {
      setErroLocal('Preencha Nome, Username e Senha inicial.');
      return;
    }

    setSalvando(true);
    try {
      const res = await api.criarUsuario({
        nome: nome.trim(),
        username: username.trim().toLowerCase(),
        senha: senha.trim(),
        role,
      });

      const msg = res.mensagem || `Usuário @${username.trim().toLowerCase()} criado com sucesso!`;
      setSucessoLocal(msg);
      if (onNotificar) onNotificar(msg, 'sucesso');

      setNome('');
      setUsername('');
      setSenha('');
      setRole('GESTOR');
      await carregarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Não foi possível criar o usuário.';
      setErroLocal(msg);
      if (onNotificar) onNotificar(msg, 'erro');
    } finally {
      setSalvando(false);
    }
  };

  const handleResetarSenha = async (alvo) => {
    setErroLocal('');
    setSucessoLocal('');
    setResetandoId(alvo.id);

    try {
      const res = await api.resetarSenhaUsuario(alvo.id);
      const msg =
        res.mensagem ||
        `Senha de ${alvo.nome} (@${alvo.username}) resetada para "${res.senhaTemporaria || 'Mudar@123'}"!`;
      setSucessoLocal(msg);
      if (onNotificar) onNotificar(msg, 'sucesso');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Não foi possível resetar a senha deste usuário.';
      setErroLocal(msg);
      if (onNotificar) onNotificar(msg, 'erro');
    } finally {
      setResetandoId(null);
    }
  };

  // Verifica se o operador logado pode resetar a senha de determinado usuário da lista
  const podeResetarAlvo = (alvo) => {
    if (isAdmin) return true;
    if (isTI && alvo.role === 'GESTOR') return true;
    return false;
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-1 ring-purple-300 dark:ring-purple-500/30">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  👥 Gerenciar Acessos &amp; Permissões (RBAC)
                </h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    ROLE_BADGE[usuarioLogado?.role] || ''
                  }`}
                >
                  Logado como: {usuarioLogado?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAdmin
                  ? 'Administrador: crie novas contas (ADM, TI ou GESTOR) e resete senhas para o padrão "Mudar@123".'
                  : 'Técnico de TI: visualize contas ativas e realize o reset de senha de Gestores de Cobrança.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {erroLocal && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-xs font-medium text-rose-700 dark:text-rose-200 sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{erroLocal}</span>
            </div>
          )}

          {sucessoLocal && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-medium text-emerald-800 dark:text-emerald-200 sm:text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{sucessoLocal}</span>
            </div>
          )}

          {/* Formulário de Criação de Novo Usuário (Exclusivo para ADM) */}
          {isAdmin && (
            <form
              onSubmit={handleCriarUsuario}
              className="rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/40 dark:bg-slate-950/70 p-4 sm:p-5"
            >
              <div className="mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300">
                  <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Cadastrar Novo Usuário</span>
                </div>
                <span className="rounded bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300">
                  Exclusivo ADM
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Mendes"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Username (Login) *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="Ex: carlos.gestor"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Senha Inicial *
                  </label>
                  <input
                    type="text"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Ex: Mudar@123"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Papel / Permissão (Role) *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="GESTOR">GESTOR (Troca em Lote)</option>
                    <option value="TI">TI (Técnico de TI)</option>
                    <option value="ADM">ADM (Administrador)</option>
                  </select>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-purple-500 disabled:opacity-50"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{salvando ? 'Criando Conta...' : 'Criar Usuário'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Lista de Usuários Cadastrados */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contas Cadastradas no Sistema ({usuarios.length})
              </h3>
              <button
                type="button"
                onClick={carregarUsuarios}
                disabled={carregando}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${carregando ? 'animate-spin text-henn-500' : ''}`} />
                <span>Atualizar Lista</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Papel (Role)</th>
                    <th className="px-4 py-3 text-right">Ações de Segurança</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {carregando ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Carregando usuários cadastrados...
                      </td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((u) => {
                      const habilitadoReset = podeResetarAlvo(u);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              {u.role === 'ADM' ? (
                                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              ) : u.role === 'TI' ? (
                                <Wrench className="h-4 w-4 text-henn-500 dark:text-sky-400" />
                              ) : (
                                <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              )}
                              <span>{u.nome}</span>
                              {u.username === usuarioLogado?.username && (
                                <span className="rounded bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                                  Você
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">@{u.username}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                                ROLE_BADGE[u.role] || 'border-slate-300 bg-slate-100 text-slate-700'
                              }`}
                              title={ROLE_LABEL[u.role] || u.role}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {habilitadoReset ? (
                              <button
                                type="button"
                                disabled={resetandoId === u.id}
                                onClick={() => handleResetarSenha(u)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
                                title="Reseta a senha deste usuário para o padrão Mudar@123"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                                <span>
                                  {resetandoId === u.id
                                    ? 'Resetando...'
                                    : 'Resetar Senha (Mudar@123)'}
                                </span>
                              </button>
                            ) : (
                              <span className="text-[11px] italic text-slate-400 dark:text-slate-500">
                                Apenas ADM pode resetar {u.role}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Senha padrão de reset: <code className="font-mono font-bold text-amber-700 dark:text-amber-300">Mudar@123</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-1.5 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
