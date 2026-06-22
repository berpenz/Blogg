import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Tag, MessageSquare, LogOut } from 'lucide-react';

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/artikel', label: 'Artikel', icon: FileText },
  { path: '/admin/gedanken', label: 'Gedanken', icon: MessageSquare },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display text-lg tracking-[0.2em] font-semibold">
              BERPEN
            </Link>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Admin</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Zur Webseite
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Nav */}
        <nav className="flex gap-1 mb-8 border-b border-border pb-4">
          {ADMIN_NAV.map(item => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-sm ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}