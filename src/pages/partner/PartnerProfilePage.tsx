import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, X, Save, AlertTriangle, CheckCircle2, Image as ImageIcon, Sparkles, Share2, Eye, Link as LinkIcon, Instagram, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePartnerStore } from '@/store/partnerStore';
import { toast } from '@/hooks/use-toast';
import { apiUploadImage } from '@/services/api';
import StateCitySelect from '@/components/shared/StateCitySelect';
import GalleryUploader from '@/components/partners/GalleryUploader';
import VideoEmbed from '@/components/partners/VideoEmbed';
import { serviceCategories } from '@/data/mockData';
import { getPublishChecks, isPartnerPublishable } from '@/lib/partners';
import type { ServiceCategory } from '@/types';
import type { PartnerAbout, CocktailStyle } from '@/store/partnerStore';

const PartnerProfilePage = () => {
  const { profile, updateProfile } = usePartnerStore();
  const [form, setForm] = useState({ ...profile });
  const [areaInput, setAreaInput] = useState('');
  const [diffInput, setDiffInput] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...profile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.apiId]);

  const uploadImage = async (
    file: File,
    setBusy: (b: boolean) => void,
    apply: (url: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Selecione um arquivo de imagem', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const { url } = await apiUploadImage(file);
      apply(url);
      toast({ title: 'Imagem enviada', description: 'Lembre de salvar o perfil para confirmar.' });
    } catch (err: any) {
      toast({ title: 'Falha no upload', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const addToList = (key: 'areasServed' | 'differentials', value: string, clear: () => void) => {
    const v = value.trim();
    if (!v) return;
    const list = (form[key] as string[]) || [];
    if (list.includes(v)) return;
    setForm({ ...form, [key]: [...list, v] });
    clear();
  };

  const removeFromList = (key: 'areasServed' | 'differentials', value: string) => {
    const list = (form[key] as string[]) || [];
    setForm({ ...form, [key]: list.filter((a) => a !== value) });
  };

  const toggleCategory = (cat: ServiceCategory) => {
    const has = form.serviceCategories?.includes(cat);
    const next = has
      ? form.serviceCategories.filter((c) => c !== cat)
      : [...(form.serviceCategories || []), cat];
    setForm({ ...form, serviceCategories: next });
  };

  const handleSave = async () => {
    if (!form.serviceCategories || form.serviceCategories.length === 0) {
      toast({ title: 'Selecione ao menos um tipo de serviço', variant: 'destructive' });
      return;
    }
    setSaving(true);
    updateProfile(form);
    try {
      await usePartnerStore.getState().syncProfile();
      toast({ title: 'Perfil salvo!', description: 'Suas informações foram atualizadas e sincronizadas.' });
    } catch {
      toast({ title: 'Perfil salvo localmente', description: 'Não foi possível sincronizar com o servidor.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const checks = getPublishChecks(form);
  const publishable = isPartnerPublishable(form);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Essas informações aparecem na sua página pública em <span className="font-medium">Encontre seu Bartender</span>.
          </p>
        </div>
        <ProfileActions apiId={form.apiId} businessName={form.businessName} />
      </div>


      {/* Status de publicação */}
      <Card className={publishable ? 'border-primary/40 bg-primary/5' : 'border-amber-300 bg-amber-50 dark:bg-amber-950/20'}>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            {publishable ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Seu perfil está publicado na vitrine.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Complete seu perfil para aparecer na vitrine pública da plataforma.</span>
              </>
            )}
          </div>
          <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
            {checks.map((c) => (
              <li key={c.field} className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${c.ok ? 'text-primary' : 'text-muted-foreground/50'}`} />
                <span className={c.ok ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cover + Logo */}
      <Card className="overflow-hidden border-border/60">
        <div
          className="relative h-48 bg-muted flex items-center justify-center cursor-pointer group"
          onClick={() => coverRef.current?.click()}
        >
          {form.coverImage ? (
            <img src={form.coverImage} alt="Capa" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-muted-foreground">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Clique para adicionar foto de capa</span>
            </div>
          )}
          {uploadingCover && (
            <span className="absolute bottom-3 right-3 text-xs font-medium text-background bg-foreground/60 px-3 py-1 rounded">Enviando...</span>
          )}
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f, setUploadingCover, (url) => setForm((p) => ({ ...p, coverImage: url })));
              if (coverRef.current) coverRef.current.value = '';
            }}
          />
        </div>
        <CardContent className="p-5 flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl bg-muted overflow-hidden border border-border flex items-center justify-center cursor-pointer shrink-0"
            onClick={() => logoRef.current?.click()}
          >
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <Label className="text-sm">Logo / imagem principal</Label>
            <p className="text-xs text-muted-foreground">
              {uploadingLogo ? 'Enviando...' : 'Clique no quadrado ao lado para enviar.'}
            </p>
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f, setUploadingLogo, (url) => setForm((p) => ({ ...p, logo: url })));
              if (logoRef.current) logoRef.current.value = '';
            }}
          />
        </CardContent>
      </Card>

      {/* Identidade */}
      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-lg">Identidade</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da empresa ou profissional</Label>
              <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Nome do seu negócio" />
            </div>
            <div className="space-y-2">
              <Label>Título do perfil</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Bartenders premium para casamentos" maxLength={150} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição curta</Label>
            <Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Frase curta usada no card da vitrine" rows={2} maxLength={300} />
            <p className="text-xs text-muted-foreground">{form.shortDescription?.length || 0}/300</p>
          </div>
          <div className="space-y-2">
            <Label>Descrição completa</Label>
            <Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="Conte sua história, experiência e estilo de trabalho..." rows={5} />
          </div>
        </CardContent>
      </Card>

      {/* Serviços e atendimento */}
      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-lg">Serviços e atendimento</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Tipos de serviço que ofereço *</Label>
            <p className="text-xs text-muted-foreground">Selecione um ou mais. Clientes só verão você nas categorias marcadas.</p>
            <div className="grid gap-2 mt-2">
              {serviceCategories.map((cat) => {
                const checked = form.serviceCategories?.includes(cat.value as ServiceCategory);
                return (
                  <label key={cat.value} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 cursor-pointer transition-colors">
                    <Checkbox checked={!!checked} onCheckedChange={() => toggleCategory(cat.value as ServiceCategory)} className="mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground block">{cat.label}</span>
                      <span className="text-sm text-muted-foreground">{cat.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Localização base</Label>
            <StateCitySelect
              state={form.state}
              city={form.cityBase}
              onStateChange={(uf) => setForm({ ...form, state: uf })}
              onCityChange={(c) => setForm({ ...form, cityBase: c })}
              stateLabel="Estado"
              cityLabel="Cidade base"
            />
          </div>

          <div className="space-y-2">
            <Label>Áreas atendidas</Label>
            <div className="flex gap-2">
              <Input
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                placeholder="Adicionar região"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('areasServed', areaInput, () => setAreaInput('')))}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => addToList('areasServed', areaInput, () => setAreaInput(''))}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.areasServed.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.areasServed.map((area) => (
                  <Badge key={area} variant="secondary" className="gap-1 pr-1">
                    {area}
                    <button onClick={() => removeFromList('areasServed', area)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mídia */}
      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-lg">Mídia</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Galeria (até 5 fotos)</Label>
            <GalleryUploader images={form.gallery || []} onChange={(g) => setForm({ ...form, gallery: g })} max={5} />
          </div>
          <div className="space-y-2">
            <Label>Vídeo de apresentação (URL)</Label>
            <Input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="YouTube, Vimeo ou link MP4"
            />
            {form.videoUrl && <VideoEmbed url={form.videoUrl} className="mt-2" />}
          </div>
        </CardContent>
      </Card>

      {/* Diferenciais */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Diferenciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={diffInput}
              onChange={(e) => setDiffInput(e.target.value)}
              placeholder="Ex: Bar móvel premium iluminado"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('differentials', diffInput, () => setDiffInput('')))}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => addToList('differentials', diffInput, () => setDiffInput(''))}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {!!form.differentials?.length && (
            <div className="flex flex-wrap gap-2">
              {form.differentials.map((d) => (
                <Badge key={d} variant="secondary" className="gap-1 pr-1">
                  {d}
                  <button onClick={() => removeFromList('differentials', d)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contato e redes */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Share2 className="w-4 h-4 text-primary" />Contato e redes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={form.socials?.instagram || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, instagram: e.target.value } })} placeholder="https://instagram.com/seuperfil" />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input value={form.socials?.facebook || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, facebook: e.target.value } })} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input value={form.socials?.tiktok || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, tiktok: e.target.value } })} placeholder="https://tiktok.com/@..." />
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Input value={form.socials?.site || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, site: e.target.value } })} placeholder="https://seusite.com" />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Exibir contato no perfil público</p>
              <p className="text-xs text-muted-foreground">Mostra WhatsApp e email para qualquer visitante.</p>
            </div>
            <Switch checked={!!form.showContact} onCheckedChange={(v) => setForm({ ...form, showContact: v })} />
          </div>
        </CardContent>
      </Card>

      <Button variant="gold" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        <Save className="w-4 h-4 mr-2" />
        {saving ? 'Salvando...' : 'Salvar Perfil'}
      </Button>
    </motion.div>
  );
};

export default PartnerProfilePage;
