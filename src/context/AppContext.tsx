import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAchievements, Achievement, AchievementId } from '../hooks/useAchievements';
import { ThemeType } from '../types';
import { applyThemeToRoot } from '../utils/theme';

interface AppContextType {
  theme: string;
  prevTheme: string;
  setTheme: (t: string) => void;
  setPrevTheme: (t: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAchievementsModalOpen: boolean;
  setIsAchievementsModalOpen: (open: boolean) => void;
  // Achievements
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  unlockedIds: AchievementId[];
  unlock: (id: AchievementId) => void;
  latestAchievement: Achievement | null;
  clearLatest: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('site-theme') || 'monolith';
  });
  const [prevTheme, setPrevTheme] = useState<string>(() => {
    return localStorage.getItem('site-prev-theme') || 'monolith';
  });
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);

  const achievements = useAchievements();

  // Keep theme in localStorage and apply it on state change
  useEffect(() => {
    localStorage.setItem('site-theme', theme);
    const root = document.documentElement;
    applyThemeToRoot(root, theme);
  }, [theme]);

  // Persist the previous theme so "revert" survives a reload (e.g. out of Matrix).
  useEffect(() => {
    localStorage.setItem('site-prev-theme', prevTheme);
  }, [prevTheme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        prevTheme,
        setTheme,
        setPrevTheme,
        isChatOpen,
        setIsChatOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAchievementsModalOpen,
        setIsAchievementsModalOpen,
        ...achievements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
