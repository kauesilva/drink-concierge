import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Calendar, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import CompanyCard from '@/components/companies/CompanyCard';
import { useQuoteStore } from '@/store/quoteStore';
import { eventTypes } from '@/data/mockData';
import { useCompanies } from '@/hooks/useCompanies';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { briefing } = useQuoteStore();

  useEffect(() => {
    if (!briefing.eventType || !briefing.people) {
      navigate('/orcamento');
    }
  }, [briefing, navigate]);

  const { data: companies, isLoading } = useCompanies({
    cidade: briefing.city,
    estado: briefing.state,
  });

  const eventLabel = eventTypes.find(e => e.value === briefing.eventType)?.label || briefing.eventType;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link to="/orcamento">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Editar briefing
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Empresas disponíveis para seu evento
              </h1>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <span>🎉</span>
                  <span className="text-foreground">{eventLabel}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{briefing.people} pessoas</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{briefing.city}, {briefing.state}</span>
                </div>
                {briefing.eventDate && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {format(new Date(briefing.eventDate), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Buscando empresas...</p>
            </div>
          ) : companies && companies.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {companies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Nenhuma empresa encontrada para sua região.
              </p>
              <Button asChild variant="gold">
                <Link to="/orcamento">Alterar busca</Link>
              </Button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-accent/50 rounded-xl text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 Compare os cardápios e valores de cada empresa. 
              <br className="hidden md:block" />
              Após escolher, um agente entrará em contato para finalizar a contratação.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
