import { useState } from 'react';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { apiSendQuickQuote } from '@/services/api';
import { eventTypes } from '@/data/mockData';

const schema = z.object({
  nome_cliente: z.string().trim().min(2, 'Informe seu nome').max(120),
  whatsapp: z.string().trim().min(8, 'Informe um WhatsApp válido').max(20),
  email: z.string().trim().email('Email inválido').max(160),
  tipo_evento: z.string().min(1, 'Selecione o tipo de evento'),
  quantidade_pessoas: z.coerce.number().int().min(1, 'Mínimo 1 pessoa').max(5000),
  data_evento: z.string().min(1, 'Informe a data'),
  cidade: z.string().trim().min(2, 'Informe a cidade').max(120),
  estado: z.string().trim().min(2, 'UF').max(2),
  observacoes: z.string().max(1000).optional(),
});

type FormState = {
  nome_cliente: string;
  whatsapp: string;
  email: string;
  tipo_evento: string;
  quantidade_pessoas: string;
  data_evento: string;
  cidade: string;
  estado: string;
  observacoes: string;
};

interface QuickQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiroId: number;
  parceiroNome: string;
  cidadeBase?: string;
  estadoBase?: string;
}

const QuickQuoteDialog = ({
  open,
  onOpenChange,
  parceiroId,
  parceiroNome,
  cidadeBase,
  estadoBase,
}: QuickQuoteDialogProps) => {
  const [form, setForm] = useState<FormState>({
    nome_cliente: '',
    whatsapp: '',
    email: '',
    tipo_evento: '',
    quantidade_pessoas: '',
    data_evento: '',
    cidade: cidadeBase || '',
    estado: estadoBase || '',
    observacoes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async () => {
    const parsed = schema.safeParse({
      ...form,
      quantidade_pessoas: form.quantidade_pessoas,
      estado: form.estado.toUpperCase(),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        if (e.path[0]) errs[String(e.path[0])] = e.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await apiSendQuickQuote({
        parceiro_id: parceiroId,
        nome_cliente: parsed.data.nome_cliente,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email,
        tipo_evento: parsed.data.tipo_evento,
        quantidade_pessoas: parsed.data.quantidade_pessoas,
        data_evento: parsed.data.data_evento,
        cidade: parsed.data.cidade,
        estado: parsed.data.estado,
        observacoes: parsed.data.observacoes || undefined,
      });
      toast({
        title: 'Pedido enviado!',
        description: `${parceiroNome} recebeu seu pedido por email e entrará em contato em breve.`,
      });
      onOpenChange(false);
      setForm({
        nome_cliente: '',
        whatsapp: '',
        email: '',
        tipo_evento: '',
        quantidade_pessoas: '',
        data_evento: '',
        cidade: cidadeBase || '',
        estado: estadoBase || '',
        observacoes: '',
      });
    } catch (err: any) {
      toast({
        title: 'Não foi possível enviar',
        description: err?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Solicitar orçamento</DialogTitle>
          <DialogDescription>
            Seu pedido vai direto para <span className="font-medium text-foreground">{parceiroNome}</span>,
            que entrará em contato pelo WhatsApp ou email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Seu nome *</Label>
            <Input
              value={form.nome_cliente}
              onChange={(e) => set({ nome_cliente: e.target.value })}
              placeholder="Como podemos te chamar"
            />
            {errors.nome_cliente && <p className="text-xs text-destructive">{errors.nome_cliente}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp *</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => set({ whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
              />
              {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="voce@email.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de evento *</Label>
              <Select value={form.tipo_evento} onValueChange={(v) => set({ tipo_evento: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {eventTypes.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.icon} {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_evento && <p className="text-xs text-destructive">{errors.tipo_evento}</p>}
            </div>
            <div className="space-y-2">
              <Label>Quantidade de pessoas *</Label>
              <Input
                type="number"
                min={1}
                value={form.quantidade_pessoas}
                onChange={(e) => set({ quantidade_pessoas: e.target.value })}
                placeholder="Ex: 80"
              />
              {errors.quantidade_pessoas && (
                <p className="text-xs text-destructive">{errors.quantidade_pessoas}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-1">
              <Label>Data do evento *</Label>
              <Input
                type="date"
                value={form.data_evento}
                onChange={(e) => set({ data_evento: e.target.value })}
              />
              {errors.data_evento && <p className="text-xs text-destructive">{errors.data_evento}</p>}
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label>Cidade *</Label>
              <Input
                value={form.cidade}
                onChange={(e) => set({ cidade: e.target.value })}
                placeholder="São Paulo"
              />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label>UF *</Label>
              <Input
                value={form.estado}
                onChange={(e) => set({ estado: e.target.value.toUpperCase().slice(0, 2) })}
                placeholder="SP"
                maxLength={2}
              />
              {errors.estado && <p className="text-xs text-destructive">{errors.estado}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mensagem (opcional)</Label>
            <Textarea
              value={form.observacoes}
              onChange={(e) => set({ observacoes: e.target.value })}
              rows={3}
              placeholder="Conte detalhes do evento, estilo de drinks, etc."
              maxLength={1000}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="gold" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" />Enviar pedido</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickQuoteDialog;
