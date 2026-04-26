import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import { RESUME_DATA } from '../data/resume';

interface SmartNavProps {
  isVisible: boolean;
}

export const SmartNav: React.FC<SmartNavProps> = ({ isVisible }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const sections = RESUME_DATA.siteMetadata.sections;

  const updateCurrentSection = useCallback(() => {
    const sectionElements = sections.map(s => document.getElementById(s.id));
    
    let currentIdx = 0;
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sectionElements.forEach((el, idx) => {
      if (el && el.offsetTop <= scrollPosition) {
        currentIdx = idx;
      }
    });

    setCurrentSectionIndex(currentIdx);
  }, [sections]);

  useEffect(() => {
    window.addEventListener('scroll', updateCurrentSection);
    return () => window.removeEventListener('scroll', updateCurrentSection);
  }, [updateCurrentSection]);

  const scrollToNext = () => {
    const isLast = currentSectionIndex === sections.length - 1;
    const targetIdx = isLast ? 0 : currentSectionIndex + 1;
    const targetId = sections[targetIdx].id;
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80; // Account for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isLastSection = currentSectionIndex === sections.length - 1;
  const nextSection = isLastSection ? null : sections[currentSectionIndex + 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToNext}
          className="mb-3 px-5 py-2.5 bg-surface-high/80 backdrop-blur-md border border-copper/20 text-on-surface shadow-lg rounded-full flex items-center gap-3 group transition-all hover:border-copper/50"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/60 group-hover:text-copper transition-colors">
            {isLastSection ? 'Back to Top' : `Next: ${nextSection?.title}`}
          </span>
          <div className="w-5 h-5 rounded-full bg-copper/10 flex items-center justify-center text-copper group-hover:bg-copper group-hover:text-charcoal transition-all">
            {isLastSection ? <ArrowUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
