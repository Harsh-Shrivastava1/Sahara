import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'
import { Heart, Shield, User, LogOut, Info, Code } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NavbarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { user, profile, signOut, isGuest } = useAuth()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onViewChange('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Sahara
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant={currentView === 'home' ? 'gradient' : 'ghost'}
              onClick={() => onViewChange('home')}
              className="text-sm"
            >
              Home
            </Button>
            <Button
              variant={currentView === 'features' ? 'gradient' : 'ghost'}
              onClick={() => onViewChange('features')}
              className="text-sm"
            >
              Features
            </Button>
            <Button
              variant={currentView === 'about' ? 'gradient' : 'ghost'}
              onClick={() => onViewChange('about')}
              className="text-sm"
            >
              <Info className="w-4 h-4 mr-1" />
              About
            </Button>
            {user && (
              <Button
                variant={currentView === 'dashboard' ? 'gradient' : 'ghost'}
                onClick={() => onViewChange('dashboard')}
                className="text-sm"
              >
                Dashboard
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border ${
                  isGuest 
                    ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    isGuest 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                      : 'bg-gradient-to-r from-green-400 to-blue-500'
                  }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">
                      {isGuest ? 'Guest User' : profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {isGuest ? 'Guest' : profile?.role || profile?.user_type || 'Member'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="gradient"
                onClick={() => onViewChange('auth')}
                className="text-sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}