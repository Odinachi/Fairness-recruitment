import { useParams, useNavigate } from 'react-router'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  MapPin, Briefcase, GraduationCap, Star, Sparkles, MessageSquare,
  Calendar, ArrowLeft, ExternalLink, Award, TrendingUp, CheckCircle2,
  Brain, Target, Clock, Users,
} from 'lucide-react'
import { candidates, jobs } from '../data/mockData'
import { useState } from 'react'
import { motion } from 'motion/react'

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

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'ai'>('overview')
  const [stageOverride, setStageOverride] = useState<string | null>(null)

  const candidate = candidates.find(c => c.id === id) || candidates[0]
  const appliedJob = candidate.jobId ? jobs.find(j => j.id === candidate.jobId) : null
  const currentStage = stageOverride || candidate.stage

  const aiMatchBreakdown = [
    { label: 'Skills Match', score: 96 },
    { label: 'Experience Level', score: 92 },
    { label: 'Education Fit', score: 88 },
    { label: 'Culture Alignment', score: 85 },
    { label: 'Communication', score: 90 },
    { label: 'Growth Potential', score: 94 },
  ]

  const stages = ['applied', 'screening', 'interview', 'offer', 'hired']

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Back
        </button>

        {/* Profile header */}
        <div className="p-6 rounded-2xl bg-card border border-border mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center ${
                candidate.status === 'Available' ? 'bg-emerald-400' :
                candidate.status === 'Open to offers' ? 'bg-amber-400' : 'bg-muted-foreground'
              }`} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>{candidate.name}</h1>
                  <p className="text-muted-foreground">{candidate.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
                    candidate.aiScore >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    candidate.aiScore >= 80 ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <Sparkles size={13} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="animate-pulse" /> {candidate.aiScore}% AI Score
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.75} /> {candidate.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} strokeWidth={1.75} /> {candidate.experience} years experience</span>
                <span className="flex items-center gap-1.5"><GraduationCap size={14} strokeWidth={1.75} /> {candidate.education}</span>
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  candidate.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                  candidate.status === 'Open to offers' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {candidate.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidate.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>

              {user?.role === 'recruiter' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/messages')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all group/msg"
                  >
                    <MessageSquare size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="transition-transform group-hover/msg:scale-105" /> Send Message
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors group/cal">
                    <Calendar size={16} strokeWidth={1.75} className="transition-transform group-hover/cal:scale-105" /> Schedule Interview
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors group/port">
                    <ExternalLink size={16} strokeWidth={1.75} className="transition-transform group-hover/port:scale-105" /> View Portfolio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline stage (for recruiters) */}
        {user?.role === 'recruiter' && (
          <div className="p-5 rounded-2xl bg-card border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Target size={16} className="text-primary" />
                Pipeline Stage
              </h3>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${stageColors[currentStage]}`}>
                {stageLabels[currentStage]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {stages.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => setStageOverride(s)}
                    className={`w-full h-2 rounded-full transition-all ${
                      stages.indexOf(currentStage) >= i
                        ? 'bg-primary'
                        : 'bg-muted hover:bg-muted-foreground/30'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground capitalize hidden sm:block">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-xl w-fit">
          {(['overview', 'experience', 'ai'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'ai' ? '🤖 AI Analysis' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{candidate.bio}</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2 group/title">
                  <Award size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-amber-400 transition-transform group-hover/title:scale-110" /> Key Achievements
                </h3>
                <ul className="space-y-2">
                  {candidate.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={15} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {appliedJob && (
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-3">Applied For</h3>
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border hover:border-primary/20 transition-all cursor-pointer group"
                    onClick={() => navigate(`/jobs/${appliedJob.id}`)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                      {['💳', '🤖', '🎨', '₿', '✈️'][parseInt(appliedJob.id) - 1] || '💼'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">{appliedJob.title}</div>
                      <div className="text-xs text-muted-foreground">{appliedJob.company} · {appliedJob.salary}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                      {appliedJob.match}% match
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Experience', value: `${candidate.experience} years`, icon: Briefcase },
                    { label: 'AI Score', value: `${candidate.aiScore}/100`, icon: Sparkles },
                    { label: 'Applied', value: new Date(candidate.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), icon: Clock },
                    { label: 'Status', value: candidate.status, icon: Users },
                  ].map(stat => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.label} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon size={14} strokeWidth={1.75} className="transition-transform group-hover:scale-110" />
                          {stat.label}
                        </div>
                        <span className="text-sm font-medium">{stat.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4">
            {[
              { role: candidate.title, company: 'Previous Company', period: '2022–Present', desc: 'Led frontend architecture and drove technical initiatives across multiple product teams.', skills: candidate.skills.slice(0, 3) },
              { role: 'Mid-level Engineer', company: 'Startup Inc.', period: '2020–2022', desc: 'Built core product features and improved performance by 40%.', skills: candidate.skills.slice(1, 4) },
              { role: 'Junior Developer', company: 'Agency Co.', period: '2018–2020', desc: 'Developed client websites and internal tools using modern web technologies.', skills: candidate.skills.slice(0, 2) },
            ].map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.desc}</p>
                <div className="flex gap-2">
                  {exp.skills.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary animate-pulse" />
                <h3 className="font-semibold text-sm">AI Match Breakdown</h3>
              </div>
              <div className="space-y-3">
                {aiMatchBreakdown.map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-accent animate-pulse" />
                <h3 className="font-semibold text-sm">AI-Generated Summary</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">{candidate.name}</strong> is an exceptional candidate with a rare combination of deep technical expertise and demonstrated leadership ability. Their {candidate.experience}-year track record shows consistent growth and impact.
                </p>
                <p className="leading-relaxed">
                  Their skills in {candidate.skills.slice(0, 3).join(', ')} directly align with your requirements. The AI predicts a <strong className="text-emerald-400">{candidate.aiScore}% probability of success</strong> in this role based on skill alignment, experience trajectory, and historical performance patterns.
                </p>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 group/rec">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={12} strokeWidth={1.75} className="text-primary transition-transform group-hover/rec:translate-x-0.5 group-hover/rec:-translate-y-0.5" />
                    <span className="text-xs font-medium text-primary">AI Recommendation</span>
                  </div>
                  <p className="text-xs">High priority candidate. Recommend fast-tracking to interview stage to prevent competing offer loss.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
