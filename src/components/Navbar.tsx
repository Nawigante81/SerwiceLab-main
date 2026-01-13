import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/5' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-shadow duration-300"
              whileHover={{ 
                boxShadow: '0 0 25px hsl(82 100% 46% / 0.6)'
              }}
            >
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground font-display">ServiceLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/#how-it-works", label: "Jak to działa" },
              { href: "/cennik", label: "Cennik" },
              { href: "/faq", label: "FAQ" },
              { href: "/kontakt", label: "Kontakt" }
            ].map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                className="relative text-muted-foreground hover:text-primary transition-colors font-sans text-sm group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="hero" size="sm">
                  Panel główny
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Zaloguj się
                  </Button>
                </Link>
                <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
                  <Button variant="hero" size="sm">
                    Zgłoś naprawę
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-1">
                {[
                  { href: "/#how-it-works", label: "Jak to działa" },
                  { href: "/cennik", label: "Cennik" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/kontakt", label: "Kontakt" }
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={link.href} 
                      className="block text-muted-foreground hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-card"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                  {user ? (
                    <Link to="/dashboard">
                      <Button variant="hero" className="w-full">
                        Panel główny
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth">
                        <Button variant="ghost" className="w-full justify-start">
                          Zaloguj się
                        </Button>
                      </Link>
                      <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
                        <Button variant="hero" className="w-full">
                          Zgłoś naprawę
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
