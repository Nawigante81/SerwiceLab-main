import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Imię jest wymagane").max(100, "Imię jest za długie"),
  email: z.string().trim().email("Nieprawidłowy adres email").max(255, "Email jest za długi"),
  phone: z.string().trim().max(20, "Numer telefonu jest za długi").optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Temat jest wymagany").max(200, "Temat jest za długi"),
  message: z.string().trim().min(1, "Wiadomość jest wymagana").max(2000, "Wiadomość jest za długa"),
});

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "kontakt@servicelab.pl",
    href: "mailto:kontakt@servicelab.pl",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+48 123 456 789",
    href: "tel:+48123456789",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "ul. Serwisowa 15, 00-001 Warszawa",
    href: null,
  },
  {
    icon: Clock,
    label: "Godziny pracy",
    value: "Pon-Pt: 9:00-18:00",
    href: null,
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast({
        title: "Błąd walidacji",
        description: firstError.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || null,
          subject: result.data.subject,
          message: result.data.message,
        });

      if (error) throw error;

      toast({
        title: "Wiadomość wysłana!",
        description: "Odpowiemy najszybciej jak to możliwe.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="text-sm font-medium text-primary">Jesteśmy do Twojej dyspozycji</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Skontaktuj się z nami
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Masz pytania dotyczące naprawy? Chcesz poznać szczegóły naszych usług? Napisz do nas lub zadzwoń!
            </p>
          </motion.div>
        </section>

        <section className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-card border border-border rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6">Wyślij wiadomość</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Imię i nazwisko</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jan Kowalski"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jan@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon (opcjonalnie)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+48 123 456 789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Temat</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Pytanie o naprawę"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Wiadomość</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Opisz swoje pytanie lub problem..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Wysyłanie..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Wyślij wiadomość
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Dane kontaktowe</h2>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl group hover:border-primary/30 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* FAQ Prompt */}
              <motion.div
                className="bg-secondary/50 border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-display font-semibold mb-2">Często zadawane pytania</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Odpowiedzi na najczęściej zadawane pytania znajdziesz w naszej sekcji FAQ.
                </p>
                <Link 
                  to="/faq" 
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  Przejdź do FAQ
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
