## Dividir a primeira dobra da home em duas

Hoje o hero acumula tudo numa tela só (badge + título rotativo + subtítulo + 2 CTAs + selos de confiança) sobre imagem rotativa. Fica pesado de ler e dilui a foto. Vamos separar em duas dobras com hierarquia clara.

### Dobra 1 — Hero cinematográfico (apenas imagem + slogan)

Foco total no impacto visual. Quase nada compete com a foto.

- **Banner rotativo full-bleed** (mantém as 5 imagens e o sync com `RotatingHeadline`).
- **Overlay mais leve** que o atual: gradiente de baixo para cima `from-background/70 via-background/20 to-transparent` (escurece só a base onde fica o texto, libera o resto da foto).
- **Conteúdo central, minimalista:**
  - H1 com o `RotatingHeadline` + linha "em poucos cliques" em dourado (igual hoje).
  - Nada mais acima ou abaixo — sem badge, sem subtítulo, sem CTAs nessa dobra.
- **Indicador de scroll discreto** no rodapé da dobra (chevron animado + texto micro "role para ver mais") — sinaliza que tem continuação e melhora conversão.
- **Bullets de progresso** dos 5 banners (linha de 5 traços finos no canto inferior, o ativo em dourado) — referência visual elegante tipo Apple/Linear.
- Altura: `min-h-[100vh]` (mantém).

### Dobra 2 — Proposta de valor + CTA (legibilidade plena)

Fundo limpo (sem foto), tipografia respira, CTA principal em destaque. É aqui que a conversão acontece.

- **Fundo:** `bg-background` com um brilho dourado sutil no topo (`bg-primary/5` blur) para amarrar com a dobra anterior.
- **Layout centralizado, max-w-3xl:**
  1. Badge "Marketplace de drinks para eventos" (movida da dobra 1).
  2. Subtítulo grande e respirado: "Compare empresas de coquetelaria, veja cardápios e valores. Solicite contratação sem complicação para qualquer tipo de evento."
  3. Dois CTAs lado a lado: **"Receber orçamento grátis"** (gold, xl) + **"Como funciona"** (outline, xl).
  4. Trust signals (100% gratuito · Sem compromisso · Empresas verificadas) em linha discreta abaixo.
- **Animação de entrada:** stagger fadeInUp ao entrar no viewport (já temos o helper).
- Padding generoso: `py-20 md:py-28`.

### Por que essa divisão melhora conversão

- **Dobra 1** vira hero emocional puro — a foto vende a fantasia do evento, o slogan ancora a mensagem.
- **Dobra 2** vira pitch racional limpo — sem competir com imagem, o usuário lê com calma e o botão dourado vira o único ponto de tensão visual → clique.
- O indicador de scroll evita que a dobra 1 pareça "estática demais" (risco quando se tira CTA do hero).

### Arquivo afetado

- `src/pages/Index.tsx` — reestruturar a `<section>` do hero atual em duas sections consecutivas. Manter `HERO_IMAGES`, `RotatingHeadline`, `heroIndex` state, preload de próxima imagem. Mover badge/subtítulo/CTAs/trust signals para a nova section.

Sem mudanças em outros arquivos, sem mudanças de business logic.
