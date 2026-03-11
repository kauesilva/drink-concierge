import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Wine } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <Wine className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Bartender Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/orcamento" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pedir Orçamento
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild variant="gold" size="lg">
              <Link to="/orcamento">Receber Orçamento</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-foreground py-2"
              >
                Início
              </Link>
              <Link 
                to="/orcamento" 
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-foreground py-2"
              >
                Pedir Orçamento
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-muted-foreground py-2"
              >
                Painel Admin
              </Link>
              <Button asChild variant="gold" size="lg" className="mt-2">
                <Link to="/orcamento" onClick={() => setIsMenuOpen(false)}>
                  Receber Orçamento
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
