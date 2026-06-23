import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Sparkles, Users, Briefcase, TrendingUp, Clock, BarChart3,
  ChevronRight, ArrowUpRight, Brain, Target, Plus, Filter,
  Calendar, MessageSquare, Star, CheckCircle2, AlertCircle,
  Zap, RefreshCw, Eye, FileText, Award,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from 'recharts'
import {
  candidates, recruiterHiringData, recruiterJobPostings,
  sourceData, monthlyHireData,
} from '../data/mockData'
import { motion } from 'motion/react'

function MatchBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : score >= 80 ? 'bg-primary/20 text-primary border-primary/30'
    : score >= 70 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-muted text-muted-foreground border-border'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Sparkles size={10} /> {score}%
    </span>
  )
}

const stageColors: Record<string, string> = {
  applied: 'text-muted-foreground bg-muted border-border',
  screening: 'text-accent bg-accent/15 border-accent/30',
  interview: 'text-primary bg-primary/15 border-primary/30',
  offer: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  hired: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
  rejected: 'text-red-400 bg-red-500/15 border-red-500/30',
}

const stageLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer Sent',
  hired: 'Hired',
  rejected: 'Rejected',
}

export function RecruiterDashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'analytics'>('overview')

  const aiInsights = [
    { icon: TrendingUp, text: 'Your avg time-to-fill is 18 days — 24% faster than industry average', type: 'positive' },
    { icon: Star, text: 'Alex Chen & Marcus Williams are showing signs of competing offers — act fast', type: 'warning' },
    { icon: Brain, text: 'ML Engineer role has 95% match candidates you haven\'t reviewed yet', type: 'tip' },
    { icon: AlertCircle, text: 'DevOps role has been paused for 14 days — consider reactivating', type: 'warning' },
  ]

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-card to-primary/10 border border-accent/20 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-xs font-medium text-accent">Recruiter Intelligence</span>
              </div>
              <h1 className="text-foreground mb-1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.company || 'Your company'} · 8 new applicants today · 3 interviews scheduled · 2 AI shortlists ready
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
              >
                <Plus size={16} />
                Post New Job
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                <Filter size={16} />
                Filter Candidates
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Jobs', value: '5', change: '+1 this week', icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total Applicants', value: '437', change: '+24 today', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
            { label: 'Interviews', value: '8', change: '3 this week', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Avg Time to Hire', value: '18d', change: '↓6d vs last month', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all"
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

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-xl w-fit">
          {(['overview', 'candidates', 'analytics'] as const).map(tab => (
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
            {/* Left column 2/3 */}
            <div className="xl:col-span-2 space-y-6">
              {/* Hiring funnel */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary" />
                    Hiring Funnel
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>All roles</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={recruiterHiringData} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#8b92b8' }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip
                      contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }}
                      cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Candidates">
                      {recruiterHiringData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Job postings */}
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Active Job Postings</h3>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Manage all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Role</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Applicants</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">New Today</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Top Match</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Views</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiterJobPostings.map((job, i) => (
                        <tr key={job.id} className={`border-b border-border hover:bg-muted/20 transition-colors ${i === recruiterJobPostings.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium">{job.title}</td>
                          <td className="px-4 py-3 text-sm">{job.applicants}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-emerald-400 font-medium">+{job.newToday}</span>
                          </td>
                          <td className="px-4 py-3"><MatchBadge score={job.match} /></td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{job.views.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                              job.status === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-muted text-muted-foreground border-border'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-xs text-primary hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly hires chart */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Hires vs Target</h3>
                  <span className="text-xs text-muted-foreground">2026</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyHireData}>
                    <defs>
                      <linearGradient id="hireGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="hires" stroke="#6366f1" fill="url(#hireGrad)" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right sidebar 1/3 */}
            <div className="space-y-6">
              {/* AI top candidates */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Brain size={14} className="text-primary" />
                    AI Top Candidates
                  </h3>
                  <button onClick={() => setActiveTab('candidates')} className="text-xs text-primary hover:underline">
                    See all
                  </button>
                </div>
                <div className="space-y-3">
                  {candidates.slice(0, 4).map((candidate, i) => (
                    <div
                      key={candidate.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/profile/${candidate.id}`)}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={candidate.avatar} alt={candidate.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-primary" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px' }}>
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{candidate.title}</div>
                      </div>
                      <MatchBadge score={candidate.aiScore} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Application sources */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-4">Application Sources</h3>
                <div className="flex justify-center mb-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sourceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {sourceData.map(source => (
                    <div key={source.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: source.color }} />
                        <span className="text-muted-foreground">{source.name}</span>
                      </div>
                      <span className="font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-primary" />
                  <h3 className="font-semibold text-sm">AI Recruiter Insights</h3>
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
                        <Icon size={13} className={`flex-shrink-0 mt-0.5 ${
                          insight.type === 'positive' ? 'text-emerald-400' :
                          insight.type === 'warning' ? 'text-amber-400' : 'text-primary'
                        }`} />
                        <p className="text-xs text-foreground/80 leading-relaxed">{insight.text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">AI-Ranked Candidates</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                  <Filter size={12} /> Filter
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            </div>

            {/* Pipeline stages */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { stage: 'Applied', count: 142 },
                { stage: 'AI Screened', count: 58 },
                { stage: 'HR Review', count: 24 },
                { stage: 'Interview', count: 8 },
                { stage: 'Offer', count: 4 },
                { stage: 'Hired', count: 2 },
              ].map((s, i) => (
                <div key={s.stage} className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary/20 transition-all">
                  <div className="font-bold text-foreground mb-1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{s.count}</div>
                  <div className="text-xs text-muted-foreground">{s.stage}</div>
                </div>
              ))}
            </div>

            {/* Candidates grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
                  onClick={() => navigate(`/profile/${candidate.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{candidate.name}</h3>
                          <p className="text-xs text-muted-foreground">{candidate.title} · {candidate.location}</p>
                        </div>
                        <MatchBadge score={candidate.aiScore} />
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${stageColors[candidate.stage]}`}>
                          {stageLabels[candidate.stage]}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          candidate.status === 'Available' ? 'text-emerald-400 bg-emerald-500/10' :
                          candidate.status === 'Open to offers' ? 'text-accent bg-accent/10' :
                          'text-muted-foreground bg-muted'
                        }`}>
                          {candidate.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {candidate.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/messages`) }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <MessageSquare size={12} /> Message
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/profile/${candidate.id}`) }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors"
                        >
                          <Eye size={12} /> View Profile
                        </button>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors ml-auto"
                        >
                          <Calendar size={12} /> Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                Hiring Funnel Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={recruiterHiringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Candidates">
                    {recruiterHiringData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-4">Application Source Distribution</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                      {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border lg:col-span-2">
              <h3 className="font-semibold text-sm mb-4">Monthly Hires vs Target</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyHireData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0c1023', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="hires" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Actual Hires" />
                  <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
