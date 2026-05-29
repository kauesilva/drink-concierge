# Painel Master Admin — visão única + aprovação de parceiros

Unifica o painel `/admin/dashboard` em uma interface com abas, adiciona fluxo de **aprovação de parceiros** e expõe as solicitações de cobertura (cidades fora da atuação).

## 1. Conceito de aprovação

- Toda nova conta de parceiro nasce como `ativo = 0` (pendente).
- Enquanto pendente: o parceiro consegue logar, editar perfil, criar pacotes — **mas não aparece** em `list_companies`, no diretório, nas buscas, nem recebe leads/quick-quote.
- O admin aprova (`ativo = 1`) ou rejeita (`ativo = 2`, "rejeitado" — mantém o registro para auditoria, bloqueia exibição).
- Backend (`api.php`) precisa filtrar `WHERE ativo = 1` em todas as rotas públicas (`list_companies`, `get_public_partner`, `send_quick_quote`, matching de leads). Snippet de referência incluído.

## 2. Reescrita do `AdminDashboardPage.tsx` com abas

Layout com `Tabs` do shadcn em 4 seções:

### Aba "Parceiros" (default)
- Lista todos os parceiros (`apiAdminListPartners`) com nome, email, cidade, categorias, data de cadastro e badge de status: **Pendente / Ativo / Rejeitado**.
- Filtro por status (Todos | Pendentes | Ativos | Rejeitados) e busca por nome/email.
- Cada card tem ações contextuais: **Aprovar**, **Rejeitar**, **Reativar**, **Ver perfil público** (link `/parceiro/:id`).
- Destaque visual para pendentes (badge animada, no topo).

### Aba "Solicitações de orçamento"
- O conteúdo atual de leads (já implementado), com filtros por status e busca por cliente/cidade.

### Aba "Cidades solicitadas"
- Lista as entradas de `coverage_requests` (popup "Outras cidades" do wizard).
- Mostra nome, contato, cidade/UF e data — útil para o admin priorizar expansão.

### Aba "Resumo" (KPIs simples no topo, sempre visível acima das abas)
- Cards: total de parceiros ativos, pendentes de aprovação, leads do mês, cidades solicitadas no mês.

## 3. Novas chamadas de API (frontend)

Em `src/services/api.ts`:
- `apiAdminListPartners(token)` → `GET admin_list_partners` (todos os parceiros, qualquer status).
- `apiAdminSetPartnerStatus(token, { parceiro_id, ativo: 0|1|2 })` → `POST admin_set_partner_status`.
- `apiAdminListCoverageRequests(token)` → `GET admin_list_coverage_requests`.

## 4. Sugestões adicionais (incluídas no plano)

Implementar agora junto com o resto:
- **Badge "Pendente de aprovação"** no próprio painel do parceiro (`PartnerDashboardPage`), explicando que ele só fica visível ao público após aprovação.
- **Notificação por email** (snippet PHP) ao admin quando um novo parceiro se cadastra, e ao parceiro quando é aprovado/rejeitado.

Fora desta iteração (sugestões para depois — pergunto se quer adicionar):
- Página de detalhe do parceiro dentro do admin (ver pacotes, leads recebidos, métricas) em vez de só link para perfil público.
- Exportação CSV de leads e parceiros.
- Logs de auditoria de ações do admin.
- Soft-delete de leads/parceiros.
- Estatísticas históricas (gráficos por mês).

## Arquivos afetados

- `src/pages/admin/AdminDashboardPage.tsx` — reescrita com abas.
- `src/services/api.ts` — 3 novas funções + tipo `ApiCoverageRequest`.
- `src/pages/partner/PartnerDashboardPage.tsx` — banner "aguardando aprovação" quando `ativo === 0`.
- `backend-snippets/admin-partners-approval.php` — SQL/handlers de referência:
  - `admin_list_partners`, `admin_set_partner_status`, `admin_list_coverage_requests`
  - filtro `ativo = 1` em todas as rotas públicas
  - default `ativo = 0` no `register`
  - emails de notificação (admin e parceiro)

## Fora de escopo

- Implementação real do PHP/MySQL (depende do backend do usuário; entrego snippet).
- Multi-admin / roles granulares (segue com login único de admin).
