import { useState, useEffect, useCallback } from 'react';

export type AchievementId = 'getting-to-know-ankush' | 'deep-diver' | 'data-miner' | 'ai-prodigy' | 'peer-reviewed' | 'time-traveler' | 'the-networker';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  hint: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  'getting-to-know-ankush': { 
    id: 'getting-to-know-ankush', 
    title: 'Getting to Know Ankush', 
    description: 'Arrived at the site and started exploring.', 
    icon: '👋',
    hint: 'The first step is often the quietest.'
  },
  'deep-diver': { 
    id: 'deep-diver', 
    title: 'Deep Diver', 
    description: 'Opened a project deep dive.', 
    icon: '🏆',
    hint: 'Surface-level views only tell half the story. Seek the architecture beneath.'
  },
  'data-miner': { 
    id: 'data-miner', 
    title: 'Data Miner', 
    description: 'Scrolled to the absolute bottom of the page.', 
    icon: '📜',
    hint: 'The foundation is where the truth is buried. Can you find the absolute floor?'
  },
  'ai-prodigy': { 
    id: 'ai-prodigy', 
    title: 'AI Prodigy', 
    description: 'Engaged with the Ankush AI chatbot.', 
    icon: '🧠',
    hint: 'A ghost in the machine waits for a spark. Have you spoken to the reflection?'
  },
  'peer-reviewed': { 
    id: 'peer-reviewed', 
    title: 'Peer Reviewed', 
    description: 'Read through the peer testimonials.', 
    icon: '🤝',
    hint: 'To know the architect, listen to the echoes of those who worked beside him.'
  },
  'time-traveler': { 
    id: 'time-traveler', 
    title: 'Time Traveler', 
    description: 'Navigated the chronological timeline.', 
    icon: '⏳',
    hint: 'Linear progression is an illusion. Trace the steps of the decades.'
  },
  'the-networker': { 
    id: 'the-networker', 
    title: 'Networker', 
    description: 'Clicked a contact or social link.', 
    icon: '🌐',
    hint: 'The digital web extends beyond these borders. Find the threads that lead out.'
  }
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
