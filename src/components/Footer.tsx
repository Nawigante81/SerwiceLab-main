import { Link } from "react-router-dom";
import { Cpu, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <motion.div 
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center"
                whileHover={{ boxShadow: '0 0 20px hsl(82 100% 46% / 0.5)' }}
              >
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-foreground font-display">ServiceLab</span>
            </Link>
            <p className="font-sans text-muted-foreground text-sm leading-relaxed">
              Profesjonalny serwis komputerowy z wysyłką. Naprawiamy laptopy i PC bez wychodzenia z domu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Usługi</h4>
            <ul className="space-y-2">
              {["Naprawa laptopów", "Naprawa PC", "Odzyskiwanie danych", "Wymiana podzespołów"].map((item) => (
                <li key={item}>
                  <Link to="/#services" className="font-sans text-muted-foreground hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Firma</h4>
            <ul className="space-y-2">
              {[
                { label: "O nas", href: "/o-nas" },
                { label: "Jak to działa", href: "/#how-it-works" },
                { label: "Cennik", href: "/cennik" },
                { label: "FAQ", href: "/faq" },
                { label: "Kontakt", href: "/kontakt" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="font-sans text-muted-foreground hover:text-primary text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans">kontakt@servicelab.pl</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans">+48 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans">Warszawa, Polska</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-muted-foreground text-sm">
            © 2025 ServiceLab. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/regulamin" className="font-sans text-muted-foreground hover:text-primary text-sm transition-colors">
              Regulamin
            </Link>
            <Link to="/polityka-prywatnosci" className="font-sans text-muted-foreground hover:text-primary text-sm transition-colors">
              Polityka prywatności
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
