import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChevronRight, Star, GlassWater } from 'lucide-react';
import { Menu, Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageMatch } from '@/lib/matching';

interface PackageResultCardProps {
  menu: Menu & { match?: PackageMatch };
  company: Company;
  index?: number;
}

const PackageResultCard = ({ menu, company, index = 0 }: PackageResultCardProps) => {
  const cover = menu.coverImage;
  const isLabor = menu.serviceCategory === 'mao-de-obra';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-gold transition-all duration-300"
    >
      <div className="relative h-40 w-full bg-gradient-to-br from-secondary to-muted overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={menu.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <GlassWater className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
        {isLabor && (
          <Badge className="absolute top-3 left-3" variant="secondary">
            Mão de obra
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-background bg-background flex-shrink-0">
            <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{company.name}</p>
            {company.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>{company.rating.toFixed(1)}</span>
                <span>· {company.totalReviews}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground line-clamp-1">
            {menu.name}
          </h3>
          {menu.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {menu.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {isLabor ? (
            <>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>Mín. {menu.minHours ?? 0}h</span>
              </div>
              {menu.includesSetup && (
                <div className="flex items-center gap-1.5">
                  <span>Inclui montagem {menu.setupHours ?? 1}h antes</span>
                </div>
              )}
              {menu.allowsOvertime && (
                <div className="flex items-center gap-1.5">
                  <span>Hora extra: R$ {menu.overtimeHourlyRate ?? 0}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{menu.durationHours}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span>Mín. {menu.minPeople}</span>
              </div>
            </>
          )}
        </div>

        {menu.match?.reasons && menu.match.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {menu.match.reasons.slice(0, 3).map((r) => (
              <Badge key={r} variant="secondary" className="text-xs font-normal">
                {r}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">A partir de</p>
            <p className="text-lg font-bold text-foreground">
              {!isLabor && menu.pricePerPerson <= 0 ? (
                <span className="text-base">A combinar</span>
              ) : (
                <>
                  R$ {isLabor ? menu.hourlyRate ?? 0 : menu.pricePerPerson}
                  <span className="text-sm font-normal text-muted-foreground">
                    {isLabor ? '/hora' : '/pessoa'}
                  </span>
                </>
              )}
            </p>
          </div>
          <Button asChild variant="gold" size="sm">
            <Link to={`/empresas/${company.id}/cardapios/${menu.id}`}>
              Detalhes
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageResultCard;
