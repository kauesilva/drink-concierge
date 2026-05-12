import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePartnerStore } from '@/store/partnerStore';
import { toast } from '@/hooks/use-toast';
import { apiUploadImage } from '@/services/api';
import StateCitySelect from '@/components/shared/StateCitySelect';
import { serviceCategories } from '@/data/mockData';
import type { ServiceCategory } from '@/types';

const PartnerProfilePage = () => {
  const { profile, updateProfile } = usePartnerStore();
  const [form, setForm] = useState({ ...profile });
  const [areaInput, setAreaInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Hidrata o formulário quando o profile é carregado da API
  useEffect(() => {
    setForm((prev) => ({ ...prev, ...profile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.apiId]);

  const [uploading, setUploading] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Selecione um arquivo de imagem', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const { url } = await apiUploadImage(file);
      setForm((prev) => ({ ...prev, coverImage: url }));
      toast({ title: 'Imagem enviada', description: 'Lembre de salvar o perfil para confirmar.' });
    } catch (err: any) {
      toast({ title: 'Falha no upload', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addArea = () => {
    const val = areaInput.trim();
    if (val && !form.areasServed.includes(val)) {
      setForm({ ...form, areasServed: [...form.areasServed, val] });
      setAreaInput('');
    }
  };

  const removeArea = (area: string) => {
    setForm({ ...form, areasServed: form.areasServed.filter((a) => a !== area) });
  };

  const [saving, setSaving] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="font-display text-2xl font-bold">Meu Perfil</h1>

      {/* Cover Image */}
      <Card className="overflow-hidden border-border/60">
        <div
          className="relative h-48 bg-muted flex items-center justify-center cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          {form.coverImage ? (
            <img src={form.coverImage} alt="Capa" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-muted-foreground">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Clique para adicionar foto de capa</span>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
            {uploading ? (
              <span className="text-sm font-medium text-background bg-foreground/60 px-3 py-1 rounded">Enviando...</span>
            ) : (
              <Camera className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da empresa</Label>
              <Input
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="Nome do seu negócio"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sobre</Label>
            <Textarea
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Descreva seu negócio, experiência e diferenciais..."
              rows={4}
            />
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
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Tipos de serviço */}
          <div className="space-y-2">
            <Label>Tipos de serviço que ofereço *</Label>
            <p className="text-xs text-muted-foreground">
              Selecione um ou mais. Clientes só verão você nas categorias marcadas.
            </p>
            <div className="grid gap-2 mt-2">
              {serviceCategories.map((cat) => {
                const checked = form.serviceCategories?.includes(cat.value as ServiceCategory);
                return (
                  <label
                    key={cat.value}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={!!checked}
                      onCheckedChange={() => toggleCategory(cat.value as ServiceCategory)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-foreground block">{cat.label}</span>
                      <span className="text-sm text-muted-foreground">{cat.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Areas Served */}
          <div className="space-y-2">
            <Label>Áreas atendidas</Label>
            <div className="flex gap-2">
              <Input
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                placeholder="Adicionar região"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addArea}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.areasServed.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.areasServed.map((area) => (
                  <Badge key={area} variant="secondary" className="gap-1 pr-1">
                    {area}
                    <button onClick={() => removeArea(area)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button variant="gold" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PartnerProfilePage;
