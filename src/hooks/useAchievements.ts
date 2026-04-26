import { useState, useEffect, useCallback } from 'react';
import { AchievementId, Achievement, ACHIEVEMENTS } from '../data/achievements';

export type { AchievementId, Achievement };
export { ACHIEVEMENTS };

export const useAchievements = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('gamification-enabled');
    return stored !== null ? stored === 'true' : true;
  });

  const [unlockedIds, setUnlockedIds] = useState<AchievementId[]>(() => {
    const stored = localStorage.getItem('unlocked-achievements');
    return stored ? JSON.parse(stored) : [];
  });

  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    localStorage.setItem('gamification-enabled', enabled.toString());
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('unlocked-achievements', JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  const unlock = useCallback((id: AchievementId) => {
    if (!enabled) return;
    
    setUnlockedIds(prev => {
      if (prev.includes(id)) return prev;
      
      const newAchievement = ACHIEVEMENTS[id];
      setLatestAchievement(newAchievement);
      
      // Auto-hide the toast after 8 seconds
      setTimeout(() => {
        setLatestAchievement(current => current?.id === id ? null : current);
      }, 8000);
      
      return [...prev, id];
    });
  }, [enabled]);

  const clearLatest = useCallback(() => {
    setLatestAchievement(null);
  }, []);

  return {
    enabled,
    setEnabled,
    unlockedIds,
    unlock,
    latestAchievement,
    clearLatest
  };
};
