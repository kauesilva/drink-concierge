import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, GlassWater, Clock, Users, DollarSign, MapPin, ImageIcon } from 'lucide-react';
import GalleryUploader from '@/components/partners/GalleryUploader';
import { apiUploadImage } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePartnerStore, type DrinkPackage } from '@/store/partnerStore';
import { toast } from '@/hooks/use-toast';
import { serviceCategories, eventTypes } from '@/data/mockData';
import { brazilianStates, getCitiesByUF } from '@/data/brazilLocations';
import type { CoverageArea, ServiceCategory } from '@/types';

const emptyPkg = {
  name: '',
  description: '',
  includes: [] as string[],
  drinks: [] as string[],
  durationHours: 4,
  pricePerPerson: 0,
  minPeople: 30,
  maxPeople: undefined as number | undefined,
  serviceCategory: undefined as ServiceCategory | undefined,
  coverage: [] as CoverageArea[],
  eventTypes: [] as string[],
  coverImage: '',
  gallery: [] as string[],
  hourlyRate: 0,
  minHours: 5,
  includesSetup: false,
  setupHours: 1 as number | undefined,
  allowsOvertime: false,
  overtimeHourlyRate: 0 as number | undefined,
};

const PartnerPackagesPage = () => {
  const { packages, addPackage, updatePackage, deletePackage } = usePartnerStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyPkg });
  const [includeInput, setIncludeInput] = useState('');
  const [drinkInput, setDrinkInput] = useState('');

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyPkg });
    setDialogOpen(true);
  };

  const openEdit = (pkg: DrinkPackage) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      description: pkg.description,
      includes: [...pkg.includes],
      drinks: [...pkg.drinks],
      durationHours: pkg.durationHours,
      pricePerPerson: pkg.pricePerPerson,
      minPeople: pkg.minPeople,
      maxPeople: pkg.maxPeople,
      serviceCategory: pkg.serviceCategory,
      coverage: pkg.coverage ? [...pkg.coverage] : [],
      eventTypes: pkg.eventTypes ? [...pkg.eventTypes] : [],
      coverImage: pkg.coverImage || '',
      gallery: pkg.gallery ? [...pkg.gallery] : [],
      hourlyRate: pkg.hourlyRate ?? 0,
      minHours: pkg.minHours ?? 5,
      includesSetup: !!pkg.includesSetup,
      setupHours: pkg.setupHours ?? 1,
      allowsOvertime: !!pkg.allowsOvertime,
      overtimeHourlyRate: pkg.overtimeHourlyRate ?? 0,
    });
    setDialogOpen(true);
  };

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploadingCover(true);
    try {
      const { url } = await apiUploadImage(file);
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch (err: any) {
      toast({ title: 'Falha no upload', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const addItem = (field: 'includes' | 'drinks', value: string, setter: (v: string) => void) => {
    const val = value.trim();
    if (val && !form[field].includes(val)) {
      setForm({ ...form, [field]: [...form[field], val] });
      setter('');
    }
  };

  const removeItem = (field: 'includes' | 'drinks', item: string) => {
    setForm({ ...form, [field]: form[field].filter((i) => i !== item) });
  };

  // Coverage helpers
  const [coverageState, setCoverageState] = useState<string>('');
  const coverageCities = coverageState ? getCitiesByUF(coverageState) : [];

  const toggleCoverageCity = (city: string) => {
    if (!coverageState) return;
    const existing = form.coverage.find((c) => c.state === coverageState);
    let next: CoverageArea[];
    if (existing) {
      const has = existing.cities.includes(city);
      const cities = has
        ? existing.cities.filter((c) => c !== city)
        : [...existing.cities, city];
      next = cities.length === 0
        ? form.coverage.filter((c) => c.state !== coverageState)
        : form.coverage.map((c) => (c.state === coverageState ? { ...c, cities } : c));
    } else {
      next = [...form.coverage, { state: coverageState, cities: [city] }];
    }
    setForm({ ...form, coverage: next });
  };

  const removeCoverageState = (uf: string) => {
    setForm({ ...form, coverage: form.coverage.filter((c) => c.state !== uf) });
  };

  const isCityInCoverage = (city: string) => {
    const c = form.coverage.find((c) => c.state === coverageState);
    return !!c?.cities.includes(city);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast({ title: 'Preencha o nome do pacote', variant: 'destructive' });
      return;
    }
    if (!form.serviceCategory) {
      toast({ title: 'Selecione a categoria do pacote', variant: 'destructive' });
      return;
    }
    const isLabor = form.serviceCategory === 'mao-de-obra';
    if (isLabor) {
      if (!form.hourlyRate || form.hourlyRate <= 0) {
        toast({ title: 'Informe o valor por hora', variant: 'destructive' });
        return;
      }
      if (!form.minHours || form.minHours < 1) {
        toast({ title: 'Informe o mínimo de horas', variant: 'destructive' });
        return;
      }
      if (form.allowsOvertime && (!form.overtimeHourlyRate || form.overtimeHourlyRate <= 0)) {
        toast({ title: 'Informe o valor da hora extra', variant: 'destructive' });
        return;
      }
      // Limite de 1 pacote de mão de obra
      const exists = packages.some(
        (p) => p.serviceCategory === 'mao-de-obra' && p.id !== editingId,
      );
      if (exists) {
        toast({
          title: 'Você já possui um pacote de mão de obra',
          description: 'Apenas 1 pacote de mão de obra é permitido por parceiro.',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (form.pricePerPerson <= 0) {
        toast({ title: 'Informe o preço por pessoa', variant: 'destructive' });
        return;
      }
      if (form.maxPeople && form.maxPeople < form.minPeople) {
        toast({ title: 'O máximo de pessoas deve ser maior ou igual ao mínimo', variant: 'destructive' });
        return;
      }
    }
    if (!form.coverage || form.coverage.length === 0) {
      toast({ title: 'Adicione ao menos uma cidade de atendimento', variant: 'destructive' });
      return;
    }
    // Normaliza o payload conforme o tipo do pacote
    const payload = isLabor
      ? {
          ...form,
          pricePerPerson: 0,
          minPeople: 0,
          maxPeople: undefined,
          drinks: [],
        }
      : {
          ...form,
          hourlyRate: undefined,
          minHours: undefined,
          includesSetup: false,
          setupHours: undefined,
          allowsOvertime: false,
          overtimeHourlyRate: undefined,
        };
    if (editingId) {
      updatePackage(editingId, payload);
      toast({ title: 'Pacote atualizado!' });
    } else {
      const ok = await addPackage(payload);
      if (!ok) {
        toast({ title: 'Limite de 4 pacotes atingido', variant: 'destructive' });
        return;
      }
      toast({ title: 'Pacote criado!' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deletePackage(id);
    toast({ title: 'Pacote removido.' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Meus Pacotes</h1>
        <Button
          variant="gold"
          onClick={openNew}
          disabled={packages.length >= 4}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pacote
          {packages.length >= 4 && <span className="ml-1 text-xs opacity-70">(máx 4)</span>}
        </Button>
      </div>

      {packages.length === 0 && (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="py-16 text-center text-muted-foreground">
            <GlassWater className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhum pacote criado</p>
            <p className="text-sm mt-1">Adicione até 4 pacotes de drinks para seus clientes.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-border/60 hover:border-primary/30 transition-colors h-full overflow-hidden">
                {pkg.coverImage && (
                  <div
                    className="relative h-32 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${pkg.coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(pkg)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {pkg.serviceCategory && (
                    <Badge variant="outline" className="text-xs">
                      {serviceCategories.find((c) => c.value === pkg.serviceCategory)?.label}
                    </Badge>
                  )}
                  {pkg.description && <p className="text-muted-foreground">{pkg.description}</p>}
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      R$ {pkg.pricePerPerson}/pessoa
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.durationHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {pkg.maxPeople ? `${pkg.minPeople}–${pkg.maxPeople} pessoas` : `Mín. ${pkg.minPeople}`}
                    </span>
                  </div>
                  {pkg.coverage && pkg.coverage.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        {pkg.coverage
                          .map((c) => `${c.state}: ${c.cities.slice(0, 3).join(', ')}${c.cities.length > 3 ? '...' : ''}`)
                          .join(' • ')}
                      </span>
                    </div>
                  )}
                  {pkg.gallery && pkg.gallery.length > 0 && (
                    <div className="flex gap-1.5">
                      {pkg.gallery.slice(0, 5).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Foto ${i + 1}`}
                          className="w-10 h-10 rounded object-cover border border-border"
                        />
                      ))}
                    </div>
                  )}
                  {pkg.drinks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.drinks.map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Pacote' : 'Novo Pacote'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Atualize as informações do pacote.' : 'Crie um novo pacote de drinks.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do pacote *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Open Bar Premium"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva o que está incluído..."
                rows={3}
              />
            </div>

            {/* Foto de capa */}
            <div className="space-y-2">
              <Label>Foto de capa do pacote</Label>
              <p className="text-xs text-muted-foreground">
                Aparece ao fundo do card do pacote. Use uma imagem horizontal (16:9) para melhor resultado.
              </p>
              {form.coverImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border group">
                  <img src={form.coverImage} alt="Capa do pacote" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, coverImage: '' }))}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 text-background flex items-center justify-center"
                    aria-label="Remover capa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImageIcon className="w-7 h-7 mb-1" />
                  <span className="text-sm">{uploadingCover ? 'Enviando...' : 'Adicionar foto de capa'}</span>
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </div>

            {/* Galeria */}
            <div className="space-y-2">
              <Label>Galeria do pacote (até 5 fotos)</Label>
              <p className="text-xs text-muted-foreground">
                Mostre exemplos do serviço, drinks e decoração.
              </p>
              <GalleryUploader
                images={form.gallery}
                onChange={(gallery) => setForm((p) => ({ ...p, gallery }))}
                max={5}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria do pacote *</Label>
              <RadioGroup
                value={form.serviceCategory || ''}
                onValueChange={(v) => setForm({ ...form, serviceCategory: v as ServiceCategory })}
                className="grid gap-2"
              >
                {serviceCategories.map((cat) => {
                  const laborTaken =
                    cat.value === 'mao-de-obra' &&
                    packages.some(
                      (p) => p.serviceCategory === 'mao-de-obra' && p.id !== editingId,
                    );
                  return (
                    <label
                      key={cat.value}
                      htmlFor={`cat-${cat.value}`}
                      className={`flex items-start gap-3 p-3 rounded-lg border border-border transition-colors ${
                        laborTaken
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-secondary/40 cursor-pointer'
                      }`}
                    >
                      <RadioGroupItem
                        value={cat.value}
                        id={`cat-${cat.value}`}
                        className="mt-0.5"
                        disabled={laborTaken}
                      />
                      <div>
                        <span className="font-medium text-foreground block">{cat.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {cat.description}
                          {laborTaken && ' — você já possui um pacote de mão de obra.'}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {form.serviceCategory === 'mao-de-obra' ? (
              <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                <p className="text-xs text-muted-foreground">
                  Pacote de mão de obra é cobrado por hora, não por pessoa.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Valor por hora (R$) *</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.hourlyRate || ''}
                      onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mínimo de horas *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.minHours || ''}
                      onChange={(e) => setForm({ ...form, minHours: Number(e.target.value) })}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border">
                  <div>
                    <p className="text-sm font-medium">Inclui montagem prévia?</p>
                    <p className="text-xs text-muted-foreground">
                      Chegada antecipada para preparação do bar.
                    </p>
                  </div>
                  <Switch
                    checked={form.includesSetup}
                    onCheckedChange={(v) => setForm({ ...form, includesSetup: v })}
                  />
                </div>
                {form.includesSetup && (
                  <div className="space-y-2">
                    <Label>Horas de antecedência</Label>
                    <Select
                      value={String(form.setupHours ?? 1)}
                      onValueChange={(v) => setForm({ ...form, setupHours: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora antes</SelectItem>
                        <SelectItem value="2">2 horas antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border">
                  <div>
                    <p className="text-sm font-medium">Permite hora extra?</p>
                    <p className="text-xs text-muted-foreground">
                      Cliente pode estender o evento mediante cobrança adicional.
                    </p>
                  </div>
                  <Switch
                    checked={form.allowsOvertime}
                    onCheckedChange={(v) => setForm({ ...form, allowsOvertime: v })}
                  />
                </div>
                {form.allowsOvertime && (
                  <div className="space-y-2">
                    <Label>Valor da hora extra (R$)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.overtimeHourlyRate || ''}
                      onChange={(e) =>
                        setForm({ ...form, overtimeHourlyRate: Number(e.target.value) })
                      }
                      placeholder="80"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Preço/pessoa *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.pricePerPerson || ''}
                    onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })}
                    placeholder="90"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (h)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mín. pessoas</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.minPeople}
                    onChange={(e) => setForm({ ...form, minPeople: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máx. pessoas</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.maxPeople ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxPeople: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Sem limite"
                  />
                </div>
              </div>
            )}


            {/* Tipos de evento atendidos */}
            <div className="space-y-2">
              <Label>Tipos de evento atendidos</Label>
              <p className="text-xs text-muted-foreground">
                Marque os tipos compatíveis. Se nenhum for marcado, o pacote será considerado para qualquer tipo de evento.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {eventTypes.map((ev) => {
                  const checked = form.eventTypes.includes(ev.value);
                  return (
                    <label
                      key={ev.value}
                      className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-border hover:bg-secondary/40"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          setForm((prev) => ({
                            ...prev,
                            eventTypes: checked
                              ? prev.eventTypes.filter((t) => t !== ev.value)
                              : [...prev.eventTypes, ev.value],
                          }))
                        }
                      />
                      <span>{ev.icon} {ev.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Includes */}
            <div className="space-y-2">
              <Label>O que inclui</Label>
              <div className="flex gap-2">
                <Input
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  placeholder="Ex: Bartender profissional"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('includes', includeInput, setIncludeInput))}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => addItem('includes', includeInput, setIncludeInput)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.includes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.includes.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1 pr-1">
                      {item}
                      <button onClick={() => removeItem('includes', item)}><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Drinks */}
            <div className="space-y-2">
              <Label>Drinks</Label>
              <div className="flex gap-2">
                <Input
                  value={drinkInput}
                  onChange={(e) => setDrinkInput(e.target.value)}
                  placeholder="Ex: Caipirinha"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('drinks', drinkInput, setDrinkInput))}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => addItem('drinks', drinkInput, setDrinkInput)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.drinks.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.drinks.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1 pr-1">
                      {item}
                      <button onClick={() => removeItem('drinks', item)}><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Coverage / Region */}
            <div className="space-y-2">
              <Label>Cidades atendidas por este pacote *</Label>
              <p className="text-xs text-muted-foreground">
                Escolha o estado e marque as cidades. Repita para adicionar outros estados.
              </p>

              <Select value={coverageState} onValueChange={setCoverageState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {brazilianStates.map((s) => (
                    <SelectItem key={s.uf} value={s.uf}>
                      {s.uf} — {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {coverageState && (
                <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {coverageCities.map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground"
                      >
                        <Checkbox
                          checked={isCityInCoverage(city)}
                          onCheckedChange={() => toggleCoverageCity(city)}
                        />
                        <span>{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.coverage.length > 0 && (
                <div className="space-y-2 mt-2">
                  {form.coverage.map((c) => (
                    <div key={c.state} className="border border-border rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{c.state}</span>
                        <button
                          onClick={() => removeCoverageState(c.state)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.cities.map((city) => (
                          <Badge key={city} variant="secondary" className="text-xs">{city}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleSave}>
              {editingId ? 'Salvar' : 'Criar Pacote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PartnerPackagesPage;
