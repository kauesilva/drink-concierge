import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wine, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePartnerStore } from '@/store/partnerStore';
import Layout from '@/components/layout/Layout';

const PartnerRegisterPage = () => {
  const navigate = useNavigate();
  const { register, isRegistered } = usePartnerStore();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', type: 'empresa' as const });

  if (isRegistered) {
    navigate('/parceiro/painel/perfil');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
    navigate('/parceiro/painel/perfil');
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wine className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Cadastro de Parceiro</CardTitle>
              <CardDescription>
                Cadastre-se para gerenciar seus pacotes de drinks e alcançar novos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome ou da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'empresa', label: 'Empresa', icon: Building2 },
                      { value: 'autonomo', label: 'Autônomo', icon: User },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: opt.value as 'empresa' | 'autonomo' })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          form.type === opt.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full">
                  Criar Conta
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PartnerRegisterPage;
