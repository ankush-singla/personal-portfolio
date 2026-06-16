import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Phone, Loader2, Mic, AudioLines } from 'lucide-react';
import Markdown from 'react-markdown';
import posthog from 'posthog-js';
import { ConversationProvider, useConversationControls, useConversationStatus } from '@elevenlabs/react';
import { ThemeType } from '../types';
import { useApp } from '../context/AppContext';

import { SmartNav } from './SmartNav';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Shown (in the agent's own voice) when a voice call ends unexpectedly — almost
// always the ElevenLabs quota running out mid-conversation. Note that the text
// chat is a separate model that didn't "hear" the voice call, so we set that
// expectation rather than pretending the conversation carried over.
const VOICE_DROP_NOTICE =
  "🎙️ My voice just cut out — looks like I've maxed out my voice-AI quota for now (free-tier portfolio life). Quick heads-up: this text chat is a *different* model, so it didn't catch what we were just saying out loud — sorry for the reset. Give me the short version and I'll pick right back up.";

interface ThemeBotProps {
  currentTheme?: string;
  onThemeChange: (theme: ThemeType) => void;
  onInteract?: () => void;
  onVoiceInteract?: () => void;
  unlockedIds?: string[];
}

export default function ThemeBot(props: ThemeBotProps) {
  return (
    <ConversationProvider>
      <ThemeBotInner {...props} />
    </ConversationProvider>
  );
}

function ThemeBotInner({ onThemeChange, onInteract, onVoiceInteract, unlockedIds = [] }: ThemeBotProps) {
  const { isMobileMenuOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Questions about my product experience? Ask away—or tell me if you'd like to switch up the site's visual theme." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const traceIdRef = useRef(crypto.randomUUID());
  const voiceConvoIdRef = useRef<string>('');
  const voiceConvoStartRef = useRef<number>(0);
  const lastUserMessageRef = useRef<string>('');
  const lastUserMessageTimeRef = useRef<number>(0);
  // True only when the human clicks "End Call"; lets us tell a deliberate
  // hang-up apart from the session dying on its own (quota/server error/drop).
  const voiceEndedByUserRef = useRef<boolean>(false);

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

  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();

  useEffect(() => {
    if (status === 'connected' && onVoiceInteract) {
      onVoiceInteract();
    }
  }, [status, onVoiceInteract]);

  // When the voice session ends on its own (quota exhausted, server error,
  // dropped connection) rather than by a deliberate hang-up, the agent stays in
  // character: it owns the failure and hands the user to the text chat, which
  // runs on a separate (Gemini) budget.
  const handleUnexpectedVoiceDrop = () => {
    setIsOpen(true);
    setMessages(prev =>
      prev[prev.length - 1]?.text === VOICE_DROP_NOTICE
        ? prev
        : [...prev, { role: 'model', text: VOICE_DROP_NOTICE }]
    );
  };

  const handleVoiceToggle = async () => {
    if (status === 'connected') {
      voiceEndedByUserRef.current = true;
      await endSession();
    } else if (status === 'disconnected') {
      try {
        let userId: string | undefined = undefined;
        try {
          userId = posthog.get_distinct_id();
        } catch (phErr) {
          console.warn("PostHog distinct ID not available:", phErr);
        }

        await startSession({
          agentId: 'agent_2901kv3gvjbcfe1vc9s6z00hkzfv',
          userId,
          onConnect: ({ conversationId }) => {
            voiceConvoIdRef.current = conversationId;
            voiceConvoStartRef.current = Date.now();
            voiceEndedByUserRef.current = false;
            lastUserMessageRef.current = '';
            lastUserMessageTimeRef.current = 0;
            posthog.capture('voice_chat_connected', {
              elevenlabs_conversation_id: conversationId,
              userId: userId
            });
          },
          onMessage: ({ role, message }) => {
            if (role === 'user') {
              lastUserMessageRef.current = message;
              lastUserMessageTimeRef.current = Date.now();
            } else if (role === 'agent') {
              const latencyMs = lastUserMessageTimeRef.current > 0
                ? Date.now() - lastUserMessageTimeRef.current
                : 0;

              posthog.capture('$ai_generation', {
                $ai_model: 'elevenlabs-convai-agent',
                $ai_provider: 'elevenlabs',
                $ai_input: [{ role: 'user', content: lastUserMessageRef.current || '(initial connection/greeting)' }],
                $ai_output_choices: [{ role: 'assistant', content: message }],
                $ai_latency: latencyMs / 1000,
                $ai_is_success: true,
                $ai_trace_id: voiceConvoIdRef.current,
                environment: import.meta.env?.MODE || 'production'
              });

              // Reset turn trackers
              lastUserMessageRef.current = '';
              lastUserMessageTimeRef.current = 0;
            }
          },
          onDisconnect: (details) => {
            const durationSec = voiceConvoStartRef.current > 0
              ? Math.round((Date.now() - voiceConvoStartRef.current) / 1000)
              : 0;
            const endedByUser = voiceEndedByUserRef.current;

            posthog.capture('voice_chat_disconnected', {
              elevenlabs_conversation_id: voiceConvoIdRef.current,
              reason: details.reason,
              duration_seconds: durationSec,
              ended_by_user: endedByUser
            });

            // The user didn't hang up, so the session died on us (most commonly
            // the ElevenLabs quota). Own it in-character and pivot to text.
            if (!endedByUser) {
              handleUnexpectedVoiceDrop();
            }

            voiceEndedByUserRef.current = false;
            voiceConvoIdRef.current = '';
            voiceConvoStartRef.current = 0;
            lastUserMessageRef.current = '';
            lastUserMessageTimeRef.current = 0;
          },
          onError: (message) => {
            posthog.capture('voice_chat_error', {
              elevenlabs_conversation_id: voiceConvoIdRef.current,
              error: message
            });
          }
        });
      } catch (err) {
        console.error('Failed to start ElevenLabs session:', err);
      }
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[90] flex flex-col items-end ${isMobileMenuOpen ? 'hidden' : ''}`}>
      <SmartNav isVisible={true} />
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
                      onClick={() => handleSend()}
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

          <div className="h-12 bg-surface-highest/90 backdrop-blur-md border border-copper/30 hover:border-copper/50 shadow-xl rounded-full flex items-center p-1 gap-1 transition-all">
            {/* ElevenLabs Voice AI Button */}
            <button
              onClick={handleVoiceToggle}
              className={`h-full px-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                status === 'connected'
                  ? 'bg-copper text-charcoal font-black'
                  : 'hover:bg-copper/10 text-on-surface/80 hover:text-copper'
              }`}
            >
              {status === 'connecting' ? (
                <>
                  <Loader2 size={14} className="animate-spin text-copper" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">Connecting...</span>
                </>
              ) : status === 'connected' ? (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-charcoal"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">End Call</span>
                </>
              ) : (
                <>
                  <AudioLines size={14} className="text-copper animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">Talk to my AI agent</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="w-[1px] h-4 bg-copper/20 shrink-0" />

            {/* Text Chatbot Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`h-full px-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer group ${
                isOpen
                  ? 'bg-copper text-charcoal font-black'
                  : 'hover:bg-copper/10 text-on-surface/80 hover:text-copper'
              }`}
            >
              {isOpen ? (
                <>
                  <X size={14} className="text-charcoal transition-transform group-hover:rotate-90 duration-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Close Chat</span>
                </>
              ) : (
                <>
                  <MessageSquare size={14} className="text-copper transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Text Chat</span>
                </>
              )}
            </button>
          </div>
        </div>
      );
}
