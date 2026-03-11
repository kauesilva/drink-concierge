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
      className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-gold transition-all duration-300"
    >
      <div className="mb-4">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          {menu.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {menu.description}
        </p>
      </div>

      <div className="flex gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{menu.durationHours}h</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>Mín. {menu.minPeople}</span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Inclui
        </p>
        <ul className="space-y-2">
          {menu.includes.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">{item}</span>
            </li>
          ))}
          {menu.includes.length > 4 && (
            <li className="text-sm text-muted-foreground pl-6">
              +{menu.includes.length - 4} itens
            </li>
          )}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-2xl font-bold text-foreground">
          R$ {menu.pricePerPerson}
          <span className="text-sm font-normal text-muted-foreground">/pessoa</span>
        </p>
        <Button asChild variant="gold-outline" size="sm">
          <Link to={`/empresas/${companyId}/cardapios/${menu.id}`}>
            Detalhes
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
