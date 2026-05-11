import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, GlassWater, Clock, Users, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
import { serviceCategories } from '@/data/mockData';
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
  serviceCategory: undefined as ServiceCategory | undefined,
  coverage: [] as CoverageArea[],
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
      serviceCategory: pkg.serviceCategory,
      coverage: pkg.coverage ? [...pkg.coverage] : [],
    });
    setDialogOpen(true);
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
    if (!form.name || form.pricePerPerson <= 0) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }
    if (!form.serviceCategory) {
      toast({ title: 'Selecione a categoria do pacote', variant: 'destructive' });
      return;
    }
    if (!form.coverage || form.coverage.length === 0) {
      toast({ title: 'Adicione ao menos uma cidade de atendimento', variant: 'destructive' });
      return;
    }
    if (editingId) {
      updatePackage(editingId, form);
      toast({ title: 'Pacote atualizado!' });
    } else {
      const ok = await addPackage(form);
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
              <Card className="border-border/60 hover:border-primary/30 transition-colors h-full">
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
                      Mín. {pkg.minPeople}
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

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria do pacote *</Label>
              <RadioGroup
                value={form.serviceCategory || ''}
                onValueChange={(v) => setForm({ ...form, serviceCategory: v as ServiceCategory })}
                className="grid gap-2"
              >
                {serviceCategories.map((cat) => (
                  <label
                    key={cat.value}
                    htmlFor={`cat-${cat.value}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} className="mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground block">{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-3 gap-3">
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
