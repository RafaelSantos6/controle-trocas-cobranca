import { useState } from 'react';
import {
  Lock,
  User,
  LogIn,
  AlertCircle,
  ShieldCheck,
  Wrench,
  Users,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const { tema, isDark, toggleTema } = useTheme();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!username.trim() || !senha) {
      setErro('Informe o usuário e a senha para acessar o sistema.');
      return;
    }

    setCarregando(true);
    try {
      await login(username.trim(), senha);
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        'Falha ao autenticar. Verifique suas credenciais ou a conexão com o servidor.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  const preencherCredencialPadrao = (user, pass) => {
    setUsername(user);
    setSenha(pass);
    setErro('');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Botão de Alternância de Tema (Dark / Light) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTema}
          className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
          title={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}
        >
          {isDark ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-blue-600" />
              <span>Modo Escuro</span>
            </>
          )}
        </button>
      </div>

      {/* Glow decorativo de fundo com os tons da HENN Tecnologia (#019cdc / azul) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-henn-500/10 dark:bg-blue-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-sky-400/10 dark:bg-sky-500/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-blue-600/5 dark:bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Cabeçalho da Marca: HENN Tecnologia + Grupo Consulth Soluções */}
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Logo HENN Tecnologia */}
          <div className="mb-3.5 flex items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg shadow-blue-500/10 ring-2 ring-henn-500/30">
            <img
              src="/logo-henn.png"
              alt="HENN Tecnologia"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Badges de Parceria e Prestação de Serviços */}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-henn-50 dark:bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-henn-700 dark:text-blue-300 ring-1 ring-henn-500/30 dark:ring-blue-500/40">
              <Sparkles className="h-3 w-3 text-henn-500" />
              Desenvolvido por HENN Tecnologia
            </span>
          </div>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs text-amber-800 dark:text-amber-200">
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span>
              Cliente: <strong className="text-slate-900 dark:text-white">Grupo Consulth Soluções</strong> · Cobrança
            </span>
          </div>

          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Mapa de Alocação &amp; Trocas Mensais
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Gestão Operacional de TI · 10 Corredores · 122 Bancadas
          </p>
        </div>

        {/* Card de Login */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xl dark:shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Portal de Acesso Seguro</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Entre com suas credenciais da equipe de TI ou Gestão de Cobrança.
            </p>
          </div>

          {erro && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-50 dark:bg-rose-950/50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Usuário (Username)
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin, ti ou gestor"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-henn-500 focus:ring-2 focus:ring-henn-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-henn-500 focus:ring-2 focus:ring-henn-500/20"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  tabIndex={-1}
                  title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-henn-500 hover:bg-henn-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-henn-500/30 transition duration-150 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{carregando ? 'Autenticando...' : 'Acessar o Sistema'}</span>
            </button>
          </form>

          {/* Atalhos Rápidos de Perfis RBAC */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Perfis de Acesso (RBAC):
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Clique para preencher</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => preencherCredencialPadrao('admin', 'admin123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 p-2 text-center transition hover:border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                title="HENN ADM: Acesso total ao sistema e usuários"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300">ADM</span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">admin / admin123</span>
              </button>

              <button
                type="button"
                onClick={() => preencherCredencialPadrao('ti', 'ti123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/30 p-2 text-center transition hover:border-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                title="HENN TI: Gestão de bancadas, reservas e suporte"
              >
                <Wrench className="h-4 w-4 text-henn-500 dark:text-sky-400" />
                <span className="text-[11px] font-extrabold text-henn-700 dark:text-sky-300">HENN TI</span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">ti / ti123</span>
              </button>

              <button
                type="button"
                onClick={() => preencherCredencialPadrao('gestor', 'gestor123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 p-2 text-center transition hover:border-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                title="Consulth Gestor: Modo Troca em Lote e Romaneio"
              >
                <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-300">GESTOR</span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">gestor / gestor123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé Informativo */}
        <div className="mt-4 text-center text-[11px] text-slate-500">
          HENN Tecnologia © Todos os direitos reservados
          <br />
          Prestação de Serviços Especializados para o{' '}
          <span className="text-slate-700 dark:text-slate-400 font-semibold">Grupo Consulth Soluções</span>
        </div>
      </div>
    </div>
  );
}
