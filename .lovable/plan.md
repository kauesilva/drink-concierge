## Objetivo

Na vitrine "Encontre seu bartender" (`/parceiros`), ao abrir o perfil público de uma empresa/bartender (`/parceiros/:partnerId`), exibir todos os pacotes disponíveis daquele parceiro, com possibilidade de clicar para ver os detalhes.

## Mudanças

### `src/pages/PartnerPublicProfilePage.tsx`
- Buscar os pacotes do parceiro usando o hook `useCompanyMenus(partnerId)` (já existente, consome `apiGetCompanyPackages`).
- Adicionar uma nova seção "Pacotes disponíveis" na coluna principal (logo após "Sobre" / antes de "Diferenciais"), renderizando os pacotes em grade com o componente `MenuCard` já usado em `CompanyDetailPage`.
- Cada card mantém o CTA "Detalhes" que leva para `/empresas/:companyId/cardapios/:menuId` (rota já existente em `App.tsx`), permitindo ao visitante ver o pacote completo.
- Estados: skeleton/loading discreto enquanto carrega; se não houver pacotes, mostrar mensagem suave ("Este parceiro ainda não publicou pacotes.") em vez de esconder a seção, para reforçar que é uma área de pacotes.
- Sem alterações de backend nem de regras de negócio — apenas UI/consumo de API já disponível.

### Sem mudanças
- Rotas, autenticação, schema, e o fluxo de "Solicitar orçamento" permanecem iguais.
- `CompanyDetailPage` continua existindo e funcionando como hoje (a navegação a partir do MenuCard reusa essa rota para detalhe do pacote).
