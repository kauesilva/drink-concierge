# Negociação de pacotes combinados

Quando o cliente soma **2 ou mais pacotes da mesma empresa**, mostramos o valor cheio riscado, um valor de expectativa visual e um botão **"Negociar"** que apenas sinaliza o interesse — a empresa decide o desconto final via WhatsApp.

## Comportamento

- **1 pacote selecionado:** fluxo atual permanece (apenas "Selecionar e agendar").
- **2+ pacotes da mesma empresa:**
  - Em `PricingPage`, o total cheio aparece **riscado** ao lado de um valor "expectativa" (sugestão visual de -10% combo, apenas referência — sem fechar desconto).
  - Aparece um selo "Aberto à negociação · combo de N pacotes".
  - Dois CTAs lado a lado:
    - **Negociar combo** (gold, primário) → vai para `/agendamento` com flag `negotiationRequested = true`.
    - **Selecionar e agendar** (outline) → fluxo normal sem flag.
  - Em `SchedulingPage`, se a flag estiver ativa:
    - Título do bloco muda para "Solicitação de negociação".
    - Texto explicativo: "Você está pedindo uma condição especial para combinar N pacotes. A empresa avaliará e retornará via WhatsApp."
    - Botão final muda para "Enviar pedido de negociação".
    - `observacoes` ganha um cabeçalho `[NEGOCIAÇÃO SOLICITADA - COMBO DE N PACOTES]` antes do resumo atual.
    - `valor_estimado` continua sendo o total cheio (sem inventar desconto no banco).

## Mudanças por arquivo

**`src/store/quoteStore.ts`**
- Adicionar `negotiationRequested: boolean`, setter `setNegotiationRequested(value)` e resetar para `false` em `clearSelection`, `setSelectedMenu` e quando muda de empresa.

**`src/pages/PricingPage.tsx`**
- Calcular `isCombo = selectedMenus.length >= 2`.
- Se combo: renderizar o "Total estimado" com `<span className="line-through text-muted-foreground">` no valor cheio + um valor de expectativa (`Math.round(estimatedTotal * 0.9)`) destacado, com legenda "Expectativa em negociação · valor final definido pela empresa".
- Substituir o botão único por:
  - `Negociar combo` (gold) → `setNegotiationRequested(true)` e navega para `/agendamento`.
  - `Selecionar e agendar` (outline) → `setNegotiationRequested(false)` e navega normalmente.
- Selo informativo acima dos CTAs quando `isCombo`.

**`src/pages/SchedulingPage.tsx`**
- Ler `negotiationRequested` do store.
- Ajustar título do card de resumo, copy explicativa e label do botão conforme flag.
- Prefixar `observacoes` com `[NEGOCIAÇÃO SOLICITADA - COMBO DE N PACOTES]\n` quando ativo.
- Após sucesso, resetar `negotiationRequested`.

**`src/components/menus/QuoteSelectionCard.tsx`**
- Quando `selected.length >= 2`, mostrar um pequeno selo "Combo · aberto a negociação" abaixo do subtotal, para reforçar a expectativa antes da pricing page.

## Fora do escopo
- Nenhuma mudança no backend/MySQL nem nas colunas de `leads` — a sinalização viaja inteira dentro de `observacoes`.
- Não há cálculo real de desconto nem contraproposta automática; o parceiro define tudo via WhatsApp.
- Nenhuma alteração no `MenuDetailPage` ou no fluxo de seleção de pacotes.
