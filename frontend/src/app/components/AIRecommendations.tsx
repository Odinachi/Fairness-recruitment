import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Brain, Sparkles, Target, TrendingUp, Send, Bot, User,
  ChevronRight, Zap, ArrowUpRight, RefreshCw, Star,
  CheckCircle2, AlertCircle, BookOpen, MapPin, DollarSign,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

const aiResponses: Record<string, string> = {
  default: "Based on your profile analysis, I recommend focusing on roles that leverage your React and TypeScript expertise. Your 7 years of experience puts you in a strong position for Senior to Staff-level positions. Would you like me to break down specific opportunities?",
  salary: "Based on your skills and experience, the market rate for Senior Frontend Engineers in San Francisco is $160k–$220k. With your TypeScript and GraphQL expertise, you're positioned at the higher end of this range. I recommend targeting $185k+ in negotiations.",
  interview: "I've analyzed hundreds of Stripe interview transcripts. Their frontend interviews focus on: (1) System design at scale, (2) React performance optimization, (3) TypeScript generics and type system, (4) Cross-team collaboration scenarios. Want me to generate practice questions?",
  career: "Your career trajectory analysis shows two strong paths: (1) Staff Engineer track — 2-3 years, focus on system design and technical leadership, $220k-$310k. (2) Engineering Manager track — more people-focused, similar timeline. Given your GitHub activity and mentoring history, I lean toward the Staff track for you.",
  skills: "I detected 3 skill gaps vs. your target roles: (1) AWS Certification — adds 23 new eligible roles, (2) System Design — mentioned in 78% of Senior job descriptions, (3) Python basics — opens ML-adjacent opportunities. The highest ROI investment is the AWS Solutions Architect cert.",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay')) return aiResponses.salary
  if (lower.includes('interview') || lower.includes('prepare') || lower.includes('question')) return aiResponses.interview
  if (lower.includes('career') || lower.includes('path') || lower.includes('grow') || lower.includes('future')) return aiResponses.career
  if (lower.includes('skill') || lower.includes('learn') || lower.includes('gap')) return aiResponses.skills
  return aiResponses.default
}

const gapData = [
  { skill: 'AWS', current: 65, target: 85, color: '#f59e0b' },
  { skill: 'System Design', current: 70, target: 90, color: '#6366f1' },
  { skill: 'Python', current: 55, target: 75, color: '#a855f7' },
  { skill: 'GraphQL', current: 76, target: 85, color: '#22d3ee' },
  { skill: 'Docker', current: 72, target: 80, color: '#10b981' },
]

