import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'mapa_cobranca_token';
export const USER_STORAGE_KEY = 'mapa_cobranca_usuario';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: injeta automaticamente o Bearer Token em todas as chamadas
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: se retornar 401 (Não autenticado / Token expirado), desloga o usuário
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export const api = {
  // === AUTENTICAÇÃO & GESTÃO DE ACESSOS (RBAC) ===
  login: (credenciais) => apiClient.post('/auth/login', credenciais).then((res) => res.data),

  obterUsuarioAtual: () => apiClient.get('/auth/me').then((res) => res.data),

  listarUsuarios: () => apiClient.get('/auth/usuarios').then((res) => res.data),

  criarUsuario: (dados) => apiClient.post('/auth/usuarios', dados).then((res) => res.data),

  resetarSenhaUsuario: (id, novaSenha) =>
    apiClient
      .patch(`/auth/usuarios/${encodeURIComponent(id)}/reset-senha`, novaSenha ? { novaSenha } : {})
      .then((res) => res.data),

  // === PLANTA DE BANCADAS & MOVIMENTAÇÕES ===
  // Lista todas as 122 bancadas com suas máquinas associadas
  listarBancadas: () => apiClient.get('/bancadas').then((res) => res.data),

  // Detalhes de uma bancada específica
  obterBancada: (codigo) =>
    apiClient.get(`/bancadas/${encodeURIComponent(codigo)}`).then((res) => res.data),

  // Executa alocação ou movimentação de máquina/colaborador
  alocarOuMover: (dados) => apiClient.post('/bancadas/alocar', dados).then((res) => res.data),

  // Altera status da bancada (LIVRE, OCUPADA, RESERVA, DESATIVADA, MANUTENCAO)
  alterarStatus: (dados) => apiClient.patch('/bancadas/status', dados).then((res) => res.data),

  // Inverte duas bancadas diretamente (Swap)
  realizarSwap: (dados) => apiClient.post('/bancadas/swap', dados).then((res) => res.data),

  // Efetiva trocas mensais em lote e retorna dados do Romaneio
  realizarTrocaEmLote: (dados) =>
    apiClient.post('/bancadas/troca-em-lote', dados).then((res) => res.data),

  // Retorna a linha do tempo de movimentações de uma máquina pelo hostname
  obterHistoricoMaquina: (hostname) =>
    apiClient.get(`/historico/${encodeURIComponent(hostname)}`).then((res) => res.data),

  // Retorna o histórico de movimentações de uma bancada específica
  obterHistoricoBancada: (codigo) =>
    apiClient.get(`/historico/bancada/${encodeURIComponent(codigo)}`).then((res) => res.data),

  // Lista todas as máquinas cadastradas
  listarMaquinas: () => apiClient.get('/maquinas').then((res) => res.data),
};

export default apiClient;
