import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { 
  BarChart3, TrendingUp, AlertTriangle, Heart, 
  Brain, Activity, Calendar, Clock, MessageCircle
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'

interface SessionData {
  id: string
  session_type: string
  session_notes: string
  mood_before: number
  mood_after: number | null
  risk_level: string
  crisis_detected: boolean
  created_at: string
}

export function SentimentAnalysis() {
  const { profile } = useAuth()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageMood: 0,
    riskSessions: 0,
    improvementRate: 0
  })

  useEffect(() => {
    if (profile) {
      fetchAnalysisData()
    }
  }, [profile])

  const fetchAnalysisData = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('mental_health_sessions')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSessions(data || [])
      
      // Calculate stats
      const totalSessions = data?.length || 0
      const averageMood = data?.reduce((sum, session) => sum + (session.mood_before || 5), 0) / totalSessions || 5
      const riskSessions = data?.filter(session => ['high', 'critical'].includes(session.risk_level)).length || 0
      const improvementRate = data?.filter(session => 
        session.mood_after && session.mood_before && session.mood_after > session.mood_before
      ).length / totalSessions * 100 || 0

      setStats({
        totalSessions,
        averageMood: Math.round(averageMood * 10) / 10,
        riskSessions,
        improvementRate: Math.round(improvementRate)
      })

    } catch (error) {
      console.error('Error fetching analysis data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-500'
    if (mood >= 6) return 'text-yellow-500'
    if (mood >= 4) return 'text-orange-500'
    return 'text-red-500'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading sentiment analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Sentiment Analysis</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered analysis of your mental health journey and emotional patterns
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Sessions",
              value: stats.totalSessions,
              icon: Activity,
              color: "text-blue-500",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "Average Mood",
              value: `${stats.averageMood}/10`,
              icon: Heart,
              color: "text-pink-500",
              gradient: "from-pink-500 to-rose-500"
            },
            {
              title: "Risk Sessions",
              value: stats.riskSessions,
              icon: AlertTriangle,
              color: "text-orange-500",
              gradient: "from-orange-500 to-red-500"
            },
            {
              title: "Improvement Rate",
              value: `${stats.improvementRate}%`,
              icon: TrendingUp,
              color: "text-green-500",
              gradient: "from-green-500 to-teal-500"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Session History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                Session History & Analysis
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your mental health sessions and emotional patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Heart className={`w-5 h-5 ${getMoodColor(session.mood_before)}`} />
                            <span className="font-medium">Mood: {session.mood_before}/10</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRiskColor(session.risk_level)}`}>
                            {session.risk_level} risk
                          </div>
                          {session.crisis_detected && (
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Crisis Detected
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(session.created_at)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {session.session_notes}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{session.session_type.replace('_', ' ')}</span>
                        {session.mood_after && (
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Improved to {session.mood_after}/10
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No sessions yet</h3>
                  <p className="text-gray-500 mb-6">Start chatting with Saathi to see your analysis</p>
                  <Button 
                    variant="mental"
                    onClick={() => window.location.href = '#/ai-buddy'}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start AI Chat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}