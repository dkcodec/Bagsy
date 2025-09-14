'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Переключатель тем между светлой, темной и системной
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Предотвращаем гидратацию
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="theme-toggle">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="theme-toggle__button"
        aria-label="Переключить тему"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
