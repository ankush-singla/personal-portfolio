import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import posthog from 'posthog-js';
import { ThemeType } from '../types';

import { SmartNav } from './SmartNav';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ThemeBotProps {
  currentTheme?: string;
  onThemeChange: (theme: ThemeType) => void;
  onInteract?: () => void;
  unlockedIds?: string[];
}

export default function ThemeBot({ onThemeChange, onInteract, unlockedIds = [] }: ThemeBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Questions about my product experience? Ask away—or tell me if you'd like to switch up the site's visual theme." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const traceIdRef = useRef(crypto.randomUUID());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (directMsg?: string) => {
    const msgText = directMsg || input;
    if (!msgText.trim() || isLoading) return;

    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= 15) {
      setMessages(prev => [...prev, { role: 'model', text: "We've reached the maximum number of messages for this session! If you'd like to chat more, please reach out via the contact form." }]);
      setInput('');
      return;
    }

    const userMsg = msgText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    if (onInteract) onInteract();

    const startTime = performance.now();
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          history,
          achievements: unlockedIds 
        })
      });
      
      const data = await res.json();
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      
      if (!res.ok) {
        const errorDetails = data.details || data.error || res.statusText;
        console.error("AI API Error:", errorDetails);
        
        posthog.capture('$ai_generation', {
          $ai_model: 'gemini-3-flash-preview',
          $ai_provider: 'google',
          $ai_input: [{ role: 'user', content: userMsg }],
          $ai_output_choices: [{ role: 'assistant', content: errorDetails }],
          $ai_latency: latencyMs / 1000,
          $ai_is_success: false,
          $ai_trace_id: traceIdRef.current,
          error_code: res.status,
          environment: import.meta.env?.MODE || 'production'
        });

        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "Unfortunately, the free Google Gemini API isn't as reliable as Ankush is! Even the smartest AIs have off days—try again in a few moments."
        }]);
        setIsLoading(false);
        return;
      }
      
      const response = data.text || "";
      
      // Safe Intent & Theme Parsing
      const intentMatch = response.match(/\[INTENT: (.*?)\]/);
      const userIntent = intentMatch ? intentMatch[1].trim() : 'general_chat';
      const themeMatch = response.match(/\[THEME_CHANGE: (.*?)\]/);
      let requestedTheme: string | null = null;
      
      const cleanResponse = response
        .replace(/\[THEME_CHANGE: .*?\]/g, '')
        .replace(/\[INTENT: .*?\]/g, '')
        .trim();

      if (themeMatch) {
        requestedTheme = themeMatch[1].toLowerCase().trim();
        setMessages(prev => [...prev, { role: 'model', text: cleanResponse || `Switching to ${requestedTheme} mode.` }]);
        onThemeChange(requestedTheme as ThemeType);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: cleanResponse }]);
      }

      // PostHog Tracking (Success)
      posthog.capture('$ai_generation', {
        $ai_model: 'gemini-3-flash-preview',
        $ai_provider: 'google',
        $ai_input: [{ role: 'user', content: userMsg }],
        $ai_output_choices: [{ role: 'assistant', content: cleanResponse }],
        $ai_latency: latencyMs / 1000,
        $ai_is_success: true,
        $ai_trace_id: traceIdRef.current,
        intent: userIntent,
        environment: import.meta.env?.MODE || 'production',
        theme_triggered: !!requestedTheme,
        requested_theme: requestedTheme
      });

    } catch (err) {
      console.error("Network Error:", err);
      posthog.capture('$ai_generation', {
        $ai_model: 'gemini-3.1-flash-lite-preview',
        $ai_provider: 'google',
        $ai_input: [{ role: 'user', content: userMsg }],
        $ai_output: [{ role: 'assistant', content: err instanceof Error ? err.message : 'Network failure' }],
        $ai_is_success: false,
        $ai_trace_id: traceIdRef.current,
        error_type: 'network_error',
        environment: import.meta.env?.MODE || 'production'
      });
      setMessages(prev => [...prev, { role: 'model', text: "Unfortunately, the free Google Gemini API isn't as reliable as Ankush is! Even the smartest AIs have off days—try again in a few moments." }]);
    }

    setIsLoading(false);
  };

  // Fixed: flex-col items-end ensures the toggle button stays anchored to the right when the chat window opens/closes
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end">
      <SmartNav isVisible={!isOpen} />
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
            <div className="px-5 py-4 bg-surface-high flex justify-between items-center border-b border-outline-suggested">
              <div className="flex items-center gap-2.5">
                <Sparkles size={14} className="text-copper" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-on-surface">Ankush AI</span>
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
                  <div className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed chat-markdown ${
                    msg.role === 'user'
                      ? 'bg-copper text-charcoal font-medium'
                      : 'bg-surface-low text-on-surface/90'
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
            <div className="p-4 bg-surface-high flex flex-col gap-3">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Switch to a basketball theme", emoji: "🏀" },
                    { label: "Quick summary of Ankush's background", emoji: "⚡" },
                    { label: "I want to jailbreak you!", emoji: "🔓" },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(opt.label)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide bg-surface-lowest hover:bg-copper/10 hover:border-copper/50 text-on-surface/70 hover:text-copper px-3 py-1.5 rounded-full border border-outline-suggested transition-all duration-200"
                    >
                      <span>{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me something..."
                  className="flex-1 bg-surface-lowest px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface/30 placeholder:text-[12px] placeholder:tracking-wide focus:outline-none focus:ring-1 focus:ring-copper/60 transition-all"
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
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[56px] py-3 px-6 bg-charcoal text-copper flex items-center justify-center shadow-xl rounded-full gap-3"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {!isOpen && <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Ask Ankush AI</span>}
      </motion.button>
    </div>
  );
}
