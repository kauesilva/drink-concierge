import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Calendar, Loader2, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyCard from '@/components/companies/CompanyCard';
import PackageResultCard from '@/components/menus/PackageResultCard';
import { useQuoteStore } from '@/store/quoteStore';
import { eventTypes } from '@/data/mockData';
import { useMatchingPackages } from '@/hooks/useCompanies';
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

  const { data: matches, isLoading } = useMatchingPackages(briefing);

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
                Empresas compatíveis com seu evento
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
              <p className="text-muted-foreground">Buscando empresas compatíveis...</p>
            </div>
          ) : matches && matches.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {matches.map(({ company, matchedPackages }, index) => (
                <div key={company.id} className="space-y-2">
                  <CompanyCard company={company} index={index} />
                  <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {matchedPackages.length} pacote{matchedPackages.length > 1 ? 's' : ''} compatível{matchedPackages.length > 1 ? 'eis' : ''}
                    </span>
                    {matchedPackages[0]?.match.reasons.slice(0, 2).map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs font-normal">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-2">
                Nenhum pacote compatível com seu briefing.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Tente ajustar a quantidade de pessoas, a cidade ou o tipo de serviço.
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
