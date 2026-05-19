## Objetivo

Adicionar à página `/parceiro/painel/perfil` três novos recursos: **Visualizar perfil** (preview), **Compartilhar** (WhatsApp / Instagram / copiar link) e uma nova seção **Sobre** com campos pessoais opcionais que aparecerão na vitrine pública quando preenchidos.

---

## 1. Botão "Visualizar perfil"

- Botão no topo do `PartnerProfilePage` (ao lado do "Salvar"), ícone `Eye`.
- Abre a rota pública `/parceiros/:id` em nova aba.
- Para permitir visualização mesmo quando o perfil ainda não está publicado:
  - Adicionar suporte a um parâmetro `?preview=1` na rota pública.
  - Quando presente, `PartnerPublicProfilePage` busca os dados via `apiGetPartner` (perfil completo do próprio parceiro autenticado) em vez de `apiGetPublicPartner`, e exibe uma faixa no topo: "Modo pré-visualização — somente você vê esta página".
  - Caso o parceiro ainda não tenha `apiId`, o botão fica desabilitado com tooltip "Salve seu cadastro primeiro".

## 2. Botão "Compartilhar"

- Botão secundário ao lado de "Visualizar perfil", ícone `Share2`.
- Abre um `DropdownMenu` (shadcn) com 3 opções:
  - **WhatsApp** → `https://wa.me/?text=<msg+url>` (encodeURIComponent)
  - **Instagram** → abre `https://www.instagram.com/` em nova aba e copia o link automaticamente (Instagram web não tem deep link de compartilhar) + toast "Link copiado, cole na sua bio ou DM".
  - **Copiar link** → `navigator.clipboard.writeText(url)` + toast de confirmação.
- O link compartilhado é a URL pública: `${window.location.origin}/parceiros/<apiId>`.

## 3. Nova seção "Sobre"

Adicionar um `Card` "Sobre você" no formulário do perfil, **logo abaixo dos dados básicos**, com todos os campos opcionais:

| Campo | Tipo de input |
|---|---|
| Idade | number |
| Sexo | Select: Masculino, Feminino, Não declarar |
| Profissão | text |
| Altura (cm) | number |
| Peso (kg) | number |
| Uniforme | Select: Avental, Roupa social, Freestyle |
| Estilo de coquetelaria | Select: Clássico, Moderno, Molecular, Contemporâneo, Diversificado, Todos, Outros (com campo de texto livre quando "Outros") |

Comportamento:
- Todos os campos opcionais; nenhuma validação obrigatória.
- Exibição no perfil público: nova seção "Sobre" que só aparece se pelo menos 1 campo estiver preenchido; cada item renderizado apenas se houver valor.

---

## Detalhes técnicos

### Frontend

- `src/store/partnerStore.ts`: estender `PartnerProfile` com `about: { age?, gender?, profession?, height?, weight?, uniform?, cocktailStyle?, cocktailStyleOther? }` (renomear o `about` atual de string para `bio` — verificar usos e migrar; alternativa: usar `personalInfo` como chave nova para evitar conflito com o campo `sobre` já existente no DB).
- `src/services/api.ts` (`apiUpdateProfile` e `ApiParceiro`): incluir os novos campos (`idade`, `sexo`, `profissao`, `altura`, `peso`, `uniforme`, `estilo_coquetelaria`, `estilo_coquetelaria_outro`) e propagá-los em `loadFromApi` / `syncProfile`.
- `src/pages/partner/PartnerProfilePage.tsx`: adicionar header com botões Visualizar/Compartilhar + novo `Card` "Sobre você".
- `src/pages/PartnerPublicProfilePage.tsx`:
  - Ler `useSearchParams().get('preview')`.
  - Em modo preview, buscar via `apiGetProfile(apiId)` (autenticado) e exibir banner.
  - Adicionar renderização condicional do bloco "Sobre".

### Backend (PHP / MySQL)

- Migration na tabela `parceiros` adicionando colunas:
  - `idade INT NULL`
  - `sexo ENUM('masculino','feminino','nao_declarar') NULL`
  - `profissao VARCHAR(120) NULL`
  - `altura SMALLINT NULL` (cm)
  - `peso SMALLINT NULL` (kg)
  - `uniforme ENUM('avental','social','freestyle') NULL`
  - `estilo_coquetelaria VARCHAR(40) NULL`
  - `estilo_coquetelaria_outro VARCHAR(120) NULL`
- Atualizar `api.php` nos endpoints `updateProfile`, `getProfile` e `getPublicPartner` para ler/gravar/retornar esses campos.

> Observação: como o backend é PHP/MySQL externo (não Lovable Cloud), as alterações de DB precisam ser aplicadas manualmente pelo usuário/equipe que mantém `api.php`. Posso entregar o SQL + diff sugerido do PHP junto da implementação.

---

## Fora de escopo

- Autenticação por token no modo preview (assume-se que `apiGetProfile` já é chamado autenticado via `authStore`).
- Alterações visuais profundas na página pública além da nova seção "Sobre" e do banner de preview.