# 🏢 Sistema de Controle de Alocação e Trocas Mensais · Setor de Cobrança

Sistema Full Stack corporativo projetado para gestão visual, governança patrimonial de TI e rastreabilidade histórica de postos de trabalho e computadores (`COBCON...`) em um ambiente de operação de cobrança composto por **10 corredores e 122 bancadas**.

---

## 🎯 Guia de Funcionalidades para o Cliente

### 1. 🗺️ Planta Baixa Visual e Interativa (100% Dark Mode)
- **Distribuição Real do Setor:** Mapeamento fiel das 122 bancadas de atendimento divididas em 10 corredores horizontais:
  - **Corredores 01 a 09:** 12 bancadas cada (6 no Lado A e 6 no Lado B).
  - **Corredor 10:** 14 bancadas (7 no Lado A e 7 no Lado B).
- **Interface Otimizada:** Visualização contínua que preenche a largura total da tela, com contraste balanceado em modo escuro (Dark Mode exclusivo) para reduzir o cansaço visual dos operadores de TI e supervisores.

---

### 2. 🚦 Identificação Visual e Estados das Bancadas
Cada posto possui um cartão de status com cores normatizadas e ícones de identificação imediata:
- 🟢 **Ocupada (Verde):** Posto ativo com computador alocado e operador em atendimento.
- 🔵 **Reserva - Pronta p/ Uso (Azul/Ciano):** Posto com máquina física montada (computador, monitor e periféricos), porém sem operador vinculado (ideal para desligamentos recentes ou postos de contingência prontos para novas contratações).
- ⚪ **Livre (Cinza):** Posto desocupado sem nenhum equipamento vinculado, pronto para novas instalações.
- 🔴 **Desativada (Vermelho):** Bancada bloqueada por avaria física, elétrica ou de rede, exibindo o motivo da inoperância.
- 🟡 **Manutenção (Âmbar):** Posto em intervenção técnica ou reparo predial.

---

### 3. 🔍 Busca Global Instantânea
- Localize instantaneamente qualquer posto digitando no campo superior:
  - **Hostname da Máquina:** Ex: `COBCON220`.
  - **Nome do(a) Colaborador(a):** Localize onde um operador está sentado.
  - **Equipe ou Carteira:** Ex: `Negociação Especial`, `Preventiva`, `60+`.
  - **Código da Bancada:** Ex: `C01-A01`, `C05-B04`.
  - **Ponto de Rede ou Status:** Localize facilmente postos em `RESERVA` ou `DESATIVADA`.
- As bancadas encontradas recebem **destaque com borda amarela pulsante**, e o sistema exibe o total de resultados encontrados em tempo real.

---

### 4. 🔵 Gestão do Estado "RESERVA" & Desligamento Rápido
- **Preservação de Ativos:** Ao ocorrer o desligamento ou remanejamento de um funcionário sem que a máquina precise sair da mesa, o operador pode acionar **"🔵 Desligamento (Colocar em Reserva)"**.
- O sistema desvincula o operador anterior, mantém o computador, monitor e periféricos montados na mesa e registra o evento `DESLIGAMENTO_RESERVA` no histórico.

---

### 5. 🔄 Modo Troca em Lote (Virada de Mês) com Romaneio / O.S.
Desenvolvido especificamente para atender a rotina de rodízio de carteiras e equipes entre supervisores:
- **Fluxo Simples por Cliques:**
  1. Clique em **"🔄 Iniciar Modo Troca"** no topo da tela.
  2. Informe o **Nome do Gestor / Equipe Solicitante** (preenchido automaticamente para supervisores logados).
  3. Clique na **Bancada de Origem** e depois na **Bancada de Destino**.
  4. **Swap Automático:** Se a bancada de destino já tiver um operador/máquina, o sistema detecta e agenda a inversão automática das duas posições.
  5. As bancadas agendadas recebem bordas tracejadas e badges visuais indicando a direção da mudança.
- **Painel Retrátil de Staging:** Permite revisar todas as trocas pendentes, remover itens individuais ou limpar a fila antes de salvar.
- **Transação Segura:** Todas as mudanças são processadas pelo servidor de forma atômica (se uma falhar, nenhuma é aplicada indevidamente).
- **Emissão Automática de Romaneio (O.S.):**
  - Ao confirmar o lote, abre-se uma tela com o **Romaneio de Movimentação de Ativos** formatado para impressão ou exportação em PDF (`window.print()`).
  - O documento contém número de protocolo, data/hora, solicitante, técnico, tabela detalhada de movimentações e campos para assinaturas formais de entrega e recebimento.

---

