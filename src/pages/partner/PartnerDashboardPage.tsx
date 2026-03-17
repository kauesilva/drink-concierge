import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PartnerSidebar } from '@/components/partner/PartnerSidebar';
import { usePartnerStore } from '@/store/partnerStore';

const PartnerDashboardPage = () => {
  const { isRegistered } = usePartnerStore();

  if (!isRegistered) {
    return <Navigate to="/parceiro/cadastro" replace />;
  }

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
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PartnerDashboardPage;
