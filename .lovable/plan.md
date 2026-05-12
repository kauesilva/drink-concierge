
# Vitrine de Parceiros + Perfil Público + Painel Expandido

Transformar o perfil do parceiro em uma vitrine comercial dentro da plataforma, com nova página pública, página de detalhe profissional e edição completa no painel.

## 1. Modelo de dados (PHP/MySQL)

Adicionar novos campos em `parceiros` (via `api.php`/SQL no servidor):

- `titulo_perfil` VARCHAR(150) — título de apresentação
- `descricao_curta` VARCHAR(300)
- `logo` VARCHAR(255) — URL do logo/imagem principal
- `galeria` JSON — array de até 5 URLs
- `video_url` VARCHAR(500) — link de 1 vídeo (YouTube/Vimeo/MP4)
- `diferenciais` JSON — array de strings
- `instagram`, `facebook`, `tiktok`, `site` VARCHAR(255)
- `telefone_publico` TINYINT(1) — se permite exibir contato
- `publicado` TINYINT(1) — calculado/flag de visibilidade

Novas actions no `api.php`:

- `list_public_partners` — retorna apenas parceiros com perfil mínimo completo (nome, ao menos 1 categoria, cidade/estado, descrição curta, ao menos 1 foto — capa ou galeria)
- `get_public_partner` — devolve o perfil público (sem email/whatsapp se `telefone_publico=0`)
- `update_profile` estendido para os novos campos

> Observação: o usuário precisa criar/ajustar essas colunas e actions no backend PHP. O frontend será preparado para consumir esses campos.

## 2. Frontend — Tipos e API client

`src/types/index.ts`: estender `PartnerProfile` (e tipos relacionados) com:
`title`, `shortDescription`, `logo`, `gallery: string[]`, `videoUrl`, `differentials: string[]`, `socials: { instagram?, facebook?, tiktok?, site? }`, `showContact: boolean`.

`src/services/api.ts`:
- `apiListPublicPartners(filters?)` → `list_public_partners`
- `apiGetPublicPartner(id)` → `get_public_partner`
- Estender `apiUpdateProfile` com os novos campos.

`src/store/partnerStore.ts`: incluir os novos campos em `defaultProfile`, `loadFromApi` e `syncProfile`.

## 3. Nova rota e item no menu

- Adicionar rota `/parceiros` → `PartnersDirectoryPage` em `src/App.tsx`.
- Adicionar rota `/parceiros/:id` → `PartnerPublicProfilePage`.
- Em `src/components/layout/Header.tsx`: incluir item **"Encontre seu Bartender"** no nav desktop e mobile, entre "Orçamento" e "Como funciona".

## 4. Página `Encontre seu Bartender` (`src/pages/PartnersDirectoryPage.tsx`)

- Hero curto + filtros: estado/cidade (`StateCitySelect`), categoria de serviço (mão de obra / serviço completo / consultoria).
- Grid responsivo de cards (2 col mobile / 3-4 col desktop), cada card com: logo ou foto principal, nome, badges de categorias, cidade/estado, descrição curta, botão **Ver perfil** → `/parceiros/:id`.
- Empty state quando não houver parceiros com perfil completo.
- Componente reutilizável `PartnerCard` em `src/components/partners/PartnerCard.tsx`.

## 5. Página pública do perfil (`src/pages/PartnerPublicProfilePage.tsx`)

Layout em seções:

```text
[ Capa + logo + nome + título + cidade ]
[ Botões: Solicitar orçamento  |  WhatsApp (se showContact) ]
[ Sobre / descrição completa ]
[ Diferenciais (lista com ícones) ]
[ Galeria (grid até 5 fotos, lightbox simples) ]
[ Vídeo de apresentação (embed YouTube/Vimeo ou <video>) ]
[ Tipos de serviço + Regiões atendidas ]
[ Redes sociais + contato (se permitido) ]
```

- "Solicitar orçamento" leva a `/orcamento` pré-preenchendo a categoria do parceiro (via querystring/quoteStore).
- Animações sutis com framer-motion; respeitar tokens do design system.

## 6. Painel do parceiro — `Meu Perfil` expandido

Reescrever `src/pages/partner/PartnerProfilePage.tsx` em seções (ou tabs):

1. **Identidade**: logo (upload via `apiUploadImage`), nome da empresa, título do perfil, descrição curta, descrição completa.
2. **Serviços e atendimento**: categorias (já existe), estado/cidade base, áreas atendidas.
3. **Mídia**: foto de capa (já existe), galeria com até 5 fotos (upload, reorder simples, remover), 1 vídeo (URL).
4. **Diferenciais**: lista editável (input + chips, mesmo padrão das áreas).
5. **Contato e redes**: WhatsApp, email, Instagram, Facebook, TikTok, site, switch "Exibir contato no perfil público".
6. **Status de publicação**: card com checklist do mínimo necessário; se incompleto, exibir aviso amarelo:
   *"Complete seu perfil para aparecer na vitrine pública da plataforma."*
   Listar quais campos estão faltando.

Manter botão único **Salvar Perfil** que dispara `syncProfile` com todos os campos.

## 7. Regra de publicação

Helper `isPartnerPublishable(profile)` em `src/lib/partners.ts` validando:
nome, ≥1 categoria, estado+cidade base, descrição curta, ≥1 imagem (capa ou galeria).

- Backend filtra em `list_public_partners`.
- Frontend usa o mesmo helper para o aviso no painel e para esconder/ocultar botões.

## 8. Detalhes técnicos

- Uploads continuam via `apiUploadImage` (endpoint já existente em `bartenderstore.com.br/servicos/uploads.php`).
- Galeria: array de URLs salvas no perfil; UI permite adicionar até 5 e remover.
- Vídeo: aceitar URL YouTube/Vimeo; helper para extrair embed; fallback `<video src>` se for `.mp4`.
- Sem mudanças em autenticação, pagamentos ou lógica de matching existente.
- Manter design minimalista premium (Space Grotesk display, Inter body, CTA dourado).

## 9. Arquivos a criar/editar

Novos:
- `src/pages/PartnersDirectoryPage.tsx`
- `src/pages/PartnerPublicProfilePage.tsx`
- `src/components/partners/PartnerCard.tsx`
- `src/components/partners/GalleryUploader.tsx`
- `src/components/partners/VideoEmbed.tsx`
- `src/lib/partners.ts`

Editados:
- `src/App.tsx` (rotas)
- `src/components/layout/Header.tsx` (novo link)
- `src/types/index.ts`
- `src/services/api.ts`
- `src/store/partnerStore.ts`
- `src/pages/partner/PartnerProfilePage.tsx`

Backend (você precisa aplicar no servidor PHP/MySQL):
- Migration adicionando colunas em `parceiros`
- Novas actions `list_public_partners` e `get_public_partner` em `api.php`
- Extensão da action `update_profile`
