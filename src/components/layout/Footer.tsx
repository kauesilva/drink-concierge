import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wine className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                Bartender Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              A plataforma que conecta você às melhores empresas de coquetelaria para eventos. 
              Simples, rápido e transparente.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Produto
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { to: '/', label: 'Início' },
                { to: '/orcamento', label: 'Pedir Orçamento' },
                { to: '/#como-funciona', label: 'Como Funciona' },
                { to: '/#faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contato@bartenderstore.com" className="hover:text-foreground transition-colors">
                  contato@bartenderstore.com
                </a>
              </li>
              <li>
                <a href="tel:+5511999999999" className="hover:text-foreground transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 Bartender Store. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
