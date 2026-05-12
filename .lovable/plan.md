# Novo `api.php` (vitrine de parceiros)

Vou gerar um arquivo `/mnt/documents/api_v2.php` baseado no atual `api.php` (811 linhas), preservando 100% dos handlers existentes e adicionando o necessário para o módulo "Encontre seu Bartender".

## Migration SQL (entregue junto, em arquivo separado)

```sql
ALTER TABLE parceiros
  ADD COLUMN titulo_perfil      VARCHAR(150) NULL,
  ADD COLUMN descricao_curta    VARCHAR(300) NULL,
  ADD COLUMN logo               VARCHAR(255) NULL,
  ADD COLUMN galeria            JSON NULL,
  ADD COLUMN video_url          VARCHAR(500) NULL,
  ADD COLUMN diferenciais       JSON NULL,
  ADD COLUMN instagram          VARCHAR(255) NULL,
  ADD COLUMN facebook           VARCHAR(255) NULL,
  ADD COLUMN tiktok             VARCHAR(255) NULL,
  ADD COLUMN site               VARCHAR(255) NULL,
  ADD COLUMN telefone_publico   TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN publicado          TINYINT(1) NOT NULL DEFAULT 0;
```

## Mudanças no `api.php`

### 1. Roteamento — novas actions
```
list_public_partners → handleListPublicPartners
get_public_partner   → handleGetPublicPartner
```

### 2. `handleUpdateProfile` — estender lista de campos permitidos
Adicionar a `$allowed`:
`titulo_perfil`, `descricao_curta`, `logo`, `video_url`, `instagram`, `facebook`, `tiktok`, `site` (string) e `telefone_publico` (int 0/1).

Adicionar tratamento JSON (igual `categorias_servico`) para:
- `galeria` (array de até 5 URLs — slice de segurança)
- `diferenciais` (array de strings)

Após salvar, recalcular flag `publicado` via helper `isPartnerPublishable($pdo, $id)` (nome + ≥1 categoria + estado + cidade_base + descricao_curta + ≥1 imagem entre `foto_capa`/`logo`/`galeria`) e atualizar coluna `publicado`.

### 3. `handleGetProfile` — incluir os novos campos
Decodificar `galeria` e `diferenciais` via `decodeJsonField`. Casts booleanos para `telefone_publico` e `publicado`.

### 4. `handleListPublicPartners` (novo)
- `SELECT * FROM parceiros WHERE ativo=1 AND publicado=1`
- Filtros opcionais: `?estado=`, `?cidade=` (match em `cidade_base` ou em `parceiro_areas.area`), `?categoria=` (busca em `categorias_servico` JSON via `JSON_CONTAINS`)
- Carrega `areas_atendidas`, `categorias_servico`, `galeria`, `diferenciais`
- Retorna apenas campos públicos (omite `email`, `whatsapp` quando `telefone_publico=0`)
- Ordena por `avaliacao DESC, atualizado_em DESC`

### 5. `handleGetPublicPartner` (novo)
- `?id=` obrigatório
- Mesma lógica de filtragem de campos sensíveis baseado em `telefone_publico`
- 404 se não publicado / não ativo

### 6. Helper novo
```php
function isPartnerPublishable(PDO $pdo, int $id): bool
function stripPrivateFields(array $p): array  // remove email/whatsapp se telefone_publico=0
```

### 7. Comentário de cabeçalho
Adicionar as 2 novas actions à lista de endpoints no docblock.

## Entregáveis

- `/mnt/documents/api_v2.php` — arquivo PHP completo, pronto para substituir o atual
- `/mnt/documents/migration_vitrine.sql` — ALTER TABLE acima

Nada do PHP existente será removido ou renomeado; apenas extensões aditivas.
