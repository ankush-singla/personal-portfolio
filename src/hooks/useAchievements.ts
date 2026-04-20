import { useState, useEffect, useCallback } from 'react';

export type AchievementId = 'getting-to-know-ankush' | 'deep-diver' | 'data-miner' | 'vibe-checker' | 'peer-reviewed' | 'time-traveler' | 'the-networker';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  'getting-to-know-ankush': { id: 'getting-to-know-ankush', title: 'Getting to Know Ankush', description: 'Arrived at the site and started exploring.', icon: '👋' },
  'deep-diver': { id: 'deep-diver', title: 'Deep Diver', description: 'Opened a project deep dive.', icon: '🏆' },
  'data-miner': { id: 'data-miner', title: 'Data Miner', description: 'Scrolled to the absolute bottom of the page.', icon: '📜' },
  'vibe-checker': { id: 'vibe-checker', title: 'Vibe Checker', description: 'Interacted with the ThemeBot.', icon: '🎨' },
  'peer-reviewed': { id: 'peer-reviewed', title: 'Peer Reviewed', description: 'Read through the peer testimonials.', icon: '🤝' },
  'time-traveler': { id: 'time-traveler', title: 'Time Traveler', description: 'Navigated the chronological timeline.', icon: '⏳' },
  'the-networker': { id: 'the-networker', title: 'Networker', description: 'Clicked a contact or social link.', icon: '🌐' }
};

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
      
      // Auto-hide the toast after 4 seconds
      setTimeout(() => {
        setLatestAchievement(current => current?.id === id ? null : current);
      }, 4000);
      
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
