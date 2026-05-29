import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import logo from '@/assets/logo-meu-bartender.png';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { usePartnerStore } from '@/store/partnerStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout: authLogout } = useAuthStore();
  const partnerLogout = usePartnerStore((s) => s.logout);

  const logout = () => {
    authLogout();
    partnerLogout();
    navigate('/', { replace: true });
  };

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

  const navLinkClass = (active: boolean) =>
    `font-medium transition-colors ${active ? 'text-white' : 'text-white/70 hover:text-white'} text-base`;

  const outlineWhite =
    'border-white/50 bg-transparent hover:bg-white hover:text-primary text-gray-950';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-white/10">
      <div className="container my-[10px] py-[10px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="Meu Bartender"
              className="h-auto w-[160px] md:w-[180px] group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass(location.pathname === '/')}>
              Início
            </Link>
            <Link to="/orcamento" className={navLinkClass(location.pathname === '/orcamento')}>
              Orçamento
            </Link>
            <Link to="/parceiros" className={navLinkClass(location.pathname.startsWith('/parceiros'))}>
              Encontre seu Bartender
            </Link>
            <a
              href="#como-funciona"
              onClick={handleComoFunciona}
              className="font-medium text-white/70 hover:text-white transition-colors cursor-pointer text-base"
            >
              Como funciona
            </a>
            {isAuthenticated && user?.role === 'parceiro' && (
              <Link
                to="/parceiro/painel/perfil"
                className={navLinkClass(location.pathname.startsWith('/parceiro'))}
              >
                Painel
              </Link>
            )}
          </nav>

          {/* CTA / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-white/90">
                  Olá, {user?.nome?.split(' ')[0]}
                </span>
                <Button variant="outline" size="sm" className={outlineWhite} onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className={outlineWhite}>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className={outlineWhite}>
                  <Link to="/cadastro">Cadastre-se</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/15 rounded-lg transition-colors"
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
              <nav className="flex flex-col gap-1 py-4 border-t border-white/15">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/15 transition-colors">
                  Início
                </Link>
                <Link to="/orcamento" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/15 transition-colors">
                  Pedir Orçamento
                </Link>
                <Link to="/parceiros" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/15 transition-colors">
                  Encontre seu Bartender
                </Link>
                <a href="#como-funciona" onClick={handleComoFunciona} className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/15 transition-colors cursor-pointer">
                  Como Funciona
                </a>
                {isAuthenticated && user?.role === 'parceiro' && (
                  <Link to="/parceiro/painel/perfil" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/15 transition-colors">
                    Painel
                  </Link>
                )}
                {isAuthenticated ? (
                  <Button variant="outline" size="lg" className={`mt-3 ${outlineWhite}`} onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Sair
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="lg" className={`mt-3 ${outlineWhite}`}>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className={`mt-2 ${outlineWhite}`}>
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
