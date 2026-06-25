import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Sparkles, Briefcase, Target, Eye, Bell,
  ChevronRight, MapPin, Clock, DollarSign, Star, ArrowUpRight,
  Brain, FileText, MessageSquare, AlertCircle,
  Zap, BarChart3, Award, Upload, Play, RefreshCw, Bookmark
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { jobs, applicantApplications, applicationChartData } from '../data/mockData'
import { motion } from 'motion/react'

const skillsData = [
  { skill: 'React', score: 95 },
  { skill: 'TypeScript', score: 88 },
  { skill: 'Node.js', score: 82 },
  { skill: 'GraphQL', score: 76 },
  { skill: 'AWS', score: 70 },
  { skill: 'Python', score: 65 },
]

const radarData = [
  { subject: 'Skills Match', A: 94, fullMark: 100 },
  { subject: 'Experience', A: 87, fullMark: 100 },
  { subject: 'Education', A: 90, fullMark: 100 },
  { subject: 'Culture Fit', A: 85, fullMark: 100 },
  { subject: 'Growth', A: 92, fullMark: 100 },
  { subject: 'Salary Fit', A: 88, fullMark: 100 },
]

// Custom mini helper for icon since TrendingUp is not imported
function TrendingUpIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  )
}

const aiInsights = [
  { icon: TrendingUpIcon, text: 'Your TypeScript skills are in the top 12% of candidates in SF', type: 'positive' },
  { icon: Target, text: 'Adding "System Design" to your skills could boost matches by 18%', type: 'tip' },
  { icon: Award, text: 'Your GitHub activity score is exceptional — mention it more prominently', type: 'positive' },
  { icon: AlertCircle, text: 'Gap detected: Most Senior roles require AWS certification', type: 'warning' },
]

const stageColors: Record<string, string> = {
  interview: 'text-primary bg-primary/5 border-primary/10',
  review: 'text-amber-400 bg-amber-500/5 border-amber-500/10',
  offer: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10',
  applied: 'text-muted-foreground bg-muted/20 border-border/30',
  rejected: 'text-red-400 bg-red-500/5 border-red-500/10',
}

const stageLabels: Record<string, string> = {
  interview: '🎯 Interview',
  review: '👁 Under Review',
  offer: '🎉 Offer Stage',
  applied: '📤 Applied',
  rejected: '❌ Rejected',
}

