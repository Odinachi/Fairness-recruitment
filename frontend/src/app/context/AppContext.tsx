import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export type UserRole = 'applicant' | 'recruiter'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  company?: string
  title?: string
  profileSetupCompleted?: boolean
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  darkMode: boolean
  toggleDarkMode: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  darkMode: true,
  toggleDarkMode: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Retrieve custom fields from LocalStorage
        const cachedProfile = localStorage.getItem(`jobnatics_profile_${firebaseUser.uid}`)
        let profile = cachedProfile ? JSON.parse(cachedProfile) : null
        
        if (!profile) {
          // Default fallback if cache is missing
          profile = {
            role: 'applicant',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
            title: 'Senior Frontend Engineer',
            profileSetupCompleted: false,
          }
        }
        
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: profile.role,
          avatar: profile.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
          company: profile.company,
          title: profile.title,
          profileSetupCompleted: !!profile.profileSetupCompleted,
        })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <AppContext.Provider value={{ user, setUser, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

