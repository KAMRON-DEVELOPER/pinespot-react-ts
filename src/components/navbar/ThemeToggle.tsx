'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';

// Define the valid theme type for safety
type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Coerce theme into our expected union type safely
  const currentTheme = (theme as Theme) || 'system';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className=''>
      <Button
        variant='ghost'
        size='icon'
        onClick={toggleTheme}>
        {currentTheme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
      </Button>

      {/* <ThemeSwitcher
        defaultValue={currentTheme}
        onChange={(value: Theme) => setTheme(value)}
        className='scale-125'
      /> */}
    </div>
  );
}
