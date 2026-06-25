import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  User, Globe, Moon, Sun, Save, CheckCircle2, Sparkles,
  ChevronRight, Zap, Upload
} from 'lucide-react'
import { motion } from 'motion/react'

export function Settings() {
  const { user, darkMode, toggleDarkMode } = useApp()
  const [saved, setSaved] = useState(false)

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

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-border/30">
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="p-5 rounded-xl bg-card border border-border/30">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Profile Photo</h2>
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'}
                alt="Avatar"
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20"
              />
              <div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors mb-1.5 group">
                  <Upload size={12} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-y-0.5 text-muted-foreground group-hover:text-foreground" />
                  Change photo
                </button>
                <p className="text-[10px] text-muted-foreground">JPG, GIF or PNG. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="p-5 rounded-xl bg-card border border-border/30">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
                { label: 'Job Title', key: 'title', type: 'text' },
                { label: 'Company', key: 'company', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
                { label: 'Website', key: 'website', type: 'url' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={profileForm[field.key as keyof typeof profileForm]}
                    onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all resize-none leading-normal"
                />
              </div>
            </div>
          </div>

          {/* AI Profile */}
          <div className="p-5 rounded-xl bg-card border border-border/30">
            <div className="flex items-center gap-1.5 mb-4 group cursor-default">
              <Sparkles size={14} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary transition-transform duration-300 group-hover:scale-110 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI Profile Settings</h2>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Preferred Work Style', value: 'Remote / Hybrid' },
                { label: 'Target Role Level', value: 'Senior / Staff' },
                { label: 'Expected Salary Range', value: '$160k–$220k' },
                { label: 'Open to Relocation', value: 'Yes (SF Bay Area)' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <button className="flex items-center gap-1 text-xs font-semibold hover:text-primary transition-colors text-foreground group/btn">
                    {item.value} <ChevronRight size={12} strokeWidth={1.75} className="text-muted-foreground group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences (Dark Mode) */}
          <div className="p-5 rounded-xl bg-card border border-border/30">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Preferences</h2>
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-semibold text-foreground">Dark Mode Interface</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Toggle between dark and light themes</div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-10 h-5 rounded-full transition-all relative ${darkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4 border-t border-border/20">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 group ${
                saved
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-sm'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={14} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="animate-bounce" />
                  Saved Changes!
                </>
              ) : (
                <>
                  <Save size={14} strokeWidth={1.75} className="transition-transform duration-300 group-hover:scale-110" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
