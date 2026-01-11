import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCompanyById, getMenuById } from '@/data/mockData';
import { useQuoteStore } from '@/store/quoteStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SchedulingPage = () => {
  const navigate = useNavigate();
  const { briefing, selectedCompanyId, selectedMenuId } = useQuoteStore();
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const company = getCompanyById(selectedCompanyId || '');
  const menu = getMenuById(selectedMenuId || '');

  if (!company || !menu) {
    navigate('/resultados');
    return null;
  }

  const people = briefing.people || 50;
  const baseTotal = menu.pricePerPerson * people;
  const travelFee = 150;
  const estimatedTotal = baseTotal + travelFee;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate('/confirmacao');
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
            Voltar
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Confirmar agendamento
            </h1>
            <p className="text-muted-foreground">
              Revise os dados antes de solicitar a contratação
            </p>
          </motion.div>

          {/* Company & Menu Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-6 mb-6"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-border/50 mb-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {company.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Cardápio: {menu.name}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-bold text-primary">
                R$ {estimatedTotal.toLocaleString('pt-BR')}
              </span>
            </div>
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-premium p-6 mb-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Dados do evento</h3>
            <div className="space-y-3">
              {briefing.eventDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(briefing.eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-medium text-foreground">
                    {briefing.address ? `${briefing.address}, ` : ''}
                    {briefing.neighborhood}, {briefing.city} - {briefing.state}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium p-6 mb-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Seus dados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground">{briefing.clientName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium text-foreground">{briefing.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{briefing.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Observations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-premium p-6 mb-8"
          >
            <Label htmlFor="observations" className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              Observações (opcional)
            </Label>
            <Textarea
              id="observations"
              placeholder="Tema do evento, restrições alimentares, pedidos especiais..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
            />
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="gold"
              size="xl"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar contratação'}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Um agente entrará em contato para finalizar a contratação
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SchedulingPage;
