import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeBot from './ThemeBot';
import { AchievementToast } from './AchievementToast';
import { AchievementsModal } from './AchievementsModal';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const {
    theme,
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

  const fireConfetti = () => {
    import('canvas-confetti').then((confettiModule) => {
      const confetti = confettiModule.default;
      const colors = ['#b87333', '#76d6d5', '#ffffff']; // Copper, Teal, White
      
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: colors,
        zIndex: 999
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.65 },
          scalar: 1.2
        });
      }, 300);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.65 },
          scalar: 1.2
        });
      }, 600);

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          confetti({
            ...defaults,
            particleCount: Math.floor(Math.random() * 20) + 15,
            spread: 60,
            origin: { 
              x: 0.2 + Math.random() * 0.6, 
              y: 0.2 + Math.random() * 0.4 
            }
          });
        }, 900 + (i * 200));
      }
    });
  };

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
          setPrevTheme(theme);
          setTheme('matrix');
        }}
        onReplayConfetti={fireConfetti}
      />
    </>
  );
}
