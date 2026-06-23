import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  User, Bell, Shield, CreditCard, Globe, Moon, Sun, Eye, EyeOff,
  Save, CheckCircle2, Sparkles, Trash2, LogOut, ChevronRight,
  Zap, Mail, MessageSquare, Star,
} from 'lucide-react'
import { motion } from 'motion/react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export function Settings() {
  const { user, setUser, darkMode, toggleDarkMode } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    company: user?.company || '',
    location: 'San Francisco, CA',
    bio: 'Senior frontend engineer with 7 years of experience building scalable web applications.',
    website: 'https://portfolio.dev',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
  })

  const [notifSettings, setNotifSettings] = useState({
    jobMatches: true,
    messages: true,
    applications: true,
    interviews: true,
    weeklyDigest: false,
    pushNotifications: true,
    emailNotifications: true,
    matchThreshold: 80,
  })

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account, notifications, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}

            <div className="pt-4 mt-4 border-t border-border space-y-1">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                  Dark Mode
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-10 h-5 rounded-full transition-all relative ${darkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">
            {activeTab === 'profile' && (
              <>
                {/* Avatar */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Profile Photo</h2>
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20"
                    />
                    <div>
                      <button className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors mb-2 block">
                        Change photo
                      </button>
                      <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Personal info */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text' },
                      { label: 'Email Address', key: 'email', type: 'email' },
                      { label: 'Job Title', key: 'title', type: 'text' },
                      { label: 'Company', key: 'company', type: 'text' },
                      { label: 'Location', key: 'location', type: 'text' },
                      { label: 'Website', key: 'website', type: 'url' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          value={profileForm[field.key as keyof typeof profileForm]}
                          onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm transition-all"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Bio</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* AI Profile */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-primary" />
                    <h2 className="font-semibold">AI Profile Settings</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Preferred Work Style', value: 'Remote / Hybrid' },
                      { label: 'Target Role Level', value: 'Senior / Staff' },
                      { label: 'Expected Salary Range', value: '$160k–$220k' },
                      { label: 'Open to Relocation', value: 'Yes (SF Bay Area)' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                          {item.value} <ChevronRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                    saved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                  }`}
                >
                  {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
              </>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'jobMatches', label: 'New Job Matches', desc: 'Get notified when AI finds high-match opportunities', icon: Sparkles },
                      { key: 'messages', label: 'Messages', desc: 'New messages from recruiters and candidates', icon: MessageSquare },
                      { key: 'applications', label: 'Application Updates', desc: 'Status changes on your applications', icon: Zap },
                      { key: 'interviews', label: 'Interview Reminders', desc: 'Reminders before scheduled interviews', icon: Star },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity and new opportunities', icon: Mail },
                    ].map(item => {
                      const Icon = item.icon
                      const value = notifSettings[item.key as keyof typeof notifSettings] as boolean
                      return (
                        <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon size={15} className="text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !value }))}
                            className={`flex-shrink-0 w-10 h-5 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">AI Match Threshold</h2>
                  <p className="text-sm text-muted-foreground mb-4">Only notify me about jobs with AI match score above:</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={notifSettings.matchThreshold}
                      onChange={e => setNotifSettings(prev => ({ ...prev, matchThreshold: parseInt(e.target.value) }))}
                      className="flex-1 accent-primary"
                    />
                    <span className="font-bold text-primary min-w-12 text-center" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {notifSettings.matchThreshold}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Profile Visibility</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Profile visible to recruiters', desc: 'Let recruiters find and view your profile' },
                      { label: 'Show in AI matching pool', desc: 'Allow AI to match you with relevant opportunities' },
                      { label: 'Display current employer', desc: 'Show your current workplace on your profile' },
                      { label: 'Anonymous mode', desc: 'Hide your identity until you choose to reveal it' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                        <button className="flex-shrink-0 w-10 h-5 rounded-full bg-primary relative">
                          <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-red-500/10">
                  <h2 className="font-semibold text-destructive mb-3">Danger Zone</h2>
                  <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone.</p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 size={16} /> Delete Account
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">
                      <LogOut size={16} /> Sign Out All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-card border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-primary" />
                        <h2 className="font-semibold">Pro Plan</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">Your subscription renews on July 3, 2026</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>$29</div>
                      <div className="text-xs text-muted-foreground">/month</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Unlimited AI matches', 'AI cover letters', 'Interview prep', 'Priority support'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Payment Method</h2>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 border border-border mb-3">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <CreditCard size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Visa ending in 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/28</div>
                    </div>
                    <button className="text-xs text-primary hover:underline">Change</button>
                  </div>
                  <button className="text-sm text-primary hover:underline">+ Add payment method</button>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="font-semibold mb-4">Billing History</h2>
                  <div className="space-y-2">
                    {[
                      { date: 'Jun 3, 2026', amount: '$29.00', status: 'Paid' },
                      { date: 'May 3, 2026', amount: '$29.00', status: 'Paid' },
                      { date: 'Apr 3, 2026', amount: '$29.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{invoice.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{invoice.status}</span>
                          <span className="text-sm font-medium">{invoice.amount}</span>
                          <button className="text-xs text-primary hover:underline">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
