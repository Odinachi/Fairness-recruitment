import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  doc,
  setDoc,
  getDocs,
  limit,
  query,
  onSnapshot
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import {
  jobs as initialJobs,
  candidates as initialCandidates,
  conversations as initialConversations,
  messages as initialMessages,
  notifications as initialNotifications,
  applicantApplications as initialApplicantApplications,
  applicationChartData as initialApplicationChartData,
  recruiterHiringData as initialRecruiterHiringData,
  recruiterJobPostings as initialRecruiterJobPostings,
  sourceData as initialSourceData,
  monthlyHireData as initialMonthlyHireData,
  Job,
  Candidate,
  Conversation,
  Message,
  Notification
} from '../data/mockData'

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
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  workStyle?: string
  roleLevel?: string
  salaryRange?: string
  relocation?: string
  hiringPriority?: string
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  darkMode: boolean
  toggleDarkMode: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Data states
  jobs: Job[]
  candidates: Candidate[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  notifications: Notification[]
  applicantApplications: any[]
  applicationChartData: any[]
  recruiterHiringData: any[]
  recruiterJobPostings: any[]
  sourceData: any[]
  monthlyHireData: any[]
  loadingData: boolean

  // Mutators
  addMessage: (msg: Message) => Promise<void>
  updateConversationLastMessage: (convId: string, lastMessage: string, lastMessageTime: string) => Promise<void>
  addApplicantApplication: (app: any) => Promise<void>
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  darkMode: true,
  toggleDarkMode: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},

  jobs: initialJobs,
  candidates: initialCandidates,
  conversations: initialConversations,
  messages: initialMessages,
  notifications: initialNotifications,
  applicantApplications: initialApplicantApplications,
  applicationChartData: initialApplicationChartData,
  recruiterHiringData: initialRecruiterHiringData,
  recruiterJobPostings: initialRecruiterJobPostings,
  sourceData: initialSourceData,
  monthlyHireData: initialMonthlyHireData,
  loadingData: true,

  addMessage: async () => {},
  updateConversationLastMessage: async () => {},
  addApplicantApplication: async () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Firestore DB states initialized with initial mock values
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [applicantApplications, setApplicantApplications] = useState<any[]>(initialApplicantApplications)
  const [applicationChartData, setApplicationChartData] = useState<any[]>(initialApplicationChartData)
  const [recruiterHiringData, setRecruiterHiringData] = useState<any[]>(initialRecruiterHiringData)
  const [recruiterJobPostings, setRecruiterJobPostings] = useState<any[]>(initialRecruiterJobPostings)
  const [sourceData, setSourceData] = useState<any[]>(initialSourceData)
  const [monthlyHireData, setMonthlyHireData] = useState<any[]>(initialMonthlyHireData)
  const [loadingData, setLoadingData] = useState<boolean>(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const [bootstrapped, setBootstrapped] = useState(false)

  // Bootstrap database if empty and user is logged in
  useEffect(() => {
    if (!user || bootstrapped) return

    const bootstrapFirestore = async () => {
      try {
        const jobsSnap = await getDocs(query(collection(db, 'jobs'), limit(1)))
        if (jobsSnap.empty) {
          console.log('Firestore is empty. Bootstrapping database from mockData...')
          setBootstrapped(true) // prevent double runs

          const promises: Promise<any>[] = []

          initialJobs.forEach(job => {
            promises.push(setDoc(doc(db, 'jobs', job.id), job))
          })

          initialCandidates.forEach(cand => {
            promises.push(setDoc(doc(db, 'candidates', cand.id), cand))
          })

          initialConversations.forEach(conv => {
            promises.push(setDoc(doc(db, 'conversations', conv.id), conv))
          })

          Object.keys(initialMessages).forEach(convId => {
            initialMessages[convId].forEach(msg => {
              promises.push(setDoc(doc(db, 'messages', msg.id), msg))
            })
          })

          initialNotifications.forEach(notif => {
            promises.push(setDoc(doc(db, 'notifications', notif.id), notif))
          })

          initialApplicantApplications.forEach(appItem => {
            promises.push(setDoc(doc(db, 'applicantApplications', appItem.id), appItem))
          })

          initialApplicationChartData.forEach((item, index) => {
            promises.push(setDoc(doc(db, 'applicationChartData', `chart_data_${index}`), item))
          })

          initialRecruiterHiringData.forEach((item, index) => {
            promises.push(setDoc(doc(db, 'recruiterHiringData', `hiring_data_${index}`), item))
          })

          initialRecruiterJobPostings.forEach(item => {
            promises.push(setDoc(doc(db, 'recruiterJobPostings', item.id), item))
          })

          initialSourceData.forEach((item, index) => {
            promises.push(setDoc(doc(db, 'sourceData', `source_data_${index}`), item))
          })

          initialMonthlyHireData.forEach((item, index) => {
            promises.push(setDoc(doc(db, 'monthlyHireData', `monthly_hire_data_${index}`), item))
          })

          await Promise.all(promises)
          console.log('Database successfully bootstrapped in Firestore!')
        } else {
          setBootstrapped(true)
        }
      } catch (err) {
        console.error('Error bootstrapping Firestore:', err)
      } finally {
        setLoadingData(false)
      }
    }

    bootstrapFirestore()
  }, [user, bootstrapped])

  // Listen to Firestore real-time updates when user is authenticated
  useEffect(() => {
    if (!user) {
      // Clear data to initial mock values or empty when logged out
      setJobs(initialJobs)
      setCandidates(initialCandidates)
      setConversations(initialConversations)
      setMessages(initialMessages)
      setNotifications(initialNotifications)
      setApplicantApplications(initialApplicantApplications)
      setApplicationChartData(initialApplicationChartData)
      setRecruiterHiringData(initialRecruiterHiringData)
      setRecruiterJobPostings(initialRecruiterJobPostings)
      setSourceData(initialSourceData)
      setMonthlyHireData(initialMonthlyHireData)
      setLoadingData(false)
      return
    }

    console.log('User authenticated. Starting real-time Firestore listeners...')
    setLoadingData(true)

    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const list: Job[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Job)
      })
      if (list.length > 0) setJobs(list)
      setLoadingData(false)
    }, err => {
      console.error('Error listening to jobs:', err)
      setLoadingData(false)
    })

    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const list: Candidate[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Candidate)
      })
      if (list.length > 0) setCandidates(list)
    }, err => console.error('Error listening to candidates:', err))

    const unsubConversations = onSnapshot(collection(db, 'conversations'), (snapshot) => {
      const list: Conversation[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Conversation)
      })
      if (list.length > 0) setConversations(list)
    }, err => console.error('Error listening to conversations:', err))

    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const map: Record<string, Message[]> = {}
      snapshot.forEach(docSnap => {
        const msg = docSnap.data() as Message
        if (!map[msg.conversationId]) {
          map[msg.conversationId] = []
        }
        map[msg.conversationId].push({ ...msg, id: docSnap.id })
      })

      // Sort messages by timestamp
      Object.keys(map).forEach(convId => {
        map[convId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      })

      if (Object.keys(map).length > 0) setMessages(map)
    }, err => console.error('Error listening to messages:', err))

    const unsubNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const list: Notification[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Notification)
      })
      if (list.length > 0) setNotifications(list)
    }, err => console.error('Error listening to notifications:', err))

    const unsubApplicantApplications = onSnapshot(collection(db, 'applicantApplications'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id })
      })
      if (list.length > 0) setApplicantApplications(list)
    }, err => console.error('Error listening to applicantApplications:', err))

    const unsubApplicationChartData = onSnapshot(collection(db, 'applicationChartData'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push(docSnap.data())
      })
      if (list.length > 0) setApplicationChartData(list)
    }, err => console.error('Error listening to applicationChartData:', err))

    const unsubRecruiterHiringData = onSnapshot(collection(db, 'recruiterHiringData'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push(docSnap.data())
      })
      if (list.length > 0) setRecruiterHiringData(list)
    }, err => console.error('Error listening to recruiterHiringData:', err))

    const unsubRecruiterJobPostings = onSnapshot(collection(db, 'recruiterJobPostings'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id })
      })
      if (list.length > 0) setRecruiterJobPostings(list)
    }, err => console.error('Error listening to recruiterJobPostings:', err))

    const unsubSourceData = onSnapshot(collection(db, 'sourceData'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push(docSnap.data())
      })
      if (list.length > 0) setSourceData(list)
    }, err => console.error('Error listening to sourceData:', err))

    const unsubMonthlyHireData = onSnapshot(collection(db, 'monthlyHireData'), (snapshot) => {
      const list: any[] = []
      snapshot.forEach(docSnap => {
        list.push(docSnap.data())
      })
      if (list.length > 0) setMonthlyHireData(list)
    }, err => console.error('Error listening to monthlyHireData:', err))

    return () => {
      console.log('User unauthenticated or changed. Cleaning up Firestore listeners...')
      unsubJobs()
      unsubCandidates()
      unsubConversations()
      unsubMessages()
      unsubNotifications()
      unsubApplicantApplications()
      unsubApplicationChartData()
      unsubRecruiterHiringData()
      unsubRecruiterJobPostings()
      unsubSourceData()
      unsubMonthlyHireData()
    }
  }, [user])

  // Firebase auth state listener
  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous user document listener if any
      if (unsubUserDoc) {
        unsubUserDoc()
        unsubUserDoc = null
      }

      if (firebaseUser) {
        // First, check if there is a local cache to avoid flash of un-onboarded state while loading
        const cachedProfile = localStorage.getItem(`jobnatics_profile_${firebaseUser.uid}`)
        if (cachedProfile) {
          try {
            const profile = JSON.parse(cachedProfile)
            setUser({
              id: firebaseUser.uid,
              name: profile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: profile.role || 'applicant',
              avatar: profile.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
              company: profile.company,
              title: profile.title,
              profileSetupCompleted: !!profile.profileSetupCompleted,
              bio: profile.bio || '',
              location: profile.location || '',
              website: profile.website || '',
              linkedin: profile.linkedin || '',
              github: profile.github || '',
              workStyle: profile.workStyle || 'Remote',
              roleLevel: profile.roleLevel || 'Senior',
              salaryRange: profile.salaryRange || '$120k–$150k',
              relocation: profile.relocation || 'No',
              hiringPriority: profile.hiringPriority || 'Technical Depth',
            })
          } catch (e) {
            console.error('Error parsing cached profile:', e)
          }
        }

        // Set up real-time listener on user doc
        unsubUserDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data()
            const updatedUser = {
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: data.role || 'applicant',
              avatar: data.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
              company: data.company,
              title: data.title,
              profileSetupCompleted: !!data.profileSetupCompleted,
              bio: data.bio || '',
              location: data.location || '',
              website: data.website || '',
              linkedin: data.linkedin || '',
              github: data.github || '',
              workStyle: data.workStyle || 'Remote',
              roleLevel: data.roleLevel || 'Senior',
              salaryRange: data.salaryRange || '$120k–$150k',
              relocation: data.relocation || 'No',
              hiringPriority: data.hiringPriority || 'Technical Depth',
            }
            setUser(updatedUser)
            // Update LocalStorage cache
            localStorage.setItem(`jobnatics_profile_${firebaseUser.uid}`, JSON.stringify(updatedUser))
          } else {
            // User doc does not exist in Firestore yet (e.g. newly signed up or database is cleared)
            // Retrieve from LocalStorage or create defaults, then save to Firestore
            const cachedProfile = localStorage.getItem(`jobnatics_profile_${firebaseUser.uid}`)
            let profile = cachedProfile ? null : null
            try {
              profile = cachedProfile ? JSON.parse(cachedProfile) : null
            } catch (e) {
              console.error('Error parsing cached profile during init:', e)
            }
            if (!profile) {
              profile = {
                role: 'applicant',
                avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
                title: 'Senior Frontend Engineer',
                profileSetupCompleted: false,
              }
            }
            const initialUser = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: profile.role,
              avatar: profile.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
              company: profile.company,
              title: profile.title,
              profileSetupCompleted: !!profile.profileSetupCompleted,
              bio: profile.bio || '',
              location: profile.location || '',
              website: profile.website || '',
              linkedin: profile.linkedin || '',
              github: profile.github || '',
              workStyle: profile.workStyle || 'Remote',
              roleLevel: profile.roleLevel || 'Senior',
              salaryRange: profile.salaryRange || '$120k–$150k',
              relocation: profile.relocation || 'No',
              hiringPriority: profile.hiringPriority || 'Technical Depth',
            }
            setUser({ id: firebaseUser.uid, ...initialUser })
            
            // Create user document in Firestore
            setDoc(doc(db, 'users', firebaseUser.uid), initialUser)
              .catch(err => console.error('Error initializing user doc in Firestore:', err))
          }
        }, (error) => {
          console.error('Error in user doc snapshot listener:', error)
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubUserDoc) {
        unsubUserDoc()
      }
    }
  }, [])

  const addMessage = async (msg: Message) => {
    try {
      await setDoc(doc(db, 'messages', msg.id), msg)
    } catch (err) {
      console.error('Error adding message to Firestore:', err)
    }
  }

  const updateConversationLastMessage = async (convId: string, lastMessage: string, lastMessageTime: string) => {
    try {
      await setDoc(doc(db, 'conversations', convId), { lastMessage, lastMessageTime }, { merge: true })
    } catch (err) {
      console.error('Error updating conversation in Firestore:', err)
    }
  }

  const addApplicantApplication = async (app: any) => {
    try {
      await setDoc(doc(db, 'applicantApplications', app.id), app)
    } catch (err) {
      console.error('Error adding application to Firestore:', err)
    }
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <AppContext.Provider value={{
      user, setUser, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen,
      jobs, candidates, conversations, messages, notifications,
      applicantApplications, applicationChartData, recruiterHiringData,
      recruiterJobPostings, sourceData, monthlyHireData, loadingData,
      addMessage, updateConversationLastMessage, addApplicantApplication
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

