import { Laptop, Monitor, HardDrive, Cpu, Wifi, Battery } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const features = [
  { icon: Laptop, title: "Laptopy", description: "Naprawa wszystkich marek - HP, Dell, Lenovo, ASUS, Acer i innych.", category: "laptop" },
  { icon: Monitor, title: "Komputery PC", description: "Stacje robocze, zestawy gamingowe i komputery biurowe.", category: "pc" },
  { icon: HardDrive, title: "Dyski i dane", description: "Odzyskiwanie danych, wymiana dysków SSD/HDD.", category: "laptop" },
  { icon: Cpu, title: "Podzespoły", description: "Wymiana procesorów, RAM, kart graficznych i płyt głównych.", category: "pc" },
  { icon: Wifi, title: "Sieci i WiFi", description: "Naprawy modułów sieciowych i kart WiFi.", category: "other" },
  { icon: Battery, title: "Baterie", description: "Wymiana baterii w laptopach i urządzeniach mobilnych.", category: "other" },
];

const issuesByCategory = {
  laptop: ["Nie uruchamia się", "Przegrzewanie", "Uszkodzona klawiatura", "Matryca/podświetlenie"],
  pc: ["Brak obrazu", "Niestabilna praca", "Resetowanie pod obciążeniem", "Wolne działanie"],
  other: ["Nie działa WiFi", "Słaba bateria", "Uszkodzone porty", "Głośna praca"],
};

const FeaturesSection = () => {
  const [activeCategory, setActiveCategory] = useState<"laptop" | "pc" | "other">("laptop");
  const filteredFeatures = features.filter((feature) => feature.category === activeCategory);
  const categoryCounts = features.reduce<Record<string, number>>((acc, feature) => {
    acc[feature.category] = (acc[feature.category] || 0) + 1;
    return acc;
  }, {});
  const issues = issuesByCategory[activeCategory];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            Zakres usług
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co <span className="text-primary">naprawiamy?</span>
          </h2>
          <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
            Specjalizujemy się w naprawach sprzętu komputerowego wszelkiego typu.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { id: "laptop", label: "Laptop" },
            { id: "pc", label: "PC" },
            { id: "other", label: "Inne" },
          ].map((category) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id as "laptop" | "pc" | "other")}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(82_100%_46%_/_0.3)]"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {category.label}{" "}
              <span className="opacity-70">({categoryCounts[category.id] ?? 0})</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {filteredFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          key={`${activeCategory}-issues`}
          className="mt-10 rounded-2xl bg-card border border-border p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
            Najczęstsze usterki
          </p>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue) => (
              <span
                key={issue}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground"
              >
                {issue}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
