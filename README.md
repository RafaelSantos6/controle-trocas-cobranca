# 🏢 Sistema de Controle de Alocação e Trocas Mensais
### 🚀 Desenvolvido por HENN Tecnologia · Prestação de Serviços de TI para o Grupo Consulth Soluções

<p align="center">
  <img src="frontend/public/logo-henn.png" alt="HENN Tecnologia" width="180" />
</p>

Sistema corporativo de gestão visual, governança patrimonial de TI e rastreabilidade histórica de postos de trabalho e computadores (`COBCON...`), projetado e implementado pela **HENN Tecnologia** para a operação de cobrança do **Grupo Consulth Soluções** (**126 bancadas distribuídas em 10 corredores + Meio Corredor 11**).

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

### 3. 🗺️ Planta Baixa Visual e Interativa (126 Bancadas · Ordem Crescente da Base ao Topo)
- **Distribuição Real e Padronizada do Setor (126 Postos):**
  - **Corredor 01 (Base):** 12 bancadas desativadas (reserva de infraestrutura predial).
  - **Corredores 02 a 10:** 12 bancadas por corredor (6 no Lado D e 6 no Lado E).
  - **Meio Corredor 11 (Topo):** 6 bancadas exclusivas no Lado E (sem fileira D).
- **Disposição Arquitetural Lado D (Superior) e Lado E (Inferior):**
  - Cada ilha possui a **Fileira Lado D em cima** (`D06` a `D01`) e a **Fileira Lado E embaixo** (`E06` a `E01`), separadas pela calha central de rede e energia, seguindo à risca a convenção física da empresa.
- **Orientação das Posições em Relação ao Corredor de Circulação:**
  - O início da numeração de cada lado (`01`) é **sempre voltado para a ponta do corredor de circulação e testeiras (à direita da tela)**.
  - O final da numeração (`06`) fica **na ponta oposta, voltada para a parede (à esquerda da tela)**.
  - Dessa forma, postos como `Luis Cavalheiro (C02-E01)`, `Pamela Buch (C02-D01)`, `Barbara Fonceca (C03-E01)` e `Fernanda Bovo (C11-E01)` ficam posicionados junto ao corredor, enquanto postos como `Abdnego (C02-E06)`, `Maria Souza (C03-E05/E06)` e `Thayany Silva (C11-E06)` ficam na ponta oposta contra a parede.
- **Ordem Crescente a Partir da Base do Site:**
  - O **Corredor 01** posiciona-se na **base do mapa (parte inferior da tela)**, alinhado à perspectiva de quem adentra a operação física.
  - A visualização cresce de maneira ascendente até o **Meio Corredor 11** no topo da tela (C01 na base até C11 no topo).
  - Cada ilha de corredor integra o painel de postos, calha central de rede/elétrica e a testeira institucional CONSULT'H à direita.

---

### 4. 🚦 Identificação Visual e Estados das Bancadas
Cada posto possui um cartão de status com cores normatizadas e ícones de identificação imediata, adaptadas perfeitamente para temas claro e escuro:
- 🟢 **Ocupada (Verde):** Posto ativo com colaborador alocado. Se já possui computador instalado, exibe o hostname (ex: `COBCON239`); caso ainda não possua máquina montada, exibe o rótulo informativo `S/ MÁQUINA`.
- 🔵 **Reserva - Pronta p/ Uso (Azul HENN `#019cdc` / Ciano):** Posto com máquina física montada e testada (computador, monitor e periféricos), porém sem operador vinculado (ideal para desligamentos recentes ou postos de contingência prontos para novas contratações).
- ⚪ **Livre (Cinza):** Posto desocupado sem nenhum equipamento vinculado, pronto para novas instalações.
- 🔴 **Desativada (Vermelho):** Bancada bloqueada por motivo técnico ou físico (ex: `Sem bancada física no local` ou `Corredor 01 Desativado`).
- 🟡 **Manutenção (Âmbar):** Posto em intervenção técnica ou reparo predial.

---

