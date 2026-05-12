import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/mockData';
import type { ServiceCategory } from '@/types';

export interface PartnerCardData {
  id: string | number;
  name: string;
  title?: string;
  shortDescription?: string;
  image?: string;
  cityBase?: string;
  state?: string;
  serviceCategories?: ServiceCategory[];
}

const PartnerCard = ({ partner }: { partner: PartnerCardData }) => {
  const catLabel = (v: string) => serviceCategories.find((c) => c.value === v)?.label || v;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
    >
      <Link to={`/parceiros/${partner.id}`} className="block">
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          {partner.image ? (
            <img
              src={partner.image}
              alt={partner.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {partner.name}
          </h3>
          {partner.title && (
            <p className="text-sm text-muted-foreground line-clamp-1">{partner.title}</p>
          )}
        </div>
        {(partner.cityBase || partner.state) && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{[partner.cityBase, partner.state].filter(Boolean).join(' / ')}</span>
          </div>
        )}
        {partner.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{partner.shortDescription}</p>
        )}
        {!!partner.serviceCategories?.length && (
          <div className="flex flex-wrap gap-1.5">
            {partner.serviceCategories.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs font-normal">
                {catLabel(c)}
              </Badge>
            ))}
          </div>
        )}
        <Button asChild variant="outline" size="sm" className="w-full mt-2">
          <Link to={`/parceiros/${partner.id}`}>
            Ver perfil <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
};

export default PartnerCard;
