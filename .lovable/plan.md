# Unificar pacotes da mesma empresa em um único orçamento

## Objetivo
Hoje o cliente seleciona **um único pacote** de uma empresa e segue para `/valores` → `/agendamento` → lead. Permitir selecionar **vários pacotes da mesma empresa** e enviá-los juntos em um único orçamento (ex.: "Open Bar Premium" + "Bar de café" da mesma casa).

Regra-chave: o "carrinho" é **scoped a uma única empresa**. Se o usuário tentar adicionar um pacote de outra empresa, mostrar confirmação para limpar a seleção atual.

## Mudanças

### 1. `src/store/quoteStore.ts` — múltipla seleção
Substituir `selectedMenuId: string | null` por `selectedMenuIds: string[]`, mantendo `selectedCompanyId` único:
- `addMenuToSelection(companyId, menuId)` — se trocar de empresa, reseta lista.
- `removeMenuFromSelection(menuId)`.
- `clearSelection()`.
- `setSelectedMenu(id)` continua existindo como atalho (substitui a lista por `[id]`) para compatibilidade.

### 2. `src/pages/MenuDetailPage.tsx`
- Trocar o botão único "Ver valores" por:
  - Botão primário **"Adicionar ao orçamento"** (gold) → adiciona à seleção e exibe toast.
  - Botão secundário **"Ver valores e finalizar"** → adiciona (se ainda não estiver) e navega para `/valores`.
- Se o pacote já está na seleção, botão vira **"Remover do orçamento"** (variant outline).
- Logo abaixo, mini-card "Seu orçamento" com:
  - Nome da empresa.
  - Lista de pacotes selecionados (com botão X para remover cada).
  - Total estimado consolidado.
  - Link "Ver valores" → `/empresas/:companyId/cardapios/:firstMenuId/valores`.
- Bloqueio cross-empresa: se `selectedCompanyId` existir e for outra, abrir `AlertDialog` "Trocar de empresa? Os pacotes selecionados serão removidos."

### 3. `src/pages/PricingPage.tsx`
- Ler `selectedMenuIds` do store em vez de apenas `menuId` da rota.
- Renderizar **uma seção "Composição do valor" por pacote** (nome + preço/pessoa × pessoas), além de uma única taxa de deslocamento.
- Total = soma de todos pacotes × pessoas + taxa.
- Manter rota `/empresas/:companyId/cardapios/:menuId/valores` — o `menuId` da URL é só "entrada" e garante que o pacote da URL esteja na seleção.

### 4. `src/pages/SchedulingPage.tsx`
- Renderizar resumo com **lista de pacotes** selecionados (não só um).
- Total consolidado.
- Ao enviar `apiCreateLead`:
  - `pacote_id` = primeiro da lista (compatibilidade com backend atual).
  - `valor_estimado` = soma total.
  - Prefixar `observacoes` com bloco `Pacotes solicitados:` + lista (`- Nome (R$ X/pessoa)`) antes das observações do usuário.
- Sem mudanças no backend.

### 5. Componente novo `src/components/menus/QuoteSelectionCard.tsx`
Card reutilizável que mostra a seleção atual (empresa + pacotes + total + CTA). Usado em `MenuDetailPage`. Pode ser reaproveitado depois em `ResultsPage`.

## Fora do escopo
- Adicionar pacotes a partir do `PackageResultCard` na página de resultados (pode vir depois — o usuário pediu para clicar em "Ver mais detalhes" e cair na página do pacote, fluxo atual).
- Mudanças na API/banco para suportar múltiplos `pacote_id` por lead.
- Selecionar pacotes de empresas diferentes no mesmo orçamento.

## Detalhes técnicos
- `AlertDialog` do shadcn já disponível.
- Toast via `useToast`.
- Persistência via `persist` do Zustand já existente — apenas atualizar a chave migrada (aceitar `selectedMenuId` legado e converter para `[id]` no `onRehydrateStorage` ou em uso, simples ignorar — é orçamento volátil).
