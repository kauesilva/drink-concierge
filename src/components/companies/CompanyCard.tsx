import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { Company } from '@/types';
import { getMenusByCompany } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import RatingStars from '@/components/shared/RatingStars';
import BadgePremium from '@/components/shared/BadgePremium';

interface CompanyCardProps {
  company: Company;
  index?: number;
}

const CompanyCard = ({ company, index = 0 }: CompanyCardProps) => {
  const menus = getMenusByCompany(company.id);
  const minPrice = Math.min(...menus.map(m => m.pricePerPerson));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-gold transition-all duration-300"
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-secondary flex-shrink-0 overflow-hidden">
            <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-lg font-bold text-foreground truncate">
                {company.name}
              </h3>
              {company.badge && <BadgePremium type={company.badge} className="flex-shrink-0" />}
            </div>
            <RatingStars rating={company.rating} totalReviews={company.totalReviews} size="sm" />
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{company.cityBase}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">A partir de</p>
            <p className="text-lg font-bold text-foreground">
              R$ {minPrice}<span className="text-sm font-normal text-muted-foreground">/pessoa</span>
            </p>
          </div>
          <Button asChild variant="gold" size="sm">
            <Link to={`/empresas/${company.id}`}>
              Ver cardápios
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
