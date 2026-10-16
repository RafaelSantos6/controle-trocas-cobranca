import { createContext, useContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'henn_theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    try {
      const salvo = localStorage.getItem(THEME_STORAGE_KEY);
      if (salvo === 'light' || salvo === 'dark') return salvo;
      return 'dark'; // Padrão
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem(THEME_STORAGE_KEY, tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        tema,
        isDark: tema === 'dark',
        toggleTema,
        setTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider.');
  }
  return ctx;
}

