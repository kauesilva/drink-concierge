# Foto de capa e galeria por pacote

Adicionar ao cadastro/edição de pacote no painel do parceiro:
- 1 foto de capa (exibida ao fundo do card do pacote)
- até 5 fotos de galeria (exemplos do serviço)

## Frontend

**`src/store/partnerStore.ts`**
- Adicionar em `DrinkPackage`: `coverImage?: string` e `gallery?: string[]`.
- Incluir esses campos em `addPackage`, `updatePackage` e no mapeamento de `syncPackages` (de/para `foto_capa` e `galeria`).

**`src/services/api.ts`**
- Em `apiAddPackage` e `apiUpdatePackage`: incluir `foto_capa?: string` e `galeria?: string[]`.
- Em `ApiPacote`: adicionar `foto_capa: string | null` e `galeria: string[]`.

**`src/pages/partner/PartnerPackagesPage.tsx`**
- Estender `emptyPkg` com `coverImage: ''` e `gallery: []`.
- Em `openEdit`, carregar esses campos.
- No diálogo, adicionar duas seções (logo após “Descrição”):
  - **Foto de capa**: usa um uploader simples (botão + preview + remover), reutilizando `apiUploadImage` do `services/api.ts`.
  - **Galeria (até 5 fotos)**: reutilizar `src/components/partners/GalleryUploader.tsx` (já existe, suporta `max`).
- No card do pacote: se `pkg.coverImage` existir, exibir como background com overlay escuro para legibilidade do texto; caso contrário manter visual atual.
- (Opcional, pequeno) mostrar miniatura da galeria no card se houver imagens.

## Backend (gerar arquivos ao final)

**SQL (`pacotes_fotos.sql`)**
```sql
ALTER TABLE pacotes
  ADD COLUMN foto_capa VARCHAR(500) NULL,
  ADD COLUMN galeria TEXT NULL; -- JSON array de URLs
```

**`api_v2.php`**
- Em `add_package` e `update_package`: aceitar `foto_capa` (string) e `galeria` (array → `json_encode`).
- Em `get_packages` / leitura: retornar `foto_capa` e `galeria` (com `json_decode` → array; default `[]`).

## Validações
- Limite client-side: galeria ≤ 5.
- Apenas `image/*` no upload (já no `GalleryUploader` e replicado no uploader de capa).
- Campos opcionais — não bloqueiam o salvamento do pacote.

## Entregáveis ao final da implementação
- Código atualizado nos arquivos acima.
- `pacotes_fotos.sql` para o usuário rodar no MySQL.
- `api_v2.php` atualizado para download.
