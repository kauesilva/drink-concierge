## Cabeçalho com fundo amarelo

Trocar o header (`src/components/layout/Header.tsx`) de fundo translúcido branco para **dourado sólido** (cor `primary`), ajustando textos e botões para manter contraste e legibilidade sobre o amarelo.

### Mudanças em `src/components/layout/Header.tsx`

**Barra:**
- `bg-background/60 backdrop-blur-xl border-b border-border/40` → `bg-primary border-b border-primary-foreground/10`
- Remover blur (não faz sentido em fundo sólido).

**Logo:**
- Quadrado do ícone: hoje `bg-primary` com ícone `text-primary-foreground`. Invertido para `bg-primary-foreground` (preto) com `Wine` em `text-primary` (amarelo) — destaca sobre o amarelo.
- Texto "Meu Bartender Pro": mantém `text-foreground` (preto), já contrasta bem.

**Links de navegação (desktop + mobile):**
- Ativo: `text-foreground` (preto sólido).
- Inativo: `text-muted-foreground` → `text-foreground/70`, hover `text-foreground`.

**Saudação "Olá, {nome}":**
- `text-muted-foreground` → `text-foreground/80`.

**Botões (desktop):**
- "Entrar" / "Sair" (variant `outline`): trocar por `variant="outline"` com classe extra para borda preta sobre amarelo — `className="border-foreground/30 hover:bg-foreground hover:text-primary"`.
- "Cadastre-se" (hoje `variant="gold"`): em fundo amarelo o botão dourado some. Trocar para `variant="default"` (preto sobre amarelo — alto contraste, vira o CTA principal).

**Botões mobile (drawer):**
- Mesmas trocas: outline com borda escura, e CTA principal `default` (preto).
- Drawer abre como `motion.div` filho — herda fundo amarelo automaticamente. Borda divisória: `border-border/40` → `border-foreground/10`.
- Links do menu mobile: `hover:bg-secondary` → `hover:bg-foreground/10` para um hover sutil sobre amarelo.

**Botão hambúrguer mobile:**
- `text-foreground hover:bg-secondary` → `text-foreground hover:bg-foreground/10`.

### Por que assim
- Fundo `primary` (amarelo) + texto/CTA `foreground` (preto) = combinação já validada no design system (é a base do botão `gold`).
- O CTA principal vira preto sólido (inversão do padrão atual), o que **destaca mais** sobre o amarelo do que outro dourado.
- Nenhuma cor hardcoded — tudo via tokens (`primary`, `foreground`, `primary-foreground`).

### Arquivos afetados
- `src/components/layout/Header.tsx` (único).

Sem mudanças no `index.css`, tokens ou outras páginas. O hero da home (que tem blurs `bg-primary/10`) continua funcionando — o header sólido amarelo cria uma transição natural para o conteúdo abaixo.