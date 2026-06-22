import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { path: '/', label: 'Start' },
  { path: '/blog', label: 'Artikel' },
  { path: '/galerie', label: 'Galerie' },
  { path: '/gedankenarchiv', label: 'Gedankenarchiv' },
  { path: '/ueber-mich', label: 'Über mich' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isHome = location.pathname === '/';
  const showTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent
          ? 'bg-transparent'
          : 'bg-background/90 backdrop-blur-md border-b border-border/50'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="relative z-10">
          <span
            className={`font-display text-2xl tracking-[0.25em] font-semibold transition-colors duration-500 ${
              showTransparent ? 'text-white' : 'text-foreground'
            }`}
          >
            BERPEN
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm tracking-wide transition-colors duration-300 hover:text-primary ${
                showTransparent
                  ? location.pathname === link.path ? 'text-white font-medium' : 'text-white/80'
                  : location.pathname === link.path ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/suche"
            className={`transition-colors duration-300 ${
              showTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4" />
          </Link>
          <button
            onClick={toggleTheme}
            className={`transition-colors duration-300 ${
              showTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className={showTransparent ? 'text-white/80' : 'text-muted-foreground'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={showTransparent ? 'text-white' : 'text-foreground'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-lg font-heading ${
                    location.pathname === link.path ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/suche" className="block text-lg font-heading text-muted-foreground">
                Suche
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}