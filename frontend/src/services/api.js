import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Lista todas as 122 bancadas com suas máquinas associadas
  listarBancadas: () => apiClient.get('/bancadas').then((res) => res.data),

  // Detalhes de uma bancada específica
  obterBancada: (codigo) =>
    apiClient.get(`/bancadas/${encodeURIComponent(codigo)}`).then((res) => res.data),

  // Executa alocação ou movimentação de máquina/colaborador
  alocarOuMover: (dados) => apiClient.post('/bancadas/alocar', dados).then((res) => res.data),

  // Altera status da bancada (LIVRE, OCUPADA, DESATIVADA, MANUTENCAO)
  alterarStatus: (dados) => apiClient.patch('/bancadas/status', dados).then((res) => res.data),

  // Inverte duas bancadas diretamente (Swap)
  realizarSwap: (dados) => apiClient.post('/bancadas/swap', dados).then((res) => res.data),

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
