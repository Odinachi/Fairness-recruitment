import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useApp, User } from '../context/AppContext'
import { Zap, Eye, EyeOff, ArrowLeft, Sparkles, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type Mode = 'signin' | 'signup'
type Role = 'applicant' | 'recruiter'

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser, darkMode } = useApp()

  const [mode, setMode] = useState<Mode>('signup')
  const [role, setRole] = useState<Role>(searchParams.get('role') === 'recruiter' ? 'recruiter' : 'applicant')
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    title: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup' && step === 1) {
      setStep(2)
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const user: User = {
      id: '1',
      name: form.name || (role === 'recruiter' ? 'Alex Rivera' : 'Jordan Lee'),
      email: form.email || (role === 'recruiter' ? 'alex@techcorp.ai' : 'jordan@email.com'),
      role,
      avatar: role === 'recruiter'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      company: form.company || (role === 'recruiter' ? 'TechCorp AI' : undefined),
      title: form.title || (role === 'applicant' ? 'Senior Frontend Engineer' : 'Head of Talent'),
    }

    setUser(user)
    navigate(role === 'recruiter' ? '/app/recruiter' : '/app/applicant')
  }

  const demoLogin = async (demoRole: Role) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const user: User = {
      id: '1',
      name: demoRole === 'recruiter' ? 'Alex Rivera' : 'Jordan Lee',
      email: demoRole === 'recruiter' ? 'alex@techcorp.ai' : 'jordan@email.com',
      role: demoRole,
      avatar: demoRole === 'recruiter'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      company: demoRole === 'recruiter' ? 'TechCorp AI' : undefined,
      title: demoRole === 'applicant' ? 'Senior Frontend Engineer' : 'Head of Talent',
    }

    setUser(user)
    navigate(demoRole === 'recruiter' ? '/app/recruiter' : '/app/applicant')
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#07091a] via-[#0d1228] to-[#070918] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col p-12 w-full">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-16">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to home</span>
          </button>

          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Jobnatics <span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 }}>
              {role === 'applicant'
                ? 'Your next opportunity\nis waiting'
                : 'Find exceptional\ntalent, faster'
              }
            </h2>
            <p className="text-white/60 mb-12 leading-relaxed">
              {role === 'applicant'
                ? 'AI matches you to jobs that fit your skills, experience, and career goals. Stop browsing, start discovering.'
                : 'AI ranks every applicant by fit. Your perfect shortlist is ready before you even open your inbox.'
              }
            </p>

            <div className="space-y-4">
              {(role === 'applicant' ? [
                'AI analyzes your resume in seconds',
                'Personalized job feed ranked by match %',
                'One-click applications with AI cover letters',
                'Interview prep powered by real interview data',
              ] : [
                'AI ranks all applicants automatically',
                'Reduce time-to-hire by up to 60%',
                'Bias-free candidate screening',
                'Deep analytics on your hiring pipeline',
              ]).map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mt-12">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face"
              alt="Testimonial"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <div>
              <p className="text-xs text-white/80">"Landed my dream job at Stripe in 2 weeks."</p>
              <p className="text-xs text-white/40 mt-0.5">Maya Patel, Senior Engineer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Jobnatics <span className="text-primary">AI</span>
            </span>
          </div>

          {/* Mode tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setStep(1) }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">I am a...</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole('applicant')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'applicant'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <Sparkles size={20} />
                <span className="text-sm font-medium">Job Seeker</span>
                <span className="text-xs opacity-70">Find opportunities</span>
              </button>
              <button
                onClick={() => setRole('recruiter')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'recruiter'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <Users size={20} />
                <span className="text-sm font-medium">Recruiter</span>
                <span className="text-xs opacity-70">Hire talent</span>
              </button>
            </div>
          </div>

          {/* Demo quick login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => demoLogin('applicant')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <Sparkles size={14} />
              Demo: Applicant
            </button>
            <button
              onClick={() => demoLogin('recruiter')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-accent/30 bg-accent/5 text-accent text-sm font-medium hover:bg-accent/10 transition-colors disabled:opacity-50"
            >
              <Users size={14} />
              Demo: Recruiter
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {(mode === 'signup' && step === 1) || mode === 'signin' ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jordan Lee"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {role === 'recruiter' ? 'Company Name' : 'Current/Desired Job Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={role === 'recruiter' ? 'TechCorp AI' : 'Senior Frontend Engineer'}
                      value={role === 'recruiter' ? form.company : form.title}
                      onChange={e => role === 'recruiter' ? setForm({ ...form, company: e.target.value }) : setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-primary" />
                      <span className="text-sm font-medium text-primary">AI Profile Setup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      After signing up, our AI will analyze your {role === 'recruiter' ? 'company and job requirements' : 'resume and career history'} to create your intelligent profile.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'signup' && step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Setting up your AI profile...</span>
                </>
              ) : (
                <>
                  {mode === 'signup' ? (step === 1 ? 'Continue' : 'Create Account') : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {mode === 'signin' && (
              <button type="button" className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                Forgot your password?
              </button>
            )}
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
