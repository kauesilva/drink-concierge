## Header em branco sobre amarelo

Inverter o esquema do header para **tudo branco** sobre o fundo amarelo, com hover branco nos links e botões.

### Mudanças em `src/components/layout/Header.tsx`

**Logo:**
- Quadrado do ícone: `bg-primary-foreground` (preto) → `bg-white`. `Wine` permanece `text-primary` (amarelo) dentro do quadrado branco.
- Texto: "Meu Bartender Pro" → **"Meu Bartender"**, cor trocada de `text-foreground` para `text-white`.

**Links de navegação (desktop):**
- Estado ativo: `text-foreground` → `text-white`.
- Estado inativo: `text-foreground/70 hover:text-foreground` → `text-foreground/70 hover:text-white`.
- Aplica a: Início, Orçamento, Encontre seu Bartender, Como funciona, Painel.

**Saudação "Olá, {nome}":**
- `text-foreground/80` → `text-white/90`.

**Botões desktop (Entrar / Sair / Cadastre-se):**
- Hoje os outline têm `hover:bg-foreground hover:text-primary` (hover preto). Inverter para hover branco:
  - "Entrar" e "Sair": `variant="outline"` + `className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"`.
  - "Cadastre-se": trocar `variant="default"` (preto) por outline branco com **fill no hover** — `className="border-white/60 bg-transparent text-white hover:bg-white hover:text-primary"` mantendo `variant="outline"`. Assim ambos priorizam o efeito branco.

**Botão hambúrguer mobile:**
- `text-foreground hover:bg-foreground/10` → `text-white hover:bg-white/15`.

**Menu mobile (drawer):**
- Borda divisória: `border-foreground/10` → `border-white/15`.
- Links: `text-foreground hover:bg-foreground/10` → `text-white hover:bg-white/15`.
- Botões "Entrar/Sair/Cadastre-se" do drawer: mesmas trocas do desktop (outline branco com hover preenchendo de branco).

### Por que assim
- Branco sobre amarelo cria contraste suave e premium (estilo marcas como Snapchat/Postmates).
- Hover preenchendo de branco com texto amarelo reforça a identidade da marca em cada interação, sem usar preto.
- Apenas tokens (`primary`, `primary-foreground`) e `white` (utilitário Tailwind padrão) — sem cores hardcoded fora do sistema.

### Arquivos afetados
- `src/components/layout/Header.tsx` (único).