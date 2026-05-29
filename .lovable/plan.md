## Objetivo

Ao abrir o site, o usuário deve ver o Hero completo + pelo menos 60% da seção "Modalidades" sem rolar (viewport ~638px de altura).

## Diagnóstico

Hoje o Hero (`src/pages/Index.tsx`) usa paddings e tipografia generosos que ocupam praticamente toda a viewport:
- `pt-10 md:pt-14 pb-20 md:pb-28` (até ~112px topo + 112px base)
- `mb-8` no badge, `mb-8` no h1, `mb-12` no parágrafo, `mb-10` nos CTAs
- `text-xl md:text-2xl` no parágrafo
- A seção Modalidades começa com `py-24 md:py-[50px]` e título com `mb-16`

Soma vertical do hero ~600–700px, empurrando Modalidades totalmente para baixo da dobra.

## Mudanças (somente `src/pages/Index.tsx`)

### Hero — reduzir altura vertical
- Container: `pt-10 md:pt-14 pb-20 md:pb-28` → `pt-6 md:pt-8 pb-10 md:pb-12`
- Badge wrapper: `mb-8` → `mb-5`
- H1: `mb-8` → `mb-5`
- Parágrafo: `text-xl md:text-2xl ... mb-12` → `text-base md:text-lg ... mb-7`
- Wrapper dos CTAs: `mb-10` → `mb-6`
- Trust indicators: manter, mas com `gap-y-2`

### Seção Modalidades — encurtar topo
- `py-24 md:py-[50px]` → `py-10 md:py-12`
- Bloco do título: `mb-16` → `mb-8`
- Subtítulo: `text-lg` → `text-base`

### Observações
- Sem mudanças em cores, fontes ou tokens do design system.
- Sem alterar Header, Footer ou outras seções.
- Mantém hierarquia tipográfica (heading-display e heading-section permanecem); o ganho vem de paddings e margens, não de reduzir o H1.

## Resultado esperado

Em viewport ~1006×638 (estado atual do usuário), o Hero passa a caber em ~430–470px, deixando ~170–210px visíveis da seção Modalidades — cobrindo título, subtítulo e o topo dos cards (≥60% da dobra perceptível antes do scroll).
