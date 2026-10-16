# 🏢 Sistema de Controle de Alocação e Trocas Mensais
### 🚀 Desenvolvido por HENN Tecnologia · Prestação de Serviços de TI para o Grupo Consulth Soluções

<p align="center">
  <img src="frontend/public/logo-henn.png" alt="HENN Tecnologia" width="180" />
</p>

Sistema corporativo de gestão visual, governança patrimonial de TI e rastreabilidade histórica de postos de trabalho e computadores (`COBCON...`), projetado e implementado pela **HENN Tecnologia** para a operação de cobrança do **Grupo Consulth Soluções** (**10 corredores e 122 bancadas**).

---

## 🎯 Guia de Funcionalidades para o Cliente

### 1. 🏢 Identidade Visual & Design System HENN Tecnologia (Inspirado no Site Oficial)
- **Identidade Corporativa:** Toda a interface do sistema adota os elementos de design, tipografia e paleta do site oficial da **HENN Tecnologia** ([henntecnologia.com.br](https://henntecnologia.com.br/)), destacando o azul ciano elétrico característico (`#019cdc`), azul royal e tons sóbrios corporativos.
- **Chancela e Reconhecimento:** O logotipo oficial da HENN Tecnologia está presente na tela de login, no cabeçalho operacional, no rodapé e nos documentos oficiais (Romaneios de Troca), formalizando a autoria da solução e a prestação contínua de serviços para o **Grupo Consulth Soluções**.

---

### 2. ☀️/🌙 Tema Claro / Escuro Opcional (Alternância com Persistência)
- **Flexibilidade e Conforto Visual:** O modo escuro agora é **opcional**. O usuário pode alternar instantaneamente entre o **Modo Claro** (estilo corporativo moderno, fundo limpo e cartões nítidos) e o **Modo Escuro** (alto contraste para longos períodos de operação técnica).
- **Botão Alternador Rápido:** Disponível tanto na tela de Login quanto no cabeçalho superior (`HeaderBusca`), com ícones dinâmicos de Sol (☀️) e Lua (🌙).
- **Memória de Preferência:** A escolha do usuário é gravada automaticamente no navegador (`localStorage`), mantendo o tema selecionado mesmo após fechar a aba ou realizar novo login.

---

### 3. 🗺️ Planta Baixa Visual e Interativa
- **Distribuição Real do Setor:** Mapeamento fiel das 122 bancadas de atendimento divididas em 10 corredores horizontais:
  - **Corredores 01 a 09:** 12 bancadas cada (6 no Lado A e 6 no Lado B).
  - **Corredor 10:** 14 bancadas (7 no Lado A e 7 no Lado B).
- **Interface Otimizada de Ponta a Ponta:** Aproveitamento total da largura da tela com ilhas de bancadas organizadas, corredores de circulação e visualização instantânea de todos os postos.

---

### 4. 🚦 Identificação Visual e Estados das Bancadas
Cada posto possui um cartão de status com cores normatizadas e ícones de identificação imediata, adaptadas perfeitamente para temas claro e escuro:
- 🟢 **Ocupada (Verde):** Posto ativo com computador alocado e operador em atendimento.
- 🔵 **Reserva - Pronta p/ Uso (Azul HENN `#019cdc` / Ciano):** Posto com máquina física montada (computador, monitor e periféricos), porém sem operador vinculado (ideal para desligamentos recentes ou postos de contingência prontos para novas contratações).
- ⚪ **Livre (Cinza):** Posto desocupado sem nenhum equipamento vinculado, pronto para novas instalações.
- 🔴 **Desativada (Vermelho):** Bancada bloqueada por avaria física, elétrica ou de rede, exibindo o motivo da inoperância.
- 🟡 **Manutenção (Âmbar):** Posto em intervenção técnica ou reparo predial.

---

### 5. 🔍 Busca Global Instantânea com Ampla Visibilidade
- **Campo de Busca Dedicado e Amplo:** Campo de pesquisa proeminente e expansivo (`max-w-xl`), estrategicamente posicionado em linha própria para garantir que o texto digitado pelo usuário permaneça sempre 100% legível e nunca comprimido por outros botões do cabeçalho.
- **Localização Instantânea:** Localize qualquer posto em tempo real digitando:
  - **Hostname da Máquina:** Ex: `COBCON220`.
  - **Nome do(a) Colaborador(a):** Localize onde um operador está sentado.
  - **Equipe ou Carteira:** Ex: `Negociação Especial`, `Preventiva`, `60+`.
  - **Código da Bancada:** Ex: `C01-A01`, `C05-B04`.
  - **Ponto de Rede ou Status:** Localize facilmente postos em `RESERVA` ou `DESATIVADA`.
- **Contador Integrado & Limpeza Rápida:** As bancadas encontradas recebem **destaque com borda amarela pulsante**, e o campo exibe o badge de resultados (`X achadas`) com espaçamento protegido (`pr-32`) para que nunca sobreponha o termo pesquisado, contando ainda com botão `✕` para limpeza instantânea.

---

### 6. 🔵 Gestão do Estado "RESERVA" & Desligamento Rápido
- **Preservação de Ativos:** Ao ocorrer o desligamento ou remanejamento de um colaborador sem que a máquina precise sair da mesa, o operador pode acionar **"🔵 Desligamento (Colocar em Reserva)"**.
- O sistema desvincula o operador anterior, mantém o computador, monitor e periféricos montados na mesa e registra o evento `DESLIGAMENTO_RESERVA` no histórico.

---

### 7. 🔄 Modo Troca em Lote (Virada de Mês) com Romaneio / O.S.
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
  - O documento é timbrado com a marca da **HENN Tecnologia** e os dados do cliente **Grupo Consulth Soluções**, contendo protocolo, data/hora, solicitante, técnico responsável e termos de entrega e recebimento para assinatura de ambas as partes.

---

### 8. 📜 Rastreabilidade Histórica e Auditoria de Ativos
- Toda alteração realizada no sistema gera um registro permanente e imutável de movimentação.
- Tipos de eventos auditados:
  - `ALOCACAO`: Nova máquina instalada em uma bancada.
  - `TROCA_MENSAL`: Movimentações em lote solicitadas por gestores.
  - `SWAP`: Inversão direta entre dois postos.
  - `DESATIVACAO_BANCADA`: Bloqueio de posto com registro de justificativa técnica.
  - `DESLIGAMENTO_RESERVA`: Preservação da máquina na mesa sem operador.
- No modal da bancada, é possível alternar entre a linha do tempo da **Bancada** e a linha do tempo da **Máquina** (pesquisando por qualquer hostname).

---

### 9. 🔐 Autenticação e Controle de Acesso por Papel (RBAC)
O sistema conta com autenticação via Token JWT seguro e controle de permissões em 3 níveis:

| Nível / Perfil | Descrição | O que pode fazer | O que NÃO pode fazer |
| :--- | :--- | :--- | :--- |
| 👑 **ADM** *(Administrador HENN)* | Acesso irrestrito a todas as áreas | Cria e gerencia usuários, reseta senhas de qualquer conta, altera status de bancadas, aloca máquinas, faz swaps e trocas em lote. | Sem restrições. |
| 🛠️ **TI** *(Técnico HENN Tecnologia)* | Operação diária da infraestrutura de TI | Altera status individuais (Livre, Ocupada, Reserva, Desativada, Manutenção), faz alocações, swaps e trocas em lote; reseta senhas de Gestores (`Mudar@123`). | Não pode criar novos usuários nem resetar senhas de administradores. |
| 👥 **GESTOR** *(Supervisor Grupo Consulth)* | Operação de negócio e rodízio de equipes | Acesso de leitura à planta e ao histórico; utiliza o **Modo Troca em Lote** e emite o **Romaneio de Movimentação**. | Não pode desativar bancadas, colocar em reserva individual ou gerenciar usuários. |

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
- **Administrador (HENN):** Usuário `admin` | Senha `admin123`
- **Técnico de TI (HENN):** Usuário `ti` | Senha `ti123`
- **Gestor de Cobrança (Consulth):** Usuário `gestor` | Senha `gestor123`

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS (com suporte a Light/Dark Mode), Lucide React, Axios.
- **Backend:** Node.js, Express, Sequelize ORM, SQLite3, MySQL2.
- **Segurança & Criptografia:** JWT (JSON Web Tokens), BcryptJS.
- **Identidade & Design:** HENN Tecnologia ([henntecnologia.com.br](https://henntecnologia.com.br/)).

---

## 📋 Resumo do Sistema

> **O Sistema de Controle de Alocação e Trocas Mensais** foi desenvolvido e customizado sob medida pela **HENN Tecnologia** como uma plataforma corporativa para a governança patrimonial, gestão de postos de trabalho e suporte operacional da infraestrutura de TI do **Grupo Consulth Soluções**.
>
> Inspirado na identidade visual e no padrão de excelência da **HENN Tecnologia** ([henntecnologia.com.br](https://henntecnologia.com.br/)), o software oferece total flexibilidade visual ao usuário por meio da alternância entre **Tema Claro** e **Tema Escuro** (Dark Mode opcional persistido em navegador), alto poder de usabilidade na visualização interativa dos 10 corredores e 122 bancadas de atendimento, segurança robusta com autenticação JWT e controle de papéis (RBAC - ADM, TI e GESTOR), além de estrita integridade transacional nas operações de alocação, swap e rodízio em lote com geração instantânea de Romaneios/Ordens de Serviço oficiais.
>
> Com esta solução, eliminam-se planilhas manuais vulneráveis a falhas, assegura-se o controle total sobre computadores (`COBCON...`), monitores e periféricos, e consolida-se um fluxo de trabalho ágil, moderno e transparente entre a equipe técnica da **HENN Tecnologia** e a operação de cobrança do **Grupo Consulth Soluções**.
