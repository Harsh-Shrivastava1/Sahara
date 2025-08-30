import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  HandHeart, Plus, MapPin, Clock, AlertCircle, Phone, 
  Calendar, Users, Heart, Sparkles
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { callGroqAPI, categorizeHelpRequest } from '../lib/groq'
import { getCategoryIcon, getPriorityColor, formatDate } from '../lib/utils'

export function CommunityAid() {
  const { profile } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    contactInfo: '',
    neededBy: '',
    volunteersNeeded: 1
  })

  useEffect(() => {
    fetchHelpRequests()
  }, [])

  const fetchHelpRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          *,
          profiles!help_requests_user_id_fkey(full_name, phone)
        `)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching help requests:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    try {
      // Get user's current location
      let latitude = null
      let longitude = null
      
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

      // Use AI to categorize the request if category is not provided
      let category = formData.category
      if (!category && formData.description) {
        category = await categorizeHelpRequest(formData.description)
        category = category.toLowerCase().trim()
      }

      // Insert help request
      const { error: requestError } = await supabase
        .from('help_requests')
        .insert([{
          user_id: profile.user_id,
          title: formData.title,
          description: formData.description,
          need_category: category || 'personal_assistance',
          urgency_level: formData.priority,
          location: formData.location,
          latitude,
          longitude,
          contact_info: formData.contactInfo,
          people_affected: formData.volunteersNeeded,
          resources_needed: formData.description,
          status: 'pending'
        }])

      if (requestError) throw requestError

      // Smart Integration: Suggest mental health support
      if (category && ['earthquake', 'flood', 'medical_help', 'personal_assistance'].includes(category)) {
        // Create a mental health session suggestion
        await supabase
          .from('mental_health_sessions')
          .insert([{
            user_id: profile.user_id,
            session_type: 'ai_chat',
            session_notes: `Smart integration suggestion: After requesting help for ${category}, you might benefit from emotional support. Our AI buddy Saathi is here to help.`,
            mood_before: 3,
            mood_after: null,
            crisis_detected: false
          }])
      }

      // Reset form and refresh requests
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: '',
        contactInfo: '',
        neededBy: '',
        volunteersNeeded: 1
      })
      setShowForm(false)
      fetchHelpRequests()

      // Show success animation
      document.dispatchEvent(new CustomEvent('showConfetti'))
      
    } catch (error) {
      console.error('Error creating help request:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'disaster_relief', label: 'Disaster Relief', icon: '🏚️' },
    { value: 'basic_needs', label: 'Basic Needs', icon: '🍞' },
    { value: 'medical_help', label: 'Medical Help', icon: '🏥' },
    { value: 'financial_support', label: 'Financial Support', icon: '💰' },
    { value: 'personal_assistance', label: 'Personal Assistance', icon: '👤' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <HandHeart className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Community Aid</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Request help for emergencies or disasters. Our AI will categorize your request and connect you with volunteers and NGOs.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => setShowForm(true)}
            variant="disaster"
            size="lg"
            className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            <Plus className="w-6 h-6 mr-2" />
            Request Help
          </Button>
        </motion.div>

        {/* Request Help Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Request Help</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What do you need help with?
                    </label>
                    <Input
                      type="text"
                      placeholder="Brief title of your request"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your situation
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Provide details about your situation and what kind of help you need..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (optional - AI will auto-categorize)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            category: prev.category === cat.value ? '' : cat.value 
                          }))}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.category === cat.value
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{cat.icon}</div>
                          <div className="text-xs font-medium">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volunteers Needed
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.volunteersNeeded}
                        onChange={(e) => setFormData(prev => ({ ...prev, volunteersNeeded: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <Input
                      type="text"
                      placeholder="Your current location or where help is needed"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Contact Information
                    </label>
                    <Input
                      type="text"
                      placeholder="Phone number or alternative contact method"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Needed By (optional)
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.neededBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, neededBy: e.target.value }))}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Heart className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Smart Integration</h4>
                        <p className="text-sm text-blue-600">
                          Based on your request type, we may also suggest mental health support through our AI companion Saathi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="disaster"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Requests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Active Help Requests</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                Help Needed
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {request.description}
                    </CardDescription>

                    <div className="space-y-2 text-sm text-gray-600">
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

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          By: {request.profiles?.full_name || 'Anonymous'}
                        </span>
                        <Button
                          variant="disaster"
                          size="sm"
                          onClick={() => {
                            if (request.contact_info.startsWith('http')) {
                              window.open(request.contact_info, '_blank')
                            } else {
                              window.location.href = `tel:${request.contact_info}`
                            }
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No active requests</h3>
              <p className="text-gray-500 mb-6">Be the first to request help in your area</p>
              <Button onClick={() => setShowForm(true)} variant="disaster">
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}