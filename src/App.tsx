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
import { Camera, Gamepad2, Users, Briefcase, Mail, Github, Linkedin, Twitter, ArrowRight, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { applyThemeToRoot } from './utils/theme';

export default function App() {
  const [theme, setTheme] = useState<string>('monolith');
  const [prevTheme, setPrevTheme] = useState<string>('monolith');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeYear, setActiveYear] = useState<string>(RESUME_DATA.projects[0].year);
  const [activeCompany, setActiveCompany] = useState<string>(RESUME_DATA.experience[0].company);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasFiredConfetti, setHasFiredConfetti] = useState(() => {
    return localStorage.getItem('has-fired-confetti') === 'true';
  });
  const timelineRef = React.useRef<HTMLDivElement>(null);

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
          const scrollLeft = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
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
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#b87333', '#76d6d5', '#ffffff'],
        zIndex: 999
      });
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

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % RESUME_DATA.testimonials.length);
    unlock('peer-reviewed');
  };
  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + RESUME_DATA.testimonials.length) % RESUME_DATA.testimonials.length);
    unlock('peer-reviewed');
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
  }, [theme]);

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

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Work', id: 'work' },
    { label: 'Career', id: 'background' },
    { label: 'Perspectives', id: 'testimonials' },
    { label: 'Contact', id: 'contact' }
  ];

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

  const timelineGroups = [...groupedExperiences].reverse().map(g => ({
    ...g,
    experiences: [...g.experiences].sort((a, b) => {
      const yearA = parseInt(a.period.match(/\d{4}/)?.[0] || "0");
      const yearB = parseInt(b.period.match(/\d{4}/)?.[0] || "0");
      return yearA - yearB;
    })
  }));

  return (
    <div className={`min-h-screen transition-colors duration-700 selection:bg-copper selection:text-charcoal text-on-surface bg-surface`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-surface/90 backdrop-blur-md border-b border-outline-suggested transition-all">
        <div className="flex justify-between items-center px-6 md:px-12 py-6">
          <a href="#" className="font-serif text-xl tracking-widest text-on-surface hover:text-copper transition-colors">ankushmsingla.com</a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            <div className="flex items-center gap-4 mr-4">
              <button onClick={() => setEnabled(!enabled)} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-copper/70 hover:text-copper transition-colors border border-copper/30 px-3 py-1 rounded-sm">
                Gamification: {enabled ? 'ON' : 'OFF'}
              </button>
              {enabled && (
                <div className="flex flex-col items-end gap-1.5 mt-1">
                  <button
                    onClick={() => setIsAchievementsModalOpen(true)}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal hover:text-teal/70 transition-colors"
                  >
                    {unlockedIds.length}/7 Achievements Unlocked
                  </button>
                  <div className="w-full h-1 bg-outline-suggested rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal transition-all duration-1000 ease-out" 
                      style={{ width: `${(unlockedIds.length / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={item.id === 'contact'
                  ? "bg-copper text-charcoal px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-copper-deep transition-all ml-4 shadow-[0_4px_20px_rgba(235,94,40,0.2)] active:scale-95"
                  : `text-[10px] uppercase tracking-[0.2em] transition-colors font-semibold relative ${activeSection === item.id ? 'text-copper' : 'text-on-surface hover:text-copper'}`
                }
              >
                {item.label}
                {activeSection === item.id && item.id !== 'contact' && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-copper rounded-full shadow-[0_0_8px_rgba(235,94,40,0.5)]"></span>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex items-center justify-center p-2 text-on-surface hover:text-copper transition-colors"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-drawer"
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-outline-suggested bg-surface/95 backdrop-blur-md"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navItems.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={item.id === 'contact'
                      ? "bg-copper text-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-black text-center shadow-[0_4px_20px_rgba(235,94,40,0.2)] active:scale-95"
                      : `text-sm uppercase tracking-[0.2em] font-semibold py-1 border-b border-outline-suggested/40 flex justify-between items-center transition-colors ${activeSection === item.id ? 'text-copper' : 'text-on-surface'}`
                    }
                  >
                    {item.label}
                    {item.id !== 'contact' && (
                      <ChevronRight size={14} className="text-on-surface/30" />
                    )}
                  </a>
                ))}
                {/* Gamification toggle in mobile menu */}
                <div className="pt-4 border-t border-outline-suggested/40 flex flex-col gap-3">
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className="flex items-center justify-between text-xs uppercase tracking-[0.2em] font-bold text-copper/70 hover:text-copper transition-colors border border-copper/30 px-4 py-2 rounded-sm w-full"
                  >
                    <span>Gamification</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-black ${enabled ? 'bg-copper/20 text-copper' : 'bg-outline-suggested/40 text-on-surface/40'}`}>
                      {enabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                  {enabled && (
                    <button
                      onClick={() => { setIsAchievementsModalOpen(true); setIsMobileMenuOpen(false); }}
                      className="text-[11px] uppercase tracking-[0.2em] font-bold text-teal hover:text-teal/70 transition-colors text-left"
                    >
                      {unlockedIds.length}/7 Achievements Unlocked
                      <div className="w-full h-1 bg-outline-suggested rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-teal transition-all duration-1000 ease-out"
                          style={{ width: `${(unlockedIds.length / 7) * 100}%` }}
                        />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-32 md:pt-48">
        {/* Section Wrapper with Vertical Gutter Label */}
        <section id="home" className="relative px-6 md:px-24 mb-32 md:mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start">
            <span className="vertical-label sticky top-32">01 / Home</span>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-12">
            <div className="w-full md:w-3/5 z-10">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-8"
              >
                Catalyst.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-copper-deep">
                  Strategist.
                </span><br />
                Operator.
              </motion.h1>
              <p className="text-base md:text-lg font-light text-on-surface/80 max-w-lg mb-12 whitespace-pre-line">
                {RESUME_DATA.bio}
              </p>

              <div className="flex flex-wrap gap-8">
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
        <section id="work" className="relative px-6 md:px-24 mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start">
            <span className="vertical-label sticky top-32">02 / Selected Work</span>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-outline-suggested pb-8">
              <h2 className="text-4xl md:text-6xl font-black">Selected Work Highlights</h2>
              <p className="text-xs uppercase tracking-[0.3em] opacity-40">2020 — Present</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 relative w-full">
              {/* Sticky Timeline */}
              <div className="w-full md:w-1/4 hidden md:block">
                <div className="sticky top-48 space-y-8 border-l border-outline-suggested pl-8">
                  {RESUME_DATA.projects.map(proj => (
                    <div key={`timeline-${proj.title}`}>
                      <button 
                        onClick={() => {
                          const el = document.getElementById(`proj-${proj.year}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }} 
                        className="block group text-left"
                      >
                        <span className={`text-xs font-bold tracking-[0.2em] block transition-colors ${activeYear === proj.year ? 'text-copper scale-105 origin-left' : 'text-teal group-hover:text-copper'}`}>{proj.year}</span>
                        <span className={`text-sm font-semibold transition-opacity ${activeYear === proj.year ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{proj.title}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="w-full md:w-3/4 space-y-32">
                {RESUME_DATA.projects.map((proj, i) => (
                  <motion.div
                    key={proj.title}
                    id={`proj-${proj.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveYear(proj.year)}
                    viewport={{ once: false, amount: 0.1, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={() => handleProjectSelect(proj)}
                    className="relative group cursor-pointer"
                  >
                    <div className="overflow-hidden mb-6 relative" style={{ aspectRatio: proj.aspectRatio }}>
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className={`w-full h-full transition-all duration-700 group-hover:scale-100 ${proj.title === 'Leading with AI' ? 'scale-[1.25]' : 'scale-110'} ${proj.title === 'COVID-19 Response Center' ? 'object-contain object-left bg-surface-lowest' : 'object-cover'}`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="font-semibold tracking-widest text-[10px] uppercase bg-charcoal text-copper px-4 py-2 shadow-xl border border-outline-suggested flex items-center gap-2">
                          View Deep Dive <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-teal mb-2 block">{proj.year} / {proj.category}</span>
                        <h3 className="text-3xl font-bold mb-2 group-hover:text-copper transition-colors">{proj.title}</h3>
                        <p className="text-on-surface/60 max-w-xl">{proj.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Background / Resume Section */}
        <section id="background" className="relative bg-surface-lowest px-6 md:px-24 py-32 mb-64 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start">
            <span className="vertical-label sticky top-32">03 / Career Overview</span>
          </div>

          <div className="max-w-6xl mx-auto mb-32 hidden md:block">
            <div className="flex justify-between items-center mb-12 border-b border-outline-suggested pb-4">
              <h2 className="text-4xl md:text-6xl font-black">Career Overview</h2>
              <div className="flex gap-4">
                <button onClick={() => scrollTimeline('left')} className="p-2 border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => scrollTimeline('right')} className="p-2 border border-outline-suggested hover:bg-copper hover:text-charcoal transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div ref={timelineRef} className="relative w-full overflow-x-auto no-scrollbar scroll-smooth flex pb-8 pt-8">
              <div className="flex items-start min-w-max px-4 relative gap-16">
                <div className="h-[1px] w-full bg-outline-suggested absolute top-[76px] -z-10 left-0 right-0"></div>
                {timelineGroups.map((group, gIdx) => (
                  <div key={`tl-g-${gIdx}`} className="flex flex-col relative pt-8">
                    {/* Spanning Indicator */}
                    <div className="absolute top-0 left-0 right-4 h-[2px] bg-copper/30"></div>
                    <div className="absolute top-0 left-0 w-[2px] h-2 bg-copper/30"></div>
                    <div className="absolute top-0 right-4 w-[2px] h-2 bg-copper/30"></div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40 absolute -top-6 left-0 whitespace-nowrap">{group.group}</span>

                    <div className="flex gap-4 mt-2">
                      {group.experiences.filter((exp, index, self) => index === self.findIndex((t) => t.company === exp.company)).map((exp, idx) => (
                        <a href={`#exp-${exp.company.replace(/\s+/g, '-')}-${exp.period.replace(/\s+/g, '')}`} data-company={exp.company} key={`tl-n-${idx}-${exp.company}`} className={`flex flex-col items-center relative group w-32 px-2 cursor-pointer transition-opacity duration-300 ${activeCompany === exp.company ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                          <div className={`w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center ${activeCompany === exp.company ? 'border-copper bg-surface' : 'border-outline-suggested bg-surface-lowest group-hover:border-copper'}`}>
                            <div className={`w-2 h-2 rounded-full bg-copper transition-opacity ${activeCompany === exp.company ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                          </div>
                          <span className={`text-[10px] font-bold tracking-widest mt-4 ${activeCompany === exp.company ? 'text-copper' : 'text-teal'}`}>{getDisplayPeriod(group.experiences, exp.company).match(/\d{4}/)?.[0] || exp.period}</span>
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
            <div className="w-full md:w-1/3 md:sticky md:top-48">
              <div id="left-sidebar-nav" className="max-h-[calc(100vh-16rem)] overflow-y-auto no-scrollbar pb-16">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-teal mb-4">Career Journey</h3>
                <p className="text-on-surface/50 max-w-xs mb-12 leading-relaxed">A timeline of leading teams, executing product strategy, and shipping architectures that define the front edge of AI.</p>

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
                                const y = el.getBoundingClientRect().top + window.scrollY - 120;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }}
                            className="block group text-left w-full"
                          >
                            <span className={`text-xs font-bold tracking-[0.2em] block transition-colors ${activeCompany === exp.company ? 'text-copper scale-105 origin-left' : 'text-teal group-hover:text-copper'}`}>{exp.company}</span>
                            <span className={`text-sm font-semibold transition-opacity ${activeCompany === exp.company ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{getDisplayPeriod(group.experiences, exp.company)}</span>
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
                                const y = el.getBoundingClientRect().top + window.scrollY - 120;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }}
                            className="block group text-left w-full"
                          >
                            <span className={`text-xs font-bold tracking-[0.2em] block transition-colors ${activeCompany === exp.company ? 'text-copper scale-105 origin-left' : 'text-teal group-hover:text-copper'}`}>{exp.company}</span>
                            <span className={`text-sm font-semibold transition-opacity ${activeCompany === exp.company ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{exp.period}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8 bg-surface p-6 border border-outline-suggested">
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
                  <div className="border-b border-outline-suggested pb-4 mb-16">
                    <h3 className="text-2xl font-black text-copper/80 tracking-widest uppercase">{group.group}</h3>
                  </div>
                  {group.experiences.map((exp, expIdx) => {
                    const isRepeatCompany = expIdx > 0 && group.experiences[expIdx - 1].company === exp.company;

                    return (
                      <motion.div
                        key={`${exp.company}-${exp.period}`}
                        id={`exp-${exp.company.replace(/\s+/g, '-')}-${exp.period.replace(/\s+/g, '')}`}
                        onViewportEnter={() => setActiveCompany(exp.company)}
                        viewport={{ once: false, amount: 0.1, margin: "-10% 0px -45% 0px" }}
                        className={`relative scroll-mt-32 ${isRepeatCompany ? '-mt-24' : ''}`}
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
                            <p className="text-sm italic text-on-surface/50 leading-relaxed font-serif">{exp.motivation}</p>
                          </div>
                        )}
                        <p className="text-lg text-on-surface/70 leading-relaxed max-w-2xl">{exp.description}</p>
                      </motion.div>
                    )
                  })}
                </div>
              ))}

              {educationExperiences.length > 0 && (
                <div className="space-y-32">
                  <div className="border-b border-outline-suggested pb-4 mb-16">
                    <h3 className="text-2xl font-black text-copper/80 tracking-widest uppercase">Education</h3>
                  </div>
                  {educationExperiences.map((exp) => (
                    <motion.div
                      key={exp.company}
                      id={`exp-${exp.company.replace(/\s+/g, '-')}`}
                      onViewportEnter={() => setActiveCompany(exp.company)}
                      viewport={{ once: false, amount: 0.1, margin: "-10% 0px -45% 0px" }}
                      className="relative scroll-mt-32"
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
                          <p className="text-sm italic text-on-surface/50 leading-relaxed font-serif">{exp.motivation}</p>
                        </div>
                      )}
                      <p className="text-lg text-on-surface/70 leading-relaxed max-w-2xl">{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative px-6 md:px-24 mb-64 overflow-hidden scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start">
            <span className="vertical-label sticky top-32">04 / Peer Perspectives</span>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-left">Peer Perspectives</h2>
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
        <section id="contact" className="relative px-6 md:px-24 mb-32 scroll-mt-32">
          <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start">
            <span className="vertical-label sticky top-32">05 / How I Engage</span>
          </div>
          <div className="max-w-6xl mx-auto">

            {/* How I Engage */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-outline-suggested pb-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black">How I Engage</h2>
                  <p className="text-on-surface/50 mt-3 text-sm max-w-md">I'm always open to conversations where I can create value. If any of these resonate, please feel free to reach out.</p>
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
            <div className="glass p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal mb-2">Let's connect</p>
                <h3 className="text-3xl md:text-4xl font-black">Ready when you are.</h3>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <a href={RESUME_DATA.contact.contactForm} target="_blank" rel="noopener noreferrer" className="monolith-btn-primary">Get in Touch</a>
                <a href={RESUME_DATA.contact.linkedin} onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-4 border border-outline-suggested text-on-surface font-bold uppercase tracking-widest text-sm hover:bg-copper hover:text-charcoal hover:border-copper transition-colors">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href="https://www.instagram.com/ankkkkkkk" onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors"><Camera size={20} /></a>
                {RESUME_DATA.contact.github && (
                  <a href={RESUME_DATA.contact.github} onClick={() => unlock('the-networker')} target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors"><Github size={20} /></a>
                )}
              </div>
            </div>

            {/* Footer line */}
            <div className="flex justify-end pt-6 pb-32 md:pb-0">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">© 2026 ankushmsingla.com.</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal block mt-1">vibe coded on a cold, spring, sunday afternoon in atlanta</p>
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
                  <p className="text-xl md:text-2xl font-light text-on-surface/80 leading-relaxed mb-8">{selectedProject.description}</p>

                  <p className="text-lg text-on-surface/70 leading-relaxed font-serif whitespace-pre-line mb-8 mt-8">
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

      {/* Gamification Toast */}
      <AchievementToast achievement={latestAchievement} onClose={clearLatest} />

      {/* Gamification Modal */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        unlockedIds={unlockedIds}
        currentTheme={theme}
        onUnlockMatrix={() => {
          const next = theme === 'matrix' ? prevTheme : 'matrix';
          setPrevTheme(theme);
          setTheme(next);
        }}
        onReplayConfetti={fireConfetti}
      />
    </div>
  );
}
