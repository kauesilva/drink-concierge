# Foto de capa do pacote no catálogo de resultados

## Problema
No modo "Pacotes" da página de resultados (`/resultados`), o card `PackageResultCard` está usando a foto da **empresa** (`company.image`) como fallback quando o pacote não tem `coverImage`. O usuário quer que a foto de capa exibida seja **sempre a do pacote**, nunca da empresa.

## Solução

### 1. `src/components/menus/PackageResultCard.tsx`
- Alterar `const cover = menu.coverImage || company.image;` para `const cover = menu.coverImage;`
- Quando `menu.coverImage` não existir, o card deve mostrar um placeholder neutro de pacote (gradiente/cor sólida) ao invés da imagem da empresa.
- A **imagem da empresa** deve continuar aparecendo apenas como **logo redondo** no overlay inferior do card (já está assim).

### 2. `src/hooks/useCompanies.ts` (verificação)
- Confirmar que `mapPackageToMenu` mapeia `p.foto_capa` corretamente para `coverImage` (já faz isso, mas verificar se não há edge cases).

### 3. Sem mudanças de backend
O campo `foto_capa` já é enviado/recebido pela API. Apenas a apresentação no frontend precisa ser ajustada.

## Resultado esperado
- Cada card no catálogo de pacotes mostra a foto de capa do próprio pacote.
- Se o pacote não tiver foto de capa cadastrada, exibe um fundo neutro (sem logo da empresa).
- A identidade visual da empresa (logo + nome + nota) permanece no overlay inferior, como está hoje.
