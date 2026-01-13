import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
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
              O nas
            </h1>
            <p className="font-sans text-muted-foreground text-lg">
              ServiceLab to nowoczesny serwis komputerowy z wygodną wysyłką i
              transparentną wyceną. Dbamy o bezpieczeństwo danych i szybki czas
              realizacji.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid gap-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Nasza misja
              </h2>
              <p className="font-sans text-muted-foreground">
                Ułatwiamy naprawę sprzętu komputerowego bez wychodzenia z domu.
                Skupiamy się na jakości, komunikacji i uczciwej wycenie.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Dlaczego warto nam zaufać
              </h2>
              <ul className="space-y-2 font-sans text-muted-foreground">
                <li>• Szybka diagnoza w 24-48h</li>
                <li>• Gwarancja na każdą naprawę</li>
                <li>• Bezpieczna obsługa danych</li>
                <li>• Stały wgląd w status naprawy</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Jak działamy
              </h2>
              <p className="font-sans text-muted-foreground">
                Po zgłoszeniu naprawy otrzymujesz instrukcje wysyłki. Po
                diagnozie dostajesz kosztorys do akceptacji, a po zakończeniu
                naprawy sprzęt wraca do Ciebie.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
