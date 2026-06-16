export type AchievementId = 'getting-to-know-ankush' | 'deep-diver' | 'the-reader' | 'ai-prodigy' | 'peer-reviewed' | 'behind-the-build' | 'the-networker' | 'vocal-resonance';

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
  'the-reader': {
    id: 'the-reader',
    title: 'The Reader',
    description: 'Explored the writing collection.',
    icon: '📖',
    hint: 'Roles fade; the thinking is written down somewhere. Go find the words.'
  },
  'ai-prodigy': { 
    id: 'ai-prodigy', 
    title: 'AI Prodigy', 
    description: 'Engaged with the Ankush AI agent.', 
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
  'behind-the-build': {
    id: 'behind-the-build',
    title: 'Behind the Build',
    description: 'Peeked behind the curtain at how this site was made.',
    icon: '🛠️',
    hint: 'Every build has a story. Seek out the making-of.'
  },
  'the-networker': { 
    id: 'the-networker', 
    title: 'Networker', 
    description: 'Clicked a contact or social link.', 
    icon: '🌐',
    hint: 'The digital web extends beyond these borders. Find the threads that lead out.'
  },
  'vocal-resonance': { 
    id: 'vocal-resonance', 
    title: 'Vocal Resonance', 
    description: 'Engaged in a voice chat with the AI agent.', 
    icon: '🎙️',
    hint: 'The machine does not just think, it speaks. Have you called out to the phantom in the wires?'
  }
};
