import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuoteStore } from '@/store/quoteStore';
import { useCompanyMenus, useCompanyDetail } from '@/hooks/useCompanies';

interface QuoteSelectionCardProps {
  people: number;
}

const QuoteSelectionCard = ({ people }: QuoteSelectionCardProps) => {
  const { selectedCompanyId, selectedMenuIds, removeMenuFromSelection } = useQuoteStore();
  const { data: company } = useCompanyDetail(selectedCompanyId || undefined);
  const { data: menus } = useCompanyMenus(selectedCompanyId || undefined);

  if (!selectedCompanyId || selectedMenuIds.length === 0) return null;

  const selected = (menus || []).filter((m) => selectedMenuIds.includes(m.id));
  const total = selected.reduce((acc, m) => acc + m.pricePerPerson * people, 0);
  const firstId = selectedMenuIds[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-5 border-2 border-primary/30 bg-primary/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-4 h-4 text-primary" />
        <h3 className="font-display text-base font-semibold text-foreground">
          Seu orçamento
        </h3>
        {company && (
          <span className="text-sm text-muted-foreground truncate">· {company.name}</span>
        )}
      </div>

      <ul className="space-y-2 mb-4">
        <AnimatePresence initial={false}>
          {selected.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-background border border-border"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground">
                  R$ {m.pricePerPerson}/pessoa × {people}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-semibold text-foreground">
                  R$ {(m.pricePerPerson * people).toLocaleString('pt-BR')}
                </span>
                <button
                  type="button"
                  aria-label={`Remover ${m.name}`}
                  onClick={() => removeMenuFromSelection(m.id)}
                  className="w-7 h-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex items-center justify-between pt-3 border-t border-border/60 mb-4">
        <span className="text-sm text-muted-foreground">Subtotal estimado</span>
        <span className="text-lg font-bold text-primary">
          R$ {total.toLocaleString('pt-BR')}
        </span>
      </div>

      <Button asChild variant="gold" size="sm" className="w-full">
        <Link to={`/empresas/${selectedCompanyId}/cardapios/${firstId}/valores`}>
          Ver valores e finalizar
          <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>
    </motion.div>
  );
};

export default QuoteSelectionCard;
