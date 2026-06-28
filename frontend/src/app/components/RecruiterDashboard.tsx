import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Sparkles, Users, Briefcase, Clock, BarChart3,
  ChevronRight, ArrowUpRight, Brain, Plus, Filter,
  Calendar, MessageSquare, AlertCircle, Zap, RefreshCw, Eye, TrendingUp, Star
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts'
import { motion } from 'motion/react'

function MatchBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
    : score >= 80 ? 'bg-primary/5 text-primary border-primary/10'
      : score >= 70 ? 'bg-amber-500/5 text-amber-400 border-amber-500/10'
        : 'bg-muted/30 text-muted-foreground border-border/30'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${color}`}>
      <Sparkles size={10} /> {score}%
    </span>
  )
}

const stageColors: Record<string, string> = {
  applied: 'text-muted-foreground bg-muted/20 border-border/30',
  screening: 'text-accent bg-accent/5 border-accent/10',
  interview: 'text-primary bg-primary/5 border-primary/10',
  offer: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10',
  hired: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  rejected: 'text-red-400 bg-red-500/5 border-red-500/10',
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
  const {
    user, jobs, candidates, recruiterHiringData, recruiterJobPostings,
    sourceData, monthlyHireData
  } = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const activeTab = (tabParam === 'candidates' || tabParam === 'analytics' || tabParam === 'match') ? tabParam : 'overview'

  const setActiveTab = (newTab: 'overview' | 'candidates' | 'analytics' | 'match') => {
    if (newTab === 'overview') {
      setSearchParams({})
    } else {
      setSearchParams({ tab: newTab })
    }
  }

  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [customJobDescription, setCustomJobDescription] = useState<string>('')
  const [matchingResults, setMatchingResults] = useState<any | null>(null)
  const [matchingLoading, setMatchingLoading] = useState<boolean>(false)
  const [matchingError, setMatchingError] = useState<string | null>(null)

  // Auto-populate customJobDescription when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      const selected = jobs.find(j => j.id === selectedJobId)
      if (selected) {
        setCustomJobDescription(
          `Job Title: ${selected.title}\nCompany: ${selected.company}\n\nDescription:\n${selected.description}\n\nRequirements:\n${selected.requirements?.join('\n') || ''}`
        )
      }
    } else {
      setCustomJobDescription('')
    }
  }, [selectedJobId, jobs])

  const handleMatchCandidates = async () => {
    if (!customJobDescription.trim()) return

    setMatchingLoading(true)
    setMatchingError(null)
    setMatchingResults(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/match-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_description: customJobDescription,
        }),
      })

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`)
      }

      const data = await res.json()
      setMatchingResults(data)
    } catch (err: any) {
      setMatchingError(err.message || 'An error occurred during matching.')
    } finally {
      setMatchingLoading(false)
    }
  }

  // Build AI insights using real candidate names from Firestore
  const highRiskCandidates = candidates.filter(c => c.aiScore >= 85 && (c.stage === 'interview' || c.stage === 'offer'))
  const unreviewedCandidates = candidates.filter(c => c.stage === 'applied')
  const openJobs = recruiterJobPostings.filter(j => j.status === 'active')

  const aiInsights = [
    { icon: TrendingUp, text: `Your avg time-to-fill is 18 days — 24% faster than industry average`, type: 'positive' },
    highRiskCandidates.length >= 2
      ? { icon: Star, text: `${highRiskCandidates[0].name} & ${highRiskCandidates[1].name} are at offer/interview stage — act fast to prevent competing offers`, type: 'warning' }
      : highRiskCandidates.length === 1
      ? { icon: Star, text: `${highRiskCandidates[0].name} is at ${highRiskCandidates[0].stage} stage with a ${highRiskCandidates[0].aiScore}% match — consider fast-tracking`, type: 'warning' }
      : { icon: Star, text: `No high-priority candidates at risk yet — your pipeline looks stable`, type: 'positive' },
    { icon: Brain, text: `${unreviewedCandidates.length} candidate${unreviewedCandidates.length !== 1 ? 's' : ''} in your pipeline haven't been reviewed yet`, type: 'tip' },
    openJobs.length > 0
      ? { icon: AlertCircle, text: `${openJobs.length} active job${openJobs.length !== 1 ? 's' : ''} open — keep refreshing listings to attract top talent`, type: 'tip' }
      : { icon: AlertCircle, text: 'No active job postings — post a new role to start receiving applicants', type: 'warning' },
  ]

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/30">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={13} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Recruiter Intelligence</span>
            </div>
            <h1 className="text-foreground tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.company || 'Your company'} · {candidates.length} total applicants · {candidates.filter(c => c.stage === 'interview').length} interviews · {unreviewedCandidates.length} pending review
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/post-job')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
            >
              <Plus size={13} />
              Post New Job
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-foreground">
              <Filter size={13} />
              Filter Candidates
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Jobs', value: String(openJobs.length || recruiterJobPostings.length), change: `${recruiterJobPostings.length} total listings`, icon: Briefcase, color: 'text-primary' },
            { label: 'Total Applicants', value: String(candidates.length), change: `${unreviewedCandidates.length} unreviewed`, icon: Users, color: 'text-accent' },
            { label: 'Interviews', value: String(candidates.filter(c => c.stage === 'interview').length), change: `${candidates.filter(c => c.stage === 'offer').length} at offer stage`, icon: Calendar, color: 'text-purple-400' },
            { label: 'Avg AI Score', value: candidates.length > 0 ? `${Math.round(candidates.reduce((s, c) => s + c.aiScore, 0) / candidates.length)}%` : '—', change: 'across all candidates', icon: Clock, color: 'text-emerald-400' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center transition-all group-hover:scale-105">
                    <Icon size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className={`transition-transform duration-300 ${stat.color}`} />
                  </div>
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
          {(['overview', 'candidates', 'analytics', 'match'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab === 'match' ? 'AI Candidate Matcher' : tab}
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

            {/* Left column 2/3 */}
            <div className="xl:col-span-2 space-y-6">

              {/* Hiring funnel */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hiring Funnel</h3>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>All roles</span>
                    <ChevronRight size={10} />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={recruiterHiringData} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="stage" type="category" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Candidates">
                      {recruiterHiringData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Job postings */}
              <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Job Postings</h3>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    Manage all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Today</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Match</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Views</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiterJobPostings.map((job, i) => (
                        <tr key={job.id} className={`border-b border-border/20 hover:bg-muted/10 transition-colors ${i === recruiterJobPostings.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{job.title}</td>
                          <td className="px-5 py-3.5 text-xs">{job.applicants}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-emerald-400 font-semibold">+{job.newToday}</span>
                          </td>
                          <td className="px-5 py-3.5"><MatchBadge score={job.match} /></td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{job.views.toLocaleString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${job.status === 'Active'
                                ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                                : 'bg-muted/30 text-muted-foreground border-border/30'
                              }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button className="text-xs text-primary hover:underline font-semibold">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly hires chart */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hires vs Target</h3>
                  <span className="text-[10px] text-muted-foreground">2026</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={monthlyHireData}>
                    <defs>
                      <linearGradient id="hireGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="hires" stroke="#6366f1" fill="url(#hireGrad)" strokeWidth={1.5} name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right sidebar 1/3 */}
            <div className="space-y-6">

              {/* AI top candidates */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Brain size={14} className="text-primary" />
                    AI Top Candidates
                  </h3>
                  <button onClick={() => setActiveTab('candidates')} className="text-xs text-primary font-semibold hover:underline">
                    See all
                  </button>
                </div>
                <div className="space-y-3">
                  {candidates.slice(0, 4).map((candidate, i) => (
                    <div
                      key={candidate.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/30 bg-muted/10 hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => navigate(`/profile/${candidate.id}`)}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={candidate.avatar} alt={candidate.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-card border border-border/30 flex items-center justify-center text-[8px] font-bold text-primary">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate group-hover:text-primary transition-colors text-foreground">{candidate.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate mt-0.5">{candidate.title}</div>
                      </div>
                      <MatchBadge score={candidate.aiScore} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Application sources */}
              <div className="p-5 rounded-xl bg-card border border-border/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Application Sources</h3>
                <div className="flex justify-center mb-4">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sourceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {sourceData.map(source => (
                    <div key={source.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: source.color }} />
                        <span className="text-muted-foreground">{source.name}</span>
                      </div>
                      <span className="font-semibold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI-Ranked Candidates</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors font-semibold text-foreground bg-card">
                  <Filter size={12} /> Filter
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors font-semibold text-foreground bg-card">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            </div>

            {/* Pipeline stages grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 border-b border-border/30 pb-6 mb-6">
              {[
                { stage: 'Applied', count: 142 },
                { stage: 'AI Screened', count: 58 },
                { stage: 'HR Review', count: 24 },
                { stage: 'Interview', count: 8 },
                { stage: 'Offer', count: 4 },
                { stage: 'Hired', count: 2 },
              ].map((s) => (
                <div key={s.stage} className="text-left py-2 px-1">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{s.stage}</div>
                  <div className="font-bold text-foreground tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{s.count}</div>
                </div>
              ))}
            </div>

            {/* Candidates grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border border-border/30 hover:border-primary/20 transition-all cursor-pointer group"
                  onClick={() => navigate(`/profile/${candidate.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-primary/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors text-foreground">{candidate.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{candidate.title} · {candidate.location}</p>
                        </div>
                        <MatchBadge score={candidate.aiScore} />
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${stageColors[candidate.stage]}`}>
                          {stageLabels[candidate.stage]}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${candidate.status === 'Available' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
                            candidate.status === 'Open to offers' ? 'text-accent bg-accent/5 border-accent/10' :
                              'text-muted-foreground bg-muted/20 border-border/30'
                          }`}>
                          {candidate.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {candidate.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground border border-border/30">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/messages`) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors font-semibold"
                        >
                          <MessageSquare size={12} /> Message
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/profile/${candidate.id}`) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors font-semibold"
                        >
                          <Eye size={12} /> View Profile
                        </button>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors font-semibold ml-auto"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="p-5 rounded-xl bg-card border border-border/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-primary" />
                Hiring Funnel Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={recruiterHiringData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Candidates">
                    {recruiterHiringData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Application Source Distribution</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} style={{ fontSize: 9, fill: '#8b92b8' }}>
                      {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border/30 lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Monthly Hires vs Target</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyHireData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b92b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0a0d20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, pt: 10 }} />
                  <Line type="monotone" dataKey="hires" stroke="#6366f1" strokeWidth={1.5} dot={{ fill: '#6366f1', r: 3 }} name="Actual Hires" />
                  <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {activeTab === 'match' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Job Selector & Description Input */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-5 rounded-xl bg-card border border-border/30 flex flex-col space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Select Job Posting</h3>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-2">
                      Choose Active Role
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="" className="bg-card text-muted-foreground">-- Custom Search / Paste Description --</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id} className="bg-card text-foreground">
                          {job.title} ({job.company})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-2">
                      Job Description & Requirements
                    </label>
                    <textarea
                      value={customJobDescription}
                      onChange={(e) => setCustomJobDescription(e.target.value)}
                      placeholder="Paste details of the role here to find relevant, fair-aware candidates..."
                      rows={12}
                      className="w-full flex-1 rounded-lg border border-border bg-muted/20 p-3 text-xs text-foreground focus:outline-none focus:border-primary transition-all resize-none placeholder-muted-foreground/60 leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleMatchCandidates}
                    disabled={matchingLoading || !customJobDescription.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                  >
                    {matchingLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Analyzing Cohort...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Find Fair-Aware Matches
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Fairness Dashboard & Matches */}
              <div className="lg:col-span-2 space-y-8">
                
                {matchingLoading && (
                  <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-card border border-border/30 h-96 text-center space-y-4">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-xs text-muted-foreground font-semibold">Running TF-IDF similarity mapping and fairness ThresholdOptimizer...</p>
                  </div>
                )}

                {matchingError && (
                  <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 flex items-start gap-3">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase mb-1">Server Error</h4>
                      <p className="text-xs leading-relaxed">{matchingError}</p>
                    </div>
                  </div>
                )}

                {!matchingResults && !matchingLoading && !matchingError && (
                  <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-card border border-border/30 h-96 text-center text-muted-foreground space-y-3">
                    <Brain size={40} className="stroke-[1.25] text-muted-foreground/40" />
                    <div>
                      <h4 className="text-xs font-bold uppercase text-foreground mb-1">Interactive AI Candidate Matcher</h4>
                      <p className="text-xs max-w-sm mt-1 leading-relaxed">Select or paste a job description on the left to scan your candidates pool and evaluate Demographic Parity.</p>
                    </div>
                  </div>
                )}

                {matchingResults && !matchingLoading && (
                  <div className="space-y-6">
                    
                    {/* Cohort Fairness Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* DPD Card */}
                      <div className="p-5 rounded-xl bg-card border border-border/30 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Demographic Parity Difference (DPD)</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                            matchingResults.fairness_metrics.after_correction.DPD <= 0.10
                              ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                              : 'bg-red-500/5 text-red-400 border-red-500/10'
                          }`}>
                            {matchingResults.fairness_metrics.after_correction.DPD_status}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-4 mt-2">
                          <div>
                            <div className="text-[10px] text-muted-foreground">Before</div>
                            <div className="text-lg font-semibold text-muted-foreground/70" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {(matchingResults.fairness_metrics.before_correction.DPD * 100).toFixed(1)}%
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground/30 mb-0.5" />
                          <div>
                            <div className="text-[10px] text-primary">After (Fair-Aware)</div>
                            <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {(matchingResults.fairness_metrics.after_correction.DPD * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                          Measures the difference in selection rates across demographic groups. Target: <code className="bg-muted px-1 py-0.5 rounded text-foreground">&lt; 10%</code>.
                        </p>
                      </div>

                      {/* DIR Card */}
                      <div className="p-5 rounded-xl bg-card border border-border/30 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Demographic Impact Ratio (DIR)</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                            matchingResults.fairness_metrics.after_correction.DIR >= 0.80
                              ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                              : 'bg-red-500/5 text-red-400 border-red-500/10'
                          }`}>
                            {matchingResults.fairness_metrics.after_correction.DIR_status}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-4 mt-2">
                          <div>
                            <div className="text-[10px] text-muted-foreground">Before</div>
                            <div className="text-lg font-semibold text-muted-foreground/70" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {matchingResults.fairness_metrics.before_correction.DIR.toFixed(2)}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground/30 mb-0.5" />
                          <div>
                            <div className="text-[10px] text-primary">After (Fair-Aware)</div>
                            <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {matchingResults.fairness_metrics.after_correction.DIR.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                          The selection rate ratio of the underprivileged group to the privileged group. Target: <code className="bg-muted px-1 py-0.5 rounded text-foreground">&gt; 0.80</code> (80% rule).
                        </p>
                      </div>

                    </div>

                    {/* Optimizer Applied Notice */}
                    {matchingResults.fairness_correction_applied && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary flex items-center gap-3">
                        <Zap size={14} className="flex-shrink-0 animate-pulse text-primary" />
                        <span className="text-xs font-semibold">
                          Fairness optimization applied! Reranked candidates using model: <span className="underline">{matchingResults.optimizer_used}</span>.
                        </span>
                      </div>
                    )}

                    {/* Candidates Matches Table */}
                    <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                      <div className="p-4 border-b border-border/30 bg-muted/10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Candidates Matched to Role</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-border/30">
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12">Rank</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-36">Category</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resume Snippet</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-20">Group</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-28">Fit Score</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-24">Base Match</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-24">Fair Match</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matchingResults.candidates.map((cand: any) => (
                              <tr
                                key={cand.rank}
                                className={`border-b border-border/20 hover:bg-muted/10 transition-colors ${
                                  cand.reranked ? 'bg-primary/5 hover:bg-primary/10' : ''
                                }`}
                              >
                                <td className="px-5 py-4 text-xs font-bold text-foreground">
                                  {cand.rank}
                                </td>
                                <td className="px-5 py-4 text-xs font-semibold text-foreground">
                                  {cand.category}
                                </td>
                                <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs truncate">
                                  {cand.resume_snippet}
                                </td>
                                <td className="px-5 py-4 text-xs text-muted-foreground">
                                  <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-semibold text-foreground">
                                    G-{cand.demographic_group}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                      {Math.round(cand.similarity_score * 100)}%
                                    </span>
                                    <div className="w-12 h-1.5 rounded-full bg-muted/40 overflow-hidden flex-shrink-0">
                                      <div
                                        className="h-full bg-primary"
                                        style={{ width: `${cand.similarity_score * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                                    cand.shortlisted_base
                                      ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                                      : 'bg-muted/30 text-muted-foreground border-border/30'
                                  }`}>
                                    {cand.shortlisted_base ? 'Select' : 'Skip'}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                                      cand.shortlisted_fair
                                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                                        : 'bg-muted/30 text-muted-foreground border-border/30'
                                    }`}>
                                      {cand.shortlisted_fair ? 'Select' : 'Skip'}
                                    </span>
                                    {cand.reranked && (
                                      <Zap size={11} className="text-primary animate-pulse flex-shrink-0" />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
