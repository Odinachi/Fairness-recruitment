import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'applicant' | 'recruiter'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  company?: string
  title?: string
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

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <AppContext.Provider value={{ user, setUser, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
