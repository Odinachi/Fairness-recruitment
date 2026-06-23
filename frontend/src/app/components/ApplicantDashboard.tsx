import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Sparkles, Briefcase, TrendingUp, Eye, BookmarkPlus, Bell,
  ChevronRight, MapPin, Clock, DollarSign, Star, ArrowUpRight,
  Brain, Target, FileText, MessageSquare, CheckCircle2, AlertCircle,
  Zap, BarChart3, Award, Upload, Play, RefreshCw, Bookmark
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, Cell
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

const aiInsights = [
  { icon: TrendingUp, text: 'Your TypeScript skills are in the top 12% of candidates in SF', type: 'positive' },
  { icon: Target, text: 'Adding "System Design" to your skills could boost matches by 18%', type: 'tip' },
  { icon: Award, text: 'Your GitHub activity score is exceptional — mention it more prominently', type: 'positive' },
  { icon: AlertCircle, text: 'Gap detected: Most Senior roles require AWS certification', type: 'warning' },
]

const stageColors: Record<string, string> = {
  interview: 'text-primary bg-primary/15 border-primary/30',
  review: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  offer: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  applied: 'text-muted-foreground bg-muted border-border',
  rejected: 'text-red-400 bg-red-500/15 border-red-500/30',
}

const stageLabels: Record<string, string> = {
  interview: '🎯 Interview',
  review: '👁 Under Review',
  offer: '🎉 Offer Stage',
  applied: '📤 Applied',
  rejected: '❌ Rejected',
}

function MatchBadge({ match }: { match: number }) {
  const color = match >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : match >= 80 ? 'bg-primary/20 text-primary border-primary/30'
    : match >= 70 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-muted text-muted-foreground border-border'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Sparkles size={10} />
      {match}% Match
    </span>
  )
}

