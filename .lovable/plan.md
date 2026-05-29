# Ajuste da imagem de capa no painel do parceiro

Hoje a capa é exibida com `object-cover` em altura fixa (`h-48` no editor, banner no perfil público). Dependendo do recorte da foto enviada, o assunto principal pode ficar fora do enquadramento. A solução é permitir que o parceiro escolha **qual parte da imagem fica centralizada** (focal point), sem precisar reenviar/recortar fora da plataforma.

## O que será entregue

1. **Controle visual de posicionamento na edição da capa** (`PartnerProfilePage.tsx`)
   - Após o upload, aparece um botão "Ajustar enquadramento".
   - Modal/painel inline mostra a capa no mesmo formato exibido publicamente (mesma proporção do banner).
   - Um marcador arrastável (ou dois sliders Horizontal/Vertical 0–100%) define o ponto focal.
   - Preview atualiza em tempo real usando `object-position: X% Y%`.
   - Botões: "Centralizar" (reset 50/50) e "Salvar".

2. **Persistência do ponto focal**
   - Novo campo no perfil: `coverPosition: string` (ex.: `"50% 30%"`), default `"50% 50%"`.
   - Adicionado em `PartnerProfile` (`src/store/partnerStore.ts`) e enviado em `syncProfile` como `foto_capa_posicao`.
   - Carregado em `loadFromApi`.

3. **Aplicação no display**
   - `PartnerProfilePage.tsx` (preview do editor): aplica `style={{ objectPosition: form.coverPosition }}` na `<img>` da capa.
   - `PartnerPublicProfilePage.tsx`: mesmo `objectPosition` no banner público.
   - Fallback `"50% 50%"` quando o campo estiver vazio (comportamento atual preservado).

## Detalhes técnicos

- Componente novo: `src/components/partners/CoverPositionEditor.tsx` — recebe `imageUrl`, `value`, `onChange`; renderiza a imagem em um container com a mesma `aspect-ratio` do banner público e um handle posicionável (mouse + touch). Sem libs novas.
- O salvamento usa o fluxo existente (`updateProfile` + `syncProfile`) — nenhuma nova rota de API no frontend.
- **Backend (fora do frontend, apenas nota):** a tabela `parceiros` precisa de uma coluna `foto_capa_posicao VARCHAR(16) DEFAULT '50% 50%'` e o endpoint `apiUpdateProfile` deve aceitar/retornar esse campo. Sem isso, o ajuste funciona localmente mas não persiste no servidor.

## Fora de escopo

- Crop/redimensionamento real da imagem (continuamos servindo o arquivo original).
- Zoom da capa.
- Ajuste de posicionamento da logo (somente capa, conforme pedido).