### 5. 🔍 Busca Global Instantânea com Ampla Visibilidade
- **Campo de Busca Dedicado e Amplo:** Campo de pesquisa proeminente e expansivo (`max-w-xl`), estrategicamente posicionado em linha própria para garantir que o texto digitado pelo usuário permaneça sempre 100% legível e nunca comprimido por outros botões do cabeçalho.
- **Localização Instantânea:** Localize qualquer posto em tempo real digitando:
  - **Hostname da Máquina:** Ex: `COBCON239`, `COBCON220`, `ADMCON103`.
  - **Nome do(a) Colaborador(a):** Ex: `Pamela Buch`, `Luis Cavalheiro`, `Joao Ritti`, `Murilo Almeida`.
  - **Código da Bancada:** Ex: `C02-D01`, `C08-E05`, `C11-E01`.
  - **Modelo de Processador / Hardware:** Ex: `N5095`, `J4125`, `i3`, `i5`, `10100`.
  - **Status ou Ponto de Rede:** Localize facilmente postos em `RESERVA`, `DESATIVADA` ou `LIVRE`.
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

### 10. 💻 Cruzamento Integral com o Inventário de TI & Ficha Técnica de Hardware
Os dados da planta física foram 100% cruzados e enriquecidos com a **Planilha Oficial de Controle de Ativos de TI**:
- **Preenchimento Bidirecional Completo:**
  - Postos que continham apenas o hostname da máquina foram completados com o nome real do(a) colaborador(a) correspondente (ex: `COBCON206` associado a **Murilo Almeida**, `COBCON209` a **Karolayne Bonfim**, `COBCON198` a **Camilly Gomes**, `COBCON139` a **Maria Siqueira**).
  - Postos que continham apenas o nome do colaborador foram vinculados ao seu computador específico e suas especificações completas de fábrica (ex: **Brenda Colenetz** em `COBCON232`, **Ana Schroeder** em `COBCON235`, **Keren Ferreira** em `COBCON212`, **Gabriel Vieira** em `COBCON231`).
  - Identificação de postos com líderes e supervisores utilizando máquinas executivas da linha `ADMCON` (ex: **Barbara Fonseca** em `ADMCON103`, **Ana Rebello** em `ADMCON022`, **Thais Miranda** em `ADMCON045`, **Lorayne Lopes** em `ADMCON028`, **Juliana Ferreira** em `ADMCON105`, **Felipe Silva** em `ADMCON008`).
- **Ficha Técnica de Hardware Integrada:**
  - Cada máquina cadastrada no sistema possui suas especificações reais registradas e visíveis no modal de gerenciamento:
    - **Processador / CPU:** Intel Celeron N5095, Celeron J4125, Core i3-4170, Core i3-7100, Core i3-8100, Core i3-10100, Core i5-4570.
    - **Memória RAM:** 4 GB, 8 GB ou 16 GB.
    - **Armazenamento:** SSDs de 120 GB, 240 GB ou 256 GB.
    - **Sistema Operacional:** Windows 10 ou Windows 11.
    - **Segurança:** Status do antivírus corporativo Kaspersky (`OK`).
- **Catálogo de 248 Máquinas no Banco de Dados:**
  - Além dos 100 computadores alocados nas bancadas operacionais e em reserva, o sistema registra 148 máquinas adicionais da operação em estado `ESTOQUE`, permitindo que os técnicos de TI selecionem equipamentos diretamente do catálogo oficial para novas alocações ou substituições.

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
> Inspirado na identidade visual e no padrão de excelência da **HENN Tecnologia** ([henntecnologia.com.br](https://henntecnologia.com.br/)), o software oferece total flexibilidade visual ao usuário por meio da alternância entre **Tema Claro** e **Tema Escuro** (Dark Mode opcional persistido em navegador), alto poder de usabilidade na visualização interativa das 126 bancadas de atendimento (distribuídas nos Corredores 01 a 10 com Lado D superior e Lado E inferior, mais o Meio Corredor 11 no topo com fileira Lado E única, iniciando de forma crescente a partir da base do mapa físico e com as posições 01 sempre voltadas ao corredor de circulação à direita), segurança robusta com autenticação JWT e controle de papéis (RBAC - ADM, TI e GESTOR), além de estrita integridade transacional nas operações de alocação, swap e rodízio em lote com geração instantânea de Romaneios/Ordens de Serviço oficiais.
>
> Com esta solução alimentada e 100% cruzada com os dados da planilha de controle patrimonial da operação (vinculando todos os 126 postos aos seus respectivos colaboradores, hostnames `COBCON`/`ADMCON` e fichas técnicas de hardware com CPU, RAM, SSD, SO e Kaspersky), eliminam-se planilhas manuais vulneráveis a falhas, assegura-se o controle total sobre os ativos tecnológicos e periféricos, e consolida-se um fluxo de trabalho ágil, moderno e transparente entre a equipe técnica da **HENN Tecnologia** e a operação de cobrança do **Grupo Consulth Soluções**.
