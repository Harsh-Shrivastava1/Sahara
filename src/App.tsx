import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { HomePage } from './components/HomePage'
import { FeaturesPage } from './components/FeaturesPage'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './components/Dashboard'
import { CommunityAid } from './components/CommunityAid'
import { ReliefMap } from './components/ReliefMap'
import { AiBuddy } from './components/AiBuddy'
import { NGODashboard } from './components/NGODashboard'
import { SentimentAnalysis } from './components/SentimentAnalysis'
import { CommunityStories } from './components/CommunityStories'
import { WellnessPrograms } from './components/WellnessPrograms'
import { AboutPage } from './components/AboutPage'
import { AboutDeveloper } from './components/AboutDeveloper'
import { useAuth } from './hooks/useAuth'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const { user, loading, isGuest } = useAuth()

  const requiresAuth = (view: string) => {
    const authRequiredViews = [
      'dashboard',
      'community-aid',
      'relief-map',
      'ai-buddy',
      'ngo-dashboard',
      'sentiment-analysis',
      'story-wall',
      'wellness-programs'
    ]
    return authRequiredViews.includes(view)
  }

  const showAuthForGuests = (view: string) => {
    if (isGuest && requiresAuth(view)) {
      return <AuthPage />
    }
    return null
  }

  useEffect(() => {
    const handleConfetti = () => {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div')
        confetti.className = 'fixed w-2 h-2 pointer-events-none z-50'
        confetti.style.left = Math.random() * 100 + 'vw'
        confetti.style.backgroundColor = [
          '#ef4444',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ][Math.floor(Math.random() * 5)]
        confetti.style.animation = 'fall 3s linear forwards'
        document.body.appendChild(confetti)

        setTimeout(() => {
          if (document.body.contains(confetti)) {
            document.body.removeChild(confetti)
          }
        }, 3000)
      }
    }

    document.addEventListener('showConfetti', handleConfetti)
    return () => document.removeEventListener('showConfetti', handleConfetti)
  }, [])

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading Sahara...</p>
          </div>
        </div>
      )
    }

    const guestAuthCheck = showAuthForGuests(currentView)
    if (guestAuthCheck) return guestAuthCheck

    if (!user && requiresAuth(currentView)) {
      return <AuthPage />
    }

    switch (currentView) {
      case 'home':
        return <HomePage onContinue={() => setCurrentView('features')} />
      case 'features':
        return <FeaturesPage onFeatureSelect={setCurrentView} />
      case 'auth':
        return <AuthPage />
      case 'about':
        return <AboutPage />
      case 'dashboard':
        return <Dashboard onFeatureSelect={setCurrentView} />
      case 'community-aid':
        return <CommunityAid />
      case 'relief-map':
        return <ReliefMap />
      case 'ai-buddy':
        return <AiBuddy />
      case 'ngo-dashboard':
        return <NGODashboard />
      case 'sentiment-analysis':
        return <SentimentAnalysis />
      case 'story-wall':
        return <CommunityStories />
      case 'wellness-programs':
        return <WellnessPrograms />
      default:
        return <HomePage onContinue={() => setCurrentView('features')} />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
