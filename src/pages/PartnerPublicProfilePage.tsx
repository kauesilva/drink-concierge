import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, MessageCircle, CheckCircle2, Instagram, Facebook, Globe, Mail, Phone, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VideoEmbed from '@/components/partners/VideoEmbed';
import QuickQuoteDialog from '@/components/partners/QuickQuoteDialog';
import { apiGetPublicPartner, apiGetProfile } from '@/services/api';
import { serviceCategories } from '@/data/mockData';
import { useCompanyMenus } from '@/hooks/useCompanies';
import MenuCard from '@/components/menus/MenuCard';

function safeUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url, window.location.origin);
    return ['https:', 'http:'].includes(u.protocol) ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

const PartnerPublicProfilePage = () => {
  const { partnerId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const [p, setP] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { data: menus, isLoading: loadingMenus } = useCompanyMenus(partnerId);

  useEffect(() => {
    if (!partnerId) return;
    setLoading(true);
    const fetcher = isPreview ? apiGetProfile : apiGetPublicPartner;
    fetcher(Number(partnerId))
      .then((data) => { setP(data); setError(null); })
      .catch((err) => setError(err?.message || 'Erro ao carregar parceiro'))
      .finally(() => setLoading(false));
  }, [partnerId, isPreview]);


  const catLabel = (v: string) => serviceCategories.find((c) => c.value === v)?.label || v;

  if (loading) {
    return <Layout><div className="container mx-auto px-6 py-20 text-center text-muted-foreground">Carregando perfil...</div></Layout>;
  }
  if (error || !p) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">Não foi possível carregar este parceiro.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/parceiros"><ArrowLeft className="w-4 h-4 mr-1.5" />Voltar para vitrine</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const name = p.nome_empresa || p.nome;
  const cover = p.foto_capa || p.logo;
  const gallery: string[] = p.galeria || [];
  const cats: string[] = p.categorias_servico || [];
  const areas: string[] = p.areas_atendidas || [];
  const differentials: string[] = p.diferenciais || [];
  const showContact = !!p.telefone_publico;
  const whatsappLink = p.whatsapp ? `https://wa.me/${String(p.whatsapp).replace(/\D/g, '')}` : null;

  return (
    <Layout>
      {isPreview && (
        <div className="bg-primary/10 border-b border-primary/20 text-foreground">
          <div className="container mx-auto px-6 py-2.5 text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span><strong>Modo pré-visualização.</strong> Esta é a forma como seu perfil será exibido publicamente.</span>
          </div>
        </div>
      )}
      {/* Hero */}
      <section className="relative">

        <div className="h-56 md:h-80 bg-muted overflow-hidden">
          {cover ? (
            <img src={cover} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
          )}
        </div>
        <div className="container mx-auto px-6">
          <div className="-mt-16 md:-mt-20 relative bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-5">
              {p.logo && (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-background shadow-md bg-muted shrink-0">
                  <img src={p.logo} alt={`Logo ${name}`} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{name}</h1>
                {p.titulo_perfil && (
                  <p className="text-muted-foreground mt-1">{p.titulo_perfil}</p>
                )}
                {(p.cidade_base || p.estado) && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {[p.cidade_base, p.estado].filter(Boolean).join(' / ')}
                  </div>
                )}
                {!!cats.length && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cats.map((c) => (
                      <Badge key={c} variant="secondary">{catLabel(c)}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="gold" size="lg" className="flex-1" onClick={() => setQuoteOpen(true)}>
                Solicitar orçamento
              </Button>
              {showContact && whatsappLink && (
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {(p.descricao_completa || p.sobre) && (
            <motion.section initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-xl font-semibold mb-3">Sobre</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {p.descricao_completa || p.sobre}
              </p>
            </motion.section>
          )}

          <PersonalInfoBlock p={p} />

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">Pacotes disponíveis</h2>
            {loadingMenus ? (
              <div className="text-sm text-muted-foreground">Carregando pacotes...</div>
            ) : menus && menus.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {menus.map((menu, idx) => (
                  <MenuCard key={menu.id} menu={menu} companyId={String(partnerId)} index={idx} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este parceiro ainda não publicou pacotes.</p>
            )}
          </section>

          {!!differentials.length && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Diferenciais</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {differentials.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!!gallery.length && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Galeria</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.slice(0, 5).map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {p.video_url && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Vídeo de apresentação</h2>
              <VideoEmbed url={p.video_url} />
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {!!areas.length && (
            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <h3 className="font-display text-base font-semibold mb-3">Regiões atendidas</h3>
              <div className="flex flex-wrap gap-1.5">
                {areas.map((a) => (
                  <Badge key={a} variant="outline" className="font-normal">{a}</Badge>
                ))}
              </div>
            </div>
          )}

          {(p.instagram || p.facebook || p.tiktok || p.site || (showContact && (p.whatsapp || p.email))) && (
            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <h3 className="font-display text-base font-semibold mb-3">Contato e redes</h3>
              <ul className="space-y-2 text-sm">
                {showContact && p.whatsapp && (
                  <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{p.whatsapp}</li>
                )}
                {showContact && p.email && (
                  <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{p.email}</li>
                )}
                {p.instagram && safeUrl(p.instagram) && (
                  <li><a className="flex items-center gap-2 hover:text-primary" href={safeUrl(p.instagram)} target="_blank" rel="noreferrer"><Instagram className="w-4 h-4" />Instagram</a></li>
                )}
                {p.facebook && safeUrl(p.facebook) && (
                  <li><a className="flex items-center gap-2 hover:text-primary" href={safeUrl(p.facebook)} target="_blank" rel="noreferrer"><Facebook className="w-4 h-4" />Facebook</a></li>
                )}
                {p.tiktok && safeUrl(p.tiktok) && (
                  <li><a className="flex items-center gap-2 hover:text-primary" href={safeUrl(p.tiktok)} target="_blank" rel="noreferrer"><Globe className="w-4 h-4" />TikTok</a></li>
                )}
                {p.site && safeUrl(p.site) && (
                  <li><a className="flex items-center gap-2 hover:text-primary" href={safeUrl(p.site)} target="_blank" rel="noreferrer"><Globe className="w-4 h-4" />Site</a></li>
                )}
              </ul>
            </div>
          )}

          <Button variant="gold" size="lg" className="w-full" onClick={() => setQuoteOpen(true)}>
            Solicitar orçamento
          </Button>
        </aside>
      </div>

      <QuickQuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        parceiroId={Number(partnerId)}
        parceiroNome={name}
        cidadeBase={p.cidade_base || ''}
        estadoBase={p.estado || ''}
      />
    </Layout>
  );
};

const GENDER_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  nao_declarar: 'Prefiro não declarar',
};
const UNIFORM_LABELS: Record<string, string> = {
  avental: 'Avental',
  social: 'Roupa social',
  freestyle: 'Freestyle',
};
const STYLE_LABELS: Record<string, string> = {
  classico: 'Clássico',
  moderno: 'Moderno',
  molecular: 'Molecular',
  contemporaneo: 'Contemporâneo',
  diversificado: 'Diversificado',
  todos: 'Todos',
  outros: 'Outros',
};

function PersonalInfoBlock({ p }: { p: any }) {
  const styleVal =
    p.estilo_coquetelaria === 'outros' && p.estilo_coquetelaria_outro
      ? p.estilo_coquetelaria_outro
      : p.estilo_coquetelaria
      ? STYLE_LABELS[p.estilo_coquetelaria] || p.estilo_coquetelaria
      : null;

  const items: { label: string; value: string }[] = [
    p.idade && { label: 'Idade', value: `${p.idade} anos` },
    p.sexo && { label: 'Sexo', value: GENDER_LABELS[p.sexo] || p.sexo },
    p.profissao && { label: 'Profissão', value: p.profissao },
    p.altura && { label: 'Altura', value: `${p.altura} cm` },
    p.peso && { label: 'Peso', value: `${p.peso} kg` },
    p.uniforme && { label: 'Uniforme', value: UNIFORM_LABELS[p.uniforme] || p.uniforme },
    styleVal && { label: 'Estilo de coquetelaria', value: styleVal },
  ].filter(Boolean) as { label: string; value: string }[];

  if (!items.length) return null;

  return (
    <section>
      <h2 className="font-display text-xl font-semibold mb-3">Sobre</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-card border border-border/60 rounded-2xl p-5">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</dt>
            <dd className="text-sm text-foreground font-medium mt-0.5">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default PartnerPublicProfilePage;

