import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { apiRequestPasswordReset } from '@/services/api';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await apiRequestPasswordReset(email);
      setSent(true);
      toast({ title: 'Verifique seu e-mail', description: 'Se houver uma conta cadastrada, enviamos o link de redefinição.' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Não foi possível processar.', variant: 'destructive' });
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
                <KeyRound className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Esqueci minha senha</CardTitle>
              <CardDescription>
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center text-sm text-muted-foreground space-y-4">
                  <p>Se houver uma conta para <strong>{email}</strong>, você receberá um e-mail em alguns minutos com instruções para redefinir sua senha.</p>
                  <Link to="/login" className="text-primary font-medium hover:underline">Voltar ao login</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar link de redefinição'}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <Link to="/login" className="text-primary font-medium hover:underline">Voltar ao login</Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
