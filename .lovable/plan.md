## Unificar hero em uma única dobra (sem imagens de fundo)

A divisão em duas dobras ficou frouxa e o banner rotativo polui a leitura. Vamos voltar a ter **uma única dobra hero**, direta e prática, sem imagem de fundo nem efeito de troca — mas visualmente forte por conta de tipografia, gradiente dourado e composição.

### O que muda em `src/pages/Index.tsx`

**Remover:**
- Imports de `heroDrinks`, `heroBartender`, `heroConsultor`, `heroCasamento`, `heroNaoAlcoolico` e o array `HERO_IMAGES`.
- State `heroIndex`, `useEffect` de preload, callback `handleHeroIndex`.
- `<AnimatePresence>` com a `motion.div` da imagem de fundo.
- Camada `bg-destructive-foreground`.
- Indicador de progresso dos 5 banners.
- Scroll cue ("Role para ver mais" + `ChevronDown`).
- Import de `ChevronDown` (não usado em mais nenhum lugar).
- A section "Dobra 2 — Proposta de valor + CTA" inteira (linhas 216-269).
- `RotatingHeadline` perde o prop `onIndexChange` (não usado).

**Nova hero unificada** (substitui as duas sections atuais):

```text
<section> min-h-[92vh], bg-background, overflow-hidden, relative
  ├─ Camadas decorativas (sem imagem):
  │   • Radial gold no topo: bg-primary/10 blur-[140px]
  │   • Radial sutil embaixo à direita: bg-primary/5 blur-[100px]
  │   • Grid pattern muito leve (opcional: opacity-[0.03])
  │
  └─ container, max-w-4xl mx-auto text-center, py-20 md:py-28
      1. Badge "Marketplace de drinks para eventos" (pill com bullet pulsante)
      2. H1 — RotatingHeadline + "em poucos cliques" em dourado
         (heading-display, drop-shadow leve)
      3. Subtítulo (text-xl md:text-2xl, text-foreground/80):
         "Compare empresas de coquetelaria, veja cardápios e valores.
          Solicite contratação sem complicação para qualquer tipo de evento."
      4. CTAs lado a lado:
         • "Receber orçamento grátis" (gold, xl) → /orcamento
         • "Como funciona" (outline, xl) → #como-funciona
      5. Trust signals em linha: 100% gratuito · Sem compromisso · Empresas verificadas
```

Animações: stagger `fadeInUp` (badge → h1 → subtítulo → CTAs → trust signals). Sem `AnimatePresence` de imagem.

### Por que funciona

- **Direto e prático:** o usuário vê headline + proposta + CTA na mesma tela, sem precisar rolar.
- **Visualmente chamativo sem foto:** o `RotatingHeadline` já carrega o movimento; gradientes dourados em blur grande criam profundidade premium tipo Linear/Vercel.
- **Foco total no CTA dourado** — sem foto competindo por atenção.

### Arquivos afetados

- `src/pages/Index.tsx` — substituir as duas sections do hero por uma só; limpar imports e state não usados.

Sem mudanças em outros arquivos, sem mudanças de lógica. `RotatingHeadline.tsx` continua funcionando (o prop `onIndexChange` é opcional).
