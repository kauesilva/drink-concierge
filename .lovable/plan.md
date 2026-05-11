## Objetivo

Garantir que clientes encontrem fornecedores e pacotes corretos, classificando por **tipo de serviço** (Mão de obra / Serviço completo / Consultoria e cardápio) e por **região atendida estruturada** (Estado + Cidades) no nível do **pacote**.

## 1. Categorias de serviço

**Catálogo único** (`src/data/mockData.ts` → `serviceCategories`, já existe):
- `mao-de-obra` — Mão de obra
- `servico-completo` — Serviço completo
- `consultoria` — Consultoria e cardápio

### 1.1 Cadastro do fornecedor (perfil)
- `PartnerProfilePage`: adicionar bloco **"Tipos de serviço que ofereço"** com 3 checkboxes (multi-seleção, mínimo 1).
- Persistir em `partnerStore.profile.serviceCategories: string[]` e enviar em `apiUpdateProfile` como `categorias_servico`.

### 1.2 Cadastro/edição de pacote
- `PartnerPackagesPage`: no formulário, adicionar **"Categoria do pacote"** (radio, seleção única e obrigatória).
- Persistir em `DrinkPackage.serviceCategory: string` e enviar em `apiAddPackage`/`apiUpdatePackage` como `categoria_servico`.
- Mostrar a categoria como Badge no card do pacote.

### 1.3 Match no fluxo de orçamento
- Step 1 do `QuotePage` já captura `briefing.serviceCategory`. Repassá-lo para `ResultsPage`.
- `useCompanies` / `apiListCompanies`: aceitar filtro `categoria` e enviar para a API.
- `ResultsPage`: filtrar empresas que possuam ao menos um pacote da categoria escolhida; em `CompanyDetailPage`, exibir somente pacotes daquela categoria (com fallback "ver todos" se vazio).

## 2. Localização estruturada por pacote

### 2.1 Dados de referência
- Criar `src/data/brazilLocations.ts` com:
  - `brazilianStates` (mover do mockData) — `{ uf, nome }[]`.
  - `citiesByState: Record<UF, string[]>` — lista de cidades por UF (carregada de um JSON estático embutido, ex. base do IBGE; sem dependência externa em runtime).

### 2.2 Cadastro de pacote (substitui campo livre)
- No formulário de pacote do `PartnerPackagesPage`:
  - Dropdown **Estado** (single).
  - Dropdown/multiselect **Cidades atendidas** (carrega cidades do estado selecionado; permite múltiplas).
  - Permitir repetir o processo para outros estados (lista acumulada `coverage: { state: UF, cities: string[] }[]`).
- Persistir em `DrinkPackage.coverage` e enviar como `cobertura` para `apiAddPackage`/`apiUpdatePackage`.
- Remover/depreciar o uso de `areasServed` por pacote (mantém no perfil só como referência geral).

### 2.3 Cadastro do fornecedor
- Trocar o input livre "Cidade base" e "Estado" por dropdowns (Estado → Cidade) usando o mesmo dataset.
- "Áreas atendidas" do perfil torna-se opcional/legacy.

### 2.4 Briefing do cliente (`QuotePage` Step 4)
- Substituir input livre por: dropdown **Estado** → dropdown **Cidade**.
- Manter Bairro/Endereço como texto.

### 2.5 Match
- `apiListCompanies` recebe `estado` + `cidade` + `categoria` e retorna apenas empresas que tenham **pelo menos um pacote** com cobertura naquela cidade e categoria escolhida.
- `useCompanyMenus`: filtrar pacotes por `coverage` cobrindo a cidade do briefing **e** `serviceCategory === briefing.serviceCategory`.

## 3. Mudanças técnicas (resumo)

```text
src/types/index.ts
  + Menu.serviceCategory: 'mao-de-obra' | 'servico-completo' | 'consultoria'
  + Menu.coverage: { state: string; cities: string[] }[]
  + Company.serviceCategories: string[]

src/store/partnerStore.ts
  + profile.serviceCategories
  + DrinkPackage.serviceCategory, coverage
  ajustes em syncProfile / addPackage / updatePackage / syncPackages

src/services/api.ts
  + campos categorias_servico, categoria_servico, cobertura nos payloads
  + apiListCompanies(filters: { estado, cidade, categoria })

src/data/brazilLocations.ts  (novo)
src/components/shared/StateCitySelect.tsx  (novo, reutilizável)

src/pages/partner/PartnerProfilePage.tsx
  - inputs livres → StateCitySelect + checkboxes de categoria

src/pages/partner/PartnerPackagesPage.tsx
  + radio categoria + multi-cidades por estado (coverage)

src/pages/QuotePage.tsx
  - Step 4: trocar inputs por StateCitySelect

src/pages/ResultsPage.tsx
src/pages/CompanyDetailPage.tsx
src/hooks/useCompanies.ts
  + filtro por categoria + cidade estruturada
```

## 4. Backend (PHP `api.php`) — fora deste repo

Sinalizar ao usuário que será necessário, no servidor:
- adicionar colunas `categorias_servico` (parceiro), `categoria_servico` e `cobertura` (pacote);
- atualizar `register/update_profile`, `add_package/update_package/get_packages` e `list_companies` para gravar/filtrar por esses campos.
Enquanto o backend não é atualizado, o frontend grava localmente (Zustand persist) e envia os campos extras (a API ignora os que não conhece).

## 5. Compatibilidade

- Pacotes/fornecedores existentes sem categoria/cobertura aparecem em **todas** as buscas (fallback) até serem editados, evitando "lista vazia" durante a transição.
- Nada é removido da base; campos antigos (`areasServed`, `cidade_base`) seguem visíveis somente leitura.
