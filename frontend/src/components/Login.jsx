import { useState } from 'react';
import {
  Building2,
  Lock,
  User,
  LogIn,
  AlertCircle,
  ShieldCheck,
  Wrench,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      {/* Glow decorativo de fundo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Cabeçalho da Marca */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-950/50">
            <Building2 className="h-8 w-8" />
          </div>
          <span className="mb-1.5 rounded-full bg-amber-500/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
            SETOR DE COBRANÇA · CONSULT&apos;H
          </span>
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Mapa de Alocação &amp; Trocas Mensais
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            10 Corredores · 122 Bancadas · Controle de Acesso (RBAC)
          </p>
        </div>

        {/* Card de Login */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-5 border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Autenticação de Operador</h2>
            <p className="text-xs text-slate-400">
              Entre com suas credenciais de Administrador, Suporte TI ou Gestor de Cobrança.
            </p>
          </div>

          {erro && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/50 px-3.5 py-2.5 text-xs font-medium text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Usuário (Username)
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin, ti ou gestor"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{carregando ? 'Autenticando...' : 'Entrar no Mapa de Cobrança'}</span>
            </button>
          </form>

          {/* Atalhos Rápidos de Perfis RBAC para Homologação / Testes */}
          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Perfis de Acesso Rápido (RBAC):
              </span>
              <span className="text-[10px] text-slate-500">Clique para preencher</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => preencherCredencialPadrao('admin', 'admin123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-950/30 p-2 text-center transition hover:border-purple-400 hover:bg-purple-900/40"
                title="Acesso Total: Cria contas, reseta senhas e gerencia todas as bancadas"
              >
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span className="text-[11px] font-extrabold text-purple-300">ADM</span>
                <span className="font-mono text-[10px] text-slate-400">admin / admin123</span>
              </button>

              <button
                type="button"
                onClick={() => preencherCredencialPadrao('ti', 'ti123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-sky-500/30 bg-sky-950/30 p-2 text-center transition hover:border-sky-400 hover:bg-sky-900/40"
                title="Técnico de TI: Altera bancadas (Reserva, Desativada, Livre), faz trocas e reseta senhas de Gestores"
              >
                <Wrench className="h-4 w-4 text-sky-400" />
                <span className="text-[11px] font-extrabold text-sky-300">TI</span>
                <span className="font-mono text-[10px] text-slate-400">ti / ti123</span>
              </button>

              <button
                type="button"
                onClick={() => preencherCredencialPadrao('gestor', 'gestor123')}
                className="flex flex-col items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-950/30 p-2 text-center transition hover:border-amber-400 hover:bg-amber-900/40"
                title="Gestor de Cobrança: Visualiza planta e usa Modo Troca em Lote + Romaneio"
              >
                <Users className="h-4 w-4 text-amber-400" />
                <span className="text-[11px] font-extrabold text-amber-300">GESTOR</span>
                <span className="font-mono text-[10px] text-slate-400">gestor / gestor123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

