import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="section-container">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Polityka prywatności
            </h1>
            <p className="font-sans text-muted-foreground text-lg">
              Szanujemy Twoją prywatność i dbamy o bezpieczeństwo danych
              przekazywanych w serwisie ServiceLab.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Jakie dane zbieramy
              </h2>
              <p className="font-sans text-muted-foreground">
                Dane kontaktowe, informacje o urządzeniu oraz treść zgłoszenia
                potrzebną do realizacji naprawy.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Cel przetwarzania
              </h2>
              <p className="font-sans text-muted-foreground">
                Dane przetwarzamy w celu obsługi zgłoszeń, komunikacji z
                klientem i rozliczeń.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Twoje prawa
              </h2>
              <p className="font-sans text-muted-foreground">
                Masz prawo do wglądu, poprawienia lub usunięcia danych. W tym
                celu skontaktuj się z nami.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Kontakt
              </h2>
              <p className="font-sans text-muted-foreground">
                W sprawach ochrony danych napisz na kontakt@servicelab.pl.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
