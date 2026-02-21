import { Menu, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn sidebar-toggle" onClick={onToggleSidebar}>
          <Menu size={18} />
        </button>
        <div className="header-brand">
          <Sparkles size={16} className="brand-icon" />
          <h1 className="header-title">My</h1>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
