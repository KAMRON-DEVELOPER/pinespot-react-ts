import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className='px-2 py-1'>
      <p className='text-xs text-muted-foreground px-2 pb-2'>Theme</p>
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors w-full text-left
            ${theme === value ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'}`}>
          <Icon className='h-4 w-4' />
          {label}
          {theme === value && <div className='ml-auto h-2 w-2 rounded-full bg-primary animate-pulse' />}
        </button>
      ))}
    </div>
  );
}