export function AIRecommendations() {
  const navigate = useNavigate()
  const { user, jobs } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your Jobnatics AI career assistant. I've analyzed your profile and identified 12 high-match opportunities. I can help you with job recommendations, interview prep, salary negotiation, and career planning. What would you like to explore?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault()
    const text = typeof e === 'string' ? e : input.trim()
    if (!text) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: getAIResponse(text),
      timestamp: new Date(),
    }
    setIsTyping(false)
    setMessages(prev => [...prev, aiMsg])
  }

  const quickPrompts = [
    'What are my top job matches?',
    'Help me prepare for Stripe interview',
    'What salary should I negotiate?',
    'Show my skill gaps',
  ]

  const topMatches = jobs.slice(0, 5).sort((a, b) => b.match - a.match)

  const radarData = [
    { subject: 'Skills', score: 94 },
    { subject: 'Experience', score: 87 },
    { subject: 'Education', score: 90 },
    { subject: 'Culture', score: 85 },
    { subject: 'Growth', score: 92 },
    { subject: 'Salary', score: 88 },
  ]

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700 }} className="mb-1">
            AI Recommendations
          </h1>
          <p className="text-sm text-muted-foreground">Powered by Jobnatics intelligence engine · Last analyzed 2 hours ago</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: AI Chat */}
          <div className="xl:col-span-2 space-y-6">
            {/* AI Chatbot */}
            <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden" style={{ height: '500px' }}>
              <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Jobnatics AI Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online · Analyzing your profile
                  </div>
                </div>
                <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:bg-muted transition-colors">
                  <RefreshCw size={12} /> New session
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'ai'
                        ? 'bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/30'
                        : 'bg-muted border border-border'
                    }`}>
                      {msg.role === 'ai' ? <Bot size={14} strokeWidth={1.75} className="text-white" /> : <User size={14} strokeWidth={1.75} className="text-muted-foreground" />}
                    </div>
                    <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-muted border border-border rounded-bl-md'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Bot size={14} strokeWidth={1.75} className="text-white animate-pulse" />
                    </div>
                    <div className="px-4 py-3 bg-muted border border-border rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-border bg-muted/20">
                {quickPrompts.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-lg bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex gap-3 p-4 border-t border-border">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything about your career..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 shadow-sm shadow-primary/20 transition-all group/send"
                >
                  <Send size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                </button>
              </form>
            </div>

            {/* Top matches */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary animate-pulse" />
                  Your Top AI Matches
                </h3>
                <button onClick={() => navigate('/jobs')} className="text-xs text-primary hover:underline flex items-center gap-1 group/see">
                  See all <ChevronRight size={12} strokeWidth={1.75} className="transition-transform duration-200 group-hover/see:translate-x-0.5" />
                </button>
              </div>
              <div className="space-y-3">
                {topMatches.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-base">
                      {['💳', '🛍️', '🤖', '₿', '✈️'][i]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium group-hover:text-primary transition-colors truncate">{job.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {job.company}
                        <span className="flex items-center gap-1"><DollarSign size={10} /> {job.salary.split(' – ')[0]}+</span>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        job.match >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        job.match >= 80 ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <Sparkles size={9} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="animate-pulse" /> {job.match}%
                      </span>
                    </div>
                    <ArrowUpRight size={14} strokeWidth={1.75} className="text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Match radar */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary animate-pulse" />
                <h3 className="font-semibold text-sm">AI Match Profile</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#8b92b8' }} />
                  <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill gap analysis */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-amber-400" />
                <h3 className="font-semibold text-sm">Skill Gap Analysis</h3>
              </div>
              <div className="space-y-3">
                {gapData.map(item => (
                  <div key={item.skill}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium">{item.skill}</span>
                      <span className="text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {item.current}% → {item.target}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full opacity-30" style={{ width: `${item.target}%`, background: item.color }} />
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.current}%`, background: item.color }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      +{item.target - item.current}% gap
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-xs text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                Get skill improvement plan
              </button>
            </div>

            {/* AI Insights */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-accent animate-pulse" />
                <h3 className="font-semibold text-sm">AI Career Insights</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: TrendingUp, type: 'positive', text: 'You\'re in the top 8% of Frontend candidates in SF' },
                  { icon: Star, type: 'positive', text: 'Your GitHub activity puts you ahead of 91% of applicants' },
                  { icon: AlertCircle, type: 'warning', text: 'AWS cert could unlock 23 new Senior roles' },
                  { icon: BookOpen, type: 'tip', text: 'Add "System Design" to boost match rate by 18%' },
                ].map((insight, i) => {
                  const Icon = insight.icon
                  return (
                    <div key={i} className={`flex gap-2.5 p-3 rounded-lg border text-xs group ${
                      insight.type === 'positive' ? 'bg-emerald-500/5 border-emerald-500/15' :
                      insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/15' :
                      'bg-primary/5 border-primary/15'
                    }`}>
                      <Icon size={13} strokeWidth={1.75} fill={insight.type === 'positive' || insight.type === 'tip' ? 'currentColor' : 'none'} fillOpacity={0.15} className={`flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 ${
                        insight.type === 'positive' ? 'text-emerald-400' :
                        insight.type === 'warning' ? 'text-amber-400' : 'text-primary'
                      }`} />
                      <span className="text-foreground/80 leading-relaxed transition-colors group-hover:text-foreground">{insight.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
