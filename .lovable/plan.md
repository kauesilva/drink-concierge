# Teste de ponta a ponta: cadastro de parceiro → consulta de pacotes via briefing

Objetivo: validar fluxo completo no preview, identificar erros (já há um conhecido: `get_partner_leads` retorna "Ação inválida") e mapear correções.

## Erros já detectados pelos logs

1. `**GET get_partner_leads` → 400 "Ação inválida"** (em `/parceiro/leads`). O backend `api.php` não reconhece a action. Precisa ser corrigido no backend OU o frontend deve usar a action correta.
2. **Pacote existente (id 3) sem `cobertura`, `categoria_servico`, `maximo_pessoas`, `tipos_evento**` na resposta de `get_packages`. Significa que o backend ainda não persiste esses campos novos — todo match cairá no fallback (sem categoria → não bate filtro obrigatório de `serviceCategory`, então o pacote some dos resultados).
3. **Parceiro id 12 sem `cidade_base`/`estado`/`categorias_servico**` preenchidos — perfil incompleto.

## Plano de execução do teste

### Fase 1 — Cadastro/Setup do parceiro (browser automation)

1. `navigate_to_sandbox /login`, logar como `empresa2@empresa2.com.br / 123456` (já existente).
2. Ir em `/parceiro/perfil`: preencher cidade base SP/São Paulo, escolher categorias de serviço, salvar. Capturar request `update_profile` (payload + status).
3. Ir em `/parceiro/pacotes`: criar pacote "Teste E2E" com:
  - categoria: serviço completo
  - min 20 / max 100 pessoas
  - cobertura: SP → [São Paulo, Campinas]
  - tipos de evento: casamento, corporativo
  - preço/duração quaisquer
   Capturar request `add_package`.
4. Recarregar `/parceiro/pacotes` → confirmar via `get_packages` se os novos campos voltaram persistidos.

### Fase 2 — Consulta como cliente

5. `navigate_to_sandbox /orcamento`, preencher briefing: serviço completo, casamento, 30 pessoas, São Paulo/SP, data futura.
6. Ir até `/resultados`. Capturar requests `list_companies` + `get_packages` para cada empresa.
7. Verificar se a empresa do parceiro aparece e se o pacote de teste é listado como compatível.
8. Abrir detalhe da empresa, conferir badge "Compatível".

### Fase 3 — Rastreio e diagnóstico

Para cada falha observada, registrar:

- URL/action chamada, payload enviado, resposta do backend.
- Onde no código frontend a falha se origina (ex.: mapper em `useCompanies.mapPackageToMenu`, filtros em `useMatchingPackages`, validações em `PartnerPackagesPage`).
- Causa provável: backend não persiste / frontend envia campo errado / matching descarta indevidamente.

### Fase 4 — Relatório

Entregar tabela com: passo, esperado, obtido, causa raiz, correção sugerida (frontend vs backend `api.php`).

## Hipóteses já formuladas (a confirmar no teste)

- `add_package` provavelmente ignora `cobertura`, `maximo_pessoas`, `categoria_servico`, `tipos_evento` → pacote nunca passa nos filtros obrigatórios de matching → resultados sempre vazios.
- `get_partner_leads` action ausente no backend → painel de leads quebrado.
- `update_profile` pode não persistir `categorias_servico`/`areas_atendidas` estruturado.

## O que NÃO faço neste plano

- Não altero `api.php` (fora do projeto Lovable). Para correções no backend, listo o que precisa mudar mas a aplicação é manual pelo usuário.
- Não mexo em auth, pagamentos ou layout.

## Saída esperada

Relatório em chat com:

1. Lista de bugs confirmados + reprodução.
2. Para cada um: correção no frontend (quando possível) ou gere o arquivo `api.php`completo.
3. Recomendação de próximos passos priorizados.

Aprovando, executo o teste no browser e devolvo o diagnóstico.