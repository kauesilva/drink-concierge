import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuotePage from "./pages/QuotePage";
import ResultsPage from "./pages/ResultsPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import MenuDetailPage from "./pages/MenuDetailPage";
import PricingPage from "./pages/PricingPage";
import SchedulingPage from "./pages/SchedulingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orcamento" element={<QuotePage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/empresas/:companyId" element={<CompanyDetailPage />} />
          <Route path="/empresas/:companyId/cardapios/:menuId" element={<MenuDetailPage />} />
          <Route path="/empresas/:companyId/cardapios/:menuId/valores" element={<PricingPage />} />
          <Route path="/agendamento" element={<SchedulingPage />} />
          <Route path="/confirmacao" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
