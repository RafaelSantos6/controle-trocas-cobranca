# Sistema de Controle de Alocação e Trocas Mensais · Setor de Cobrança

Sistema Full Stack para gerenciamento visual e rastreabilidade histórica de 122 bancadas (distribuídas em 10 corredores horizontais, Lados A e B) e máquinas (`COBCON...`) no setor de cobrança.

## Arquitetura

- **Backend (`/backend`)**: Node.js, Express, Sequelize ORM (SQLite como fallback padrão de desenvolvimento ou MySQL via `.env`), Transações ACID (`sequelize.transaction`) e Seeder automático das 122 bancadas.
- **Frontend (`/frontend`)**: React 18, Vite, Tailwind CSS, Axios e Lucide Icons.

## Como Executar

### 1. Backend (Porta `3001`)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```

## Principais Endpoints da API (`http://localhost:3001/api`)

- `GET /api/bancadas`: Lista todas as 122 bancadas com suas máquinas associadas.
- `GET /api/bancadas/:codigo`: Detalhes de uma bancada específica (ex: `C01-A01`).
- `POST /api/bancadas/alocar`: Aloca ou move uma máquina (`hostname`) e colaborador(a), liberando automaticamente a bancada de origem caso a máquina já estivesse alocada.
- `PATCH /api/bancadas/status`: Altera o status da bancada (`LIVRE`, `OCUPADA`, `DESATIVADA`, `MANUTENCAO`) com registro de motivo de bloqueio.
- `POST /api/bancadas/swap`: Realiza a inversão direta (Swap) de máquinas e colaboradores entre duas bancadas.
- `GET /api/historico/:hostname`: Retorna a linha do tempo de movimentações de uma máquina (ex: `COBCON220`).
