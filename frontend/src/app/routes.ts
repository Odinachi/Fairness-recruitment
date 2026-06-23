import { createHashRouter, redirect } from 'react-router'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { ApplicantDashboard } from './components/ApplicantDashboard'
import { RecruiterDashboard } from './components/RecruiterDashboard'
import { JobListings } from './components/JobListings'
import { JobDetails } from './components/JobDetails'
import { Messaging } from './components/Messaging'
import { Notifications } from './components/Notifications'
import { AIRecommendations } from './components/AIRecommendations'
import { CandidateProfile } from './components/CandidateProfile'
import { CompanyProfile } from './components/CompanyProfile'
import { Settings } from './components/Settings'

export const router = createHashRouter([
  { path: '/', Component: LandingPage },
  { path: '/auth', Component: AuthPage },
  { path: '/app/applicant', Component: ApplicantDashboard },
  { path: '/app/recruiter', Component: RecruiterDashboard },
  { path: '/jobs', Component: JobListings },
  { path: '/jobs/:id', Component: JobDetails },
  { path: '/messages', Component: Messaging },
  { path: '/notifications', Component: Notifications },
  { path: '/ai', Component: AIRecommendations },
  { path: '/profile/:id', Component: CandidateProfile },
  { path: '/company/:id', Component: CompanyProfile },
  { path: '/settings', Component: Settings },
  { path: '*', loader: () => redirect('/') },
])
