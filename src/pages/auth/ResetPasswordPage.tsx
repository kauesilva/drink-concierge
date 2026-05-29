import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { apiResetPassword } from '@/services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: 'Link inválido', description: 'Token de redefinição ausente.', variant: 'destructive' });
      return;
    }
    if (senha.length < 6) {
      toast({ title: 'Senha muito curta', description: 'Use ao menos 6 caracteres.', variant: 'destructive' });
      return;
    }
    if (senha !== confirma) {
      toast({ title: 'Senhas não conferem', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await apiResetPassword(token, senha);
      toast({ title: 'Senha redefinida!', description: 'Faça login com sua nova senha.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Link expirado ou inválido.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Redefinir senha</CardTitle>
              <CardDescription>Crie uma nova senha para acessar sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Nova senha</Label>
                  <div className="relative">
                    <Input id="senha" type={show ? 'text' : 'password'} placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirma">Confirmar senha</Label>
                  <Input id="confirma" type={show ? 'text' : 'password'} placeholder="••••••••" value={confirma} onChange={(e) => setConfirma(e.target.value)} required />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={loading || !token}>
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary font-medium hover:underline">Voltar ao login</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
