import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProgressSteps from '@/components/shared/ProgressSteps';
import { useQuoteStore } from '@/store/quoteStore';
import { eventTypes, brazilianStates } from '@/data/mockData';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = ['Tipo de Evento', 'Pessoas', 'Local', 'Data', 'Contato'];

const QuotePage = () => {
  const navigate = useNavigate();
  const { briefing, setBriefing, currentStep, setCurrentStep } = useQuoteStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date | undefined>(
    briefing.eventDate ? new Date(briefing.eventDate) : undefined
  );

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!briefing.eventType) {
          newErrors.eventType = 'Selecione o tipo de evento';
        }
        break;
      case 2:
        if (!briefing.people || briefing.people < 10) {
          newErrors.people = 'Mínimo de 10 pessoas';
        }
        break;
      case 3:
        if (!briefing.city) newErrors.city = 'Informe a cidade';
        if (!briefing.state) newErrors.state = 'Selecione o estado';
        if (!briefing.neighborhood) newErrors.neighborhood = 'Informe o bairro';
        break;
      case 4:
        if (!date) {
          newErrors.eventDate = 'Selecione a data do evento';
        }
        break;
      case 5:
        if (!briefing.clientName) newErrors.clientName = 'Informe seu nome';
        if (!briefing.whatsapp) newErrors.whatsapp = 'Informe seu WhatsApp';
        if (!briefing.email) newErrors.email = 'Informe seu email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(briefing.email)) {
          newErrors.email = 'Email inválido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 4 && date) {
        setBriefing({ eventDate: date.toISOString() });
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit and navigate to results
        navigate('/resultados');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEventTypeSelect = (type: string) => {
    setBriefing({ eventType: type });
    setErrors({});
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-secondary/30 to-background">
        <div className="container max-w-2xl py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Solicite seu orçamento
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados do seu evento para receber opções personalizadas
            </p>
          </div>

          {/* Progress */}
          <ProgressSteps steps={steps} currentStep={currentStep} className="mb-8" />

          {/* Form Steps */}
          <div className="card-premium p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Event Type */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">
                      Qual é o tipo do seu evento?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Isso nos ajuda a mostrar opções mais relevantes
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {eventTypes.map((event) => (
                      <button
                        key={event.value}
                        onClick={() => handleEventTypeSelect(event.value)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all duration-200',
                          briefing.eventType === event.value
                            ? 'border-primary bg-primary/5 shadow-gold'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                        )}
                      >
                        <span className="text-2xl mb-2 block">{event.icon}</span>
                        <span className="font-medium text-foreground">{event.label}</span>
                        {briefing.eventType === event.value && (
                          <Check className="w-5 h-5 text-primary absolute top-3 right-3" />
                        )}
                      </button>
                    ))}
                  </div>

                  {errors.eventType && (
                    <p className="text-sm text-destructive">{errors.eventType}</p>
                  )}
                </motion.div>
              )}

              {/* Step 2: People Count */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">
                      Quantas pessoas no evento?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Número aproximado de convidados que serão atendidos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="people">Número de pessoas</Label>
                      <Input
                        id="people"
                        type="number"
                        placeholder="Ex: 100"
                        min={10}
                        value={briefing.people || ''}
                        onChange={(e) => setBriefing({ people: parseInt(e.target.value) || 0 })}
                        className="mt-2 text-lg h-14"
                      />
                      {errors.people && (
                        <p className="text-sm text-destructive mt-1">{errors.people}</p>
                      )}
                    </div>

                    {/* Quick select buttons */}
                    <div className="flex flex-wrap gap-2">
                      {[30, 50, 100, 150, 200, 300].map((num) => (
                        <button
                          key={num}
                          onClick={() => setBriefing({ people: num })}
                          className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium transition-all',
                            briefing.people === num
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          )}
                        >
                          {num} pessoas
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">
                      Onde será o evento?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Para encontrar empresas que atendem sua região
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="São Paulo"
                          value={briefing.city || ''}
                          onChange={(e) => setBriefing({ city: e.target.value })}
                          className="mt-2"
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">Estado *</Label>
                        <Select
                          value={briefing.state || ''}
                          onValueChange={(value) => setBriefing({ state: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            {brazilianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <p className="text-sm text-destructive mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="neighborhood">Bairro *</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Jardins"
                        value={briefing.neighborhood || ''}
                        onChange={(e) => setBriefing({ neighborhood: e.target.value })}
                        className="mt-2"
                      />
                      {errors.neighborhood && (
                        <p className="text-sm text-destructive mt-1">{errors.neighborhood}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Endereço (opcional)</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, complemento"
                        value={briefing.address || ''}
                        onChange={(e) => setBriefing({ address: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Date */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">
                      Quando será o evento?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Data prevista para verificar disponibilidade
                    </p>
                  </div>

                  <div>
                    <Label>Data do evento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal mt-2 h-14',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione a data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={ptBR}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.eventDate && (
                      <p className="text-sm text-destructive mt-1">{errors.eventDate}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Contact */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">
                      Seus dados de contato
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Para enviarmos as opções e entrar em contato
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="clientName">Nome completo *</Label>
                      <Input
                        id="clientName"
                        placeholder="Seu nome"
                        value={briefing.clientName || ''}
                        onChange={(e) => setBriefing({ clientName: e.target.value })}
                        className="mt-2"
                      />
                      {errors.clientName && (
                        <p className="text-sm text-destructive mt-1">{errors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={briefing.whatsapp || ''}
                        onChange={(e) => setBriefing({ whatsapp: e.target.value })}
                        className="mt-2"
                      />
                      {errors.whatsapp && (
                        <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={briefing.email || ''}
                        onChange={(e) => setBriefing({ email: e.target.value })}
                        className="mt-2"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <Button variant="gold" onClick={handleNext}>
                {currentStep === steps.length ? (
                  <>
                    Receber orçamento
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuotePage;
