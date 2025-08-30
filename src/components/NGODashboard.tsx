import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  Shield, Users, MapPin, Plus, Edit, Check, X,
  Award, TrendingUp, Clock, AlertCircle, Phone, 
  Heart, Star, Filter
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getCategoryIcon, getPriorityColor, formatDate } from '../lib/utils'

export function NGODashboard() {
  const { profile, updateProfile } = useAuth()
  const [helpRequests, setHelpRequests] = useState<any[]>([])
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [setupData, setSetupData] = useState({
    location: profile?.location || '',
    services: profile?.services_offered || [],
    description: ''
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
      // Show setup if profile is incomplete
      if (!profile.location || !profile.services_offered?.length) {
        setShowSetup(true)
      }
    }
  }, [profile])

  const fetchDashboardData = async () => {
    if (!profile) return

    try {
      setLoading(true)

      // Fetch all active help requests
      const { data: allRequests, error: requestsError } = await supabase
        .from('help_requests')
        .select(`
          *,
          profiles!help_requests_user_id_fkey(full_name, phone)
        `)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })

      if (requestsError) throw requestsError

      // Fetch requests I'm helping with or created
      const { data: userRequests, error: userRequestsError } = await supabase
        .from('help_requests')
        .select(`
          *,
          profiles!help_requests_user_id_fkey(full_name, phone)
        `)
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })

      if (userRequestsError) throw userRequestsError

      setHelpRequests(allRequests || [])
      setMyRequests(userRequests || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      // Get user's geolocation
      let latitude = profile.latitude
      let longitude = profile.longitude

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          })
          latitude = position.coords.latitude
          longitude = position.coords.longitude
        } catch (error) {
          console.log('Could not get location:', error)
        }
      }

      await updateProfile({
        location: setupData.location,
        services_offered: setupData.services,
        latitude,
        longitude
      })

      setShowSetup(false)
      document.dispatchEvent(new CustomEvent('showConfetti'))
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleOfferHelp = async (requestId: string) => {
    try {
      await supabase
        .from('help_requests')
        .update({ status: 'active' })
        .eq('id', requestId)

      fetchDashboardData()
      document.dispatchEvent(new CustomEvent('showConfetti'))
    } catch (error) {
      console.error('Error offering help:', error)
    }
  }

  const filteredRequests = helpRequests.filter(request => {
    const matchesCategory = !selectedCategory || request.need_category === selectedCategory
    const matchesPriority = !selectedPriority || request.urgency_level === selectedPriority
    return matchesCategory && matchesPriority
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'disaster_relief', label: 'Disaster Relief' },
    { value: 'basic_needs', label: 'Basic Needs' },
    { value: 'medical_help', label: 'Medical Help' },
    { value: 'financial_support', label: 'Financial Support' },
    { value: 'personal_assistance', label: 'Personal Assistance' }
  ]

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  const services = [
    'Food Distribution', 'Medical Aid', 'Shelter', 'Water Supply',
    'Rescue Operations', 'Mental Health', 'Financial Support',
    'Transportation', 'Communication', 'Child Care', 'Elder Care'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              {profile?.user_type === 'ngo' ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <Heart className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {profile?.user_type === 'ngo' ? 'NGO Dashboard' : 'Volunteer Dashboard'}
              </h1>
              <p className="text-xl text-gray-600">
                Welcome, {profile?.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">Trust Level: {profile?.trust_level || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Award className="w-3 h-3" />
                <span>{profile?.badges_earned || 0} badges earned</span>
              </div>
            </div>
            <Button
              onClick={() => setShowSetup(true)}
              variant={profile?.location ? 'outline' : 'mental'}
            >
              <Edit className="w-4 h-4 mr-2" />
              {profile?.location ? 'Edit Profile' : 'Complete Setup'}
            </Button>
          </div>
        </motion.div>

        {/* Setup Modal */}
        <AnimatePresence>
          {showSetup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile?.user_type === 'ngo' ? 'NGO' : 'Volunteer'} Profile Setup
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowSetup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </Button>
                </div>

                <form onSubmit={handleSetupSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Your Location
                    </label>
                    <Input
                      type="text"
                      placeholder="City, State, Country"
                      value={setupData.location}
                      onChange={(e) => setSetupData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services You Offer
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {services.map(service => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => {
                            setSetupData(prev => ({
                              ...prev,
                              services: prev.services.includes(service)
                                ? prev.services.filter(s => s !== service)
                                : [...prev.services, service]
                            }))
                          }}
                          className={`p-3 text-sm rounded-lg border transition-all ${
                            setupData.services.includes(service)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Select all services you can provide
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSetup(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="mental"
                      className="flex-1"
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Active Requests",
              value: filteredRequests.length,
              icon: AlertCircle,
              color: "text-red-500",
              gradient: "from-red-500 to-orange-500"
            },
            {
              title: "My Contributions",
              value: myRequests.filter(r => r.status === 'completed').length,
              icon: Check,
              color: "text-green-500",
              gradient: "from-green-500 to-teal-500"
            },
            {
              title: "People Helped",
              value: (profile?.trust_level || 0) * 2,
              icon: Users,
              color: "text-blue-500",
              gradient: "from-blue-500 to-purple-500"
            },
            {
              title: "Response Time",
              value: "< 2hr",
              icon: Clock,
              color: "text-yellow-500",
              gradient: "from-yellow-500 to-orange-500"
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <select
                    className="p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    {priorities.map(pri => (
                      <option key={pri.value} value={pri.value}>
                        {pri.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Requests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Community Help Requests</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {helpRequests.length} requests
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                            <span className="text-xs text-gray-500 capitalize">{request.priority} priority</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'active' 
                          ? 'bg-red-100 text-red-700'
                          : request.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {request.description}
                    </CardDescription>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {request.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(request.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {request.volunteers_needed} volunteers needed
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Requested by: {request.profiles?.full_name || 'Anonymous'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (request.contact_info.startsWith('http')) {
                              window.open(request.contact_info, '_blank')
                            } else {
                              window.location.href = `tel:${request.contact_info}`
                            }
                          }}
                          className="flex-1"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                        
                        {request.status === 'active' && (
                          <Button
                            variant="mental"
                            size="sm"
                            onClick={() => handleOfferHelp(request.id)}
                            className="flex-1"
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Offer Help
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests match your filters</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedPriority('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}