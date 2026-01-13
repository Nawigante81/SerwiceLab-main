import { motion } from "framer-motion";
import { Check, Cpu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pricingPlans = [
  {
    name: "Diagnostyka",
    price: "0",
    description: "Diagnoza i wycena w 24-48h",
    features: [
      "Pełna diagnostyka sprzętu",
      "Raport usterek i rekomendacje",
      "Wycena bez zobowiązań",
      "Darmowa wysyłka do serwisu",
    ],
    includes: ["Diagnoza i raport", "Wycena bez zobowiązań", "Darmowa wysyłka"],
    excludes: ["Naprawa sprzętu", "Wymiana części"],
    cta: "Zamów diagnostykę",
    popular: false,
  },
  {
    name: "Naprawa Standard",
    price: "od 149",
    description: "Najczęstsze naprawy w dobrej cenie",
    features: [
      "Wymiana podzespołów",
      "Czyszczenie i konserwacja",
      "Wymiana pasty termoprzewodzącej",
      "Gwarancja 12 miesięcy",
      "Priorytetowa obsługa",
    ],
    includes: ["Robocizna i części", "Gwarancja 12 miesięcy", "Priorytetowa obsługa"],
    excludes: ["Naprawy BGA/reballing", "Ekspres 24h"],
    cta: "Zgłoś naprawę",
    popular: true,
  },
  {
    name: "Naprawa Premium",
    price: "od 399",
    description: "Naprawy zaawansowane i ekspresowe",
    features: [
      "Naprawa płyt głównych",
      "Odzyskiwanie danych",
      "Naprawa BGA/reballing",
      "Wymiana matryc laptopów",
      "Gwarancja 24 miesiące",
      "Ekspresowa realizacja 24h",
    ],
    includes: ["Zaawansowane naprawy", "Gwarancja 24 miesiące", "Ekspres 24h"],
    excludes: ["Kosztorys poza zakresem", "Brak akceptacji klienta"],
    cta: "Zgłoś naprawę",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="section-container text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Transparentne ceny</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Cennik usług
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Przejrzysta wycena i jasne zasady. Zawsze wiesz, ile zapłacisz, zanim zaczniemy naprawę.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="section-container mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-card border-2 border-primary shadow-lg shadow-primary/10"
                    : "bg-card border border-border"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-primary-foreground text-sm font-semibold">
                    Najpopularniejszy
                  </div>
                )}
                <h3 className="text-xl font-display font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-display">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">PLN</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid gap-4 mb-8">
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                      Co zawiera
                    </p>
                    <ul className="space-y-2">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                      Nie zawiera
                    </p>
                    <ul className="space-y-2">
                      {plan.excludes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <X className="w-3 h-3 text-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10 text-sm text-muted-foreground">
            Bez ukrytych kosztów. Zawsze akceptujesz kosztorys przed naprawą.
          </div>
        </section>

        {/* Additional Services */}
        <section className="section-container">
          <motion.div
            className="bg-card border border-border rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
              Dodatkowe usługi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { service: "Czyszczenie laptopa", price: "79 PLN" },
                { service: "Wymiana dysku SSD", price: "od 49 PLN" },
                { service: "Upgrade RAM", price: "od 39 PLN" },
                { service: "Instalacja systemu", price: "99 PLN" },
                { service: "Backup danych", price: "od 99 PLN" },
                { service: "Wymiana baterii", price: "od 149 PLN" },
                { service: "Wymiana klawiatury", price: "od 199 PLN" },
                { service: "Naprawa zawiasów", price: "od 179 PLN" },
              ].map((item, index) => (
                <motion.div
                  key={item.service}
                  className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                >
                  <span className="text-sm text-foreground">{item.service}</span>
                  <span className="text-sm font-semibold text-primary">{item.price}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
