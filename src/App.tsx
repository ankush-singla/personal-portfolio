/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeType } from './types';
import { RESUME_DATA } from './data/resume';
import ThemeBot from './components/ThemeBot';
import { useAchievements } from './hooks/useAchievements';
import { AchievementToast } from './components/AchievementToast';
import { AchievementsModal } from './components/AchievementsModal';
import { Camera, Gamepad2, Users, Briefcase, Mail, Github, Linkedin, Twitter, ArrowRight, X, ChevronLeft, ChevronRight, Menu, Play, Pause, Trophy } from 'lucide-react';
import { applyThemeToRoot } from './utils/theme';
import MatrixRain from './components/MatrixRain';
import BasketballParquet from './components/BasketballParquet';

export default function App() {
  const [theme, setTheme] = useState<string>('monolith');
  const [prevTheme, setPrevTheme] = useState<string>('monolith');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(1); // Default to Ace AI (2025)
  const [isProjectAutoPlayPaused, setIsProjectAutoPlayPaused] = useState(false);
  const [activeYear, setActiveYear] = useState<string>(RESUME_DATA.projects[1].year);
  const [activeCompany, setActiveCompany] = useState<string>(RESUME_DATA.experience[0].company);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasFiredConfetti, setHasFiredConfetti] = useState(() => {
    return localStorage.getItem('has-fired-confetti') === 'true';
  });
  const [isGlitching, setIsGlitching] = useState(false);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const { enabled, setEnabled, unlockedIds, unlock, latestAchievement, clearLatest } = useAchievements();

  const getDisplayPeriod = (experiences: typeof RESUME_DATA.experience, company: string) => {
    const exps = experiences.filter(e => e.company === company);
    if (exps.length === 1) return exps[0].period;
    const years = exps.map(e => e.period.match(/\d{4}/g)).flat().filter(Boolean).map(Number);
    const min = Math.min(...years);
    const max = Math.max(...years);
    const hasPresent = exps.some(e => e.period.toLowerCase().includes('present'));
    return `${min} - ${hasPresent ? 'Present' : max}`;
  };

  useEffect(() => {
    const handleGlobalScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        unlock('data-miner');
      }
    };
    window.addEventListener('scroll', handleGlobalScroll);
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [unlock]);

  useEffect(() => {
    // Unlock the welcome achievement shortly after load
    const timer = setTimeout(() => {
      unlock('getting-to-know-ankush');
    }, 1500);
    return () => clearTimeout(timer);
  }, [unlock]);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 400;
      timelineRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      unlock('time-traveler');
    }
  };

  useEffect(() => {
    if (activeCompany) {
      if (timelineRef.current) {
        const container = timelineRef.current;
        const activeElement = container.querySelector(`[data-company="${activeCompany}"]`) as HTMLElement;
        if (activeElement) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();
          const relativeLeft = elementRect.left - containerRect.left + container.scrollLeft;
          const scrollLeft = relativeLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }

      const sidebarNav = document.getElementById('left-sidebar-nav');
      if (sidebarNav) {
        const activeNav = sidebarNav.querySelector(`[data-nav-company="${activeCompany}"]`) as HTMLElement;
        if (activeNav) {
          const scrollTop = activeNav.offsetTop - (sidebarNav.clientHeight / 2) + (activeNav.clientHeight / 2);
          sidebarNav.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }
    }
  }, [activeCompany]);

  const fireConfetti = () => {
    import('canvas-confetti').then((confettiModule) => {
      const confetti = confettiModule.default;
      const colors = ['#b87333', '#76d6d5', '#ffffff']; // Copper, Teal, White
      
      // 1. Initial powerful central burst
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

      // 2. Left side cannon
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

      // 3. Right side cannon
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

      // 4. Random "Popcorn" bursts for sustained excitement
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          confetti({
            ...defaults,
            particleCount: Math.floor(Math.random() * 20) + 15,
            spread: 60,
            origin: { 
              x: 0.2 + Math.random() * 0.6, 
              y: 0.2 + Math.random() * 0.4 
            },
            scalar: 0.8,
            gravity: 1.2,
            drift: Math.random() > 0.5 ? 2 : -2
          });
        }, 900 + (i * 250));
      }
    });
  };

  useEffect(() => {
    if (unlockedIds.length === 7 && !hasFiredConfetti) {
      fireConfetti();
      setHasFiredConfetti(true);
      localStorage.setItem('has-fired-confetti', 'true');
    }
  }, [unlockedIds.length, hasFiredConfetti]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'work', 'background', 'testimonials', 'contact'];
      const scrollY = window.scrollY;

      let currentSection = 'home';
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          if (scrollY >= element.offsetTop - 300) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play for testimonials
  useEffect(() => {
    if (activeSection !== 'testimonials') return;

    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % RESUME_DATA.testimonials.length);
    }, 8000); // slightly longer due to longer text length
    return () => clearInterval(timer);
  }, [testimonialIndex, activeSection]);

  // Auto-play for projects
  useEffect(() => {
    if (activeSection !== 'work' || isProjectAutoPlayPaused) return;

    const timer = setInterval(() => {
      nextProject();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentProjectIndex, activeSection, isProjectAutoPlayPaused]);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % RESUME_DATA.testimonials.length);
    unlock('peer-reviewed');
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + RESUME_DATA.testimonials.length) % RESUME_DATA.testimonials.length);
    unlock('peer-reviewed');
  };

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % RESUME_DATA.projects.length);
    setActiveYear(RESUME_DATA.projects[(currentProjectIndex + 1) % RESUME_DATA.projects.length].year);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + RESUME_DATA.projects.length) % RESUME_DATA.projects.length);
    setActiveYear(RESUME_DATA.projects[(currentProjectIndex - 1 + RESUME_DATA.projects.length) % RESUME_DATA.projects.length].year);
  };

  const nextProjectInModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentProjectIndex + 1) % RESUME_DATA.projects.length;
    setCurrentProjectIndex(nextIdx);
    setSelectedProject(RESUME_DATA.projects[nextIdx]);
    setActiveYear(RESUME_DATA.projects[nextIdx].year);
  };

  const prevProjectInModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentProjectIndex - 1 + RESUME_DATA.projects.length) % RESUME_DATA.projects.length;
    setCurrentProjectIndex(prevIdx);
    setSelectedProject(RESUME_DATA.projects[prevIdx]);
    setActiveYear(RESUME_DATA.projects[prevIdx].year);
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
    if (project) unlock('deep-diver');
  };

  // Modal scroll lock
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Inject theme variables into root
  useEffect(() => {
    const root = document.documentElement;
    applyThemeToRoot(root, theme);

    if (theme !== prevTheme) {
      if (theme === 'matrix') {
        setIsGlitching(true);
        const timer = setTimeout(() => setIsGlitching(false), 800);
        return () => clearTimeout(timer);
      }
      setIsGlitching(false);
    }
  }, [theme, prevTheme]);

  // Load special fonts if needed
  useEffect(() => {
    if (theme === '8bit') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else if (theme === 'matrix') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [theme]);

  const navItems = RESUME_DATA.siteMetadata.sections.map(s => ({ label: s.label.split(' / ')[1], id: s.id }));

  const experienceGroups = [
    "Product Leadership",
    "Early Product Career",
    "MBA Work",
    "Early Career",
    "Early Projects"
  ];

  const groupedExperiences = experienceGroups.map(group => ({
    group,
    experiences: RESUME_DATA.experience.filter(exp => exp.group === group)
  })).filter(g => g.experiences.length > 0);

  const educationExperiences = RESUME_DATA.experience.filter(exp => exp.isEducation);

  const timelineGroups = [...groupedExperiences].map(g => ({
    ...g,
    experiences: [...g.experiences].sort((a, b) => {
      const yearA = parseInt(a.period.match(/\d{4}/)?.[0] || "0");
      const yearB = parseInt(b.period.match(/\d{4}/)?.[0] || "0");
      return yearB - yearA;
    })
  }));

  return (
    <>
      <div className={`min-h-screen overflow-x-hidden transition-colors duration-700 selection:bg-copper selection:text-charcoal text-on-surface bg-surface relative ${theme === 'matrix' ? 'matrix-mode' : ''} ${theme === 'basketball' ? 'basketball-mode' : ''} ${isGlitching ? 'glitch-flash' : ''}`}>
        <div className="noise-overlay" />
      <div className="mesh-background">
        <div className="mesh-gradient" />
        {theme === 'matrix' && <MatrixRain />}
        {theme === 'basketball' && <BasketballParquet />}
      </div>
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-surface/80 backdrop-blur-md border-b border-outline-suggested transition-all duration-500">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Brand Island (Left) */}
          <div className="flex items-center">
            <a href="#home" className="text-2xl font-black tracking-tighter hover:text-copper transition-colors flex items-center group">
              AS
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                className="text-copper ml-1"
              >
                _
              </motion.span>
            </a>
          </div>

          {/* Navigation Island (Center) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 whitespace-nowrap px-8">
            {navItems.slice(0, 4).map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={() => {
                  if (item.id === 'work') {
                    setCurrentProjectIndex(1);
                    setActiveYear(RESUME_DATA.projects[1].year);
                  }
                }}
                className={`group relative text-[11px] font-black uppercase tracking-[0.25em] pl-[0.25em] transition-all hover:-translate-y-0.5 ${activeSection === item.id ? 'text-copper' : 'text-on-surface/40 hover:text-on-surface'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="headerNav"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-copper shadow-[0_0_10px_rgba(235,94,40,0.8)]"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action & Utility Island (Right) */}
          <div className="flex items-center justify-end gap-6 h-full">
              {/* Unified Achievement HUD - Visible on 2xl */}
              <div className="hidden 2xl:flex items-center pr-6 border-r border-outline-suggested/30">
                <button 
                  onClick={() => setIsAchievementsModalOpen(true)}
                  className="group/achieve relative flex items-center gap-4 px-4 py-1 hover:bg-teal/5 rounded-full transition-colors"
                >
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="18" className="stroke-on-surface/5 fill-none stroke-1" />
                      <motion.circle 
                        cx="20" cy="20" r="18" 
                        className="stroke-teal fill-none stroke-2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: unlockedIds.length / 7 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <Trophy size={14} className={`transition-all ${unlockedIds.length > 0 ? 'text-teal drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'text-on-surface/20'} group-hover/achieve:scale-110`} />
                    
                    {/* Integrated Active Status Light */}
                    {enabled && (
                      <div className="absolute top-1 right-1">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full shadow-[0_0_5px_rgba(20,184,166,1)] animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30 group-hover/achieve:text-teal transition-colors">Achievements</span>
                    <span className="text-[10px] font-black text-teal leading-none">{unlockedIds.length}/7</span>
                  </div>
                </button>
              </div>
              
              <a href="#contact" className="hidden lg:inline-flex monolith-btn-primary py-2.5 px-6 text-[11px] uppercase tracking-[0.2em] font-black whitespace-nowrap">
              Contact
            </a>

            <button 
              className="lg:hidden p-2 -mr-2 text-on-surface hover:text-copper transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100vh', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="fixed inset-0 top-20 z-50 overflow-hidden bg-surface/95 backdrop-blur-xl"
            >
              <div className="px-8 py-12 flex flex-col h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-copper mb-4">Navigation</span>
                  {navItems.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (item.id === 'work') {
                          setCurrentProjectIndex(1);
                          setActiveYear(RESUME_DATA.projects[1].year);
                        }
                      }}
                      className={`group flex justify-between items-center py-5 border-b border-outline-suggested/30 text-sm font-black uppercase tracking-[0.2em] transition-colors ${activeSection === item.id ? 'text-copper' : 'text-on-surface/60 hover:text-on-surface'}`}
                    >
                      {item.label}
                      <ChevronRight size={18} className={`transition-transform ${activeSection === item.id ? 'text-copper translate-x-1' : 'text-on-surface/20'}`} />
                    </a>
                  ))}
                </div>

                {/* Mobile Achievement Stats */}
                <div className="mt-auto pb-32">
                  <button 
                    onClick={() => {
                      setIsAchievementsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-surface-high/40 border border-outline-suggested/50 p-6 rounded-sm group active:scale-[0.98] transition-all"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Trophy size={18} className="text-teal" />
                        <span className="text-xs font-black uppercase tracking-widest text-on-surface">Achievements</span>
                      </div>
                      <span className="text-sm font-black text-teal">{unlockedIds.length}/7</span>
                    </div>
                    <div className="w-full h-1.5 bg-outline-suggested/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedIds.length / 7) * 100}%` }}
                        className="h-full bg-teal shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                      />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface/40 mt-4 text-left">
                      Tap to view progress & settings
                    </p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-32 md:pt-48">
        {/* Section Wrapper with Vertical Gutter Label */}
        <section id="home" className="relative px-6 md:px-24 pt-32 mb-32 md:mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-32">
            <span className="vertical-label sticky top-32">{RESUME_DATA.siteMetadata.sections[0].label}</span>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24">
            <div className="w-full md:w-3/5 z-10 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 bg-copper/10 border border-copper/20 mb-6 md:hidden"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-copper">Executive Portfolio</span>
              </motion.div>
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-8"
              >
                {RESUME_DATA.siteMetadata.tagline[0]}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-copper-deep">
                  {RESUME_DATA.siteMetadata.tagline[1]}
                </span><br />
                {RESUME_DATA.siteMetadata.tagline[2]}
              </motion.h1>
              <p className="text-base md:text-lg font-light text-on-surface/80 max-w-lg mb-12 whitespace-pre-line">
                {RESUME_DATA.bio}
              </p>

              <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                <a href="#work" className="monolith-btn-primary">Explore Work</a>
              </div>
            </div>

            <div className="w-full md:w-2/5 aspect-[4/5] bg-surface-low relative group">
              <div className="absolute inset-0 glass opacity-40 group-hover:opacity-0 transition-opacity duration-700" />
              <img
                src="https://drive.google.com/thumbnail?id=1uE-lbuR7pEs4AYY6KVBTpOOUvoV3uG38&sz=w1000"
                alt="Ankush Singla"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="relative px-6 md:px-24 pt-32 mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-32">
            <span className="vertical-label sticky top-32">{RESUME_DATA.siteMetadata.sections[1].label}</span>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-outline-suggested pb-8">
              <h2 className="text-4xl md:text-6xl font-black">Selected Work Highlights</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 relative w-full items-center">
              {/* Sidebar Navigation - Acts as a Pager */}
              <div className="w-full lg:w-1/4 hidden lg:block border-l border-outline-suggested pl-8 relative z-30">
                <div className="space-y-6">
                  {RESUME_DATA.projects.map((proj, idx) => (
                    <div key={`timeline-${proj.title}`}>
                      <button 
                        onClick={() => {
                          setCurrentProjectIndex(idx);
                          setActiveYear(proj.year);
                        }} 
                        className="block group text-left"
                      >
                        <span data-year className={`text-[10px] font-bold tracking-[0.2em] block transition-colors ${currentProjectIndex === idx ? 'text-copper scale-105 origin-left' : 'text-on-surface/40 group-hover:text-copper'}`}>{proj.year}</span>
                        <span className={`text-sm font-bold transition-all ${currentProjectIndex === idx ? 'text-on-surface translate-x-2' : 'text-on-surface/20 group-hover:text-on-surface/60'}`}>{proj.title}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotating Carousel View */}
              <div className="w-full lg:w-3/4 h-[500px] md:h-[600px] lg:h-[700px] relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[120%] h-[1px] bg-outline-suggested/20" />
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence initial={false}>
                    {RESUME_DATA.projects.map((proj, idx) => {
                      const length = RESUME_DATA.projects.length;
                      let offset = idx - currentProjectIndex;
                      
                      // Infinite Loop Logic: Calculate circular offset
                      if (offset > length / 2) offset -= length;
                      if (offset < -length / 2) offset += length;
                      
                      // Only render immediate neighbors and their neighbors for smooth transitions
                      if (Math.abs(offset) > 2) return null;

                      return (
                        <motion.div
                          key={proj.title}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          dragListener={!selectedProject}
                          onDragStart={() => {
                            isDraggingRef.current = true;
                          }}
                          onDragEnd={(_, info) => {
                            const swipeThreshold = 50;
                            if (info.offset.x > swipeThreshold) {
                              prevProject();
                              setIsProjectAutoPlayPaused(true);
                            } else if (info.offset.x < -swipeThreshold) {
                              nextProject();
                              setIsProjectAutoPlayPaused(true);
                            }
                            // Small delay to ensure onTap doesn't catch the tail end of a drag
                            setTimeout(() => {
                              isDraggingRef.current = false;
                            }, 100);
                          }}
                          onTap={() => {
                            if (isDraggingRef.current || selectedProject) return;
                            
                            if (Math.abs(offset) > 0.1) {
                              setCurrentProjectIndex(idx);
                              setActiveYear(proj.year);
                            } else {
                              handleProjectSelect(proj);
                            }
                          }}
                          initial={{ opacity: 0, scale: 0.6, x: offset * 400 }}
                          animate={{ 
                            opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.3 : 0,
                            scale: offset === 0 ? 1.1 : 0.65,
                            x: offset * (window.innerWidth < 768 ? 280 : window.innerWidth < 1280 ? 340 : 420),
                            rotateY: offset * -20,
                            zIndex: 20 - Math.abs(offset),
                            filter: offset === 0 ? 'blur(0px)' : 'blur(6px)'
                          }}
                          transition={{ type: "spring", stiffness: 180, damping: 24 }}
                          onTap={() => {
                            if (Math.abs(offset) > 0.1) {
                              // If it's a neighbor, go to it
                              setCurrentProjectIndex(idx);
                              setActiveYear(proj.year);
                            } else {
                              // If it's the active one, open modal
                              handleProjectSelect(proj);
                            }
                          }}
                          className={`absolute w-full max-w-[90vw] md:max-w-2xl lg:max-w-3xl aspect-[16/9] bg-surface-low border border-outline-suggested shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group touch-pan-y`}
                        >
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className={`w-full h-full object-cover transition-all duration-1000 ${offset === 0 ? 'scale-150 brightness-[0.85]' : 'scale-100 brightness-[0.3]'}`}
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent flex flex-col justify-end transition-opacity duration-500 ${offset === 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="p-6 md:p-8 lg:p-12">
                              <span className="text-[9px] md:text-xs uppercase font-black tracking-[0.4em] text-copper mb-2 md:mb-4 block drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{proj.year} / {proj.category}</span>
                              <h3 className="text-xl md:text-3xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tighter leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">{proj.title}</h3>
                              <p className="text-xs md:text-base lg:text-lg text-white/80 max-w-2xl line-clamp-2 font-medium leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{proj.description}</p>
                            </div>
                          </div>
                          
                          {offset === 0 && (
                            <div className="absolute top-8 right-8">
                              <div className="bg-copper text-charcoal px-6 py-3 rounded-full shadow-[0_10px_20px_-5px_rgba(184,115,51,0.5)] flex items-center gap-3 group-hover:scale-105 transition-all duration-300 border border-white/20">
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Dive Deeper</span>
                                <ArrowRight size={18} />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Carousel Controls */}
                <div className="absolute -bottom-24 md:-bottom-16 w-full max-w-[90vw] md:max-w-2xl lg:max-w-3xl flex flex-col md:flex-row justify-center items-center gap-6 z-30">
                  <div className="flex gap-4 md:gap-8 items-center">
                    <button 
                      onClick={prevProject}
                      className="p-3 md:p-4 rounded-full border border-outline-suggested hover:bg-copper hover:text-charcoal transition-all group"
                    >
                      <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex gap-2 mx-2 md:mx-4">
                      {RESUME_DATA.projects.map((_, i) => (
                        <div 
                          key={`dot-${i}`}
                          className={`h-1 transition-all duration-500 ${currentProjectIndex === i ? 'w-6 md:w-8 bg-copper' : 'w-1.5 md:w-2 bg-on-surface/20'}`}
                        />
                      ))}
                    </div>

                    <button 
                      onClick={nextProject}
                      className="p-3 md:p-4 rounded-full border border-outline-suggested hover:bg-copper hover:text-charcoal transition-all group"
                    >
                      <ChevronRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Pause button integrated into the group on mobile, absolute on desktop */}
                  <div className="md:absolute md:right-0">
                    <button 
                      onClick={() => setIsProjectAutoPlayPaused(!isProjectAutoPlayPaused)}
                      className={`p-3 md:p-4 rounded-full border transition-all ${isProjectAutoPlayPaused ? 'bg-copper text-charcoal border-copper shadow-lg scale-105' : 'border-outline-suggested hover:bg-copper/10 text-on-surface'}`}
                      title={isProjectAutoPlayPaused ? "Resume Auto-play" : "Pause Auto-play"}
                    >
                      {isProjectAutoPlayPaused ? <Play size={20} className="md:w-6 md:h-6" /> : <Pause size={20} className="md:w-6 md:h-6" fill="currentColor" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Background / Resume Section */}
        <section id="background" className="relative bg-surface-lowest px-6 md:px-24 pt-32 pb-[600px] mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-32">
            <span className="vertical-label sticky top-32">{RESUME_DATA.siteMetadata.sections[2].label}</span>
          </div>

          <div className="max-w-6xl mx-auto mb-32 hidden md:block sticky top-20 z-50 bg-surface-lowest pt-12 pb-8 -mx-4 px-4 border-b border-outline-suggested/30 transition-all duration-300 sticky-shield">
            <div className="flex justify-between items-center mb-16 border-b border-outline-suggested pb-4">
              <h2 className="text-4xl md:text-6xl font-black">Career Overview</h2>
              <div className="flex gap-4">
                <button onClick={() => scrollTimeline('left')} className="p-2 border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors" title="Scroll Left">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => scrollTimeline('right')} className="p-2 border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors" title="Scroll Right">
                  <ChevronRight size={16} />
                </button>
                <a 
                  href="#testimonials" 
                  className="p-2 border border-copper text-copper hover:bg-copper hover:text-charcoal transition-colors flex items-center gap-2 px-4"
                  title="Next Section"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">Next Section</span>
                  <ArrowRight size={14} className="rotate-90" />
                </a>
              </div>
            </div>
            <div ref={timelineRef} className="relative w-full overflow-x-auto no-scrollbar scroll-smooth flex pb-8 pt-12">
              <div className="flex items-start min-w-max px-4 relative gap-16">
                <div className="h-[2px] w-full bg-outline-suggested/60 absolute top-[68px] -z-10 left-0 right-0"></div>
                {timelineGroups.map((group, gIdx) => (
                  <div key={`tl-g-${gIdx}`} className="flex flex-col relative pt-8">
                    {/* Spanning Indicator */}
                    <div className="absolute top-0 left-0 right-4 h-[3px] bg-copper/60"></div>
                    <div className="absolute top-0 left-0 w-[3px] h-3 bg-copper/60"></div>
                    <div className="absolute top-0 right-4 w-[3px] h-3 bg-copper/60"></div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/80 absolute -top-10 left-0 max-w-[150px] leading-relaxed">{group.group}</span>

                    <div className="flex gap-4 mt-2">
                      {group.experiences.filter((exp, index, self) => index === self.findIndex((t) => t.company === exp.company)).map((exp, idx) => (
                        <a href={`#exp-${exp.company.replace(/\s+/g, '-')}-${exp.period.replace(/\s+/g, '')}`} data-company={exp.company} key={`tl-n-${idx}-${exp.company}`} className={`flex flex-col items-center relative group w-32 px-2 cursor-pointer transition-opacity duration-300 ${activeCompany === exp.company ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                          <div className={`w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative ${activeCompany === exp.company ? 'border-copper bg-surface shadow-[0_0_20px_rgba(235,94,40,0.3)]' : 'border-outline-suggested/40 bg-surface-lowest group-hover:border-copper/40'}`}>
                            <div className={`w-3 h-3 rounded-full bg-on-surface/20 transition-all ${activeCompany === exp.company ? 'bg-copper' : ''}`}></div>
                            {activeCompany === exp.company && (
                              <motion.div 
                                layoutId="activeIndicator"
                                className="absolute inset-0 border-2 border-copper rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </div>
                          <span className={`text-[10px] font-bold tracking-widest mt-4 ${activeCompany === exp.company ? 'text-copper' : 'text-teal'}`}>{getDisplayPeriod(group.experiences, exp.company)}</span>
                          <span className={`text-[10px] font-semibold text-center mt-2 transition-colors line-clamp-2 uppercase tracking-wider ${activeCompany === exp.company ? 'text-on-surface' : 'group-hover:text-copper'}`}>{exp.company}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="w-full md:w-1/3 md:sticky md:top-[550px]">
              {/* Mobile Section Header */}
              <div className="md:hidden mb-12">
                <h2 className="text-4xl font-black mb-4">Career Overview</h2>
                <div className="w-12 h-1 bg-copper"></div>
              </div>

              <div id="left-sidebar-nav" className="max-h-[calc(100vh-16rem)] overflow-y-auto no-scrollbar pb-16">
                <div className="relative pl-6 md:pl-0">
                  {/* Decorative Vertical Line for Mobile */}
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-outline-suggested md:hidden"></div>
                  <div className="absolute left-0 top-0 w-[1px] h-8 bg-copper md:hidden"></div>
                  
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-copper mb-4">Career Journey</h3>
                  <p className="text-base md:text-sm text-on-surface/70 max-w-lg md:max-w-xs mb-12 leading-relaxed font-serif italic">
                    {RESUME_DATA.siteMetadata.sections.find(s => s.id === 'background')?.description}
                  </p>
                </div>

                <div className="hidden md:block space-y-8 border-l border-outline-suggested pl-8 mb-16">
                  {groupedExperiences.map(group => (
                    <div key={`nav-group-${group.group}`} className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40">{group.group}</span>
                      {group.experiences.filter((exp, index, self) => index === self.findIndex((t) => t.company === exp.company)).map(exp => (
                        <div key={`exp-nav-${exp.company}`} data-nav-company={exp.company}>
                          <button
                            onClick={() => {
                              const el = document.getElementById(`exp-${exp.company.replace(/\s+/g, '-')}-${exp.period.replace(/\s+/g, '')}`);
                              if (el) {
                                const y = el.getBoundingClientRect().top + window.scrollY - 550;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }}
                            className="block group text-left w-full"
                          >
                            <span className={`text-sm font-bold tracking-[0.15em] block transition-colors ${activeCompany === exp.company ? 'text-copper scale-105 origin-left' : 'text-teal group-hover:text-copper'}`}>{exp.company}</span>
                            <span className={`text-xs font-semibold transition-opacity ${activeCompany === exp.company ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{getDisplayPeriod(group.experiences, exp.company)}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                  {educationExperiences.length > 0 && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40">Education</span>
                      {educationExperiences.map(exp => (
                        <div key={`exp-nav-${exp.company}`} data-nav-company={exp.company}>
                          <button
                            onClick={() => {
                              const el = document.getElementById(`exp-${exp.company.replace(/\s+/g, '-')}`);
                              if (el) {
                                const y = el.getBoundingClientRect().top + window.scrollY - 550;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }}
                            className="block group text-left w-full"
                          >
                            <span className={`text-sm font-bold tracking-[0.15em] block transition-colors ${activeCompany === exp.company ? 'text-copper scale-105 origin-left' : 'text-teal group-hover:text-copper'}`}>{exp.company}</span>
                            <span className={`text-xs font-semibold transition-opacity ${activeCompany === exp.company ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{exp.period}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block space-y-8 bg-surface p-6 border border-outline-suggested">
                <span className="text-xs uppercase font-bold tracking-widest text-teal block mb-4 border-b border-outline-suggested pb-2">Board & Advisory Roles</span>
                {RESUME_DATA.otherRoles.map(role => (
                  <div key={role.org} className="space-y-1">
                    <a href={role.link} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface">{role.org}</p>
                    </a>
                    <p className="text-[10px] text-copper font-bold uppercase tracking-widest">{role.role}</p>
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-widest">{role.period}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-2/3 space-y-32">
              {groupedExperiences.map(group => (
                <div key={`detail-group-${group.group}`} className="space-y-32">
                  <div className="border-b border-outline-suggested pb-4 mb-16 scroll-mt-[550px]">
                    <h3 className="text-2xl font-black text-copper/80 tracking-widest uppercase">{group.group}</h3>
                  </div>
                  {group.experiences.map((exp, expIdx) => {
                    const isRepeatCompany = expIdx > 0 && group.experiences[expIdx - 1].company === exp.company;

                    return (
                      <motion.div
                        key={`${exp.company}-${exp.period}`}
                        id={`exp-${exp.company.replace(/\s+/g, '-')}-${exp.period.replace(/\s+/g, '')}`}
                        onViewportEnter={() => setActiveCompany(exp.company)}
                        viewport={{ once: false, amount: 0.1, margin: "-50% 0px -30% 0px" }}
                        className={`relative scroll-mt-[550px] ${isRepeatCompany ? '-mt-24' : ''}`}
                      >
                        {!isRepeatCompany && (
                          <h3 className="text-3xl font-bold mb-2">
                            {RESUME_DATA.projects.find(p => p.title === exp.company) ? (
                              <button onClick={() => handleProjectSelect(RESUME_DATA.projects.find(p => p.title === exp.company)!)} className="hover:text-copper text-left flex items-center gap-4 transition-colors group/modalbtn">
                                {exp.company}
                                <span className="text-xs uppercase font-bold tracking-widest text-charcoal bg-copper px-3 py-1 rounded-sm flex items-center gap-2 shadow-sm opacity-0 group-hover/modalbtn:opacity-100 transition-opacity">View Deep Dive <ArrowRight size={12} /></span>
                              </button>
                            ) : exp.link ? (
                              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors underline decoration-outline-suggested underline-offset-4 hover:decoration-copper">
                                {exp.company}
                              </a>
                            ) : (
                              exp.company
                            )}
                          </h3>
                        )}
                        <span className="text-xs font-bold tracking-[0.3em] text-teal block mb-4">{exp.period}</span>
                        <p className={`uppercase text-xs font-bold tracking-widest mb-6 ${exp.isEducation ? 'text-teal/80' : 'text-copper'}`}>{exp.role}</p>
                        {exp.motivation && (
                          <div className="border-l-2 border-copper/40 pl-4 mb-6">
                            <p className="text-sm italic text-on-surface/70 leading-[1.7] font-serif">{exp.motivation}</p>
                          </div>
                        )}
                        <p className="text-lg text-on-surface/90 leading-[1.8] max-w-2xl font-light">{exp.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              ))}

              {educationExperiences.length > 0 && (
                <div className="space-y-32">
                  <div className="border-b border-outline-suggested pb-4 mb-16 scroll-mt-[550px]">
                    <h3 className="text-2xl font-black text-copper/80 tracking-widest uppercase">Education</h3>
                  </div>
                  {educationExperiences.map((exp) => (
                    <motion.div
                      key={exp.company}
                      id={`exp-${exp.company.replace(/\s+/g, '-')}`}
                      onViewportEnter={() => setActiveCompany(exp.company)}
                      viewport={{ once: false, amount: 0.1, margin: "-50% 0px -30% 0px" }}
                      className="relative scroll-mt-[550px]"
                    >
                      <h3 className="text-3xl font-bold mb-2">
                        {RESUME_DATA.projects.find(p => p.title === exp.company) ? (
                          <button onClick={() => handleProjectSelect(RESUME_DATA.projects.find(p => p.title === exp.company)!)} className="hover:text-copper text-left flex items-center gap-4 transition-colors group/modalbtn">
                            {exp.company}
                            <span className="text-xs uppercase font-bold tracking-widest text-charcoal bg-copper px-3 py-1 rounded-sm flex items-center gap-2 shadow-sm opacity-0 group-hover/modalbtn:opacity-100 transition-opacity">View Deep Dive <ArrowRight size={12} /></span>
                          </button>
                        ) : exp.link ? (
                          <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors underline decoration-outline-suggested underline-offset-4 hover:decoration-copper">
                            {exp.company}
                          </a>
                        ) : (
                          exp.company
                        )}
                      </h3>
                      <span className="text-xs font-bold tracking-[0.3em] text-teal block mb-4">{exp.period}</span>
                      <p className={`uppercase text-xs font-bold tracking-widest mb-6 ${exp.isEducation ? 'text-teal/80' : 'text-copper'}`}>{exp.role}</p>
                      {exp.motivation && (
                        <div className="border-l-2 border-copper/40 pl-4 mb-6">
                          <p className="text-sm italic text-on-surface/70 leading-[1.7] font-serif">{exp.motivation}</p>
                        </div>
                      )}
                      <p className="text-lg text-on-surface/90 leading-[1.8] max-w-2xl font-light">{exp.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            {/* Board & Advisory Roles for Mobile */}
            <div className="md:hidden space-y-8 bg-surface p-6 border border-outline-suggested mt-32">
              <span className="text-xs uppercase font-bold tracking-widest text-teal block mb-4 border-b border-outline-suggested pb-2">Board & Advisory Roles</span>
              {RESUME_DATA.otherRoles.map(role => (
                <div key={role.org} className="space-y-1">
                  <a href={role.link} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface">{role.org}</p>
                  </a>
                  <p className="text-[10px] text-copper font-bold uppercase tracking-widest">{role.role}</p>
                  <p className="text-[10px] text-on-surface/40 uppercase tracking-widest">{role.period}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative px-6 md:px-24 pb-32 pt-32 mb-64 scroll-mt-32 min-h-[70vh] flex flex-col justify-center">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-32">
            <span className="vertical-label sticky top-32">{RESUME_DATA.siteMetadata.sections[3].label}</span>
          </div>

          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-left">Peer Perspectives</h2>
              <div className="flex gap-4">
                <button onClick={prevTestimonial} className="p-4 bg-surface-low border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextTestimonial} className="p-4 bg-surface-low border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[300px] w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className="bg-surface-low border border-outline-suggested group p-8 md:p-12 flex flex-col justify-center h-full hover:bg-surface-high transition-colors w-full">
                    <p className="text-lg md:text-2xl font-light italic text-on-surface/80 leading-relaxed mb-12 max-w-4xl">"{RESUME_DATA.testimonials[testimonialIndex].quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-copper"></div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-copper">{RESUME_DATA.testimonials[testimonialIndex].author}</h4>
                        <p className="text-xs text-on-surface/40 tracking-widest mt-1 uppercase">{RESUME_DATA.testimonials[testimonialIndex].context}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Dots */}
            <div className="flex gap-3 mt-8">
              {RESUME_DATA.testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-2 transition-all duration-300 ${idx === testimonialIndex ? 'w-8 bg-copper' : 'w-2 bg-outline-suggested hover:bg-surface-high'}`}
                />
              ))}
            </div>
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="relative px-6 md:px-24 pt-32 mb-32 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-32">
            <span className="vertical-label sticky top-32">{RESUME_DATA.siteMetadata.sections[4].label}</span>
          </div>
          <div className="max-w-6xl mx-auto">

            {/* How I Engage */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-outline-suggested pb-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black">Want to get in touch?</h2>
                  <p className="text-on-surface/50 mt-6 text-base md:text-lg max-w-xl leading-relaxed">I'm always open to conversations where I can create value. If any of these resonate, please feel free to reach out.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-suggested border border-outline-suggested">
                {RESUME_DATA.contact.engagements.map((eng, i) => (
                  <motion.a
                    key={eng.label}
                    href={RESUME_DATA.contact.contactForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group bg-surface p-8 flex flex-col gap-3 hover:bg-surface-low transition-colors cursor-pointer"
                  >
                    <span className="text-xs uppercase font-bold tracking-widest text-copper group-hover:text-teal transition-colors">{eng.label}</span>
                    <p className="text-on-surface/60 text-sm leading-relaxed">{eng.description}</p>
                    <span className="mt-auto text-[10px] uppercase tracking-widest text-on-surface/20 group-hover:text-copper transition-colors flex items-center gap-1">Get in touch <ArrowRight size={10} /></span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CTA Bar */}
            <div className="glass p-8 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.3em] text-teal mb-2">Let's connect</p>
                <h3 className="text-3xl md:text-4xl font-black leading-tight">Ready when you are.</h3>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-start w-full md:w-auto">
                <a href={RESUME_DATA.contact.contactForm} onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="monolith-btn-primary w-full md:w-auto">Get in Touch</a>
                <a href={RESUME_DATA.contact.linkedin} onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-6 py-4 border border-outline-suggested text-on-surface font-bold uppercase tracking-widest text-sm hover:bg-copper hover:text-charcoal hover:border-copper transition-colors w-full md:w-auto">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <a href="https://www.instagram.com/ankkkkkkk" onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors"><Camera size={22} /></a>
                  {RESUME_DATA.contact.github && (
                    <a href={RESUME_DATA.contact.github} onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors"><Github size={22} /></a>
                  )}
                </div>
              </div>
            </div>

            {/* Footer line */}
            <div className="flex justify-end pt-6 pb-32 md:pb-0">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">{RESUME_DATA.siteMetadata.footer.copyright}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal block mt-1">{RESUME_DATA.siteMetadata.footer.vibe}</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Theme Chat Bot */}
      <ThemeBot 
        currentTheme={theme} 
        onThemeChange={(t) => {
          setPrevTheme(theme);
          setTheme(t);
        }} 
        onInteract={() => unlock('ai-prodigy')}
        unlockedIds={unlockedIds}
      />

      {/* Deep Dive Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/60 backdrop-blur-3xl p-6 md:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-outline-suggested w-full max-w-5xl h-[90vh] md:h-[80vh] overflow-y-auto flex flex-col relative"
            >
              {/* Modal Navigation Buttons */}
              <div className="hidden lg:block">
                <button
                  onClick={prevProjectInModal}
                  className="fixed left-12 top-1/2 -translate-y-1/2 p-4 bg-charcoal/80 backdrop-blur-md text-copper hover:bg-copper hover:text-charcoal transition-all rounded-full shadow-2xl border border-copper/20 active:scale-95 group"
                >
                  <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={nextProjectInModal}
                  className="fixed right-12 top-1/2 -translate-y-1/2 p-4 bg-charcoal/80 backdrop-blur-md text-copper hover:bg-copper hover:text-charcoal transition-all rounded-full shadow-2xl border border-copper/20 active:scale-95 group"
                >
                  <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Mobile Navigation Buttons */}
              <div className="flex lg:hidden absolute bottom-6 right-6 gap-3 z-50">
                <button
                  onClick={prevProjectInModal}
                  className="p-3 bg-charcoal text-copper rounded-full border border-copper/20"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextProjectInModal}
                  className="p-3 bg-charcoal text-copper rounded-full border border-copper/20"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-charcoal text-copper hover:bg-copper hover:text-charcoal transition-colors z-10 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="w-full h-64 md:h-96 shrink-0 relative">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              </div>

              <div className="p-8 md:p-16 -mt-32 relative z-10">
                <span className="text-xs uppercase font-bold tracking-widest text-teal mb-4 block bg-surface/80 w-max px-3 py-1 backdrop-blur-md">{selectedProject.category}</span>
                <h2 className="text-4xl md:text-6xl font-black mb-6">{selectedProject.title}</h2>
                <div className="w-12 h-1 bg-copper mb-8"></div>
                <div className="prose prose-invert max-w-3xl">
                  <p className="text-xl md:text-2xl font-light text-on-surface/95 leading-[1.6] mb-8">{selectedProject.description}</p>

                  <p className="text-lg text-on-surface/90 leading-[1.8] font-serif whitespace-pre-line mb-8 mt-8">
                    {selectedProject.deepDive || "Deep dive content coming soon."}
                  </p>

                  {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                    <div className="mt-12 space-y-12">
                      {selectedProject.screenshots.map((shot: any, idx: number) => (
                        <div key={idx} className="space-y-4">
                          <div className="border border-outline-suggested p-2 bg-surface-lowest">
                            <img src={shot.url} alt={shot.caption} className="w-full h-auto" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-xs uppercase tracking-widest text-teal font-bold">{shot.caption}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedProject.articleLink && (
                    <div className="mt-12">
                      <a href={selectedProject.articleLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-charcoal font-bold uppercase tracking-widest text-sm hover:bg-copper-deep transition-colors">
                        {selectedProject.articleCtaText || "Read Full Article"} <ArrowRight size={16} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Gamification Toast */}
    <AchievementToast achievement={latestAchievement} onClose={clearLatest} />

    {/* Gamification Modal */}
    <AchievementsModal
      isOpen={isAchievementsModalOpen}
      onClose={() => setIsAchievementsModalOpen(false)}
      unlockedIds={unlockedIds}
      currentTheme={theme}
      enabled={enabled}
      onToggleEnabled={setEnabled}
      onUnlockMatrix={() => {
        const next = theme === 'matrix' ? prevTheme : 'matrix';
        setPrevTheme(theme);
        setTheme(next);
      }}
      onReplayConfetti={fireConfetti}
    />
    </>
  );
}
