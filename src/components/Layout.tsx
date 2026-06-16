import { Outlet } from 'react-router-dom';
import ThemeBot from './ThemeBot';
import { AchievementToast } from './AchievementToast';
import { AchievementsModal } from './AchievementsModal';
import { useApp } from '../context/AppContext';
import { fireConfetti } from '../utils/confetti';

export default function Layout() {
  const {
    theme,
    prevTheme,
    setTheme,
    setPrevTheme,
    unlockedIds,
    unlock,
    latestAchievement,
    clearLatest,
    enabled,
    setEnabled,
    isAchievementsModalOpen,
    setIsAchievementsModalOpen,
  } = useApp();

  return (
    <>
      {/* Renders the child route page */}
      <Outlet />

      {/* Persistent Theme Chat Bot */}
      <ThemeBot 
        currentTheme={theme} 
        onThemeChange={(t) => {
          setPrevTheme(theme);
          setTheme(t);
        }} 
        onInteract={() => unlock('ai-prodigy')}
        onVoiceInteract={() => unlock('vocal-resonance')}
        unlockedIds={unlockedIds}
      />

      {/* Global Achievements Toast */}
      <AchievementToast 
        achievement={latestAchievement} 
        onClose={clearLatest} 
      />

      {/* Global Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        unlockedIds={unlockedIds}
        currentTheme={theme}
        enabled={enabled}
        onToggleEnabled={() => setEnabled(!enabled)}
        onUnlockMatrix={() => {
          // Toggle: into Matrix, or back to whatever was active before.
          const next = theme === 'matrix' ? prevTheme : 'matrix';
          setPrevTheme(theme);
          setTheme(next);
        }}
        onReplayConfetti={fireConfetti}
      />
    </>
  );
}
