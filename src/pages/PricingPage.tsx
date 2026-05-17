import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Calendar, MapPin, Users, Clock, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCompanyDetail, useCompanyMenus } from '@/hooks/useCompanies';
import { useQuoteStore } from '@/store/quoteStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TRAVEL_FEE = 150;

const PricingPage = () => {
  const { companyId, menuId } = useParams();
  const navigate = useNavigate();
  const { briefing, selectedCompanyId, selectedMenuIds, addMenuToSelection, setNegotiationRequested } = useQuoteStore();

  const { data: company, isLoading: lc } = useCompanyDetail(companyId);
  const { data: menus, isLoading: lm } = useCompanyMenus(companyId);

  // Garante que o pacote vindo da URL faça parte da seleção
  useEffect(() => {
    if (!companyId || !menuId) return;
    const sameCompany = selectedCompanyId === companyId;
    if (!sameCompany || !selectedMenuIds.includes(menuId)) {
      addMenuToSelection(companyId, menuId);
    }
  }, [companyId, menuId, selectedCompanyId, selectedMenuIds, addMenuToSelection]);

  if (lc || lm) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!company || !menus) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Empresa não encontrada</h1>
          <Button asChild variant="gold">
            <Link to="/resultados">Voltar aos resultados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Usa todos os pacotes selecionados desta empresa; cai no menuId da URL como fallback
  const activeIds = selectedMenuIds.length > 0 && selectedCompanyId === companyId
    ? selectedMenuIds
    : menuId ? [menuId] : [];

  const selectedMenus = menus.filter((m) => activeIds.includes(m.id));

  if (selectedMenus.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Nenhum pacote selecionado</h1>
          <Button asChild variant="gold">
            <Link to="/resultados">Voltar aos resultados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const people = briefing.people || 50;
  const baseTotal = selectedMenus.reduce((acc, m) => acc + m.pricePerPerson * people, 0);
  const estimatedTotal = baseTotal + TRAVEL_FEE;
  const isCombo = selectedMenus.length >= 2;
  const expectationTotal = Math.round(estimatedTotal * 0.9);

  const handleContinue = (negotiate: boolean) => {
    setNegotiationRequested(negotiate && isCombo);
    navigate('/agendamento');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-2xl">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao cardápio
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Valores estimados
            </h1>
            <p className="text-muted-foreground">
              Revise os {selectedMenus.length > 1 ? `${selectedMenus.length} pacotes` : 'valores'} antes de continuar
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-4">Sua seleção</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empresa</span>
                <span className="font-medium text-foreground">{company.name}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground flex-shrink-0">
                  {selectedMenus.length > 1 ? 'Pacotes' : 'Cardápio'}
                </span>
                <div className="text-right">
                  {selectedMenus.map((m) => (
                    <p key={m.id} className="font-medium text-foreground">{m.name}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-premium p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-4">Detalhes do evento</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{people} pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedMenus[0].durationHours}h de serviço</span>
              </div>
              {briefing.eventDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{format(new Date(briefing.eventDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{briefing.city}, {briefing.state}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-4">Composição do valor</h2>
            <div className="space-y-4">
              {selectedMenus.map((m) => (
                <div key={m.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-sm text-muted-foreground">R$ {m.pricePerPerson} × {people} pessoas</p>
                  </div>
                  <span className="font-medium text-foreground">
                    R$ {(m.pricePerPerson * people).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Taxa de deslocamento</p>
                  <p className="text-sm text-muted-foreground">{briefing.neighborhood}, {briefing.city}</p>
                </div>
                <span className="font-medium text-foreground">R$ {TRAVEL_FEE.toLocaleString('pt-BR')}</span>
              </div>
              <div className="pt-4 border-t border-border/50 flex justify-between items-start gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">Total estimado</p>
                  <p className="text-xs text-muted-foreground">
                    {isCombo ? 'Expectativa em negociação · valor final definido pela empresa' : 'Valor final sujeito a confirmação'}
                  </p>
                </div>
                <div className="text-right">
                  {isCombo ? (
                    <>
                      <p className="text-sm line-through text-muted-foreground">
                        R$ {estimatedTotal.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ~ R$ {expectationTotal.toLocaleString('pt-BR')}
                      </p>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-primary">R$ {estimatedTotal.toLocaleString('pt-BR')}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {selectedMenus[0].includes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-premium p-6 mb-8">
              <h2 className="font-display text-lg font-semibold mb-4">O que está incluído</h2>
              <ul className="grid grid-cols-2 gap-2">
                {selectedMenus[0].includes.slice(0, 6).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {isCombo && (
              <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm text-foreground">
                <span className="font-medium">Combo de {selectedMenus.length} pacotes</span> · aberto à negociação com a empresa
              </div>
            )}
            {isCombo ? (
              <div className="space-y-3">
                <Button variant="gold" size="xl" className="w-full" onClick={() => handleContinue(true)}>
                  Negociar combo
                </Button>
                <Button variant="outline" size="xl" className="w-full" onClick={() => handleContinue(false)}>
                  Selecionar e agendar pelo valor cheio
                </Button>
              </div>
            ) : (
              <Button variant="gold" size="xl" className="w-full" onClick={() => handleContinue(false)}>
                Selecionar e agendar
              </Button>
            )}
            <p className="text-center text-xs text-muted-foreground mt-4">
              {isCombo
                ? 'Ao negociar, sua solicitação é enviada à empresa para avaliação do desconto.'
                : 'Ao continuar, você será direcionado para confirmar os dados do agendamento.'}
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
