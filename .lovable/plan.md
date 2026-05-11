## Bug

No `PartnerProfilePage.tsx` (linhas ~148-154), o `StateCitySelect` dispara dois callbacks ao trocar o estado:
1. `onStateChange(uf)` → `setForm({ ...form, state: uf })`
2. `onCityChange('')` → `setForm({ ...form, cityBase: '' })`

Como ambos usam o mesmo snapshot `form` (closure), o segundo `setForm` sobrescreve a mudança do estado. Resultado: `form.state` nunca é atualizado e o dropdown de cidade fica vazio (pois `getCitiesByUF('')` retorna `[]`).

O mesmo padrão pode existir em outros consumidores do `StateCitySelect` (ex.: `QuotePage` step 4, formulário de cobertura do `PartnerPackagesPage`).

## Correção

**Opção escolhida:** consertar o `StateCitySelect` para que apenas dispare `onStateChange(uf)`. A lógica de limpar a cidade fica dentro do próprio componente (chamando `onCityChange('')` apenas quando necessário, em um `useEffect` ou diretamente via uma única chamada que o pai trate). Melhor ainda: emitir as duas mudanças via callbacks que o pai possa combinar — mas como mexer em todos os pais é mais frágil, padronizar nos pais o uso de `setForm(prev => ...)` é a solução mais segura.

### Mudanças

1. `src/pages/partner/PartnerProfilePage.tsx`
   - Trocar `setForm({ ...form, state: uf })` por `setForm(prev => ({ ...prev, state: uf }))`.
   - Trocar `setForm({ ...form, cityBase: c })` por versão funcional.

2. `src/pages/QuotePage.tsx` (Step 4)
   - Mesmo ajuste para o `StateCitySelect` do briefing (usar updater funcional do estado).

3. `src/pages/partner/PartnerPackagesPage.tsx`
   - No editor de cobertura, garantir que o handler de troca de estado/cidade use updater funcional (`setCoverageDraft(prev => ...)`) para não perder a mudança de UF.

4. (Defensivo) `src/components/shared/StateCitySelect.tsx`
   - Remover a chamada extra `onCityChange('')` dentro do `onValueChange` do estado e mover para um `useEffect` que limpe a cidade quando `state` muda e a cidade atual não pertence mais à lista. Assim o componente fica seguro mesmo se o pai usar `setState` não-funcional.

## Verificação

Após editar: abrir `/parceiro/perfil`, selecionar um estado, confirmar que o dropdown de cidades preenche. Repetir no QuotePage e no editor de pacotes.
