import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Check, Wine, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCompanyById, getMenuById } from '@/data/mockData';
import { useQuoteStore } from '@/store/quoteStore';

const MenuDetailPage = () => {
  const { companyId, menuId } = useParams();
  const navigate = useNavigate();
  const { briefing, setSelectedCompany, setSelectedMenu } = useQuoteStore();

  const company = getCompanyById(companyId || '');
  const menu = getMenuById(menuId || '');

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

  const handleSelectMenu = () => {
    setSelectedCompany(company.id);
    setSelectedMenu(menu.id);
    navigate(`/empresas/${companyId}/cardapios/${menuId}/valores`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-8 md:py-12">
        <div className="container max-w-4xl">
          {/* Navigation */}
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium p-6 md:p-8"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{company.name}</span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  {menu.name}
                </h1>
                <p className="text-muted-foreground mb-6">
                  {menu.description}
                </p>

                {/* Meta */}
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
              </motion.div>

              {/* What's Included */}
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

              {/* Drinks */}
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
            </div>

            {/* Sidebar - Pricing */}
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
