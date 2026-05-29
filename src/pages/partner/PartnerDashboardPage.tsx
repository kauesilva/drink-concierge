import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PartnerSidebar } from '@/components/partner/PartnerSidebar';
import { useAuthStore } from '@/store/authStore';
import { usePartnerStore } from '@/store/partnerStore';

const PartnerDashboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const profileApiId = usePartnerStore((s) => s.profile.apiId);
  const ativo = usePartnerStore((s) => s.profile.ativo);
  const loadFromApi = usePartnerStore((s) => s.loadFromApi);

  useEffect(() => {
    const parceiroId = user?.parceiro_id;
    if (user?.role === 'parceiro' && parceiroId && profileApiId !== parceiroId) {
      loadFromApi(parceiroId);
    }
  }, [user, profileApiId, loadFromApi]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'parceiro') {
    return <Navigate to="/" replace />;
  }

  const isPending = ativo === 0;
  const isRejected = ativo === 2;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PartnerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/40 px-4 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
            <SidebarTrigger className="mr-3" />
            <span className="text-sm font-medium text-muted-foreground">
              Painel do Parceiro
            </span>
          </header>
          {(isPending || isRejected) && (
            <div
              className={
                isRejected
                  ? 'border-b border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm flex items-start gap-2'
                  : 'border-b border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 px-4 py-3 text-sm flex items-start gap-2'
              }
            >
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">
                  {isRejected ? 'Cadastro não aprovado' : 'Cadastro aguardando aprovação'}
                </p>
                <p className="opacity-90">
                  {isRejected
                    ? 'Seu cadastro foi rejeitado pela equipe. Edite seu perfil e entre em contato com o suporte para uma nova análise.'
                    : 'Você pode editar seu perfil e cadastrar pacotes, mas seu perfil ainda não está visível ao público nem recebe solicitações. Nossa equipe analisará seu cadastro em breve.'}
                </p>
              </div>
            </div>
          )}
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PartnerDashboardPage;
