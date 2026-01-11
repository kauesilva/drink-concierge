import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageCircle, Star, ChevronDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { eventTypes } from '@/data/mockData';
import heroImage from '@/assets/hero-bartender.jpg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Index = () => {
  const steps = [
    {
      number: '01',
      title: 'Conte sobre seu evento',
      description: 'Tipo de evento, quantidade de pessoas, local e data.',
    },
    {
      number: '02',
      title: 'Compare opções',
      description: 'Veja empresas parceiras, cardápios e valores estimados.',
    },
    {
      number: '03',
      title: 'Solicite contratação',
      description: 'Escolha sua opção favorita e um agente finaliza tudo.',
    },
  ];

  const testimonials = [
    {
      name: 'Carla M.',
      event: 'Casamento',
      rating: 5,
      text: 'Facilitou demais a escolha do bar para meu casamento. Comparei opções e fechei em minutos!',
    },
    {
      name: 'Ricardo S.',
      event: 'Evento Corporativo',
      rating: 5,
      text: 'Atendimento impecável. A empresa que escolhi superou todas as expectativas.',
    },
    {
      name: 'Ana Paula R.',
      event: 'Aniversário 40 anos',
      rating: 5,
      text: 'Prático e transparente. Adorei poder ver os cardápios e valores antes de decidir.',
    },
  ];

  const faqs = [
    {
      question: 'Como funciona o orçamento?',
      answer: 'Você preenche um breve formulário com os detalhes do seu evento e recebe opções de empresas parceiras com cardápios e valores estimados. Tudo de forma gratuita e sem compromisso.',
    },
    {
      question: 'Posso personalizar o cardápio?',
      answer: 'Sim! Após escolher uma empresa e cardápio base, você pode conversar diretamente com ela para ajustes e personalizações.',
    },
    {
      question: 'Como é feito o pagamento?',
      answer: 'O pagamento é feito diretamente com a empresa escolhida. Nossa plataforma conecta você às melhores opções, e você negocia os detalhes finais com o parceiro.',
    },
    {
      question: 'Quanto tempo antes devo contratar?',
      answer: 'Recomendamos pelo menos 30 dias de antecedência para garantir disponibilidade, mas isso pode variar conforme a empresa e época do ano.',
    },
    {
      question: 'As empresas atendem em qualquer cidade?',
      answer: 'Cada empresa tem sua área de atendimento. Ao preencher o orçamento, mostramos apenas empresas que atendem sua região.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Bartender profissional preparando drinks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block badge-premium mb-6"
            >
              ✨ O iFood dos drinks para eventos
            </motion.span>
            
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-foreground mb-6"
            >
              Seu bar de drinks para eventos, em{' '}
              <span className="text-primary">poucos cliques</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-body text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Escolha o tipo de evento, número de pessoas, local e data. 
              Compare empresas e cardápios. Solicite contratação sem complicação.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="gold" size="xl">
                <Link to="/orcamento">
                  Receber orçamento
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#como-funciona">
                  Como funciona
                  <ChevronDown className="w-5 h-5" />
                </a>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-border/50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">100% gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Sem compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Empresas verificadas</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="heading-section text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Em 3 passos simples, você encontra o bar perfeito para seu evento
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="card-premium p-6 md:p-8 text-center relative"
              >
                <span className="font-display text-6xl font-bold text-primary/10 absolute top-4 right-4">
                  {step.number}
                </span>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">
              Para todos os tipos de evento
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Casamentos, aniversários, eventos corporativos e muito mais
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {eventTypes.map((event, index) => (
              <motion.div
                key={event.value}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="card-premium p-4 md:p-5 text-center cursor-pointer"
              >
                <span className="text-3xl md:text-4xl mb-2 block">{event.icon}</span>
                <p className="text-sm font-medium text-foreground">{event.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto">
              Milhares de eventos bem sucedidos através da nossa plataforma
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/5 backdrop-blur-sm rounded-xl p-6 border border-background/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-background/90 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-background/60">{testimonial.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre nosso serviço
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`} className="card-premium px-6 border-none">
                    <AccordionTrigger className="text-left font-display text-lg hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-secondary to-accent">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-section text-foreground mb-4">
              Pronto para surpreender seus convidados?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Compare opções, veja valores e solicite contratação em minutos. 
              Seu evento merece um bar de drinks inesquecível.
            </p>
            <Button asChild variant="gold" size="xl">
              <Link to="/orcamento">
                Receber orçamento grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
