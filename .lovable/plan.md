## Resumo

Botão **"Solicitar orçamento"** dentro do perfil de um bartender vira um **formulário rápido** já vinculado àquele parceiro — dispara email direto para o bartender escolhido e grava o lead na plataforma (com `parceiro_id` preenchido).

> O backend atual é **PHP + MySQL externo** (`api_v2.php`), não Lovable Cloud. Por isso entrego o frontend completo + um snippet PHP pronto para você/seu dev colar no backend.

---

## 1. Frontend

### Novo componente `QuickQuoteDialog`
- `src/components/partners/QuickQuoteDialog.tsx`
- Modal (shadcn `Dialog`) acionado pelo botão "Solicitar orçamento" do perfil público.
- Recebe via props: `parceiroId`, `parceiroNome`, `cidadeBase`, `estadoBase`.
- Campos do formulário (mínimo necessário):
  - Nome do cliente
  - WhatsApp
  - Email
  - Tipo de evento (select com mesmas opções do `QuotePage`)
  - Quantidade de pessoas
  - Data do evento
  - Cidade / Estado (pré-preenchidos com a base do parceiro, editáveis)
  - Mensagem opcional
- Validação com `zod` (mesmo padrão do projeto).
- Cabeçalho do modal mostra para qual bartender o pedido vai (ex: *"Solicitar orçamento para João Bartender"*).
- Ao enviar: chama `apiSendQuickQuote(...)`, mostra toast de sucesso e fecha. Em caso de erro, mantém os dados preenchidos.

### Página pública do parceiro
- `src/pages/PartnerPublicProfilePage.tsx`: trocar os dois `<Link to="/orcamento">Solicitar orçamento</Link>` (header e sidebar) pelo trigger do `QuickQuoteDialog`.
- Botão de **WhatsApp** continua igual quando o parceiro tiver `showContact = true`.

### API client
- `src/services/api.ts`: novo método `apiSendQuickQuote({ parceiro_id, nome_cliente, whatsapp, email, tipo_evento, quantidade_pessoas, data_evento, cidade, estado, observacoes? })` → `POST action=send_quick_quote`.

### O fluxo `/orcamento` geral continua existindo
- Quem chega pela home (sem ter escolhido um bartender) ainda usa o formulário completo atual.
- Só o CTA dentro do perfil muda.

---

## 2. Backend (PHP) — snippet entregue como referência

Crio o arquivo `backend-snippets/send-quick-quote.php` dentro do projeto (não roda no Lovable, é só referência) com o endpoint pronto para colar em `api_v2.php`:

```php
// case 'send_quick_quote':
//   1. Lê e valida JSON (parceiro_id, nome_cliente, whatsapp, email,
//      tipo_evento, quantidade_pessoas, data_evento, cidade, estado, observacoes)
//   2. SELECT email, nome_empresa, ativo FROM parceiros WHERE id = ?
//      - se !ativo → 403
//   3. INSERT INTO leads (parceiro_id, tipo_evento, quantidade_pessoas,
//      cidade, estado, data_evento, nome_cliente, whatsapp, email,
//      observacoes, status='novo')
//   4. mail($parceiroEmail, "Novo pedido de orçamento — $nome", $htmlBody, headers)
//   5. retorna { id, message }
```

> Se `mail()` do servidor não for confiável, deixo no mesmo arquivo o stub PHPMailer + SMTP (você só preenche host/usuário/senha).

---

## Arquivos

**Novos**
- `src/components/partners/QuickQuoteDialog.tsx`
- `backend-snippets/send-quick-quote.php` (referência para o backend PHP)

**Alterados**
- `src/pages/PartnerPublicProfilePage.tsx` — CTA vira trigger do dialog
- `src/services/api.ts` — `apiSendQuickQuote`

---

## Fora deste escopo (combinado adiar)

- Painel Master Admin: lista de todos os parceiros, bloquear/liberar bartender, gerenciar usuários admin. Fica para depois.