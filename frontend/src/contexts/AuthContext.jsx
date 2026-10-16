import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || null);
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem(USER_STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });
  const [carregandoAuth, setCarregandoAuth] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  // Escuta evento global disparado pelo interceptor Axios em caso de HTTP 401
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  // Valida o token armazenado ao inicializar a aplicação
  useEffect(() => {
    const validarSessao = async () => {
      const tokenSalvo = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!tokenSalvo) {
        setCarregandoAuth(false);
        return;
      }

      try {
        const res = await api.obterUsuarioAtual();
        if (res?.usuario) {
          setUsuario(res.usuario);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.usuario));
        }
      } catch {
        logout();
      } finally {
        setCarregandoAuth(false);
      }
    };

    validarSessao();
  }, [logout]);

  const login = useCallback(async (username, senha) => {
    const dados = await api.login({ username, senha });
    localStorage.setItem(TOKEN_STORAGE_KEY, dados.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(dados.usuario));
    setToken(dados.token);
    setUsuario(dados.usuario);
    return dados.usuario;
  }, []);

  const role = usuario?.role || null;
  const isAdmin = role === 'ADM';
  const isTI = role === 'TI';
  const isGestor = role === 'GESTOR';
  const podeGerenciarBancadas = isAdmin || isTI;
  const podeGerenciarAcessos = isAdmin || isTI;
  const podeCriarUsuarios = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: Boolean(token && usuario),
        carregandoAuth,
        login,
        logout,
        isAdmin,
        isTI,
        isGestor,
        podeGerenciarBancadas,
        podeGerenciarAcessos,
        podeCriarUsuarios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return ctx;
}

