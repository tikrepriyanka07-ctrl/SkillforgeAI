import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  User,
  ArrowRight,
  HelpCircle,
  Clock,
  Briefcase,
  FolderGit2,
  Cpu,
  Trash2,
} from 'lucide-react';
import { StudentProfile, ReadinessAnalysis, ChatMessage, ActiveTab } from '../types';
import { askCareerMentor } from '../services/aiMentorEngine';

interface AIMentorViewProps {
  profile: StudentProfile;
  analysis: ReadinessAnalysis;
  setActiveTab: (tab: ActiveTab) => void;
}

const DEFAULT_PROMPTS = [
  'What should I learn next?',
  'Am I ready for an internship?',
  'What projects should I build?',
  'I only have 1 hour per day. Make me a plan.',
  'How can I improve my profile?',
];

export const AIMentorView: React.FC<AIMentorViewProps> = ({
  profile,
  analysis,
  setActiveTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: `Hello **${profile.name}**! 👋 I am your dedicated **AI Career Mentor** for **${profile.targetCareer}**.

I have reviewed your current profile:
- **Current Readiness Score:** ${analysis.careerReadiness}%
- **Primary Skill Gap to Close:** ${analysis.topRecommendation.skill}
- **Verified Strengths:** ${analysis.strengths.slice(0, 3).map((s) => s.skill).join(', ') || 'Foundations'}

Ask me anything about study roadmaps, portfolio projects, internship readiness, or interview prep. What would you like to tackle today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [engineSource, setEngineSource] = useState<'gemini-3.8-flash' | 'local_engine'>('local_engine');
  const [followUps, setFollowUps] = useState<string[]>(DEFAULT_PROMPTS);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askCareerMentor(trimmed, profile, analysis.skillGaps, messages);
      setEngineSource(res.source);
      setFollowUps(res.suggestedFollowUps);

      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `mentor-err-${Date.now()}`,
        sender: 'mentor',
        text: `I encountered a momentary issue querying the neural model. However, based on your profile for **${profile.targetCareer}**, your immediate priority remains mastering **${analysis.topRecommendation.skill}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'mentor',
        text: `Chat reset. I am ready to advise you on your **${profile.targetCareer}** journey!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Render markdown text simply and cleanly with bold, lists, and tables
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={lIdx} className="text-sm font-bold text-white mt-3 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Header 4
      if (line.startsWith('#### ')) {
        return (
          <h4 key={lIdx} className="text-xs font-bold text-cyan-300 mt-2 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Unordered list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
          </div>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1 text-xs text-slate-300">
            <span className="font-mono text-cyan-400 font-bold shrink-0">{line.match(/^\d+\./)?.[0]}</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s/, '')) }} />
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }
      // Standard paragraph
      return (
        <p
          key={lIdx}
          className="text-xs text-slate-300 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    });
  };

  // Helper for bold and code backticks
  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">$1</code>');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Your AI Career Mentor</h1>
              {/* Engine Status Badge */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1 border ${
                  engineSource === 'gemini-3.8-flash'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}
              >
                <Cpu className="w-3 h-3" />
                {engineSource === 'gemini-3.8-flash' ? 'Gemini 2.5 Flash' : 'Skill Intelligence Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Career: <span className="text-slate-200 font-semibold">{profile.targetCareer}</span> | Readiness:{' '}
              <span className="text-cyan-300 font-mono font-bold">{analysis.careerReadiness}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-slate-400 hover:text-white text-xs transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Go to Roadmap
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col h-[620px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMentor = msg.sender === 'mentor';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMentor ? 'justify-start' : 'justify-end'}`}
              >
                {isMentor && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-4 text-xs ${
                    isMentor
                      ? 'bg-slate-900/60 border border-slate-700/50 text-slate-200 shadow-sm'
                      : 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 opacity-80">
                    <span className="font-semibold">{isMentor ? 'AI Career Mentor' : profile.name}</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                </div>

                {!isMentor && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Mentor is synthesizing personalized career advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Follow-up Chips */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-t border-slate-700/50 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Suggested:</span>
          {followUps.map((prompt, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-700/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={`Ask your AI mentor anything (e.g. "What projects should I build for ${profile.targetCareer}?")`}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-slate-900" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
