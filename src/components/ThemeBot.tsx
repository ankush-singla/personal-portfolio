import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { ThemeType } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ThemeBotProps {
  onThemeChange: (theme: ThemeType) => void;
}

export default function ThemeBot({ onThemeChange }: ThemeBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Questions about my product experience? Ask away—or tell me if you'd like to switch up the site's visual theme." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= 15) {
      setMessages(prev => [...prev, { role: 'model', text: "We've reached the maximum number of messages for this session! If you'd like to chat more, please reach out via the contact form." }]);
      setInput('');
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'model', text: data.error || "I'm having a technical glitch. Please try again later." }]);
        setIsLoading(false);
        return;
      }
      
      const response = data.text;
      
      // Check for theme triggers
      const themeMatch = response.match(/\[THEME_CHANGE: (.*?)\]/);
      if (themeMatch) {
        const requestedTheme = themeMatch[1].toLowerCase().trim() as ThemeType;
        const cleanResponse = response.replace(/\[THEME_CHANGE: .*?\]/, '').trim();
        setMessages(prev => [...prev, { role: 'model', text: cleanResponse || `Switching to ${requestedTheme} mode.` }]);
        onThemeChange(requestedTheme);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Network error. Please try again later." }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 glass overflow-hidden flex flex-col shadow-2xl border border-outline-suggested"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="p-4 bg-surface-high flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-copper" />
                <span className="font-serif text-sm uppercase tracking-widest font-bold">Ankush AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-on-surface/60 hover:text-on-surface transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-copper text-charcoal' 
                      : 'bg-surface-low text-on-surface'
                  }`}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-low p-3 space-x-1 flex items-center">
                    <div className="w-1.5 h-1.5 bg-copper/60 animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-copper/60 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-copper/60 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-high">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me something..."
                  className="flex-1 bg-surface-lowest p-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-copper"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-copper text-charcoal p-2 hover:bg-copper-deep transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[56px] py-3 px-6 bg-charcoal border-none text-copper flex items-center justify-center shadow-xl hover:bg-surface-high transition-colors rounded-full font-sans gap-3 cursor-pointer"
      >
        {isOpen ? <X size={20} className="shrink-0" /> : <MessageSquare size={20} className="shrink-0" />}
        {!isOpen && (
          <span className="text-xs font-bold uppercase tracking-widest hidden md:block text-copper text-left leading-relaxed">
            Questions? Want to change the style of this site?<br />
            Ask my resume & style AI!
          </span>
        )}
      </motion.button>
    </div>
  );
}