function MatchBadge({ match }: { match: number }) {
  const color = match >= 90 ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
    : match >= 80 ? 'bg-primary/5 text-primary border-primary/10'
    : match >= 70 ? 'bg-amber-500/5 text-amber-400 border-amber-500/10'
    : 'bg-muted/30 text-muted-foreground border-border/30'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${color}`}>
      <Sparkles size={10} />
      {match}% Match
    </span>
  )
}

export function ApplicantDashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const activeTab = (tabParam === 'applications' || tabParam === 'insights') ? tabParam : 'overview'

  const setActiveTab = (newTab: 'overview' | 'applications' | 'insights') => {
    if (newTab === 'overview') {
      setSearchParams({})
    } else {
      setSearchParams({ tab: newTab })
    }
  }

  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jobnatics_saved_jobs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const topJobs = jobs.slice(0, 5)

  const toggleSave = (id: string) => {
    setSavedJobs(prev => {
      const updated = prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
      localStorage.setItem('jobnatics_saved_jobs', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/30">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={13} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Daily Briefing</span>
            </div>
            <h1 className="text-foreground tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              12 new job matches today · Your profile is 87% complete · 2 recruiters viewed your profile
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/ai')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
            >
              <Sparkles size={13} />
              View AI Matches
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-foreground">
              <Upload size={13} />
              Update Resume
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Applications', value: '12', change: '+3 this week', icon: FileText, color: 'text-primary' },
            { label: 'Interviews', value: '3', change: '1 scheduled', icon: MessageSquare, color: 'text-emerald-400' },
            { label: 'Avg Match %', value: '84%', change: '+6% vs last month', icon: Target, color: 'text-accent' },
            { label: 'Profile Views', value: '47', change: '+12 this week', icon: Eye, color: 'text-purple-400' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-card border border-border/30 hover:border-primary/10 transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <Icon size={16} className={stat.color} />
                </div>
                <div className="font-bold text-foreground tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem' }}>{stat.value}</div>
                <div className="text-[10px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  {stat.change}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-6 mb-8 border-b border-border/30 pb-px">
          {(['overview', 'applications', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Job recommendations - 2/3 width */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  AI Job Recommendations
                </h2>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  See all <ChevronRight size={12} />
                </button>
              </div>

              <div className="space-y-3">
                {topJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-4 rounded-xl bg-card border border-border/30 hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center flex-shrink-0 text-sm">
                        {['💳', '🤖', '🎨', '₿', '✈️'][i] || '💼'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                          </div>
                          <MatchBadge match={job.match} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={11} /> {job.salary.split(' – ')[0]}+
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {job.posted}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase ${
                            job.remote === 'remote' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
                            job.remote === 'hybrid' ? 'text-accent bg-accent/5 border-accent/10' :
                            'text-muted-foreground bg-muted/20 border-border/30'
                          }`}>
                            {job.remote}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {job.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground border border-border/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                          className={`w-7 h-7 rounded-md flex items-center justify-center border border-border/30 hover:bg-muted/40 transition-colors ${
                            savedJobs.includes(job.id) ? 'text-primary border-primary/20 bg-primary/5' : 'text-muted-foreground'
                          }`}
                        >
                          <Bookmark size={13} className={savedJobs.includes(job.id) ? 'fill-primary' : ''} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                          className="w-7 h-7 rounded-md bg-primary/5 border border-primary/10 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right sidebar - 1/3 width */}
            <div className="space-y-6">
              
              {/* AI Profile Score */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Profile Score</h3>
                  <span className="text-[10px] text-muted-foreground">vs 89% avg</span>
                </div>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/15" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={`${87 * 2.64} 300`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-bold text-foreground leading-none" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem' }}>87</span>
                      <span className="text-[10px] text-muted-foreground mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Skills Alignment', score: 94 },
                    { label: 'Experience relevance', score: 87 },
                    { label: 'Completeness', score: 81 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-semibold">{item.score}%</span>
                      </div>
                      <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center gap-1.5 mb-4">
                  <Brain size={14} className="text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Career Insights</h3>
                </div>
                <div className="space-y-3">
                  {aiInsights.map((insight, i) => {
                    const Icon = insight.icon
                    const borderCls = insight.type === 'positive' ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' :
                      insight.type === 'warning' ? 'border-amber-500/10 bg-amber-500/5 text-amber-400' :
                      'border-primary/10 bg-primary/5 text-primary'
                    return (
                      <div key={i} className="flex gap-2.5 items-start">
                        <div className={`p-1.5 rounded border ${borderCls} flex-shrink-0 mt-0.5`}>
                          <Icon size={12} />
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal">{insight.text}</p>
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={() => navigate('/ai')}
                  className="w-full mt-4 py-2 text-xs text-primary font-semibold border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View full AI analysis →
                </button>
              </div>

              {/* Quick actions */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
                <div className="space-y-1.5">
                  {[
                    { label: 'Generate AI Cover Letter', icon: FileText },
                    { label: 'Launch Mock Interview', icon: Play },
                    { label: 'Deep Skill Analysis', icon: BarChart3 },
                    { label: 'Check Salary Benchmarks', icon: DollarSign },
                  ].map(action => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors text-left text-xs font-semibold text-foreground group"
                      >
                        <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="flex-1">{action.label}</span>
                        <ChevronRight size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Application Tracker</h2>
              <span className="text-xs text-muted-foreground">12 total applications</span>
            </div>

            {/* Pipeline stages */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 border-b border-border/30 pb-6 mb-6">
              {[
                { stage: 'Applied', count: 5, color: 'text-muted-foreground' },
                { stage: 'Screening', count: 3, color: 'text-accent' },
                { stage: 'Interview', count: 2, color: 'text-primary' },
                { stage: 'Offer', count: 1, color: 'text-emerald-400' },
                { stage: 'Rejected', count: 1, color: 'text-red-400' },
              ].map(s => (
                <div key={s.stage} className="text-left py-2 px-1">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{s.stage}</div>
                  <div className={`font-bold tracking-tight ${s.color}`} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{s.count}</div>
                </div>
              ))}
            </div>

            {/* Applications table */}
            <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Job</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Match Score</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pipeline Stage</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Applied Date</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicantApplications.map((app, i) => (
                      <tr key={app.id} className={`border-b border-border/20 hover:bg-muted/10 transition-colors ${i === applicantApplications.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold text-foreground">{app.job}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{app.logo}</span>
                            <span className="text-xs text-muted-foreground">{app.company}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <MatchBadge match={app.match} />
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${stageColors[app.status]}`}>
                            {stageLabels[app.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{app.date}</td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-xs text-primary hover:underline font-semibold">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Applications chart */}
            <div className="p-5 rounded-xl bg-card border border-border/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Application Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={applicationChartData}>
                  <defs>
                    <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#8b92b8' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#appGrad)" strokeWidth={1.5} name="Applications" />
                  <Area type="monotone" dataKey="interviews" stroke="#22d3ee" fill="url(#intGrad)" strokeWidth={1.5} name="Interviews" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Skills radar */}
            <div className="p-5 rounded-xl bg-card border border-border/30">
              <div className="flex items-center gap-1.5 mb-4">
                <Brain size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Match Profile</h3>
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.03)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8b92b8' }} />
                    <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill strength bars */}
            <div className="p-5 rounded-xl bg-card border border-border/30">
              <div className="flex items-center gap-1.5 mb-4">
                <Target size={14} className="text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skill Strength Analysis</h3>
              </div>
              <div className="space-y-4">
                {skillsData.map(skill => (
                  <div key={skill.skill}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">{skill.skill}</span>
                      <span className="text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{skill.score}%</span>
                    </div>
                    <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 rounded-lg border border-primary/10 bg-primary/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Recommendation</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Adding Python to your active skill set would make you eligible for 23 additional high-match roles.
                </p>
              </div>
            </div>

            {/* Career path suggestions */}
            <div className="p-5 rounded-xl bg-card border border-border/30 lg:col-span-2">
              <div className="flex items-center gap-1.5 mb-4">
                <TrendingUpIcon size={14} className="text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Career Path Analysis</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { path: 'Staff Engineer', timeline: '2–3 years', salary: '$220k–$310k', probability: 78, skills: ['System Design', 'Leadership', 'Architecture'] },
                  { path: 'Engineering Manager', timeline: '2–4 years', salary: '$200k–$280k', probability: 65, skills: ['People Management', 'Roadmap', 'Hiring'] },
                  { path: 'Principal Architect', timeline: '4–6 years', salary: '$260k–$380k', probability: 52, skills: ['Enterprise Architecture', 'Cloud Strategy', 'CTO skills'] },
                ].map((path) => (
                  <div key={path.path} className="p-4 rounded-xl border border-border/30 bg-muted/10 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-xs text-foreground">{path.path}</h4>
                        <p className="text-[10px] text-muted-foreground">{path.timeline}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        path.probability >= 70 ? 'bg-emerald-500/5 text-emerald-400' :
                        path.probability >= 55 ? 'bg-primary/5 text-primary' :
                        'bg-amber-500/5 text-amber-400'
                      }`}>
                        {path.probability}%
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold mb-3">{path.salary}</div>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border/20">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  )
}
