import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StateCitySelect from '@/components/shared/StateCitySelect';
import PartnerCard from '@/components/partners/PartnerCard';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiListPublicPartners } from '@/services/api';
import { serviceCategories } from '@/data/mockData';
import type { ServiceCategory } from '@/types';

const PartnersDirectoryPage = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    apiListPublicPartners()
      .then((data) => { if (!canceled) { setPartners(data || []); setError(null); } })
      .catch((err) => { if (!canceled) setError(err?.message || 'Erro ao carregar parceiros'); })
      .finally(() => { if (!canceled) setLoading(false); });
    return () => { canceled = true; };
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (state && p.estado !== state) return false;
      if (city && p.cidade_base !== city) return false;
      if (category !== 'all') {
        const cats: string[] = p.categorias_servico || [];
        if (!cats.includes(category)) return false;
      }
      return true;
    });
  }, [partners, state, city, category]);

  const clear = () => { setState(''); setCity(''); setCategory('all'); };

  return (
    <Layout>
      <section className="bg-gradient-to-b from-secondary/30 to-background border-b border-border/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Vitrine de parceiros
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Encontre seu Bartender
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
              Conheça profissionais e empresas verificadas para mão de obra, serviço completo e consultoria de cardápio.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10 space-y-8">
        {/* Filtros */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">Tipo de serviço</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {serviceCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <StateCitySelect
                state={state}
                city={city}
                onStateChange={setState}
                onCityChange={setCity}
                layout="horizontal"
              />
            </div>
            <Button variant="ghost" onClick={clear} className="md:w-auto w-full">
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Listagem */}
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Carregando parceiros...</div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-20">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-60" />
            Não foi possível carregar a vitrine no momento.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-60" />
            Nenhum parceiro encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <PartnerCard
                key={p.id}
                partner={{
                  id: p.id,
                  name: p.nome_empresa || p.nome,
                  title: p.titulo_perfil,
                  shortDescription: p.descricao_curta || p.sobre,
                  image: p.logo || p.foto_capa,
                  cityBase: p.cidade_base,
                  state: p.estado,
                  serviceCategories: (p.categorias_servico || []) as ServiceCategory[],
                }}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default PartnersDirectoryPage;
