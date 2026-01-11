import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChevronRight, Check } from 'lucide-react';
import { Menu } from '@/types';
import { Button } from '@/components/ui/button';

interface MenuCardProps {
  menu: Menu;
  companyId: string;
  index?: number;
}

const MenuCard = ({ menu, companyId, index = 0 }: MenuCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-premium p-5 md:p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {menu.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {menu.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex gap-4 mb-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{menu.durationHours}h de serviço</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>Mín. {menu.minPeople} pessoas</span>
        </div>
      </div>

      {/* Includes Preview */}
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          O que inclui
        </p>
        <ul className="space-y-1.5">
          {menu.includes.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">{item}</span>
            </li>
          ))}
          {menu.includes.length > 4 && (
            <li className="text-sm text-muted-foreground pl-5">
              +{menu.includes.length - 4} itens
            </li>
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground">
            R$ {menu.pricePerPerson}
            <span className="text-sm font-normal text-muted-foreground">/pessoa</span>
          </p>
        </div>

        <Button asChild variant="gold-outline" size="sm">
          <Link to={`/empresas/${companyId}/cardapios/${menu.id}`}>
            Ver detalhes
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
