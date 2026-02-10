import { NavLink } from 'react-router-dom';
import { Utensils, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Utensils },
  { to: '/trends', label: 'Trends', icon: BarChart3 },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
