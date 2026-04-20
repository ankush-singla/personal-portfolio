import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../hooks/useAchievements';
import { X } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[200] flex items-start gap-4 p-4 rounded-lg bg-surface/90 backdrop-blur-md border border-copper/50 shadow-[0_0_15px_rgba(235,94,40,0.3)] max-w-sm"
        >
          <div className="text-3xl mt-1">{achievement.icon}</div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-copper font-bold mb-1">Achievement Unlocked</div>
            <h4 className="font-bold text-on-surface text-lg leading-tight mb-1">{achievement.title}</h4>
            <p className="text-sm text-on-surface/70 leading-snug">{achievement.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface/50 hover:text-on-surface transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
