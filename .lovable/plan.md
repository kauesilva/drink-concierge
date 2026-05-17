# Stats band com imagem de fundo cinematográfica

Transformar a faixa "500+ eventos / 98% / 50+ empresas" em uma seção imersiva com a foto do bartender de fundo, overlay escuro e tipografia em branco com destaque dourado.

## Visual

- Imagem `WhatsApp_Image_2026-05-16_at_22.05.42.jpeg` salva em `src/assets/stats-bartender.jpg` e importada como ES6.
- `bg-fixed` (parallax sutil) em desktop, fallback estático no mobile.
- Camadas de overlay (de baixo para cima):
  1. `bg-black/65` base — garante leitura dos números em qualquer parte da foto.
  2. Gradiente vertical `from-background/90 via-black/55 to-background/90` — costura a seção com o restante da página (sem "caixote" duro nas bordas).
  3. Gradiente radial centralizado com leve halo dourado (`hsl(var(--primary)/0.1)`) atrás dos números para realçar o conteúdo sem lavar a imagem.
- Borda superior/inferior trocadas por `border-primary/15` no lugar de `border-border` para manter unidade premium.

## Conteúdo

- Padding generoso: `py-20 md:py-28`.
- Eyebrow novo acima dos números: `Resultados que falam por si` (uppercase, dourado, tracking-wider).
- Números:
  - `text-white` (override pontual — semanticamente OK aqui pois é hero sobre imagem).
  - Tamanho aumentado para `text-4xl md:text-6xl`, Space Grotesk bold.
  - Linha dourada fina (`h-px w-8 bg-primary mx-auto`) entre número e label.
- Labels em `text-white/75`, mantendo Inter.
- Stagger animation já existente preservado; adicionar leve `scale: 0.96 → 1` para entrada mais cinemática.
- Divisores verticais sutis entre as 3 colunas em desktop (`md:divide-x md:divide-white/10`).

## Mudanças por arquivo

**`src/assets/stats-bartender.jpg`** (novo) — copy do upload do usuário.

**`src/pages/Index.tsx`**
- Import da imagem nova.
- Substituir o bloco `<section>` das linhas 243–263 por nova versão com `relative`, `<img>` absoluta de fundo (com `loading="lazy"`, `object-cover`, `object-center`), camadas de overlay e o grid de stats redesenhado conforme acima.

## Fora do escopo
- Nenhuma mudança nos valores das estatísticas, na ordem das seções ou em outras áreas da home.
- Sem alteração no design system / tokens globais.
