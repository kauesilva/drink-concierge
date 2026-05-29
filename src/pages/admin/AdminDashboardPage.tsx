import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  RefreshCw,
  Check,
  X,
  RotateCcw,
  ExternalLink,
  Users,
  Inbox,
  MapPinned,
  LayoutDashboard,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminStore } from '@/store/adminStore';
import {
  apiListLeads,
  apiAdminListPartners,
  apiAdminSetPartnerStatus,
  apiAdminListCoverageRequests,
  ApiLead,
  ApiParceiro,
  ApiCoverageRequest,
} from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const leadStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  novo: { label: 'Novo', variant: 'default' },
  em_contato: { label: 'Em contato', variant: 'secondary' },
  orcamento_enviado: { label: 'Orçamento enviado', variant: 'outline' },
  fechado: { label: 'Fechado', variant: 'default' },
  perdido: { label: 'Perdido', variant: 'destructive' },
};

const partnerStatusFromAtivo = (ativo: number) => {
  if (ativo === 1) return { label: 'Ativo', variant: 'default' as const, key: 'ativo' };
  if (ativo === 2) return { label: 'Rejeitado', variant: 'destructive' as const, key: 'rejeitado' };
  return { label: 'Pendente', variant: 'secondary' as const, key: 'pendente' };
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAdminStore();
  const { toast } = useToast();

  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [partners, setPartners] = useState<ApiParceiro[]>([]);
  const [coverage, setCoverage] = useState<ApiCoverageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerFilter, setPartnerFilter] = useState<'todos' | 'pendente' | 'ativo' | 'rejeitado'>('todos');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('todos');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/admin', { replace: true });
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [leadsData, partnersData, coverageData] = await Promise.allSettled([
        apiListLeads(token!),
        apiAdminListPartners(token!),
        apiAdminListCoverageRequests(token!),
      ]);
      if (leadsData.status === 'fulfilled') setLeads(leadsData.value);
      if (partnersData.status === 'fulfilled') setPartners(partnersData.value);
      if (coverageData.status === 'fulfilled') setCoverage(coverageData.value);

      const failures = [leadsData, partnersData, coverageData].filter((r) => r.status === 'rejected');
      if (failures.length) {
        toast({
          title: 'Algumas seções não carregaram',
          description: 'Verifique se os endpoints do admin estão implementados no backend.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleSetStatus = async (parceiroId: number, ativo: 0 | 1 | 2) => {
    try {
      await apiAdminSetPartnerStatus({ parceiro_id: parceiroId, ativo }, token!);
      setPartners((list) =>
        list.map((p) => (p.id === parceiroId ? { ...p, ativo } : p)),
      );
      toast({
        title:
          ativo === 1
            ? 'Parceiro aprovado'
            : ativo === 2
              ? 'Parceiro rejeitado'
              : 'Status atualizado',
      });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  // ====== Derivações / KPIs ======
  const kpis = useMemo(() => {
    const now = new Date();
    const sameMonth = (iso: string) => {
      const d = new Date(iso);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };
    return {
      ativos: partners.filter((p) => Number(p.ativo) === 1).length,
      pendentes: partners.filter((p) => Number(p.ativo) === 0).length,
      leadsMes: leads.filter((l) => sameMonth(l.criado_em)).length,
      coverageMes: coverage.filter((c) => sameMonth(c.criado_em)).length,
    };
  }, [partners, leads, coverage]);

  const filteredPartners = useMemo(() => {
    const q = partnerSearch.trim().toLowerCase();
    return partners
      .filter((p) => {
        if (partnerFilter === 'pendente' && Number(p.ativo) !== 0) return false;
        if (partnerFilter === 'ativo' && Number(p.ativo) !== 1) return false;
        if (partnerFilter === 'rejeitado' && Number(p.ativo) !== 2) return false;
        if (q && !`${p.nome} ${p.email} ${p.nome_empresa || ''}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        // pendentes primeiro
        const ap = Number(a.ativo) === 0 ? 0 : 1;
        const bp = Number(b.ativo) === 0 ? 0 : 1;
        if (ap !== bp) return ap - bp;
        return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
      });
  }, [partners, partnerFilter, partnerSearch]);

  const filteredLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    return leads.filter((l) => {
      if (leadStatusFilter !== 'todos' && l.status !== leadStatusFilter) return false;
      if (q && !`${l.nome_cliente} ${l.cidade} ${l.email} ${l.tipo_evento}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [leads, leadStatusFilter, leadSearch]);

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Painel Master Admin
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Gestão completa de parceiros, leads e solicitações
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <KpiCard icon={<Users className="w-4 h-4" />} label="Parceiros ativos" value={kpis.ativos} />
            <KpiCard
              icon={<Inbox className="w-4 h-4" />}
              label="Pendentes de aprovação"
              value={kpis.pendentes}
              highlight={kpis.pendentes > 0}
            />
            <KpiCard icon={<FileText className="w-4 h-4" />} label="Leads no mês" value={kpis.leadsMes} />
            <KpiCard icon={<MapPinned className="w-4 h-4" />} label="Cidades pedidas no mês" value={kpis.coverageMes} />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="parceiros" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="parceiros" className="gap-2">
                <Users className="w-4 h-4" /> Parceiros
                {kpis.pendentes > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5">{kpis.pendentes}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-2">
                <Inbox className="w-4 h-4" /> Solicitações
              </TabsTrigger>
              <TabsTrigger value="cobertura" className="gap-2">
                <MapPinned className="w-4 h-4" /> Cidades pedidas
              </TabsTrigger>
              <TabsTrigger value="resumo" className="gap-2">
                <LayoutDashboard className="w-4 h-4" /> Resumo
              </TabsTrigger>
            </TabsList>

            {/* PARCEIROS */}
            <TabsContent value="parceiros">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <Input
                  placeholder="Buscar por nome, empresa ou email"
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="md:max-w-sm"
                />
                <Select value={partnerFilter} onValueChange={(v: any) => setPartnerFilter(v)}>
                  <SelectTrigger className="md:max-w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="rejeitado">Rejeitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading && partners.length === 0 ? (
                <EmptyState text="Carregando..." />
              ) : filteredPartners.length === 0 ? (
                <EmptyState text="Nenhum parceiro encontrado." />
              ) : (
                <div className="space-y-3">
                  {filteredPartners.map((p, i) => {
                    const st = partnerStatusFromAtivo(Number(p.ativo));
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <Card className="border-border/60">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-foreground">
                                    {p.nome_empresa || p.nome}
                                  </span>
                                  <Badge variant={st.variant}>{st.label}</Badge>
                                  <span className="text-xs text-muted-foreground capitalize">{p.tipo}</span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>
                                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.whatsapp}</span>
                                  {(p.cidade_base || p.estado) && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {p.cidade_base}{p.estado ? ` - ${p.estado}` : ''}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(p.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                                {p.categorias_servico && p.categorias_servico.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {p.categorias_servico.map((c) => (
                                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 md:flex-nowrap">
                                {Number(p.ativo) !== 1 && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleSetStatus(p.id, 1)}
                                  >
                                    <Check className="w-4 h-4 mr-1" /> Aprovar
                                  </Button>
                                )}
                                {Number(p.ativo) !== 2 && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleSetStatus(p.id, 2)}
                                  >
                                    <X className="w-4 h-4 mr-1" /> Rejeitar
                                  </Button>
                                )}
                                {Number(p.ativo) !== 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSetStatus(p.id, 0)}
                                  >
                                    <RotateCcw className="w-4 h-4 mr-1" /> Pendente
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`/parceiros/${p.id}`, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" /> Ver
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* LEADS */}
            <TabsContent value="leads">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <Input
                  placeholder="Buscar por cliente, cidade, email..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="md:max-w-sm"
                />
                <Select value={leadStatusFilter} onValueChange={setLeadStatusFilter}>
                  <SelectTrigger className="md:max-w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    {Object.entries(leadStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && leads.length === 0 ? (
                <EmptyState text="Carregando..." />
              ) : filteredLeads.length === 0 ? (
                <EmptyState text="Nenhum orçamento encontrado." />
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead, i) => {
                    const st = leadStatusLabels[lead.status] || { label: lead.status, variant: 'outline' as const };
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
            </TabsContent>

            {/* COBERTURA */}
            <TabsContent value="cobertura">
              {loading && coverage.length === 0 ? (
                <EmptyState text="Carregando..." />
              ) : coverage.length === 0 ? (
                <EmptyState text="Nenhuma solicitação de cidade recebida." />
              ) : (
                <div className="space-y-3">
                  {coverage.map((c) => (
                    <Card key={c.id} className="border-border/60">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">
                              {c.cidade} - {c.estado}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.nome}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.whatsapp}</span>
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(c.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* RESUMO */}
            <TabsContent value="resumo">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Visão geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Total de parceiros cadastrados: <span className="text-foreground font-semibold">{partners.length}</span></p>
                  <p>Parceiros ativos: <span className="text-foreground font-semibold">{kpis.ativos}</span></p>
                  <p>Pendentes de aprovação: <span className="text-foreground font-semibold">{kpis.pendentes}</span></p>
                  <p>Total de leads: <span className="text-foreground font-semibold">{leads.length}</span></p>
                  <p>Leads no mês atual: <span className="text-foreground font-semibold">{kpis.leadsMes}</span></p>
                  <p>Solicitações de cidade no mês: <span className="text-foreground font-semibold">{kpis.coverageMes}</span></p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

const KpiCard = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <Card className={highlight ? 'border-primary/60 shadow-gold' : 'border-border/60'}>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="text-2xl font-display font-semibold text-foreground mt-1">{value}</div>
    </CardContent>
  </Card>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="text-center py-16 text-muted-foreground">{text}</div>
);

export default AdminDashboardPage;
