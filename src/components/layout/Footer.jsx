import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <span className="font-display text-xl tracking-[0.25em] font-semibold">BERPEN</span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Gedanken über das Leben, Kreativität, Technologie und die kleinen Dinge, die oft übersehen werden.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide uppercase mb-4">Navigation</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Start</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Artikel</Link>
              <Link to="/gedankenarchiv" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Gedankenarchiv</Link>
              <Link to="/ueber-mich" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Über mich</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide uppercase mb-4">Themenwelten</h4>
            <div className="space-y-3">
              <Link to="/blog?category=kreativitaet" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Kreativität</Link>
              <Link to="/blog?category=familie" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Familie</Link>
              <Link to="/blog?category=technologie" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Technologie</Link>
              <Link to="/blog?category=fotografie" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Fotografie</Link>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BERPEN. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-muted-foreground italic font-heading">
            „Die Welt aufmerksam beobachten."
          </p>
        </div>
      </div>
    </footer>
  );
}