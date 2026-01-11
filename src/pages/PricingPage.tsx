import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Calendar, MapPin, Users, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCompanyById, getMenuById } from '@/data/mockData';
import { useQuoteStore } from '@/store/quoteStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PricingPage = () => {
  const { companyId, menuId } = useParams();
  const navigate = useNavigate();
  const { briefing } = useQuoteStore();

  const company = getCompanyById(companyId || '');
  const menu = getMenuById(menuId || '');

  if (!company || !menu) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Cardápio não encontrado</h1>
          <Button asChild variant="gold">
            <Link to="/resultados">Voltar aos resultados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const people = briefing.people || 50;
  const baseTotal = menu.pricePerPerson * people;
  const travelFee = 150; // Mock
  const estimatedTotal = baseTotal + travelFee;

  const handleContinue = () => {
    navigate(`/agendamento`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-2xl">
          {/* Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao cardápio
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Valores estimados
            </h1>
            <p className="text-muted-foreground">
              Revise os valores e confirme sua seleção
            </p>
          </motion.div>

          {/* Selection Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-6 mb-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Sua seleção</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empresa</span>
                <span className="font-medium text-foreground">{company.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cardápio</span>
                <span className="font-medium text-foreground">{menu.name}</span>
              </div>
            </div>
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-premium p-6 mb-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Detalhes do evento</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{people} pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{menu.durationHours}h de serviço</span>
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

          {/* Pricing Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium p-6 mb-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Composição do valor</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Serviço de bar</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {menu.pricePerPerson} × {people} pessoas
                  </p>
                </div>
                <span className="font-medium text-foreground">
                  R$ {baseTotal.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Taxa de deslocamento</p>
                  <p className="text-sm text-muted-foreground">
                    {briefing.neighborhood}, {briefing.city}
                  </p>
                </div>
                <span className="font-medium text-foreground">
                  R$ {travelFee.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">Total estimado</p>
                  <p className="text-xs text-muted-foreground">
                    Valor final sujeito a confirmação
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  R$ {estimatedTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-premium p-6 mb-8"
          >
            <h2 className="font-display text-lg font-semibold mb-4">O que está incluído</h2>
            <ul className="grid grid-cols-2 gap-2">
              {menu.includes.slice(0, 6).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="gold"
              size="xl"
              className="w-full"
              onClick={handleContinue}
            >
              Selecionar e agendar
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Ao continuar, você será direcionado para confirmar os dados do agendamento.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