### 6. 📜 Rastreabilidade Histórica e Auditoria de Ativos
- Toda alteração realizada no sistema gera um registro permanente e imutável de movimentação.
- Tipos de eventos auditados:
  - `ALOCACAO`: Nova máquina instalada em uma bancada.
  - `TROCA_MENSAL`: Movimentações em lote solicitadas por gestores.
  - `SWAP`: Inversão direta entre dois postos.
  - `DESATIVACAO_BANCADA`: Bloqueio de posto com registro de justificativa técnica.
  - `DESLIGAMENTO_RESERVA`: Preservação da máquina na mesa sem operador.
- No modal da bancada, é possível alternar entre a linha do tempo da **Bancada** e a linha do tempo da **Máquina** (pesquisando por qualquer hostname).

---

### 7. 🔐 Autenticação e Controle de Acesso por Papel (RBAC)
O sistema conta com autenticação via Token JWT seguro e controle de permissões em 3 níveis:

| Nível / Perfil | Descrição | O que pode fazer | O que NÃO pode fazer |
| :--- | :--- | :--- | :--- |
| 👑 **ADM** *(Administrador)* | Acesso irrestrito a todas as áreas | Cria e gerencia usuários, reseta senhas de qualquer conta, altera status de bancadas, aloca máquinas, faz swaps e trocas em lote. | Sem restrições. |
| 🛠️ **TI** *(Técnico de TI)* | Operação diária da infraestrutura de TI | Altera status individuais (Livre, Ocupada, Reserva, Desativada, Manutenção), faz alocações, swaps e trocas em lote; reseta senhas de Gestores (`Mudar@123`). | Não pode criar novos usuários nem resetar senhas de administradores. |
| 👥 **GESTOR** *(Supervisor Cobrança)* | Operação de negócio e rodízio de equipes | Acesso de leitura à planta e ao histórico; utiliza o **Modo Troca em Lote** e emite o **Romaneio de Movimentação**. | Não pode desativar bancadas, colocar em reserva individual ou gerenciar usuários. |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **NPM**

### 1. Inicializar o Backend
```bash
cd backend
npm install
npm run dev
```
> O servidor iniciará na porta `3001` (`http://localhost:3001/api`).
> Por padrão, utiliza banco de dados SQLite local (`database.sqlite`) com fallback automático, ou MySQL configurável via arquivo `.env`.

### 2. Inicializar o Frontend
```bash
cd frontend
npm install
npm run dev
```
> O frontend Vite iniciará normalmente em `http://localhost:5173`.

### 3. Credenciais Padrão Pré-cadastradas
O sistema já inicializa com contas para demonstração imediata de cada nível de acesso:
- **Administrador:** Usuário `admin` | Senha `admin123`
- **Técnico de TI:** Usuário `ti` | Senha `ti123`
- **Gestor de Cobrança:** Usuário `gestor` | Senha `gestor123`

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend:** Node.js, Express, Sequelize ORM, SQLite3, MySQL2.
- **Segurança & Criptografia:** JWT (JSON Web Tokens), BcryptJS.

---

## 📋 Resumo do Sistema

> **O Sistema de Controle de Alocação e Trocas Mensais** foi desenvolvido para centralizar, simplificar e profissionalizar o gerenciamento de infraestrutura física e tecnológica do setor de cobrança da **Consult'H**.
>
> Unindo uma interface visual intuitiva a regras de negócio de alta confiabilidade (transações atômicas e controle RBAC), a plataforma elimina planilhas manuais descentralizadas, previne a perda ou extravio de equipamentos (computadores, monitores e kits de periféricos) e garante agilidade nas viradas de mês através do fluxo de trocas em lote com emissão de romaneios formais de entrega. Cada alteração realizada fica gravada para fins de auditoria interna, garantindo total transparência operacional entre a equipe de TI e a supervisão de cobrança.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend:** Node.js, Express, Sequelize ORM, SQLite3, MySQL2.
- **Segurança & Criptografia:** JWT (JSON Web Tokens), BcryptJS.

---

## 📋 Resumo do Sistema

> **O Sistema de Controle de Alocação e Trocas Mensais** foi desenvolvido para centralizar, simplificar e profissionalizar o gerenciamento de infraestrutura física e tecnológica do setor de cobrança da **Consult'H**.
>
> Unindo uma interface visual intuitiva a regras de negócio de alta confiabilidade (transações atômicas e controle RBAC), a plataforma elimina planilhas manuais descentralizadas, previne a perda ou extravio de equipamentos (computadores, monitores e kits de periféricos) e garante agilidade nas viradas de mês através do fluxo de trocas em lote com emissão de romaneios formais de entrega. Cada alteração realizada fica gravada para fins de auditoria interna, garantindo total transparência operacional entre a equipe de TI e a supervisão de cobrança.

