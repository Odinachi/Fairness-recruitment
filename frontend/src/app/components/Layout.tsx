import { ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, Briefcase, FileText, Sparkles, MessageSquare,
  Bell, Bookmark, UserCircle, Settings, LogOut, Users, BarChart3,
  Moon, Sun, Menu, X, ChevronRight, Search, Zap, Building2,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.FC<{ size?: number; className?: string }>
  path: string
  badge?: number
}

const applicantNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/applicant' },
  { label: 'Job Feed', icon: Briefcase, path: '/jobs' },
  { label: 'Applications', icon: FileText, path: '/app/applicant' },
  { label: 'AI Matches', icon: Sparkles, path: '/ai', badge: 12 },
  { label: 'Messages', icon: MessageSquare, path: '/messages', badge: 3 },
  { label: 'Notifications', icon: Bell, path: '/notifications', badge: 5 },
  { label: 'Saved Jobs', icon: Bookmark, path: '/jobs' },
  { label: 'Profile', icon: UserCircle, path: '/profile/me' },
]

const recruiterNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/recruiter' },
  { label: 'Job Postings', icon: Briefcase, path: '/jobs' },
  { label: 'Candidates', icon: Users, path: '/profile/1' },
  { label: 'AI Rankings', icon: Sparkles, path: '/ai', badge: 8 },
  { label: 'Messages', icon: MessageSquare, path: '/messages', badge: 2 },
  { label: 'Analytics', icon: BarChart3, path: '/app/recruiter' },
  { label: 'Notifications', icon: Bell, path: '/notifications', badge: 4 },
  { label: 'Company', icon: Building2, path: '/app/recruiter' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { user, setUser, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchFocused, setSearchFocused] = useState(false)

  const nav = user?.role === 'recruiter' ? recruiterNav : applicantNav

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden lg:w-16'}
          bg-sidebar border-r border-sidebar-border`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="font-bold text-sidebar-foreground whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Jobnatics <span className="text-primary">AI</span>
              </span>
            </div>
          )}
        </div>

        {/* User role badge */}
        {sidebarOpen && user && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary capitalize">{user.role} Account</span>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                    ${active
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent'
                    }`}
                >
                  <Icon size={18} className={`flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Settings size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
          {sidebarOpen && user && (
            <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-lg bg-sidebar-accent">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Search */}
          <div className={`flex-1 max-w-md relative transition-all duration-200 ${searchFocused ? 'max-w-xl' : ''}`}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs, candidates, companies..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground transition-all"
            />
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl p-2 z-50">
                <p className="text-xs text-muted-foreground px-2 py-1">Recent searches</p>
                {['Senior React Engineer', 'Remote Frontend', 'Stripe careers'].map(s => (
                  <div key={s} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                    <Search size={14} className="text-muted-foreground" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>

            {user && (
              <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/30" />
                <span className="text-sm font-medium hidden sm:block">{user.name.split(' ')[0]}</span>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
