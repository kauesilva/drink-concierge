import { Link } from 'react-router-dom';
import { Wine, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
                <Wine className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">
                Bartender Stones
              </span>
            </Link>
            <p className="text-background/70 text-sm max-w-sm mb-6">
              Conectamos você às melhores empresas de coquetelaria para eventos. 
              Seu bar de drinks perfeito, em poucos cliques.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Navegação</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="/" className="hover:text-background transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/orcamento" className="hover:text-background transition-colors">
                  Pedir Orçamento
                </Link>
              </li>
              <li>
                <Link to="/#como-funciona" className="hover:text-background transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-background transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contato@bartenderstones.com" className="hover:text-background transition-colors">
                  contato@bartenderstones.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+5511999999999" className="hover:text-background transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© 2024 Bartender Stones. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
