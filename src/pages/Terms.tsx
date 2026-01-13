import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
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
              Regulamin
            </h1>
            <p className="font-sans text-muted-foreground text-lg">
              Poniżej znajdziesz skróconą wersję regulaminu korzystania z
              usług ServiceLab. Pełny dokument udostępnimy na życzenie.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Zakres usług
              </h2>
              <p className="font-sans text-muted-foreground">
                Świadczymy usługi diagnostyki i naprawy sprzętu komputerowego
                wraz z obsługą logistyczną wysyłki.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Wycena i akceptacja
              </h2>
              <p className="font-sans text-muted-foreground">
                Diagnoza jest bezpłatna, a naprawę rozpoczynamy po akceptacji
                kosztorysu.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Gwarancja
              </h2>
              <p className="font-sans text-muted-foreground">
                Na wykonane usługi udzielamy gwarancji zgodnie z ofertą
                przedstawioną w kosztorysie.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Kontakt
              </h2>
              <p className="font-sans text-muted-foreground">
                W razie pytań skontaktuj się z nami przez formularz kontaktowy.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
