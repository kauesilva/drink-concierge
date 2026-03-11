import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Home, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockCompanies, getMenusByCompany } from '@/data/mockData';
import { useQuoteStore } from '@/store/quoteStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import RatingStars from '@/components/shared/RatingStars';
import BadgePremium from '@/components/shared/BadgePremium';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ConfirmationPage = () => {
  const { briefing, resetQuote } = useQuoteStore();
  const { toast } = useToast();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleGoHome = () => {
    resetQuote();
  };

  const handleHireCompany = async (companyId: string, companyName: string) => {
    setSendingEmail(companyId);
    // Simulate sending email to service provider
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: '📧 Solicitação enviada!',
      description: `A empresa ${companyName} receberá seu pedido e entrará em contato para agendar.`,
    });

    setSendingEmail(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-3xl">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-gold"
          >
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Pedido recebido!
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Veja abaixo as empresas disponíveis para seu evento. 
              Clique em <strong>"Contratar"</strong> para enviar um email ao prestador, 
              que entrará em contato para agendar sua festa.
            </p>
          </motion.div>

          {/* Briefing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-premium p-5 mb-8"
          >
            <h2 className="font-display text-lg font-semibold mb-3">Resumo do seu evento</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {briefing.eventDate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{format(new Date(briefing.eventDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
              )}
              {briefing.city && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{briefing.city}, {briefing.state}</span>
                </div>
              )}
              {briefing.people && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <span>👥</span>
                  <span>{briefing.people} pessoas</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Companies List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold mb-6 text-center">
              Escolha uma empresa para contratar
            </h2>

            <div className="space-y-4">
              {mockCompanies.map((company, index) => {
                const menus = getMenusByCompany(company.id);
                const minPrice = Math.min(...menus.map(m => m.pricePerPerson));
                const people = briefing.people || 50;
                const estimatedTotal = minPrice * people;

                return (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.1 }}
                    className="card-premium p-5 md:p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Company Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={company.image}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
                            {company.name}
                          </h3>
                          {company.badge && (
                            <BadgePremium type={company.badge} className="flex-shrink-0" />
                          )}
                        </div>

                        <RatingStars rating={company.rating} totalReviews={company.totalReviews} size="sm" />

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {company.description}
                        </p>

                        {/* Pricing & CTA */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-3 border-t border-border/50 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Estimado a partir de</p>
                            <p className="text-lg font-semibold text-foreground">
                              R$ {estimatedTotal.toLocaleString('pt-BR')}
                              <span className="text-xs font-normal text-muted-foreground ml-1">
                                (R$ {minPrice}/pessoa)
                              </span>
                            </p>
                          </div>

                          <Button
                            variant="gold"
                            onClick={() => handleHireCompany(company.id, company.name)}
                            disabled={sendingEmail !== null}
                            className="w-full sm:w-auto"
                          >
                            {sendingEmail === company.id ? (
                              'Enviando...'
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                Contratar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              onClick={handleGoHome}
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Voltar ao início
              </Link>
            </Button>

            {briefing.email && (
              <p className="text-xs text-muted-foreground mt-4">
                Uma confirmação será enviada para {briefing.email}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
