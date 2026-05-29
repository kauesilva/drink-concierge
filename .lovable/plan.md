# Ajustes no fluxo de Solicitação de Orçamento (`/orcamento`)

Três ajustes pontuais no wizard de briefing (`src/pages/QuotePage.tsx`), mantendo o resto do fluxo intacto.

## 1. Step "Data" — atalhos de período

Hoje só existe um calendário. Vamos adicionar 3 botões abaixo do calendário:

- **Nos próximos 30 dias**
- **Nos próximos 3 meses**
- **Em até 12 meses**

Comportamento:
- Clicar em um atalho desmarca a data específica e seleciona uma "janela" (flexível).
- Selecionar uma data no calendário desmarca o atalho.
- Validação do passo aceita **ou** uma data **ou** uma janela.
- O valor é persistido no `briefing` (campo novo `eventDateFlex: '30d' | '3m' | '12m' | null` em `src/store/quoteStore.ts` via `QuoteBriefing`). Quando enviado para o backend (lead), traduzimos para um label textual em `observacoes` ou em `data_evento` (formato `flex:30d`) — manteremos `data_evento` apenas quando há data específica, senão enviaremos a janela como string descritiva concatenada nas observações para não quebrar a coluna `data_evento DATE` do backend.

## 2. Step "Local" — restringir estados a SP + "Outras cidades"

Substituir o `StateCitySelect` genérico por um seletor customizado **apenas neste passo** (sem alterar o componente compartilhado, que segue servindo outras telas como cadastro de parceiro).

- Estado mostra **somente 2 opções**: `São Paulo (SP)` e `Outras cidades`.
- Quando SP é selecionado: campo Cidade mostra a lista de SP de `src/data/brazilLocations.ts`, com **"São Paulo" no topo** e o restante em **ordem alfabética**.
- Quando "Outras cidades" é selecionado: abre um `Dialog` com a mensagem:
  > "Ops, ainda estamos ampliando nossa atuação. Informe sua cidade que vamos buscar parceiros de confiança."
  
  Formulário do popup: Nome, WhatsApp, Email, Cidade, Estado (input livre). Ao enviar, dispara `apiRegisterCoverageRequest(...)` (novo endpoint) e mostra toast de sucesso. O passo do wizard **não avança**; o estado volta para vazio para o usuário ou escolher SP ou fechar.

## 3. Backend (snippet, não implementado nesta task)

Será necessária uma rota `register_coverage_request` em `api.php` que insere em uma nova tabela `coverage_requests` (nome, whatsapp, email, cidade, estado, created_at) e notifica o admin por email. O front já chamará a função; deixarei um arquivo `backend-snippets/coverage-requests.php` com o SQL e o handler de referência.

## Arquivos afetados

- `src/pages/QuotePage.tsx` — atalhos de data no step 5; seletor SP/Outras + dialog no step 4.
- `src/store/quoteStore.ts` + `src/types/index.ts` — adicionar `eventDateFlex` em `QuoteBriefing`.
- `src/services/api.ts` — função `apiRegisterCoverageRequest`.
- `backend-snippets/coverage-requests.php` — SQL + handler PHP de referência (apenas snippet).

## Fora de escopo

- Implementar de fato a rota PHP / tabela MySQL (depende do backend do usuário).
- Alterar o `QuickQuoteDialog` (fluxo separado de "orçamento rápido" no perfil do parceiro).
- Alterar o `StateCitySelect` compartilhado.
