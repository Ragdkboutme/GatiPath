import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  labelOdia: string;
  href: string;
};

export const Navigation = ({ isOdia = false }: { isOdia?: boolean }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems: NavItem[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      labelOdia: "ଡ୍ୟାସବୋର୍ଡ",
      href: "/"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Alerts",
      labelOdia: "ଚେତାବନୀ",
      href: "/alerts"
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Analytics",
      labelOdia: "ବିଶ୍ଳେଷଣ",
      href: "/analytics"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      labelOdia: "ସେଟିଂସ",
      href: "/settings"
    }
  ];
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {item.icon}
            <span>{isOdia ? item.labelOdia : item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden relative">
        {/* Hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-full bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block h-0.5 w-full bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50">
            <div className="py-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{isOdia ? item.labelOdia : item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};