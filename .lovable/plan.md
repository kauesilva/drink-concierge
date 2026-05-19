## Objetivo

Tratar pacotes de "Mão de obra" como uma modalidade distinta — cobrada por hora, com regras próprias — e expor um terceiro filtro na tela de resultados.

## Mudança 1 — Modelo de pacote

No tipo `DrinkPackage` (partnerStore) e `Menu` (`src/types/index.ts`), adicionar campos opcionais específicos de mão de obra. Quando `serviceCategory === 'mao-de-obra'`, o pacote vira "labor-only" e passa a usar esses campos:

- `hourlyRate: number` — valor por hora (R$)
- `minHours: number` — mínimo de horas contratáveis (ex.: 5)
- `includesSetup: boolean` — inclui montagem prévia
- `setupHours?: number` — horas de antecedência (1 ou 2), visível se `includesSetup`
- `allowsOvertime: boolean` — permite hora extra
- `overtimeHourlyRate?: number` — valor da hora extra, visível se `allowsOvertime`

Campos `pricePerPerson`, `minPeople`, `maxPeople`, `drinks` deixam de ser obrigatórios/aplicáveis para esses pacotes.

## Mudança 2 — Painel do parceiro (PartnerPackagesPage)

- No formulário de pacote, quando o parceiro selecionar a categoria **Mão de obra**:
  - Esconder os blocos "Preço/pessoa", "Mín./Máx. pessoas" e "Drinks inclusos"
  - Mostrar bloco "Mão de obra": Valor/hora, Mínimo de horas, switch "Inclui montagem prévia" (+ select 1h/2h), switch "Permite hora extra" (+ Valor/hora extra)
- Validação ao salvar pacote labor-only: exige `hourlyRate > 0` e `minHours >= 1`, ignora regras de pessoas
- **Limite**: o parceiro só pode ter **1 pacote** de mão de obra. Botão "Novo Pacote" desabilita esta categoria no formulário se já existir um. Backend (`add_package`/`update_package`) também valida.
- Card do pacote labor-only mostra "R$ X/hora · mín. Yh" no lugar de "R$ X/pessoa".

## Mudança 3 — Tela de resultados (ResultsPage)

Três abas: **Pacotes** | **Mão de obra** | **Empresas**

- "Pacotes": apenas pacotes com `serviceCategory !== 'mao-de-obra'` (comportamento atual)
- "Mão de obra": apenas pacotes labor-only, com card específico mostrando R$/hora, mínimo de horas, montagem prévia e hora extra
- "Empresas": agrupa por empresa todos os pacotes compatíveis (igual hoje)
- Ordenação na aba Mão de obra: por valor/hora ou maior nota

Adicionar `viewMode = 'mao-de-obra'` ao estado e variante "labor" no `PackageResultCard` (ou criar `LaborPackageCard`).

## Mudança 4 — Backend (snippet de referência)

Em `backend-snippets/` adicionar/atualizar exemplo PHP de `add_package`/`update_package` com:

- Persistir os novos campos (`hourly_rate`, `min_hours`, `includes_setup`, `setup_hours`, `allows_overtime`, `overtime_hourly_rate`)
- Bloquear criação de 2º pacote `categoria_servico = 'mao-de-obra'` para o mesmo parceiro (`SELECT COUNT(*) ... WHERE parceiro_id = ? AND categoria_servico = 'mao-de-obra'`)
- Migration sugerida (ALTER TABLE pacotes ADD COLUMN ...) documentada no snippet

Sem alterações no fluxo de leads/orçamento — `QuickQuoteDialog` continua igual; pacotes de mão de obra aparecem com preço por hora no perfil público.

## Pergunta antes de implementar

Quero confirmar: ao definir o pacote como categoria **Mão de obra**, ele é automaticamente "labor-only" (preço por hora). Faz sentido vincular assim, ou prefere um switch separado tipo "Cobrar por hora" independente da categoria? - faz sentido. 