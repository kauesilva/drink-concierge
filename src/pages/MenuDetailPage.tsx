import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Check, Wine, ChevronRight, Loader2, Plus, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCompanyDetail, useCompanyMenus } from '@/hooks/useCompanies';
import { useQuoteStore } from '@/store/quoteStore';
import { useToast } from '@/hooks/use-toast';
import QuoteSelectionCard from '@/components/menus/QuoteSelectionCard';

const MenuDetailPage = () => {
  const { companyId, menuId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    briefing,
    selectedCompanyId,
    selectedMenuIds,
    addMenuToSelection,
    removeMenuFromSelection,
    clearSelection,
  } = useQuoteStore();
  const [crossCompanyOpen, setCrossCompanyOpen] = useState(false);

  const { data: company, isLoading: loadingCompany } = useCompanyDetail(companyId);
  const { data: menus, isLoading: loadingMenus } = useCompanyMenus(companyId);

  const menu = menus?.find(m => m.id === menuId);

  if (loadingCompany || loadingMenus) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!company || !menu) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Cardápio não encontrado</h1>
          <Button asChild variant="gold">
            <Link to="/resultados">Voltar aos resultados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const people = briefing.people || 50;
  const estimatedTotal = menu.pricePerPerson * people;
  const meetsMinimum = people >= menu.minPeople;
  const inSelection = selectedMenuIds.includes(menu.id);
  const isDifferentCompany =
    !!selectedCompanyId && selectedCompanyId !== company.id && selectedMenuIds.length > 0;

  const doAdd = () => {
    addMenuToSelection(company.id, menu.id);
    toast({ title: 'Pacote adicionado ao orçamento' });
  };

  const handleAddClick = () => {
    if (inSelection) {
      removeMenuFromSelection(menu.id);
      toast({ title: 'Pacote removido do orçamento' });
      return;
    }
    if (isDifferentCompany) {
      setCrossCompanyOpen(true);
      return;
    }
    doAdd();
  };

  const handleSelectMenu = () => {
    if (!inSelection) {
      if (isDifferentCompany) {
        setCrossCompanyOpen(true);
        return;
      }
      addMenuToSelection(company.id, menu.id);
    }
    navigate(`/empresas/${companyId}/cardapios/${menuId}/valores`);
  };

  const confirmSwitchCompany = () => {
    clearSelection();
    addMenuToSelection(company.id, menu.id);
    setCrossCompanyOpen(false);
    toast({ title: 'Seleção trocada para esta empresa' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium overflow-hidden"
              >
                {menu.coverImage && (
                  <div className="relative w-full h-56 md:h-72 bg-secondary">
                    <img
                      src={menu.coverImage}
                      alt={menu.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <p className="text-sm opacity-90">{company.name}</p>
                      <h1 className="font-display text-2xl md:text-3xl font-semibold">
                        {menu.name}
                      </h1>
                    </div>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  {!menu.coverImage && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{company.name}</span>
                      </div>
                      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                        {menu.name}
                      </h1>
                    </>
                  )}
                  <p className="text-muted-foreground mb-6">
                    {menu.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">{menu.durationHours} horas de serviço</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">Mínimo {menu.minPeople} pessoas</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {menu.gallery && menu.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="font-display text-xl font-semibold mb-4">
                    Galeria do serviço
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {menu.gallery.map((src, idx) => (
                      <a
                        key={idx}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-square overflow-hidden rounded-lg bg-secondary"
                      >
                        <img
                          src={src}
                          alt={`${menu.name} - foto ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {menu.includes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    O que inclui
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {menu.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {menu.drinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Wine className="w-5 h-5 text-primary" />
                    Drinks servidos
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {menu.drinks.map((drink, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/20 rounded-full text-sm text-foreground"
                      >
                        {drink}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-premium p-6 sticky top-24"
              >
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Valor por pessoa</p>
                  <p className="text-3xl font-semibold text-foreground">
                    R$ {menu.pricePerPerson}
                  </p>
                </div>

                <div className="space-y-3 pb-6 border-b border-border/50 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pessoas no seu evento</span>
                    <span className="font-medium text-foreground">{people}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor estimado</span>
                    <span className="font-semibold text-foreground">
                      R$ {estimatedTotal.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {!meetsMinimum && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
                    <p className="text-sm text-amber-700">
                      ⚠️ Este cardápio exige mínimo de {menu.minPeople} pessoas. 
                      Seu evento tem {people}.
                    </p>
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleSelectMenu}
                >
                  Ver valores
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Valor final sujeito a confirmação
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuDetailPage;
