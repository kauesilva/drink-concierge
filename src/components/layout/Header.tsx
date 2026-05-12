import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wine, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleComoFunciona = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wine className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              Meu Bartender Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Início
            </Link>
            <Link
              to="/orcamento"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/orcamento' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Orçamento
            </Link>
            <Link
              to="/parceiros"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/parceiros') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Encontre seu Bartender
            </Link>
            <a
              href="#como-funciona"
              onClick={handleComoFunciona}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Como funciona
            </a>
            {isAuthenticated && user?.role === 'parceiro' && (
              <Link
                to="/parceiro/painel/perfil"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/parceiro') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Painel
              </Link>
            )}
          </nav>

          {/* CTA / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Olá, {user?.nome?.split(' ')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild variant="gold" size="sm">
                  <Link to="/cadastro">Cadastre-se</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-1 py-4 border-t border-border/40">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors">
                  Início
                </Link>
                <Link to="/orcamento" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors">
                  Pedir Orçamento
                </Link>
                <Link to="/parceiros" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors">
                  Encontre seu Bartender
                </Link>
                <a href="#como-funciona" onClick={handleComoFunciona} className="text-base font-medium text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  Como Funciona
                </a>
                {isAuthenticated && user?.role === 'parceiro' && (
                  <Link to="/parceiro/painel/perfil" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors">
                    Painel
                  </Link>
                )}
                {isAuthenticated ? (
                  <Button variant="outline" size="lg" className="mt-3" onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Sair
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="lg" className="mt-3">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                    </Button>
                    <Button asChild variant="gold" size="lg" className="mt-2">
                      <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>Cadastre-se</Link>
                    </Button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
