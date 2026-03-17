

## Plano: Painel do Prestador de Serviço (Mock Local)

### Resumo
Criar uma área de cadastro e gestão para empresas/prestadores de serviço, com dados persistidos em localStorage via Zustand. O prestador pode gerenciar seu perfil (foto de capa, texto "sobre", cidade, áreas atendidas) e criar até 4 pacotes de drinks com valores individuais.

### Estrutura de Páginas

```text
/parceiro/cadastro      → Cadastro (nome, email, tipo: empresa/autônomo)
/parceiro/painel        → Dashboard com sidebar
/parceiro/painel/perfil → Editar perfil da empresa (capa, sobre, áreas)
/parceiro/painel/pacotes → CRUD de até 4 pacotes de drinks
```

### Componentes e Arquivos

1. **`src/store/partnerStore.ts`** — Zustand store com persist (localStorage)
   - Dados do perfil: nome, email, tipo, descrição "sobre", foto de capa (base64/URL), cidade, áreas atendidas, whatsapp
   - Array de pacotes (max 4): nome, descrição, includes[], drinks[], duração, preço/pessoa, mínimo pessoas
   - Actions: updateProfile, addPackage, updatePackage, deletePackage

2. **`src/pages/partner/PartnerRegisterPage.tsx`** — Tela de cadastro
   - Formulário simples: nome, email, whatsapp, tipo (empresa/autônomo)
   - Ao enviar, salva no store e redireciona ao painel

3. **`src/pages/partner/PartnerDashboardPage.tsx`** — Layout com sidebar
   - Usa SidebarProvider do shadcn
   - Menu: Meu Perfil, Meus Pacotes
   - Header com nome do prestador

4. **`src/pages/partner/PartnerProfilePage.tsx`** — Edição do perfil
   - Upload de foto de capa (input file → base64 em localStorage)
   - Campos: nome da empresa, texto "sobre" (textarea), cidade base, estado, áreas atendidas (tags), whatsapp, email
   - Preview de como o perfil aparece para o cliente

5. **`src/pages/partner/PartnerPackagesPage.tsx`** — Gestão de pacotes
   - Lista cards dos pacotes existentes (max 4)
   - Botão "Adicionar pacote" (desabilitado se já tem 4)
   - Cada card com botões editar/excluir
   - Dialog/modal para criar/editar pacote com campos: nome, descrição, o que inclui (lista editável), drinks (lista editável), duração, preço por pessoa, mínimo de pessoas

6. **`src/App.tsx`** — Adicionar rotas `/parceiro/*`

7. **`src/components/layout/Header.tsx`** — Adicionar link "Área do Parceiro" na navegação

### Design
- Segue o design system existente (amarelo/preto/branco, Space Grotesk + Inter)
- Sidebar escura com ícones do lucide-react
- Cards premium existentes para os pacotes
- Responsivo mobile-first (sidebar colapsável)

### Integração com Fluxo Público
- Os dados do partnerStore podem ser lidos pelo mockData para exibir empresas cadastradas pelo parceiro na listagem pública (futuro)
- Por enquanto, mantém os dados mock existentes separados

