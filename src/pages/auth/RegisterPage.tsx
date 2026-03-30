import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wine, Eye, EyeOff, Building2, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore, UserRole } from '@/store/authStore';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [role, setRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    whatsapp: '',
    tipo: 'empresa' as 'empresa' | 'autonomo',
  });
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.senha.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      toast({ title: 'As senhas não conferem', variant: 'destructive' });
      return;
    }

    if (!role) return;

    try {
      await register({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        role,
        ...(role === 'parceiro' ? { whatsapp: form.whatsapp, tipo: form.tipo } : {}),
      });
      toast({ title: 'Conta criada com sucesso!' });
      if (role === 'parceiro') {
        navigate('/parceiro/painel/perfil');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao criar conta',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Step 1: Choose role
  if (!role) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wine className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Criar Conta</CardTitle>
                <CardDescription>Como deseja se cadastrar?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <button
                  onClick={() => setRole('parceiro')}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sou Parceiro / Bartender</p>
                    <p className="text-sm text-muted-foreground">
                      Quero oferecer meus serviços de bartender
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setRole('lead')}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Quero Contratar</p>
                    <p className="text-sm text-muted-foreground">
                      Estou buscando bartender para meu evento
                    </p>
                  </div>
                </button>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Já tem conta?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Entrar
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Step 2: Registration form
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
                {role === 'parceiro' ? (
                  <Building2 className="w-6 h-6 text-primary" />
                ) : (
                  <Users className="w-6 h-6 text-primary" />
                )}
              </div>
              <CardTitle className="font-display text-2xl">
                {role === 'parceiro' ? 'Cadastro de Parceiro' : 'Cadastro de Cliente'}
              </CardTitle>
              <CardDescription>
                <button
                  onClick={() => setRole(null)}
                  className="text-primary hover:underline"
                >
                  ← Voltar
                </button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {role === 'parceiro' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'empresa' as const, label: 'Empresa', icon: Building2 },
                          { value: 'autonomo' as const, label: 'Autônomo', icon: User },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm({ ...form, tipo: opt.value })}
                            className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                              form.tipo === opt.value
                                ? 'border-primary bg-accent text-accent-foreground'
                                : 'border-border hover:border-primary/40 text-muted-foreground'
                            }`}
                          >
                            <opt.icon className="w-4 h-4" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar senha</Label>
                  <Input
                    id="confirmar-senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    value={form.confirmarSenha}
                    onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
