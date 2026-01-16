import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const trustStats = [
    { value: "4.9/5", label: "z 1 200 opinii" },
    { value: "12 000+", label: "napraw rocznie" },
    { value: "24-48h", label: "średnia diagnoza" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional computer repair workstation" 
          className="w-full h-full object-cover object-center brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-primary font-medium">Profesjonalny serwis komputerowy</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Wyślij. Naprawimy.
            <span className="block text-primary mt-2" style={{ textShadow: '0 0 40px hsl(82 100% 46% / 0.5)' }}>
              Odbierz.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="font-sans text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Serwis komputerowy z wysyłką do paczkomatu. Diagnoza w 24-48h,
            naprawa bez wychodzenia z domu i 12 miesięcy gwarancji.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
              <Button variant="hero" size="xl" className="group">
                Zgłoś naprawę
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/sledzenie-statusu-naprawy">
              <Button variant="heroOutline" size="xl">
                Sprawdź status
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="glass" size="xl">
                Sprawdź czas diagnozy
              </Button>
            </Link>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-foreground/80 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {trustStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="px-4 py-2 rounded-full bg-card/60 border border-border backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.06 }}
              >
                <span className="font-semibold text-foreground">{stat.value}</span>{" "}
                <span className="text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { icon: Package, title: "Darmowa wysyłka", desc: "InPost & DPD" },
              { icon: Shield, title: "Gwarancja 12 mies.", desc: "Na każdą naprawę" },
              { icon: Zap, title: "Szybka diagnoza", desc: "W 24-48h" }
            ].map((item) => (
              <div 
                key={item.title}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
