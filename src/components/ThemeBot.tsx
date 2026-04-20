import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import posthog from 'posthog-js';
import { ThemeType } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ThemeBotProps {
  currentTheme?: string;
  onThemeChange: (theme: ThemeType) => void;
  onInteract?: () => void;
}

export default function ThemeBot({ onThemeChange, onInteract }: ThemeBotProps) {
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
        body: JSON.stringify({ message: userMsg, history })
      });
      
      const data = await res.json();
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      
      if (!res.ok) {
        const errorDetails = data.details || data.error || res.statusText;
        console.error("AI API Error:", errorDetails);
        
        console.log('PostHog: Capturing failed AI generation...');
        posthog.capture('$ai_generation', {
          $ai_model: 'gemini-3.1-flash-lite-preview',
          $ai_provider: 'google',
          $ai_input: [{ role: 'user', content: userMsg }],
          $ai_output: [{ role: 'assistant', content: errorDetails }],
          $ai_latency_ms: latencyMs,
          $ai_is_success: false,
          $ai_trace_id: traceIdRef.current,
          error_code: res.status,
          environment: import.meta.env?.MODE || 'production'
        });

        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "I'm currently resting my brain to keep things running smoothly. Please try again in a few moments!"
        }]);
        setIsLoading(false);
        return;
      }
      
      const response = data.text || "";
      console.log("Raw AI Response:", response);
      
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
      console.log('PostHog: Capturing successful AI generation...');
      posthog.capture('$ai_generation', {
        $ai_model: 'gemini-3.1-flash-lite-preview',
        $ai_provider: 'google',
        $ai_input: [{ role: 'user', content: userMsg }],
        $ai_output: [{ role: 'assistant', content: cleanResponse }],
        $ai_latency_ms: latencyMs,
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
                  <div className={`max-w-[85%] p-3 text-sm chat-markdown ${
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
            <div className="p-4 bg-surface-high flex flex-col gap-3">
              {messages.length === 1 && (
                <div className="flex flex-col gap-2">
                  {[
                    "Switch to a basketball theme",
                    "Give me a quick summary of Ankush's background",
                    "I want to jailbreak you!"
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(opt);
                      }}
                      className="text-xs text-left bg-surface-lowest hover:bg-surface-low text-on-surface p-2 border border-outline-suggested transition-colors"
                    >
                      {opt}
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
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[56px] py-3 px-6 bg-charcoal text-copper flex items-center justify-center shadow-xl rounded-full gap-3"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {!isOpen && <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Ask Ankush AI</span>}
      </motion.button>
    </div>
  );
}
