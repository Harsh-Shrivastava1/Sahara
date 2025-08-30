import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { 
  Heart, Shield, Users, MapPin, MessageCircle, Award,
  TrendingUp, Clock, AlertCircle, CheckCircle, Star,
  Plus, Eye
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getGreeting, formatDate, getPriorityColor, getCategoryIcon } from '../lib/utils'

interface DashboardProps {
  onFeatureSelect: (feature: string) => void
}

export function Dashboard({ onFeatureSelect }: DashboardProps) {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    helpRequests: 0,
    completedRequests: 0,
    mentalHealthSessions: 0,
    communityStories: 0
  })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
    }
  }, [profile])

  const fetchDashboardData = async () => {
    if (!profile) return

    try {
      // Fetch help requests stats
      const { data: helpRequests } = await supabase
        .from('help_requests')
        .select('*')
        .eq('user_id', profile.user_id)

      // Fetch mental health sessions
      const { data: mentalSessions } = await supabase
        .from('mental_health_sessions')
        .select('*')
        .eq('user_id', profile.id)

      // Fetch recent help requests
      const { data: recentHelp } = await supabase
        .from('help_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent mental health sessions
      const { data: recentMental } = await supabase
        .from('mental_health_sessions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setStats({
        helpRequests: helpRequests?.length || 0,
        completedRequests: helpRequests?.filter(r => r.status === 'completed').length || 0,
        mentalHealthSessions: mentalSessions?.length || 0,
        communityStories: 0 // Will implement later
      })

      setRecentRequests(recentHelp || [])
      setRecentSessions(recentMental || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const badges = profile?.badges_earned || 0
  const trustLevel = profile?.trust_level || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {getGreeting()}, {profile?.full_name || 'Friend'} 
                <span className="ml-2">
                  {new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 17 ? '☀️' : '🌙'}
                </span>
              </h1>
              <p className="text-gray-600 mt-2">Welcome to your Sahara dashboard</p>
            </div>
            
            {/* Profile Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{profile?.user_type}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm">Trust Level: {trustLevel}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Help Requests",
                value: stats.helpRequests,
                icon: Shield,
                color: "text-red-500",
                gradient: "from-red-500 to-orange-500"
              },
              {
                title: "Completed",
                value: stats.completedRequests,
                icon: CheckCircle,
                color: "text-green-500",
                gradient: "from-green-500 to-teal-500"
              },
              {
                title: "Mental Sessions",
                value: stats.mentalHealthSessions,
                icon: Heart,
                color: "text-blue-500",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                title: "Badges Earned",
                value: badges,
                icon: Award,
                color: "text-yellow-500",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Request Help",
              description: "Get assistance for disasters and emergencies",
              icon: Shield,
              action: () => onFeatureSelect('community-aid'),
              gradient: "from-red-500 to-orange-500"
            },
            {
              title: "Offer Help",
              description: "Volunteer to help others in need",
              icon: Heart,
              action: () => onFeatureSelect('ngo-dashboard'),
              gradient: "from-green-500 to-teal-500"
            },
            {
              title: "Mental Support",
              description: "Chat with AI buddy or join community",
              icon: MessageCircle,
              action: () => onFeatureSelect('ai-buddy'),
              gradient: "from-blue-500 to-purple-500"
            },
            {
              title: "Relief Map",
              description: "View live map of help requests and volunteers",
              icon: MapPin,
              action: () => onFeatureSelect('relief-map'),
              gradient: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
                onClick={feature.action}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardHeader className="relative text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button variant="outline" className="w-full group-hover:border-transparent group-hover:bg-white/50 transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Help Requests */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-500" />
                    Recent Help Requests
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => onFeatureSelect('relief-map')}>
                    <Eye className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{getCategoryIcon(request.category)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{request.title}</p>
                        <p className="text-sm text-gray-500 truncate">{request.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                          <span className="text-xs text-gray-500">{formatDate(request.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent requests</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mental Health Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-blue-500" />
                    Mental Health Sessions
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => onFeatureSelect('ai-buddy')}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div key={session.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{session.session_type.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-500">{formatDate(session.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{session.content.substring(0, 100)}...</p>
                      {session.risk_level && (
                        <div className="flex items-center mt-2">
                          <AlertCircle className={`w-3 h-3 mr-1 ${
                            session.risk_level === 'high' || session.risk_level === 'critical' 
                              ? 'text-red-500' 
                              : 'text-yellow-500'
                          }`} />
                          <span className="text-xs capitalize">{session.risk_level} risk</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent sessions</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onFeatureSelect('ai-buddy')}
                      className="mt-2"
                    >
                      Start chatting with Saathi
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8"
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Live Relief Map Preview
                </CardTitle>
                <Button onClick={() => onFeatureSelect('relief-map')}>
                  View Full Map
                </Button>
              </div>
              <CardDescription>
                Real-time view of help requests (🟥) and volunteers (🟩)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Interactive map will load here</p>
                  <Button onClick={() => onFeatureSelect('relief-map')}>
                    Launch Full Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}