# Banner de fundo dinâmico no hero

## Objetivo
Na primeira dobra da home, exibir uma imagem de fundo (estilo banner) atrás do texto "Meu xxxx em poucos cliques", que troca em sincronia com a palavra atual do `RotatingHeadline`.

## Mapeamento
- `bar de drinks` → `drinks.jpeg`
- `bartender` → `bartender.jpeg`
- `consultor de bar` → `consultor.jpeg`
- `bar de casamento` → `casamento.jpeg`
- `bar não alcoólico` → reutiliza `drinks.jpeg` (não há imagem dedicada — sinalizar caso o usuário queira outra)

## Mudanças

### 1. Copiar uploads para `src/assets/hero/`
- `user-uploads://bartender.jpeg` → `src/assets/hero/bartender.jpg`
- `user-uploads://consultor.jpeg` → `src/assets/hero/consultor.jpg`
- `user-uploads://casamento.jpeg` → `src/assets/hero/casamento.jpg`
- `user-uploads://drinks.jpeg` → `src/assets/hero/drinks.jpg`

### 2. `src/components/RotatingHeadline.tsx`
- Aceitar prop opcional `onIndexChange?: (i: number) => void` para emitir o índice atual.
- Manter o ciclo de 1s.

### 3. `src/pages/Index.tsx`
- Importar as 4 imagens e montar `HERO_IMAGES = ['drinks','bartender','consultor','casamento','drinks']` (mesma ordem das palavras em `RotatingHeadline`).
- Adicionar estado `heroIndex` controlado por callback de `RotatingHeadline`.
- Na `<section>` hero, adicionar um layer absoluto com `AnimatePresence` cruzando a imagem ativa (fade ~600ms), com overlay escuro/gradiente para preservar legibilidade do texto.
- Manter os blobs/glow existentes por cima da imagem mas abaixo do conteúdo.

## Detalhes técnicos
- `framer-motion` já em uso.
- Imagens carregadas com `loading="eager"` apenas a primeira; demais com fetchpriority normal.
- Texto fica em `z-10` sobre a imagem; overlay com `bg-background/70` + gradiente para contraste.

## Fora do escopo
- Trocar a duração da rotação.
- Mudar a lista de palavras.
