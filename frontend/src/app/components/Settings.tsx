import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  User, Globe, Moon, Sun, Save, CheckCircle2, Sparkles,
  ChevronRight, Zap, Upload
} from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function Settings() {
  const { user, setUser, darkMode, toggleDarkMode } = useApp()
  const [saved, setSaved] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
  })

  const [aiSettings, setAiSettings] = useState({
    workStyle: user?.workStyle || 'Remote',
    roleLevel: user?.roleLevel || 'Senior',
    salaryRange: user?.salaryRange || '$120k–$150k',
    relocation: user?.relocation || 'No',
    hiringPriority: user?.hiringPriority || 'Technical Depth',
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        company: user.company || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
      })
      setAiSettings({
        workStyle: user.workStyle || 'Remote',
        roleLevel: user.roleLevel || 'Senior',
        salaryRange: user.salaryRange || '$120k–$150k',
        relocation: user.relocation || 'No',
        hiringPriority: user.hiringPriority || 'Technical Depth',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return

    const updatedProfile = {
      role: user.role,
      avatar: user.avatar,
      title: profileForm.title,
      company: profileForm.company,
      location: profileForm.location,
      bio: profileForm.bio,
      website: profileForm.website,
      linkedin: profileForm.linkedin,
      github: user.role === 'applicant' ? profileForm.github : undefined,
      workStyle: aiSettings.workStyle,
      roleLevel: aiSettings.roleLevel,
      salaryRange: user.role === 'applicant' ? aiSettings.salaryRange : undefined,
      relocation: user.role === 'applicant' ? aiSettings.relocation : undefined,
      hiringPriority: user.role === 'recruiter' ? aiSettings.hiringPriority : undefined,
      profileSetupCompleted: true,
    }

    try {
      await setDoc(doc(db, 'users', user.id), {
        name: user.name,
        email: user.email,
        ...updatedProfile
      }, { merge: true })
    } catch (err) {
      console.error('Error saving settings to Firestore:', err)
      toast.error('Failed to update settings in database.')
      return
    }

    // Save details to LocalStorage under user uid
    localStorage.setItem(`jobnatics_profile_${user.id}`, JSON.stringify(updatedProfile))

    // Update global app state
    setUser({
      ...user,
      name: user.name,
      email: user.email,
      title: profileForm.title,
      company: profileForm.company,
      location: profileForm.location,
      bio: profileForm.bio,
      website: profileForm.website,
      linkedin: profileForm.linkedin,
      github: updatedProfile.github,
      workStyle: updatedProfile.workStyle,
      roleLevel: updatedProfile.roleLevel,
      salaryRange: updatedProfile.salaryRange,
      relocation: updatedProfile.relocation,
      hiringPriority: updatedProfile.hiringPriority,
    })

    setSaved(true)
    toast.success('Settings updated successfully!')
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
                { label: 'Full Name', key: 'name', type: 'text', disabled: true },
                { label: 'Email Address', key: 'email', type: 'email', disabled: true },
                { label: 'Job Title', key: 'title', type: 'text' },
                { label: 'Company', key: 'company', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
                { label: 'Website', key: 'website', type: 'url' },
                ...(user?.role === 'applicant' ? [{ label: 'GitHub Profile', key: 'github', type: 'url' }] : []),
                { label: 'LinkedIn Profile', key: 'linkedin', type: 'url' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={profileForm[field.key as keyof typeof profileForm] || ''}
                    onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                    disabled={field.disabled}
                    className={`w-full px-3 py-2 rounded-lg border text-xs transition-all text-foreground ${
                      field.disabled
                        ? 'bg-muted/40 border-border/20 opacity-60 cursor-not-allowed'
                        : 'bg-muted/20 border-border/30 focus:outline-none focus:border-primary'
                    }`}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all resize-none leading-normal text-foreground"
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Preferred Work Style</label>
                <select
                  value={aiSettings.workStyle}
                  onChange={e => setAiSettings({ ...aiSettings, workStyle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all text-foreground"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Target Role Level</label>
                <select
                  value={aiSettings.roleLevel}
                  onChange={e => setAiSettings({ ...aiSettings, roleLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all text-foreground"
                >
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              {user?.role === 'applicant' ? (
                <>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Expected Salary Range</label>
                    <select
                      value={aiSettings.salaryRange}
                      onChange={e => setAiSettings({ ...aiSettings, salaryRange: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all text-foreground"
                    >
                      <option value="$80k–$100k">$80k – $100k</option>
                      <option value="$100k–$120k">$100k – $120k</option>
                      <option value="$120k–$150k">$120k – $150k</option>
                      <option value="$150k–$180k">$150k – $180k</option>
                      <option value="$180k–$220k">$180k – $220k</option>
                      <option value="$220k+">$220k+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Open to Relocation</label>
                    <select
                      value={aiSettings.relocation}
                      onChange={e => setAiSettings({ ...aiSettings, relocation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all text-foreground"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Hiring Priority</label>
                  <select
                    value={aiSettings.hiringPriority}
                    onChange={e => setAiSettings({ ...aiSettings, hiringPriority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/30 focus:outline-none focus:border-primary text-xs transition-all text-foreground"
                  >
                    <option value="Technical Depth">Technical Depth</option>
                    <option value="Culture Fit">Culture Fit</option>
                    <option value="Delivery Speed">Delivery Speed</option>
                    <option value="Cost Efficiency">Cost Efficiency</option>
                  </select>
                </div>
              )}
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
