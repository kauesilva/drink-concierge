import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Calendar, MapPin, User, Phone, Mail, FileText, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/store/adminStore';
import { apiListLeads, ApiLead } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  novo: { label: 'Novo', variant: 'default' },
  em_contato: { label: 'Em contato', variant: 'secondary' },
  orcamento_enviado: { label: 'Orçamento enviado', variant: 'outline' },
  fechado: { label: 'Fechado', variant: 'default' },
  perdido: { label: 'Perdido', variant: 'destructive' },
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAdminStore();
  const { toast } = useToast();
  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/admin', { replace: true });
      return;
    }
    fetchLeads();
  }, [isAuthenticated, token]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await apiListLeads(token!);
      setLeads(data);
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar leads',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Painel Admin
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {leads.length} orçamento{leads.length !== 1 ? 's' : ''} recebido{leads.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>

          {loading && leads.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Carregando...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Nenhum orçamento recebido ainda.
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead, i) => {
                const st = statusLabels[lead.status] || { label: lead.status, variant: 'outline' as const };
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="border-border/60">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-semibold">
                            #{lead.id} — {lead.tipo_evento}
                          </CardTitle>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-medium text-foreground">{lead.nome_cliente}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{lead.whatsapp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>
                              {lead.data_evento
                                ? format(new Date(lead.data_evento), "dd/MM/yyyy", { locale: ptBR })
                                : '—'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>
                              {lead.bairro ? `${lead.bairro}, ` : ''}{lead.cidade} - {lead.estado}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-primary">👥</span>
                            <span>{lead.quantidade_pessoas} pessoas</span>
                          </div>
                          {lead.valor_estimado && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="font-medium text-foreground">
                                R$ {lead.valor_estimado.toLocaleString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                        {lead.observacoes && (
                          <p className="mt-3 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                            {lead.observacoes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          Recebido em {format(new Date(lead.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
