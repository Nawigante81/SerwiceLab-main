import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Award, 
  Users, 
  Clock, 
  TrendingUp, 
  Shield, 
  Wrench,
  Star,
  CheckCircle2,
  Calendar,
  Target,
  Zap,
  Heart
} from "lucide-react";

// Statistics data
const stats = [
  { icon: Wrench, value: "2500+", label: "Napraw rocznie", description: "Wykonanych napraw w 2023" },
  { icon: Clock, value: "24-48h", label: "Średni czas diagnozy", description: "Szybka wycena problemu" },
  { icon: Users, value: "98%", label: "Zadowolonych klientów", description: "Pozytywne opinie" },
  { icon: TrendingUp, value: "3-5 dni", label: "Średni czas naprawy", description: "Od diagnozy do wysyłki" },
];

// Team members / technicians
const team = [
  {
    name: "Michał Kowalski",
    role: "Lead Technician",
    experience: "12 lat doświadczenia",
    specialization: "Naprawa płyt głównych, BGA/reballing",
    certifications: ["Apple Certified", "CompTIA A+", "Certified Electronics Technician"],
  },
  {
    name: "Anna Nowak",
    role: "Senior Technician",
    experience: "8 lat doświadczenia",
    specialization: "Laptopy, wymiana matryc",
    certifications: ["Dell Certified", "HP Certified", "Lenovo Certified"],
  },
  {
    name: "Piotr Wiśniewski",
    role: "Data Recovery Specialist",
    experience: "10 lat doświadczenia",
    specialization: "Odzyskiwanie danych, diagnostyka",
    certifications: ["ACE Data Recovery", "IACRB Certified"],
  },
];

// Customer testimonials
const testimonials = [
  {
    name: "Marcin K.",
    rating: 5,
    text: "Szybka naprawa laptopa Dell. Wymiana matrycy w 3 dni, wszystko bez wychodzenia z domu. Polecam!",
    date: "Grudzień 2024",
  },
  {
    name: "Karolina W.",
    rating: 5,
    text: "Profesjonalna obsługa i transparentna wycena. Laptop działał po naprawie lepiej niż wcześniej. Super komunikacja na każdym etapie.",
    date: "Listopad 2024",
  },
  {
    name: "Tomasz M.",
    rating: 5,
    text: "Odzyskali dane z uszkodzonego dysku. Nie miałem nadziei, a oni zrobili cuda. Bardzo dziękuję!",
    date: "Październik 2024",
  },
  {
    name: "Agnieszka P.",
    rating: 5,
    text: "Naprawa PC gamingowego - wymiana karty graficznej. Szybko, sprawnie, bezpiecznie. Polecam każdemu!",
    date: "Wrzesień 2024",
  },
];

// Certifications and trust elements
const certifications = [
  { name: "ISO 9001:2015", description: "System zarządzania jakością" },
  { name: "Certyfikat GIODO", description: "Ochrona danych osobowych" },
  { name: "Autoryzowany serwis", description: "Partnera wiodących marek" },
  { name: "Gwarancja jakości", description: "12-24 miesiące gwarancji" },
];

// Trust elements
const trustElements = [
  { icon: Shield, title: "Bezpieczeństwo danych", description: "Szyfrowane procedury, zgodność z RODO" },
  { icon: CheckCircle2, title: "Gwarancja na naprawy", description: "12-24 miesiące gwarancji na wszystkie usługi" },
  { icon: Zap, title: "Ekspresowa obsługa", description: "Opcja przyspieszonej realizacji 24h" },
  { icon: Heart, title: "Wsparcie posprzedażowe", description: "Pomoc techniczna po naprawie" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-container">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              O ServiceLab
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Profesjonalny serwis <span className="text-primary">z pasją</span>
            </h1>
            <p className="font-sans text-muted-foreground text-lg leading-relaxed">
              ServiceLab to nowoczesny serwis komputerowy powstały z myślą o wygodzie klientów. 
              Łączymy profesjonalizm z innowacyjnym podejściem do napraw - wszystko przez wysyłkę, 
              bez konieczności odwiedzania stacjonarnego punktu.
            </p>
          </motion.div>
        </section>

        {/* Company History */}
        <section className="section-container py-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                Nasza historia
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Jak to się <span className="text-primary">zaczęło?</span>
              </h2>
            </div>

            <div className="grid gap-6">
              <motion.div
                className="bg-card border border-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">2018 - Powstanie firmy</h3>
                    <p className="font-sans text-muted-foreground">
                      ServiceLab rozpoczął działalność jako lokalny serwis komputerowy w Warszawie. 
                      Już wtedy stawialiśmy na jakość obsługi i transparentność wycen.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-card border border-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">2020 - Pierwszy w Polsce model wysyłkowy</h3>
                    <p className="font-sans text-muted-foreground">
                      Wprowadziliśmy innowacyjny model napraw przez paczkomaty. To był przełom - 
                      klienci z całej Polski mogli korzystać z naszych usług bez wychodzenia z domu.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-card border border-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">2024 - Lider branży</h3>
                    <p className="font-sans text-muted-foreground">
                      Dziś jesteśmy jednym z największych serwisów wysyłkowych w Polsce. 
                      Realizujemy ponad 2500 napraw rocznie, zatrudniając doświadczonych techników 
                      z certyfikatami renomowanych producentów.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="section-container py-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Liczby, które mówią same
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Nasze <span className="text-primary">osiągnięcia</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="font-sans text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="font-sans text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="section-container py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                Nasz zespół
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Poznaj naszych <span className="text-primary">ekspertów</span>
              </h2>
              <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
                Doświadczeni technicy z certyfikatami wiodących producentów
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-card border border-border rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="font-sans text-sm text-primary text-center mb-3">
                    {member.role}
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-sans text-muted-foreground">{member.experience}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Wrench className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-muted-foreground">{member.specialization}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-semibold text-foreground mb-2">Certyfikaty:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="section-container py-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Certyfikaty i standardy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Jakość <span className="text-primary">potwierdzona</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className="bg-card border border-border rounded-2xl p-6 text-center group hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {cert.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust Elements */}
        <section className="section-container py-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                Dlaczego my?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Twoje <span className="text-primary">bezpieczeństwo</span> to priorytet
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustElements.map((element, index) => (
                <motion.div
                  key={element.title}
                  className="bg-card border border-border rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <element.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {element.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    {element.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="section-container py-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Opinie klientów
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Co mówią o nas <span className="text-primary">klienci?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="bg-card border border-border rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-sans text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-sans text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="font-sans text-xs text-muted-foreground">
                    {testimonial.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Workshop/Gallery placeholder */}
        <section className="section-container py-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Nasze zaplecze
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Nowoczesny <span className="text-primary">warsztat</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Stanowisko diagnostyczne", desc: "Profesjonalny sprzęt do diagnostyki" },
              { title: "Strefa napraw", desc: "Wyposażona w narzędzia do precyzyjnych napraw" },
              { title: "Laboratorium czystości", desc: "Strefy ESD do pracy z komponentami" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="relative rounded-2xl overflow-hidden bg-card border border-border group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Wrench className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
