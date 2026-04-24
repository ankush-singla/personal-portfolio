import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { ACHIEVEMENTS, AchievementId } from '../hooks/useAchievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: AchievementId[];
  currentTheme: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onUnlockMatrix: () => void;
  onReplayConfetti: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedIds, currentTheme, enabled, onToggleEnabled, onUnlockMatrix, onReplayConfetti }) => {
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
            className="bg-surface border border-outline-suggested w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-charcoal text-copper hover:bg-copper hover:text-charcoal transition-all z-20 rounded-full border border-copper/20"
            >
              <X size={20} />
            </button>

            <div className="mb-6 pr-12">
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal mb-2 block">Personal Records</span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black mb-1">Achievements</h2>
                    <div className="w-10 h-1 bg-copper"></div>
                  </div>
                  
                  <button 
                    onClick={() => onToggleEnabled(!enabled)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 border rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] ${enabled ? 'border-teal bg-teal/5 text-teal' : 'border-outline-suggested text-on-surface/40'}`}
                  >
                    <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${enabled ? 'bg-teal animate-pulse' : 'bg-on-surface/20'}`} />
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                      {enabled ? 'Gamification ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
              <p className="text-on-surface/60 mt-4 text-sm max-w-xl">
                You have unlocked {unlockedIds.length} out of {allAchievements.length} available achievements. Keep exploring the site to find more hidden secrets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);

                return (
                  <div 
                    key={achievement.id}
                    className={`flex items-start gap-3 p-3 border transition-all ${
                      isUnlocked 
                        ? 'border-copper/50 bg-surface-lowest shadow-[0_0_10px_rgba(235,94,40,0.1)]' 
                        : 'border-outline-suggested bg-surface/50 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-2xl shrink-0">
                      {isUnlocked ? achievement.icon : <Lock size={20} className="text-on-surface/40 mt-1" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm leading-tight mb-0.5">
                        {isUnlocked ? achievement.title : '???'}
                      </h4>
                      <p className="text-[11px] text-on-surface/70 leading-tight">
                        {isUnlocked ? achievement.description : achievement.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {unlockedIds.length < allAchievements.length ? (
              <div className="mt-6 p-4 border border-outline-suggested bg-surface/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-outline-suggested bg-surface-lowest text-on-surface/20 shrink-0">
                    <Lock size={18} className="animate-pulse" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-sm font-black mb-0.5 uppercase tracking-widest text-on-surface/40">Mystery Reward Locked</h3>
                    <p className="text-[10px] text-on-surface/50 font-medium">Unlock all {allAchievements.length} achievements to reveal a secret reality. {allAchievements.length - unlockedIds.length} remaining.</p>
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
