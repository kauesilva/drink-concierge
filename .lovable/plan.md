# Busca por Empresas ou Pacotes nos Resultados

Adicionar um toggle no topo da página de resultados (`/resultados`) permitindo ao usuário alternar entre:

- **Empresas** (visão atual): card por empresa com seus pacotes compatíveis agrupados.
- **Pacotes** (nova visão): catálogo plano de pacotes compatíveis, cada card mostrando o logotipo/nome da empresa ao lado, estilo iFood.

## Mudanças

### 1. `src/pages/ResultsPage.tsx`
- Adicionar estado local `viewMode: 'empresas' | 'pacotes'` (default `empresas`).
- Renderizar `Tabs` (shadcn) logo abaixo dos filtros do briefing, com dois botões: "Empresas" e "Pacotes".
- Quando `pacotes`: achatar `matches` em uma lista única de pacotes (`matchedPackages.flatMap`), ordenados por `match.score` desc, e renderizar com o novo `PackageResultCard`.
- Manter visão "Empresas" inalterada.

### 2. Novo componente `src/components/menus/PackageResultCard.tsx`
- Props: `menu: Menu & { match }`, `company: Company`, `index`.
- Layout (catálogo tipo iFood):
  - Faixa lateral/topo com `coverImage` do pacote (fallback `company.image`).
  - Nome do pacote, descrição curta, duração, mín. pessoas, preço/pessoa.
  - Linha com logotipo redondo da empresa (`company.image`) + nome da empresa + rating pequeno.
  - Badges de motivos do match (reuso da lógica atual).
  - Botão "Ver mais detalhes" → `Link` para `/empresas/{company.id}/cardapios/{menu.id}` (rota já existente — `MenuDetailPage`).
- Usar tokens do design system (sem cores hardcoded), `framer-motion` para entrada.

### 3. Sem mudanças de backend/dados
Os dados já vêm de `useMatchingPackages` (empresa + pacotes compatíveis). Apenas reorganizamos a apresentação no cliente.

## Detalhes técnicos
- Reusar `Tabs`/`TabsList`/`TabsTrigger` de `@/components/ui/tabs`.
- Tipos: `CompanyMatch` já expõe `company` e `matchedPackages` (que estende `Menu` com `match`); fácil de achatar.
- Rota de detalhes do pacote: `/empresas/:companyId/cardapios/:menuId` (já existente, usada por `MenuCard`).
- Mobile-first: grid 1 coluna no mobile, 2 colunas em md+.

## Fora do escopo
- Busca textual / filtros adicionais no catálogo de pacotes (pode vir depois).
- Mudanças em `MenuDetailPage`, store de orçamento ou API.
