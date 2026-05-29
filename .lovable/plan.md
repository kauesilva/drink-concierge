## Mudanças

### 1) "Freelancer em Bar" só em pacotes de mão de obra

**`src/pages/partner/PartnerPackagesPage.tsx`** (loop de `eventTypes`, linha ~645)
- Filtrar a lista renderizada: se `form.serviceCategory !== 'mao-de-obra'`, ocultar a opção `freelancer-bar`.
- Ao trocar a categoria para algo diferente de `mao-de-obra`, remover automaticamente `'freelancer-bar'` de `form.eventTypes` (limpeza no `onValueChange` do select de categoria, ~linha 466), para não persistir um valor inválido em pacotes de serviço completo / consultoria.

### 2) Opção "A combinar" no preço por pessoa

Convenção: armazenar `pricePerPerson = 0` como "A combinar" (sem mudança de schema). Um checkbox no formulário controla o modo.

**`src/pages/partner/PartnerPackagesPage.tsx`**
- Adicionar estado local `priceOnRequest: boolean` derivado/sincronizado com `form.pricePerPerson === 0` ao abrir/editar.
- No bloco de preços (não-mão-de-obra, linhas ~590-600), adicionar checkbox "Preço a combinar". Quando marcado: ocultar/desabilitar o input "Preço/pessoa" e setar `pricePerPerson = 0`.
- Ajustar a validação (~linha 195): se `priceOnRequest`, pular a checagem `pricePerPerson <= 0`.
- No card de listagem do parceiro (~linha 332), exibir "A combinar" quando `pricePerPerson` for 0/nulo, em vez de "R$ 0/pessoa".

**Exibição pública** (mesma convenção)
- `src/components/menus/MenuCard.tsx`: mostrar "A combinar" no rodapé do card quando `menu.pricePerPerson` for 0.
- `src/components/menus/PackageResultCard.tsx`: idem no bloco "A partir de".
- `src/pages/MenuDetailPage.tsx` e `src/pages/CompanyDetailPage.tsx`: substituir a renderização de `R$ X/pessoa` por "A combinar" quando o valor for 0. (Verificar os pontos exatos antes de editar.)

### Não muda
- Schema do banco, API PHP e tipos (`Menu.pricePerPerson` continua `number`).
- Lógica de pacotes de mão de obra (`hourlyRate` etc.) permanece igual.
- Briefing/matching: pacotes "A combinar" continuam aparecendo nos resultados normalmente; só o rótulo de preço muda.
