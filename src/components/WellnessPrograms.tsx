import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { 
  Sparkles, Heart, Brain, Activity, Moon, 
  Sun, Zap, Target, CheckCircle, Play
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { generateAIResponse } from '../lib/groq'

interface Program {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  icon: React.ComponentType<any>
  color: string
  activities: string[]
}

export function WellnessPrograms() {
  const { profile, isGuest } = useAuth()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string>('')

  useEffect(() => {
    generatePrograms()
    if (profile && !isGuest) {
      generatePersonalizedSuggestions()
    }
  }, [profile])

  const generatePrograms = async () => {
    const basePrograms: Program[] = [
      {
        id: '1',
        title: 'Morning Mindfulness',
        description: 'Start your day with peace and clarity through guided meditation and breathing exercises.',
        duration: '10-15 minutes',
        difficulty: 'Beginner',
        category: 'Meditation',
        icon: Sun,
        color: 'text-yellow-500',
        activities: [
          'Deep breathing exercises',
          'Gratitude journaling',
          'Mindful stretching',
          'Positive affirmations'
        ]
      },
      {
        id: '2',
        title: 'Stress Relief Toolkit',
        description: 'Evidence-based techniques to manage stress and anxiety in daily life.',
        duration: '20-30 minutes',
        difficulty: 'Intermediate',
        category: 'Stress Management',
        icon: Brain,
        color: 'text-blue-500',
        activities: [
          'Progressive muscle relaxation',
          'Cognitive restructuring',
          'Stress identification exercises',
          'Quick relief techniques'
        ]
      },
      {
        id: '3',
        title: 'Sleep Better Tonight',
        description: 'Improve your sleep quality with relaxation techniques and sleep hygiene tips.',
        duration: '15-20 minutes',
        difficulty: 'Beginner',
        category: 'Sleep',
        icon: Moon,
        color: 'text-purple-500',
        activities: [
          'Bedtime routine planning',
          'Sleep meditation',
          'Environment optimization',
          'Wind-down exercises'
        ]
      },
      {
        id: '4',
        title: 'Energy Boost',
        description: 'Natural ways to increase energy and motivation throughout the day.',
        duration: '15-25 minutes',
        difficulty: 'Beginner',
        category: 'Energy',
        icon: Zap,
        color: 'text-green-500',
        activities: [
          'Energizing breathing',
          'Movement exercises',
          'Motivation techniques',
          'Goal setting'
        ]
      },
      {
        id: '5',
        title: 'Emotional Resilience',
        description: 'Build emotional strength and learn to bounce back from challenges.',
        duration: '25-35 minutes',
        difficulty: 'Advanced',
        category: 'Resilience',
        icon: Heart,
        color: 'text-red-500',
        activities: [
          'Emotional awareness exercises',
          'Resilience building techniques',
          'Coping strategy development',
          'Self-compassion practices'
        ]
      },
      {
        id: '6',
        title: 'Focus & Productivity',
        description: 'Enhance concentration and mental clarity for better performance.',
        duration: '20-30 minutes',
        difficulty: 'Intermediate',
        category: 'Focus',
        icon: Target,
        color: 'text-indigo-500',
        activities: [
          'Concentration exercises',
          'Distraction management',
          'Flow state techniques',
          'Productivity planning'
        ]
      }
    ]

    setPrograms(basePrograms)
    setLoading(false)
  }

  const generatePersonalizedSuggestions = async () => {
    if (!profile || isGuest) return

    try {
      const prompt = `Generate 3 personalized wellness recommendations for someone seeking mental health support. Make them encouraging, specific, and actionable. Focus on daily practices they can start today.`
      
      const suggestions = await generateAIResponse(prompt, 'You are a wellness coach providing personalized recommendations.')
      setPersonalizedSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setPersonalizedSuggestions('Take time for self-care today. Consider trying meditation, journaling, or connecting with supportive friends.')
    }
  }

  const startProgram = (program: Program) => {
    if (isGuest) {
      alert('Please create an account to access full wellness programs with personalized tracking and AI guidance.')
      return
    }
    setSelectedProgram(program)
    // Here you could track program starts in the database
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading wellness programs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Wellness Programs</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-curated wellness programs designed to improve your mental health and well-being
          </p>
          {isGuest && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                You're viewing as a guest. Create an account for personalized programs and progress tracking.
              </p>
            </div>
          )}
        </motion.div>

        {/* Personalized Suggestions */}
        {personalizedSuggestions && !isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Brain className="w-5 h-5 mr-2" />
                  Personalized for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-50">{personalizedSuggestions}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Programs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 h-full group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <program.icon className={`w-6 h-6 ${program.color}`} />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                      {program.difficulty}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        {program.duration}
                      </span>
                      <span className="capitalize">{program.category}</span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">What you'll do:</h4>
                      <ul className="space-y-1">
                        {program.activities.slice(0, 3).map((activity, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            {activity}
                          </li>
                        ))}
                        {program.activities.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{program.activities.length - 3} more activities
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      onClick={() => startProgram(program)}
                      variant="mental"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isGuest ? 'Preview Program' : 'Start Program'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Program Detail Modal */}
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center`}>
                    <selectedProgram.icon className={`w-6 h-6 ${selectedProgram.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProgram.title}</h2>
                    <p className="text-gray-600">{selectedProgram.duration} • {selectedProgram.difficulty}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700">{selectedProgram.description}</p>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Program Activities:</h3>
                  <div className="space-y-2">
                    {selectedProgram.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProgram(null)}
                    className="flex-1"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    variant="mental"
                    onClick={() => {
                      setSelectedProgram(null)
                      document.dispatchEvent(new CustomEvent('showConfetti'))
                    }}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Begin Journey
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}