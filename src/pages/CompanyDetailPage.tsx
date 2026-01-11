import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Check, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import MenuCard from '@/components/menus/MenuCard';
import RatingStars from '@/components/shared/RatingStars';
import BadgePremium from '@/components/shared/BadgePremium';
import { getCompanyById, getMenusByCompany } from '@/data/mockData';

const CompanyDetailPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const company = getCompanyById(companyId || '');
  const menus = getMenusByCompany(companyId || '');

  if (!company) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Empresa não encontrada</h1>
          <Button asChild variant="gold">
            <Link to="/resultados">Voltar aos resultados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
        {/* Hero */}
        <div className="bg-foreground text-background py-8 md:py-12">
          <div className="container max-w-4xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-6 text-background/70 hover:text-background hover:bg-background/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Company Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-background/10 flex-shrink-0 overflow-hidden">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <h1 className="font-display text-2xl md:text-3xl font-semibold">
                    {company.name}
                  </h1>
                  {company.badge && <BadgePremium type={company.badge} />}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <RatingStars 
                    rating={company.rating} 
                    totalReviews={company.totalReviews} 
                    size="md" 
                  />
                  <div className="flex items-center gap-1 text-background/70">
                    <MapPin className="w-4 h-4" />
                    <span>{company.cityBase}</span>
                  </div>
                </div>

                <p className="text-background/80 max-w-2xl">
                  {company.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-4xl py-8 md:py-12">
          {/* Areas Served */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-5 md:p-6 mb-8"
          >
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Áreas atendidas
            </h2>
            <div className="flex flex-wrap gap-2">
              {company.areasServed.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-secondary rounded-full text-sm text-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Shield, label: 'Empresa verificada' },
              { icon: Star, label: 'Avaliações reais' },
              { icon: Check, label: 'Contrato garantido' },
              { icon: MapPin, label: 'Atende sua região' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Menus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-semibold mb-6">
              Cardápios disponíveis
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {menus.map((menu, index) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  companyId={company.id}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetailPage;
