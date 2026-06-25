import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../context/AppContext'
import {
  Sparkles, MapPin, Briefcase, Globe, Linkedin, Github,
  CheckCircle2, ArrowRight, ArrowLeft, Building2, Target, DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export function ProfileSetup() {
  const navigate = useNavigate()
  const { user, setUser, darkMode } = useApp()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    } else if (user.profileSetupCompleted) {
      // If profile is already complete, redirect to respective dashboard
      navigate(user.role === 'recruiter' ? '/app/recruiter' : '/app/applicant')
    }
  }, [user, navigate])

  const [form, setForm] = useState({
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
    workStyle: 'Remote',
    roleLevel: 'Senior',
    salaryRange: '$120k–$150k',
    relocation: 'No',
    hiringPriority: 'Technical Depth',
  })

  if (!user) return null

  const handleNext = () => {
    if (step === 1 && (!form.location || !form.bio)) {
      toast.error('Please fill in your location and bio')
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleFinish = async () => {
    setLoading(true)
    // Simulate short saving timeout
    await new Promise(resolve => setTimeout(resolve, 1500))

    const updatedProfile = {
      role: user.role,
      avatar: user.avatar,
      title: user.role === 'applicant' ? (user.title || form.roleLevel + ' Engineer') : user.title,
      company: user.company,
      location: form.location,
      bio: form.bio,
      website: form.website,
      linkedin: form.linkedin,
      github: user.role === 'applicant' ? form.github : undefined,
      workStyle: form.workStyle,
      roleLevel: form.roleLevel,
      salaryRange: user.role === 'applicant' ? form.salaryRange : undefined,
      relocation: user.role === 'applicant' ? form.relocation : undefined,
      hiringPriority: user.role === 'recruiter' ? form.hiringPriority : undefined,
      profileSetupCompleted: true, // Complete onboarding!
    }

    // Save details to LocalStorage under user uid
    localStorage.setItem(`jobnatics_profile_${user.id}`, JSON.stringify(updatedProfile))

    // Fire Confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6']
    })

    toast.success('Onboarding complete! Welcome to Jobnatics AI.')

    // Update global app state
    setUser({
      ...user,
      location: form.location,
      bio: form.bio,
      title: updatedProfile.title,
      profileSetupCompleted: true,
    })

    // Redirect to dashboard
    navigate(user.role === 'recruiter' ? '/app/recruiter' : '/app/applicant')
    setLoading(false)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07091a] via-[#0d1228] to-[#070918] p-6 ${darkMode ? 'dark' : ''}`}>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={20} strokeWidth={1.75} fill="currentColor" fillOpacity={0.2} className="text-white animate-pulse" />
          </div>
          <span className="font-bold text-white text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Jobnatics <span className="text-primary">AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Header */}
          <div className="bg-muted/30 p-6 border-b border-border/20">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Complete Your Profile
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Let's personalize your AI recruiter & matchmaking settings
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Step {step} of 3
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-border/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    1. Basic Profile
                  </h2>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <MapPin size={14} strokeWidth={1.75} className="text-primary" /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA or London, UK"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 border border-border/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Briefcase size={14} strokeWidth={1.75} className="text-primary" /> 
                      {user.role === 'recruiter' ? 'About Your Hiring Needs' : 'Professional Biography'}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={user.role === 'recruiter' 
                        ? "Describe the role, company culture, or key skills you're seeking to hire..."
                        : "Describe your professional background, core technical skills, and career interests..."
                      }
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 border border-border/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 resize-none leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    2. Professional Links
                  </h2>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Globe size={14} strokeWidth={1.75} className="text-primary" /> 
                      {user.role === 'recruiter' ? 'Company Website' : 'Personal Portfolio / Website'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={form.website}
                      onChange={e => setForm({ ...form, website: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 border border-border/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Linkedin size={14} strokeWidth={1.75} className="text-primary" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={e => setForm({ ...form, linkedin: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 border border-border/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  {user.role === 'applicant' && (
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                        <Github size={14} strokeWidth={1.75} className="text-primary" /> GitHub URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={form.github}
                        onChange={e => setForm({ ...form, github: e.target.value })}
                        className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 border border-border/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    3. AI Matchmaking Preferences
                  </h2>

                  {user.role === 'applicant' ? (
                    <>
                      {/* Work style */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                          <Building2 size={14} strokeWidth={1.75} className="text-primary" /> Preferred Work Style
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Remote', 'Hybrid', 'On-site'].map(style => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setForm({ ...form, workStyle: style })}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                form.workStyle === style
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Expected salary */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                          <DollarSign size={14} strokeWidth={1.75} className="text-primary" /> Expected Salary Range
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['$90k–$120k', '$120k–$150k', '$150k–$200k+'].map(salary => (
                            <button
                              key={salary}
                              type="button"
                              onClick={() => setForm({ ...form, salaryRange: salary })}
                              className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                                form.salaryRange === salary
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30'
                              }`}
                            >
                              {salary}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Relocation */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2">Open to Relocation?</label>
                        <div className="flex gap-4">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                              <input
                                type="radio"
                                name="relocation"
                                checked={form.relocation === opt}
                                onChange={() => setForm({ ...form, relocation: opt })}
                                className="accent-primary w-4 h-4"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Recruiter hiring priority */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                          <Target size={14} strokeWidth={1.75} className="text-accent" /> Key Hiring Priority
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Speed to Hire', 'Technical Depth', 'Cultural Fit', 'Domain Experience'].map(priority => (
                            <button
                              key={priority}
                              type="button"
                              onClick={() => setForm({ ...form, hiringPriority: priority })}
                              className={`py-3 text-xs font-semibold rounded-lg border transition-all ${
                                form.hiringPriority === priority
                                  ? 'bg-accent/15 border-accent text-accent'
                                  : 'bg-muted/20 border-border/30 text-muted-foreground hover:border-accent/30'
                              }`}
                            >
                              {priority}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Work style recruiter */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2">Office Policy</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Remote', 'Hybrid', 'On-site'].map(style => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setForm({ ...form, workStyle: style })}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                form.workStyle === style
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-muted/10 border-t border-border/20 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 group"
              >
                <ArrowLeft size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-x-0.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-all hover:scale-[1.02] shadow shadow-primary/25 group"
              >
                Continue
                <ArrowRight size={14} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:scale-[1.02] transition-all shadow-md shadow-primary/25 disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Saving setup...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-white" />
                    Complete Profile Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
