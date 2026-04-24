import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { ACHIEVEMENTS, AchievementId } from '../hooks/useAchievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: AchievementId[];
  currentTheme: string;
  onUnlockMatrix: () => void;
  onReplayConfetti: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedIds, currentTheme, onUnlockMatrix, onReplayConfetti }) => {
  const allAchievements = Object.values(ACHIEVEMENTS);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-surface/60 backdrop-blur-3xl p-6 md:p-12"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-outline-suggested w-full max-w-3xl max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-charcoal text-copper hover:bg-copper hover:text-charcoal transition-colors z-10 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-teal mb-4 block">Gamification</span>
              <h2 className="text-4xl md:text-5xl font-black mb-2">Achievements</h2>
              <div className="w-12 h-1 bg-copper mb-4"></div>
              <p className="text-on-surface/60">
                You have unlocked {unlockedIds.length} out of {allAchievements.length} available achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);

                return (
                  <div 
                    key={achievement.id}
                    className={`flex items-start gap-4 p-4 border transition-all ${
                      isUnlocked 
                        ? 'border-copper/50 bg-surface-lowest shadow-[0_0_10px_rgba(235,94,40,0.1)]' 
                        : 'border-outline-suggested bg-surface/50 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-4xl">
                      {isUnlocked ? achievement.icon : <Lock size={32} className="text-on-surface/40 mt-1" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-lg leading-tight mb-1">
                        {isUnlocked ? achievement.title : '???'}
                      </h4>
                      <p className="text-sm text-on-surface/70 leading-snug">
                        {isUnlocked ? achievement.description : achievement.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {unlockedIds.length < allAchievements.length ? (
              <div className="mt-12 p-8 border border-outline-suggested bg-surface/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Glitch-like decorative elements */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-copper/30 to-transparent" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 flex items-center justify-center border border-outline-suggested bg-surface-lowest text-on-surface/20 shrink-0">
                    <Lock size={32} className="animate-pulse" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-xl font-black mb-1 uppercase tracking-widest text-on-surface/40">Mystery Reward Locked</h3>
                    <p className="text-xs text-on-surface/50 font-medium">Unlock all {allAchievements.length} achievements to reveal a secret reality. {allAchievements.length - unlockedIds.length} remaining.</p>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: allAchievements.length }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-3 h-3 border rotate-45 transition-all duration-500 ${
                          i < unlockedIds.length ? 'bg-teal border-teal shadow-[0_0_8px_rgba(118,214,213,0.5)]' : 'bg-transparent border-outline-suggested'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-6 border border-copper bg-surface-lowest text-center relative overflow-hidden">
                {/* Glitch Effect Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-black mb-2 text-copper relative z-10">100% Complete</h3>
                <p className="text-sm text-on-surface/70 mb-6 relative z-10">You've unlocked every achievement. A hidden reality is now available to you.</p>
                <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
                  <button 
                    onClick={() => {
                      onUnlockMatrix();
                      onClose();
                    }}
                    className="bg-copper text-charcoal font-bold uppercase tracking-widest px-8 py-3 hover:bg-copper-deep transition-colors shadow-[0_0_20px_rgba(235,94,40,0.3)]"
                  >
                    {currentTheme === 'matrix' ? 'Revert to Previous Theme' : 'Enter The Matrix'}
                  </button>
                  <button 
                    onClick={onReplayConfetti}
                    className="border border-copper text-copper font-bold uppercase tracking-widest px-8 py-3 hover:bg-copper/10 transition-colors"
                  >
                    Replay Celebration
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
