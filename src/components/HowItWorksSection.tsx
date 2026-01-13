import { Package, Search, CreditCard, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Zgłoś naprawę",
    description: "Opisz problem i wybierz paczkomat. Od razu dostajesz etykietę i instrukcje.",
    time: "5-10 min",
    owner: "Ty",
  },
  {
    icon: Search,
    step: "02",
    title: "Diagnoza",
    description: "Sprawdzamy sprzęt i przygotowujemy kosztorys w 24-48h.",
    time: "24-48h",
    owner: "My",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Akceptacja i płatność",
    description: "Akceptujesz kosztorys online i opłacasz naprawę. Bez niespodzianek.",
    time: "2-3 min",
    owner: "Ty",
  },
  {
    icon: Truck,
    step: "04",
    title: "Odbiór",
    description: "Naprawiony sprzęt wraca do Ciebie paczkomatem lub kurierem.",
    time: "1-2 dni",
    owner: "My",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            Prosty proces
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jak to <span className="text-primary">działa?</span>
          </h2>
          <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
            Od zgłoszenia do odbioru naprawionego sprzętu - wszystko załatwisz online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="group relative"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[60%] w-full h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}

              <div className="relative p-6 h-full rounded-xl bg-card border border-border transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
                <span 
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm"
                  style={{ boxShadow: '0 0 20px hsl(82 100% 46% / 0.4)' }}
                >
                  {item.step}
                </span>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {item.owner}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground">
                    {item.time}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
