import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Sparkles, Zap, Shield, Users } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import Layout from '@/components/layout/Layout';
import RotatingHeadline from '@/components/RotatingHeadline';

import { Button } from '@/components/ui/button';
import { eventTypes, serviceCategories } from '@/data/mockData';
import imgCasamento from '@/assets/events/casamento.jpg';
import imgAniversario from '@/assets/events/aniversario.jpg';
import imgCorporativo from '@/assets/events/corporativo.jpg';
import imgComemoracao from '@/assets/events/comemoracao.jpg';
import img15Anos from '@/assets/events/15-anos.jpg';
import imgAtivacao from '@/assets/events/ativacao-marca.jpg';
import imgFreelancer from '@/assets/events/freelancer-bar.jpg';

import imgMaoDeObra from '@/assets/services/mao-de-obra.jpg';
import imgServicoCompleto from '@/assets/services/servico-completo.jpg';
import imgConsultoria from '@/assets/services/consultoria.jpg';
import statsBartender from '@/assets/stats-bartender.jpg';

const EVENT_IMAGES: Record<string, string> = {
  'casamento': imgCasamento,
  'aniversario': imgAniversario,
  'corporativo': imgCorporativo,
  'comemoracao': imgComemoracao,
  '15-anos': img15Anos,
  'ativacao-marca': imgAtivacao,
  'freelancer-bar': imgFreelancer,
};

const SERVICE_IMAGES: Record<string, string> = {
  'mao-de-obra': imgMaoDeObra,
  'servico-completo': imgServicoCompleto,
  'consultoria': imgConsultoria,
};
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
        {/* Banner de fundo dinâmico sincronizado com a palavra rotativa */}
        <div className="absolute inset-0 bg-destructive-foreground" />
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.7 }, scale: { duration: 1.2, ease: 'easeOut' } }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMAGES[heroIndex]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay cinematográfico — escurece só a base, libera a foto */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-glow-pulse" />

        <div className="container relative z-10 flex flex-col items-center justify-center min-h-[100vh] py-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="heading-display text-foreground text-center max-w-4xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
            <RotatingHeadline onIndexChange={handleHeroIndex} />
            <br />
            <span className="text-primary">em poucos cliques</span>
          </motion.h1>

          {/* Indicador de progresso dos banners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <span
                key={i}
                className={`h-0.5 transition-all duration-500 ${
                  i === heroIndex ? 'w-8 bg-primary' : 'w-4 bg-foreground/30'
                }`}
              />
            ))}
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/60">
            <span className="text-xs uppercase tracking-[0.2em]">Role para ver mais</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Dobra 2 — Proposta de valor + CTA */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

        <div className="container relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center">

            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 border border-primary/20 bg-primary/5 text-foreground py-[10px] font-sans text-sm md:text-base font-semibold rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Marketplace de drinks para eventos
              </span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-body text-xl md:text-2xl text-foreground/90 mb-12 leading-relaxed">
              Compare empresas de coquetelaria, veja cardápios e valores.
              <br className="hidden md:block" />
              Solicite contratação sem complicação para qualquer tipo de evento.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
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


      {/* Stats band — imersivo com foto de fundo */}
      <section className="relative overflow-hidden border-y border-primary/15">
        {/* Imagem de fundo */}
        <img
          src={statsBartender}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center md:[background-attachment:fixed]"
        />
        {/* Overlay escuro — mantém a foto visível com contraste para o texto */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)]" />

        <div className="container relative z-10 py-10 md:py-14">

          <div className="grid grid-cols-3 gap-4 md:gap-8 md:divide-x md:divide-white/10">
            {stats.map((stat, i) =>
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
                className="text-center px-2 md:px-4"
              >
                <p className="font-display text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter
                    value={parseInt(stat.value)}
                    suffix={stat.value.replace(/^\d+/, '')}
                    duration={2}
                  />
                </p>
                <div className="h-px w-8 bg-primary mx-auto mb-3" />
                <p className="text-xs md:text-sm text-white/75 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24 md:py-[50px]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Modalidades
            </p>
            <h2 className="heading-section text-foreground mb-4">
              Escolha o tipo de serviço
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Da contratação só do bartender ao serviço completo com bar e estrutura.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((cat, index) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}>

                <Link
                  to="/orcamento"
                  className="group block overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-gold transition-all duration-300">

                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={SERVICE_IMAGES[cat.value]}
                      alt={cat.label}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works — Stripe inspired */}
      <section id="como-funciona" className="py-24 md:py-0">
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
      <section className="py-24 bg-secondary/30 md:py-0">
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
              className="group overflow-hidden rounded-2xl border border-border bg-card text-center cursor-pointer hover:border-primary/30 hover:shadow-gold transition-all duration-300">
              
                <div className="aspect-square overflow-hidden">
                  <img
                    src={EVENT_IMAGES[event.value]}
                    alt={event.label}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="text-sm font-medium text-foreground py-3 px-2">{event.label}</p>
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