export function ApplicantDashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'insights'>('overview')
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const topJobs = jobs.slice(0, 5)

  const toggleSave = (id: string) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id])
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-card to-accent/10 border border-primary/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-xs font-medium text-primary">AI Daily Briefing</span>
              </div>
              <h1 className="text-foreground mb-1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>
                Good morning, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                12 new job matches today · Your profile is 87% complete · 2 recruiters viewed your profile
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/ai')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
              >
                <Sparkles size={16} />
                View AI Matches
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                <Upload size={16} />
                Update Resume
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applications', value: '12', change: '+3 this week', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Interviews', value: '3', change: '1 scheduled', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Avg Match %', value: '84%', change: '+6% vs last month', icon: Target, color: 'text-accent', bg: 'bg-accent/10' },
            { label: 'Profile Views', value: '47', change: '+12 this week', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all cursor-default"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground" />
                </div>
                <div className="font-bold text-foreground mb-0.5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem' }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-emerald-400 mt-1">{stat.change}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-xl w-fit">
          {(['overview', 'applications', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Job recommendations - 2/3 width */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  AI Job Recommendations
                </h2>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  See all <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {topJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0 text-lg">
                        {['💳', '🤖', '🎨', '₿', '✈️'][i] || '💼'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{job.company}</p>
                          </div>
                          <MatchBadge match={job.match} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign size={11} /> {job.salary.split(' – ')[0]}+
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={11} /> {job.posted}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            job.remote === 'remote' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                            job.remote === 'hybrid' ? 'text-accent bg-accent/10 border-accent/20' :
                            'text-muted-foreground bg-muted border-border'
                          }`}>
                            {job.remote.charAt(0).toUpperCase() + job.remote.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            savedJobs.includes(job.id) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <Bookmark size={15} className={savedJobs.includes(job.id) ? 'fill-primary' : ''} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                          className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* AI Score ring */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">AI Profile Score</h3>
                  <span className="text-xs text-muted-foreground">vs 89% avg</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="url(#grad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-bold text-foreground" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem' }}>87</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Skills', score: 94 },
                    { label: 'Experience', score: 87 },
                    { label: 'Profile completeness', score: 81 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-medium">{item.score}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={16} className="text-primary" />
                  <h3 className="font-semibold text-sm">AI Career Insights</h3>
                </div>
                <div className="space-y-3">
                  {aiInsights.map((insight, i) => {
                    const Icon = insight.icon
                    return (
                      <div key={i} className={`flex gap-3 p-3 rounded-lg border ${
                        insight.type === 'positive' ? 'bg-emerald-500/5 border-emerald-500/15' :
                        insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/15' :
                        'bg-primary/5 border-primary/15'
                      }`}>
                        <Icon size={14} className={`flex-shrink-0 mt-0.5 ${
                          insight.type === 'positive' ? 'text-emerald-400' :
                          insight.type === 'warning' ? 'text-amber-400' :
                          'text-primary'
                        }`} />
                        <p className="text-xs text-foreground/80 leading-relaxed">{insight.text}</p>
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={() => navigate('/ai')}
                  className="w-full mt-3 py-2 text-xs text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View full AI analysis →
                </button>
              </div>

              {/* Quick actions */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'AI Cover Letter', icon: FileText, color: 'text-primary bg-primary/10' },
                    { label: 'Mock Interview', icon: Play, color: 'text-emerald-400 bg-emerald-500/10' },
                    { label: 'Skill Analysis', icon: BarChart3, color: 'text-accent bg-accent/10' },
                    { label: 'Salary Check', icon: DollarSign, color: 'text-purple-400 bg-purple-500/10' },
                  ].map(action => {
                    const Icon = action.icon
                    return (
                      <button key={action.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-center">
                        <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-medium">{action.label}</span>
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
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Application Tracker</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">12 total applications</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            </div>

            {/* Pipeline stages */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { stage: 'Applied', count: 5, color: 'border-muted-foreground/30' },
                { stage: 'Screening', count: 3, color: 'border-accent/40' },
                { stage: 'Interview', count: 2, color: 'border-primary/40' },
                { stage: 'Offer', count: 1, color: 'border-emerald-500/40' },
                { stage: 'Rejected', count: 1, color: 'border-red-500/40' },
              ].map(s => (
                <div key={s.stage} className={`p-4 rounded-xl bg-card border-2 ${s.color} text-center`}>
                  <div className="font-bold text-foreground mb-1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{s.count}</div>
                  <div className="text-xs text-muted-foreground">{s.stage}</div>
                </div>
              ))}
            </div>

            {/* Applications table */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Job</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Company</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Match</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Stage</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Applied</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicantApplications.map((app, i) => (
                      <tr key={app.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${i === applicantApplications.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{app.job}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{app.logo}</span>
                            <span className="text-sm text-muted-foreground">{app.company}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <MatchBadge match={app.match} />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${stageColors[app.status]}`}>
                            {stageLabels[app.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{app.date}</td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-primary hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Applications chart */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-4">Application Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={applicationChartData}>
                  <defs>
                    <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#e8eaf6' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#appGrad)" strokeWidth={2} name="Applications" />
                  <Area type="monotone" dataKey="interviews" stroke="#22d3ee" fill="url(#intGrad)" strokeWidth={2} name="Interviews" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills radar */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} className="text-primary" />
                <h3 className="font-semibold text-sm">AI Match Profile</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#8b92b8' }} />
                  <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill strength bars */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-accent" />
                <h3 className="font-semibold text-sm">Skill Strength Analysis</h3>
              </div>
              <div className="space-y-4">
                {skillsData.map(skill => (
                  <div key={skill.skill}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{skill.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, #6366f1, #22d3ee)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={12} className="text-primary" />
                  <span className="text-xs font-medium text-primary">AI Recommendation</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adding Python to your active skill set would make you eligible for 23 additional high-match roles.
                </p>
              </div>
            </div>

            {/* Career path suggestions */}
            <div className="p-5 rounded-2xl bg-card border border-border lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-emerald-400" />
                <h3 className="font-semibold text-sm">AI Career Path Analysis</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { path: 'Staff Engineer', timeline: '2–3 years', salary: '$220k–$310k', probability: 78, skills: ['System Design', 'Leadership', 'Architecture'] },
                  { path: 'Engineering Manager', timeline: '2–4 years', salary: '$200k–$280k', probability: 65, skills: ['People Management', 'Roadmap', 'Hiring'] },
                  { path: 'Principal Architect', timeline: '4–6 years', salary: '$260k–$380k', probability: 52, skills: ['Enterprise Architecture', 'Cloud Strategy', 'CTO skills'] },
                ].map((path, i) => (
                  <div key={path.path} className="p-4 rounded-xl bg-muted/40 border border-border hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{path.path}</h4>
                        <p className="text-xs text-muted-foreground">{path.timeline}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        path.probability >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                        path.probability >= 55 ? 'bg-primary/20 text-primary' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {path.probability}%
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mb-3">{path.salary}</div>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">{s}</span>
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
