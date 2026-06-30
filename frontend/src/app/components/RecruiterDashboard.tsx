import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Sparkles, Users, Briefcase, Clock, BarChart3,
  ChevronRight, ArrowUpRight, Brain, Plus, Filter,
  Calendar, MessageSquare, AlertCircle, Zap, RefreshCw, Eye, TrendingUp, Star,
  ArrowLeft, MapPin, DollarSign
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts'
import { motion } from 'motion/react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

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
    sourceData, monthlyHireData, allUsers, applicantApplications
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

  const [selectedManageJob, setSelectedManageJob] = useState<any | null>(null)
  const [applicantScores, setApplicantScores] = useState<Record<string, { score: number, base_outcome: boolean }>>({})
  const [loadingScores, setLoadingScores] = useState<boolean>(false)

  // Fetch match scores for job applicants using our AI model
  useEffect(() => {
    if (!selectedManageJob) {
      setApplicantScores({})
      return
    }

    const jobApplicants = applicantApplications.filter(a => a.jobId === selectedManageJob.id)
    if (jobApplicants.length === 0) {
      setApplicantScores({})
      return
    }

    const fetchApplicantScores = async () => {
      setLoadingScores(true)
      try {
        const payloadApplicants = jobApplicants.map(app => {
          const prof = allUsers.find(u => u.id === app.userId)
          return {
            applicant_id: app.userId,
            resume_text: prof?.bio || "No resume details provided.",
            demographic_group: 0
          }
        })

        const res = await fetch('http://127.0.0.1:8000/api/match-applicants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job_description: `${selectedManageJob.title}\n\n${selectedManageJob.description}\n\n${(selectedManageJob.requirements || []).join('\n')}`,
            applicants: payloadApplicants
          })
        })

        if (res.ok) {
          const data = await res.json()
          const scoresMap: Record<string, { score: number, base_outcome: boolean }> = {}
          data.matches.forEach((m: any) => {
            scoresMap[m.applicant_id] = {
              score: m.score,
              base_outcome: m.base_outcome
            }
          })
          setApplicantScores(scoresMap)
        }
      } catch (err) {
        console.error('Error fetching applicant match scores:', err)
      } finally {
        setLoadingScores(false)
      }
    }

    fetchApplicantScores()
  }, [selectedManageJob, applicantApplications, allUsers])

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    const stageMap: Record<string, string> = {
      applied: 'Applied',
      screening: 'Screening',
      interview: 'Interview',
      offer: 'Offer Sent',
      hired: 'Hired',
      rejected: 'Rejected'
    }
    try {
      const appRef = doc(db, 'applicantApplications', appId)
      await setDoc(appRef, {
        status: newStatus,
        stage: stageMap[newStatus] || 'Applied'
      }, { merge: true })
    } catch (err) {
      console.error('Error updating application status:', err)
    }
  }

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

        {selectedManageJob ? (
          <div className="space-y-6">
            {/* Header / Back */}
            <div className="flex items-center justify-between pb-4 border-b border-border/30">
              <button
                onClick={() => setSelectedManageJob(null)}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </button>
              <span className="text-[10px] px-2.5 py-1 rounded-full border uppercase font-bold bg-emerald-500/5 text-emerald-400 border-emerald-500/10">
                Active Posting
              </span>
            </div>

            {/* Job Header Card */}
            <div className="p-6 rounded-xl bg-card border border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {selectedManageJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {selectedManageJob.location || 'Remote'}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} /> {selectedManageJob.salary || '$80k - $120k'}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {selectedManageJob.type || 'Full-time'} · {selectedManageJob.level || 'Mid-Level'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedJobId(selectedManageJob.id)
                  setActiveTab('match')
                  setSelectedManageJob(null)
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold transition-all"
              >
                <Sparkles size={13} />
                Run AI Matcher Cohort
              </button>
            </div>

            {/* Grid layout: Description & Applicants */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Job Description */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-5 rounded-xl bg-card border border-border/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-primary" />
                    Role Description
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-3 leading-relaxed max-h-[450px] overflow-y-auto pr-1">
                    <p className="whitespace-pre-line">{selectedManageJob.description}</p>
                    {selectedManageJob.requirements && selectedManageJob.requirements.length > 0 && (
                      <div>
                        <h4 className="font-bold text-foreground mt-4 mb-2">Requirements:</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {selectedManageJob.requirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Applicants List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-5 rounded-xl bg-card border border-border/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                    <Users size={14} className="text-accent" />
                    Job Applicants ({applicantApplications.filter(a => a.jobId === selectedManageJob.id).length})
                  </h3>

                  {/* Applicants Table/List */}
                  {(() => {
                    const jobApplicants = applicantApplications.filter(a => a.jobId === selectedManageJob.id)
                    if (jobApplicants.length === 0) {
                      return (
                        <div className="p-12 text-center text-muted-foreground">
                          <Users size={32} className="mx-auto mb-3 stroke-[1.25] text-muted-foreground/30" />
                          <p className="text-xs">No candidates have applied to this posting yet.</p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-4">
                        {jobApplicants.map((app) => {
                          const prof = allUsers.find(u => u.id === app.userId)
                          const scoreInfo = applicantScores[app.userId]
                          const name = prof?.name || 'Applicant'
                          const title = prof?.title || 'Software Engineer'
                          const location = prof?.location || 'Remote'
                          const avatar = prof?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
                          const email = prof?.email || ''

                          return (
                            <div key={app.id} className="p-4 rounded-lg bg-muted/10 border border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <img src={avatar} alt={name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-primary/10 flex-shrink-0" />
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground">{name}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">{title} · {location}</p>
                                  {email && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{email}</p>}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                {/* AI Match Score */}
                                <div className="text-left md:text-right">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1">AI Match Score</div>
                                  {loadingScores ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                  ) : scoreInfo ? (
                                    <MatchBadge score={Math.round(scoreInfo.score)} />
                                  ) : (
                                    <MatchBadge score={app.match || 75} />
                                  )}
                                </div>

                                {/* Status Selector */}
                                <div>
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Status</div>
                                  <select
                                    value={app.status || 'applied'}
                                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                    className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary transition-colors font-semibold"
                                  >
                                    <option value="applied">Applied</option>
                                    <option value="screening">Screening</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer Sent</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 md:ml-2">
                                  <button
                                    onClick={() => navigate('/messages')}
                                    className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Message Applicant"
                                  >
                                    <MessageSquare size={13} />
                                  </button>
                                  <button
                                    onClick={() => navigate(`/profile/${app.userId}`)}
                                    className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="View Profile"
                                  >
                                    <Eye size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <>
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
                  {(() => {
                    const myJobs = jobs.filter(j => j.postedBy === user?.id)
                    if (myJobs.length === 0) {
                      return (
                        <div className="p-8 text-center text-muted-foreground">
                          <Briefcase size={32} className="mx-auto mb-3 stroke-[1.25] text-muted-foreground/30" />
                          <p className="text-xs">You haven't posted any jobs yet.</p>
                          <button
                            onClick={() => navigate('/post-job')}
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
                          >
                            <Plus size={12} /> Post your first job
                          </button>
                        </div>
                      )
                    }

                    return (
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
                          {myJobs.map((job, i) => {
                            const jobApplicants = applicantApplications.filter(a => a.jobId === job.id)
                            const topScore = jobApplicants.length > 0
                              ? Math.max(...jobApplicants.map(a => applicantScores[a.userId]?.score || a.match || 75))
                              : 0
                            return (
                              <tr key={job.id} className={`border-b border-border/20 hover:bg-muted/10 transition-colors ${i === myJobs.length - 1 ? 'border-b-0' : ''}`}>
                                <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{job.title}</td>
                                <td className="px-5 py-3.5 text-xs">{jobApplicants.length}</td>
                                <td className="px-5 py-3.5">
                                  <span className="text-xs text-emerald-400 font-semibold">
                                    +{jobApplicants.filter(a => a.status === 'applied').length}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  {topScore > 0 ? <MatchBadge score={Math.round(topScore)} /> : <span className="text-xs text-muted-foreground">—</span>}
                                </td>
                                <td className="px-5 py-3.5 text-xs text-muted-foreground">{(job.views || 0).toLocaleString()}</td>
                                <td className="px-5 py-3.5">
                                  <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold bg-emerald-500/5 text-emerald-400 border-emerald-500/10`}>
                                    Active
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <button
                                    onClick={() => setSelectedManageJob(job)}
                                    className="text-xs text-primary hover:underline font-semibold"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )
                  })()}
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
          </>
        )}
      </div>
    </Layout>
  )
}
