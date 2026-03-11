import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Sparkles, Zap, Shield, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { eventTypes } from '@/data/mockData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
"@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const Index = () => {
  const steps = [
  {
    icon: Sparkles,
    title: 'Descreva seu evento',
    description: 'Tipo de evento, quantidade de pessoas, local e data — tudo em minutos.'
  },
  {
    icon: Zap,
    title: 'Compare opções',
    description: 'Receba propostas de empresas parceiras verificadas com cardápios e valores.'
  },
  {
    icon: Shield,
    title: 'Contrate com segurança',
    description: 'Escolha a melhor opção e nosso concierge cuida do resto.'
  }];


  const testimonials = [
  {
    name: 'Carla M.',
    event: 'Casamento',
    rating: 5,
    text: 'Facilitou demais a escolha do bar para meu casamento. Comparei opções e fechei em minutos!'
  },
  {
    name: 'Ricardo S.',
    event: 'Evento Corporativo',
    rating: 5,
    text: 'Atendimento impecável. A empresa que escolhi superou todas as expectativas.'
  },
  {
    name: 'Ana Paula R.',
    event: 'Aniversário',
    rating: 5,
    text: 'Prático e transparente. Adorei poder ver os cardápios e valores antes de decidir.'
  }];


  const faqs = [
  {
    question: 'Como funciona o orçamento?',
    answer: 'Você preenche um breve formulário com os detalhes do seu evento e recebe opções de empresas parceiras com cardápios e valores estimados. Tudo de forma gratuita e sem compromisso.'
  },
  {
    question: 'Posso personalizar o cardápio?',
    answer: 'Sim! Após escolher uma empresa e cardápio base, você pode conversar diretamente com ela para ajustes e personalizações.'
  },
  {
    question: 'Como é feito o pagamento?',
    answer: 'O pagamento é feito diretamente com a empresa escolhida. Nossa plataforma conecta você às melhores opções, e você negocia os detalhes finais com o parceiro.'
  },
  {
    question: 'Quanto tempo antes devo contratar?',
    answer: 'Recomendamos pelo menos 30 dias de antecedência para garantir disponibilidade, mas isso pode variar conforme a empresa e época do ano.'
  },
  {
    question: 'As empresas atendem em qualquer cidade?',
    answer: 'Cada empresa tem sua área de atendimento. Ao preencher o orçamento, mostramos apenas empresas que atendem sua região.'
  }];


  const stats = [
  { value: '500+', label: 'Eventos realizados' },
  { value: '98%', label: 'Clientes satisfeitos' },
  { value: '50+', label: 'Empresas parceiras' }];


  return (
    <Layout>
      {/* Hero Section — Apple / Linear inspired */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-destructive-foreground" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

        <div className="container relative z-10 md:py-32 py-[64px]">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center">
            
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Marketplace de drinks para eventos
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-foreground mb-6">
              
              Seu bar de drinks
              <br />
              <span className="text-primary">em poucos cliques</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-body text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              
              Compare empresas de coquetelaria, veja cardápios e valores. 
              Solicite contratação sem complicação para qualquer tipo de evento.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild variant="gold" size="xl">
                <Link to="/orcamento">
                  Receber orçamento grátis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#como-funciona">
                  Como funciona
                </a>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              
              {['100% gratuito', 'Sem compromisso', 'Empresas verificadas'].map((text) =>
              <div key={text} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) =>
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center">
              
                <p className="font-display text-3xl md:text-5xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works — Stripe inspired */}
      <section id="como-funciona" className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16">
            
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Como funciona
            </p>
            <h2 className="heading-section text-foreground mb-4">
              Três passos para o bar perfeito
            </h2>
            <p className="text-lg text-muted-foreground">
              Um processo simples e transparente do início ao fim.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) =>
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-gold transition-all duration-300">
              
                {/* Step number */}
                <span className="absolute top-8 right-8 font-display text-7xl font-bold text-secondary group-hover:text-primary/10 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Event Types — Minimal grid */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Eventos
            </p>
            <h2 className="heading-section text-foreground">
              Para todos os tipos de evento
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {eventTypes.map((event, index) =>
            <motion.div
              key={event.value}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="p-5 rounded-2xl border border-border bg-card text-center cursor-pointer hover:border-primary/30 hover:shadow-gold transition-all duration-300">
              
                <span className="text-3xl mb-3 block">{event.icon}</span>
                <p className="text-sm font-medium text-foreground">{event.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials — Dark section, Linear style */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Depoimentos
            </p>
            <h2 className="heading-section mb-4">
              Clientes satisfeitos
            </h2>
            <p className="text-background/60 max-w-xl mx-auto">
              Veja o que dizem os organizadores de eventos que usaram nossa plataforma.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) =>
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl p-7 border border-background/10 bg-background/5 backdrop-blur-sm">
              
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) =>
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                )}
                </div>

                <p className="text-background/85 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-background/50">{testimonial.event}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ — Notion minimal style */}
      <section id="faq" className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="heading-section text-foreground">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}>
                
                  <AccordionItem
                  value={`item-${index}`}
                  className="rounded-xl border border-border px-6 bg-card hover:border-primary/20 transition-colors">
                  
                    <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              )}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA — bold and clean */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto">
            
            <h2 className="heading-section text-foreground mb-6">
              Pronto para surpreender
              <br />
              seus convidados?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Compare opções, veja valores e solicite contratação em minutos.
            </p>
            <Button asChild variant="gold" size="xl">
              <Link to="/orcamento">
                Começar agora — é grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>);

};

export default Index;