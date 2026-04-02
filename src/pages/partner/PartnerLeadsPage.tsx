import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePartnerStore } from '@/store/partnerStore';
import { apiGetPartnerLeads, apiUpdateLeadStatus, ApiLead } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  novo: { label: 'Novo', variant: 'default' },
  aprovado: { label: 'Aprovado', variant: 'secondary' },
  reprovado: { label: 'Reprovado', variant: 'destructive' },
  'em-contato': { label: 'Em contato', variant: 'outline' },
  fechado: { label: 'Fechado', variant: 'secondary' },
};

const PartnerLeadsPage = () => {
  const { profile } = usePartnerStore();
  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    if (!profile.apiId) return;
    setLoading(true);
    try {
      const data = await apiGetPartnerLeads(profile.apiId);
      setLeads(data);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [profile.apiId]);

  const handleStatusUpdate = async (leadId: number, status: string) => {
    if (!profile.apiId) return;
    setUpdatingId(leadId);
    try {
      await apiUpdateLeadStatus({
        lead_id: leadId,
        status,
        parceiro_id: profile.apiId,
      });
      toast({
        title: status === 'aprovado' ? 'Solicitação aprovada!' : 'Solicitação reprovada',
        description: status === 'aprovado'
          ? 'O cliente será notificado sobre a aprovação.'
          : 'O cliente será notificado sobre a reprovação.',
      });
      await fetchLeads();
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Solicitações de clientes</h1>
        <p className="text-muted-foreground mt-1">Gerencie as solicitações de contratação recebidas</p>
      </div>

      {leads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 card-premium"
        >
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Nenhuma solicitação ainda</h2>
          <p className="text-muted-foreground">
            Quando clientes solicitarem seus serviços, as solicitações aparecerão aqui.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => {
            const st = statusMap[lead.status] || { label: lead.status, variant: 'outline' as const };
            const isNew = lead.status === 'novo';

            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card-premium p-6 ${isNew ? 'border-primary/30 shadow-gold' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {lead.nome_cliente}
                      </h3>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.tipo_evento} • {lead.quantidade_pessoas} pessoas
                      {lead.pacote_nome && ` • Pacote: ${lead.pacote_nome}`}
                    </p>
                  </div>
                  {lead.valor_estimado && (
                    <p className="text-lg font-bold text-primary">
                      R$ {Number(lead.valor_estimado).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {lead.data_evento
                        ? format(new Date(lead.data_evento), "dd/MM/yyyy", { locale: ptBR })
                        : 'Data não informada'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      {lead.bairro ? `${lead.bairro}, ` : ''}{lead.cidade} - {lead.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      {lead.whatsapp}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                      {lead.email}
                    </a>
                  </div>
                </div>

                {lead.observacoes && (
                  <div className="flex items-start gap-2 mb-4 p-3 bg-secondary/50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-foreground">{lead.observacoes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Recebido em {format(new Date(lead.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>

                  {isNew && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(lead.id, 'reprovado')}
                        disabled={updatingId === lead.id}
                      >
                        {updatingId === lead.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        Reprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => handleStatusUpdate(lead.id, 'aprovado')}
                        disabled={updatingId === lead.id}
                      >
                        {updatingId === lead.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Aprovar
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PartnerLeadsPage;
