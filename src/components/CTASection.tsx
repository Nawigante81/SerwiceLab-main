import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "2000+", label: "Napraw rocznie" },
  { value: "98%", label: "Zadowolonych klientów" },
  { value: "48h", label: "Średni czas diagnozy" }
];

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gotowy na <span className="text-primary" style={{ textShadow: '0 0 30px hsl(82 100% 46% / 0.5)' }}>naprawę?</span>
          </h2>
          <p className="font-sans text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Zgłoś problem ze swoim sprzętem już teraz. Darmowa wysyłka, szybka diagnoza i profesjonalna naprawa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                Zgłoś naprawę teraz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
              <Link to="/kontakt">
                <MessageCircle className="w-5 h-5" />
                Masz pytania?
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-16 pt-16 border-t border-border">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary" style={{ textShadow: '0 0 20px hsl(82 100% 46% / 0.3)' }}>
                  {stat.value}
                </p>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
