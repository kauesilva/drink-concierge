## Problema

Na página pública do parceiro (`/parceiros/:partnerId`), a seção "Pacotes disponíveis" usa o componente `MenuCard`, que **não renderiza** o campo `coverImage` (foto de capa do pacote) — mesmo quando o parceiro cadastrou uma no painel logado. Os dados chegam corretamente da API (`apiGetCompanyPackages` → `mapPackageToMenu` preenche `coverImage`), mas o card simplesmente ignora.

## Solução

Adicionar um topo visual com a imagem de capa no `src/components/menus/MenuCard.tsx`, exibido somente quando `menu.coverImage` existir. Quando não houver capa, o card mantém o layout atual (sem espaço vazio), preservando compatibilidade com os outros lugares que usam `MenuCard` (ex.: `CompanyDetailPage`).

### Mudanças

**`src/components/menus/MenuCard.tsx`**
- Inserir, no topo do card, um bloco `<div>` com `aspect-video` (ou altura fixa ~h-40), `rounded-t-2xl`, `overflow-hidden`, exibindo `<img src={menu.coverImage}>` com `object-cover` e hover sutil de zoom.
- Renderizar esse bloco apenas se `menu.coverImage` estiver definido.
- Ajustar o padding do conteúdo interno (envolver o restante em um wrapper com `p-6`) para que a imagem ocupe a borda do card sem padding extra.
- Sem alterações em props, tipos, API ou lógica de negócio.

### Não muda
- `PartnerPublicProfilePage`, hooks, serviços de API e schema continuam iguais.
- Demais usos de `MenuCard` continuam funcionando; pacotes sem capa renderizam exatamente como hoje.
