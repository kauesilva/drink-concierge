import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, MessageCircle, Home } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCompanyById, getMenuById } from '@/data/mockData';
import { useQuoteStore } from '@/store/quoteStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConfirmationPage = () => {
  const { briefing, selectedCompanyId, selectedMenuId, resetQuote } = useQuoteStore();

  const company = getCompanyById(selectedCompanyId || '');
  const menu = getMenuById(selectedMenuId || '');

  const people = briefing.people || 50;
  const baseTotal = menu ? menu.pricePerPerson * people : 0;
  const travelFee = 150;
  const estimatedTotal = baseTotal + travelFee;

  const whatsappNumber = '5511999999999';
  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de solicitar um orçamento pelo Bartender Stones.\n\nEvento: ${briefing.eventType}\nData: ${briefing.eventDate ? format(new Date(briefing.eventDate), "dd/MM/yyyy") : 'A definir'}\nPessoas: ${briefing.people}\nEmpresa: ${company?.name}\nCardápio: ${menu?.name}\n\nPode me ajudar com os próximos passos?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Reset quote after unmount (user leaves page)
  useEffect(() => {
    return () => {
      // Don't reset immediately - only if user goes home
    };
  }, []);

  const handleGoHome = () => {
    resetQuote();
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-secondary/30 to-background flex items-center py-8 md:py-12">
        <div className="container max-w-lg text-center">
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
          >
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Pedido recebido!
            </h1>
            <p className="text-muted-foreground mb-8">
              Um agente entrará em contato em breve para finalizar a contratação do seu evento.
            </p>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium p-6 text-left mb-8"
          >
            <h2 className="font-display text-lg font-semibold mb-4 text-center">
              Resumo do pedido
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empresa</span>
                <span className="font-medium text-foreground">{company?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cardápio</span>
                <span className="font-medium text-foreground">{menu?.name}</span>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                {briefing.eventDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {format(new Date(briefing.eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{briefing.city}, {briefing.state}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex justify-between">
                <span className="text-muted-foreground">Total estimado</span>
                <span className="text-xl font-bold text-primary">
                  R$ {estimatedTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Button
              asChild
              variant="gold"
              size="xl"
              className="w-full"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp agora
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoHome}
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Voltar ao início
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-8"
          >
            Uma confirmação foi enviada para {briefing.email}
          </motion.p>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
