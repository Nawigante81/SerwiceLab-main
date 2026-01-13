import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "Jak działa wysyłka sprzętu do naprawy?",
    answer: "Po zgłoszeniu naprawy otrzymasz etykietę wysyłkową na e-mail. Zapakuj sprzęt w bezpieczne opakowanie i nadaj paczkę w najbliższym paczkomacie InPost lub punkcie DPD. Wysyłka jest całkowicie bezpłatna."
  },
  {
    question: "Ile kosztuje diagnoza usterki?",
    answer: "Diagnoza jest bezpłatna! Dopiero po zdiagnozowaniu problemu przedstawimy Ci szczegółowy kosztorys naprawy. Jeśli nie zaakceptujesz kosztorysu, odsyłamy sprzęt bez dodatkowych opłat."
  },
  {
    question: "Jak długo trwa naprawa?",
    answer: "Diagnoza trwa 24-48 godzin od momentu otrzymania sprzętu. Czas naprawy zależy od rodzaju usterki - proste naprawy wykonujemy w 1-3 dni, bardziej skomplikowane mogą zająć do 7 dni roboczych."
  },
  {
    question: "Czy otrzymam gwarancję na naprawę?",
    answer: "Tak! Na każdą naprawę udzielamy 12-miesięcznej gwarancji. W przypadku ponownego wystąpienia tej samej usterki, naprawimy sprzęt bezpłatnie."
  },
  {
    question: "Jak mogę śledzić status mojej naprawy?",
    answer: "Po zalogowaniu się do panelu klienta możesz na bieżąco śledzić status naprawy. Dodatkowo wysyłamy powiadomienia e-mail przy każdej zmianie statusu."
  },
  {
    question: "Jakie urządzenia naprawiacie?",
    answer: "Naprawiamy laptopy wszystkich marek, komputery stacjonarne (PC) oraz inne urządzenia elektroniczne. Specjalizujemy się w naprawach sprzętowych i programowych."
  },
  {
    question: "Czy mogę zapłacić przy odbiorze?",
    answer: "Płatność za naprawę następuje po zaakceptowaniu kosztorysu, przed wysyłką naprawionego sprzętu. Akceptujemy płatności online (BLIK, przelew, karta) oraz płatność przy odbiorze za dodatkową opłatą."
  },
  {
    question: "Co jeśli mój sprzęt nie nadaje się do naprawy?",
    answer: "Jeśli naprawa jest nieopłacalna lub niemożliwa, poinformujemy Cię o tym bezpłatnie. Możesz zdecydować, czy chcesz odzyskać sprzęt, czy zostawić go do utylizacji."
  },
  {
    question: "Jak bezpiecznie zapakować sprzęt do wysyłki?",
    answer: "Użyj oryginalnego opakowania lub kartonu z wypełnieniem (folia bąbelkowa, papier). Laptop powinien być wyłączony, a bateria naładowana do minimum. Nie wysyłaj akcesoriów (ładowarka, mysz), chyba że dotyczą one usterki."
  },
  {
    question: "Czy moje dane są bezpieczne?",
    answer: "Tak, Twoje dane są u nas bezpieczne. Nie przeglądamy prywatnych plików, a wszelkie operacje wykonujemy z zachowaniem pełnej poufności. Zalecamy jednak wykonanie kopii zapasowej przed wysyłką."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Pomoc</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Najczęściej zadawane pytania
            </h1>
            <p className="text-lg text-muted-foreground">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych usług serwisowych.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-4">
              Nie znalazłeś odpowiedzi na swoje pytanie?
            </p>
            <a 
              href="/kontakt" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Skontaktuj się z nami
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
