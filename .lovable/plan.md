# Matching por compatibilidade

Hoje a busca usa filtros rígidos por empresa (cidade/estado/categoria) e nem considera capacidade do pacote nem tipo de evento. Vamos passar a fazer **match no nível do pacote**, com critérios obrigatórios e secundários, e mostrar resultados ordenados por relevância.

## Critérios

**Obrigatórios (bloqueiam):**
- `serviceCategory` do pacote == `briefing.serviceCategory`
- `briefing.state` + `briefing.city` ∈ `pkg.coverage` (qualquer estado da cobertura cuja lista de cidades contenha a cidade — comparado normalizado)
- `briefing.people` dentro de `[pkg.minPeople, pkg.maxPeople]` (com `maxPeople` opcional; sem teto = aceita qualquer)

**Secundários (ranqueiam, não bloqueiam):**
- `briefing.eventType` ∈ `pkg.eventTypes` → +score (relevância alta)
- Pacote sem `eventTypes` definido → considerado "geral", entra com score neutro
- Se pacote tem `eventTypes` e nenhum bate → ainda aparece, mas com score baixo (a menos que o parceiro marque restrição forte — fora de escopo nesta fase)

## Mudanças

### 1. Tipos e store (`src/types/index.ts`, `src/store/partnerStore.ts`)
- Adicionar em `Menu` / `DrinkPackage`:
  - `maxPeople?: number`
  - `eventTypes?: string[]` (chaves dos `eventTypes` de `mockData`)

### 2. Cadastro de pacote (`src/pages/partner/PartnerPackagesPage.tsx`)
- Trocar campo único "Mín. pessoas" por dois campos: **Mínimo** e **Máximo** (máx opcional, vazio = sem limite).
- Nova seção "Tipos de evento atendidos" com checkboxes a partir de `eventTypes` de `mockData` (ex.: casamento, aniversário, corporativo, confraternização, geral). Vazio = "atende qualquer tipo".
- Validação: `maxPeople`, se preenchido, deve ser ≥ `minPeople`.

### 3. API layer (`src/services/api.ts`)
- Incluir `maximo_pessoas` e `tipos_evento` em `ApiPacote`, `apiAddPackage`, `apiUpdatePackage`.
- Mapper em `useCompanies.ts` lê esses campos com fallback (`maxPeople = undefined`, `eventTypes = []`).

### 4. Util de matching (novo `src/lib/matching.ts`)
Funções puras, testáveis:
- `normalize(s)` → minúsculo, sem acento, sem espaços extras (para comparar cidades/UF).
- `matchesCoverage(pkg, state, city)` → bool.
- `matchesCapacity(pkg, people)` → bool.
- `matchesCategory(pkg, category)` → bool.
- `scorePackage(pkg, briefing)` → `{ matches: boolean, score: number, reasons: string[] }`. `matches` = todos obrigatórios; `score` soma bônus por `eventType` e por capacidade folgada.

### 5. Página de resultados (`src/pages/ResultsPage.tsx`)
- Substituir lógica atual (lista de empresas filtrada server-side) por:
  1. Buscar todas as empresas ativas (sem filtro server-side rígido — apenas `categoria` como dica).
  2. Para cada empresa, buscar seus pacotes (já existe `useCompanyMenus`; usar batch via novo hook `useAllPackages` ou um endpoint que liste pacotes públicos).
  3. Aplicar `scorePackage` em cada pacote; manter os que `matches === true`.
  4. Agrupar por empresa, ordenar empresas pelo melhor score de pacote.
  5. Mostrar empresas + indicar quantos pacotes compatíveis cada uma tem; se nenhum pacote bater, esconder a empresa.
- Mensagem "nenhum resultado" mantém-se quando vazio, com sugestão de ajustar pessoas/cidade.

### 6. Hook auxiliar (`src/hooks/useCompanies.ts`)
- Novo `useMatchingPackages(briefing)`: combina lista de empresas + pacotes + matching. Retorna `Array<{ company, matchedPackages, bestScore }>`.
- Manter `useCompanies` puro para outros usos.

### 7. Detalhe da empresa (`src/pages/CompanyDetailPage.tsx`)
- Ao listar pacotes, marcar visualmente os pacotes compatíveis com o briefing atual (badge "Compatível com seu evento") e empurrá-los para o topo.

## Detalhes técnicos

- Normalização: `s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()`. Comparar `state` por UF (já estruturado) e `city` por nome normalizado.
- `eventTypes` reutiliza `value` de `src/data/mockData.ts` `eventTypes` (já existe). Adicionar opção `geral` se não existir.
- O `api.php` precisará persistir `maximo_pessoas` e `tipos_evento` (JSON). Enquanto não persiste, o matching ainda funciona com fallback (sem máximo = passa; sem `eventTypes` = neutro). Sinalizar isso ao final.
- Não mexer em autenticação, leads ou pagamentos.

## Verificação

1. Cadastrar pacote em `/parceiro/pacotes` com min=20, max=100, tipos=[casamento, corporativo], cobertura SP/Campinas+São Paulo.
2. Fazer briefing: casamento, 30 pessoas, São Paulo/SP, serviço completo → o pacote aparece como compatível, score alto.
3. Mudar briefing para 150 pessoas → pacote não aparece.
4. Mudar tipo para "aniversário" → pacote ainda aparece (score menor) se `eventTypes` não inclui aniversário, ou some apenas se também não houver "geral".
5. Confirmar normalização: digitando cidade com/sem acento via dropdown estruturado já garante consistência.
