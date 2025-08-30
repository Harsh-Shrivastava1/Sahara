import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { 
  MapPin, Filter, Search, Navigation, Heart, Shield,
  Phone, Clock, Users, AlertCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getCategoryIcon, getPriorityColor, formatDate } from '../lib/utils'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const helpNeededIcon = L.divIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">🆘</span></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

const volunteerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">❤️</span></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

interface MapData {
  helpRequests: any[]
  volunteers: any[]
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 13)
    }
  }, [center, map])
  
  return null
}

export function ReliefMap() {
  const { profile } = useAuth()
  const [mapData, setMapData] = useState<MapData>({ helpRequests: [], volunteers: [] })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0])
  const [selectedMarker, setSelectedMarker] = useState<any>(null)

  useEffect(() => {
    getUserLocation()
    fetchMapData()
  }, [])

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        })
        setUserLocation([position.coords.latitude, position.coords.longitude])
      } catch (error) {
        console.log('Could not get location, using default:', error)
        // Default to Delhi, India if geolocation fails
        setUserLocation([28.6139, 77.2090])
      }
    } else {
      // Default to Delhi, India
      setUserLocation([28.6139, 77.2090])
    }
  }

  const fetchMapData = async () => {
    try {
      // Fetch help requests
      const { data: requests, error: requestsError } = await supabase
        .from('help_requests')
        .select(`
          *,
          profiles!help_requests_user_id_fkey(full_name, phone)
        `)
        .in('status', ['pending', 'active'])
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)

      if (requestsError) throw requestsError

      // Fetch volunteers and NGOs
      const { data: volunteers, error: volunteersError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_type', ['volunteer', 'ngo'])
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)

      if (volunteersError) throw volunteersError

      setMapData({
        helpRequests: requests || [],
        volunteers: volunteers || []
      })
    } catch (error) {
      console.error('Error fetching map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = mapData.helpRequests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || request.need_category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'disaster_relief', label: 'Disaster Relief' },
    { value: 'basic_needs', label: 'Basic Needs' },
    { value: 'medical_help', label: 'Medical Help' },
    { value: 'financial_support', label: 'Financial Support' },
    { value: 'personal_assistance', label: 'Personal Assistance' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading relief map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-12 h-12 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Live Relief Map</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time map showing help requests (🟥 Red) and available volunteers/NGOs (🟩 Green)
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by location, description, or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  Help Needed ({filteredRequests.length})
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  Volunteers/NGOs ({mapData.volunteers.length})
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="overflow-hidden shadow-2xl">
            <div className="h-[600px] w-full">
              <MapContainer
                center={userLocation[0] !== 0 ? userLocation : [28.6139, 77.2090]}
                zoom={userLocation[0] !== 0 ? 13 : 6}
                style={{ height: '100%', width: '100%' }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapUpdater center={userLocation} />
                
                {/* Help Request Markers (Red) */}
                {filteredRequests.map((request) => (
                  <Marker
                    key={`request-${request.id}`}
                    position={[request.latitude, request.longitude]}
                    icon={helpNeededIcon}
                    eventHandlers={{
                      click: () => setSelectedMarker({ type: 'request', data: request })
                    }}
                  >
                    <Popup maxWidth={300}>
                      <div className="p-2">
                        <div className="flex items-start space-x-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(request.category)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{request.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                              <span className="text-xs text-gray-500 capitalize">{request.priority} priority</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {request.description}
                        </p>
                        
                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {request.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(request.created_at)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {request.volunteers_needed} volunteers needed
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="disaster"
                          className="w-full"
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
                    </Popup>
                  </Marker>
                ))}

                {/* Volunteer/NGO Markers (Green) */}
                {mapData.volunteers.map((volunteer) => (
                  <Marker
                    key={`volunteer-${volunteer.id}`}
                    position={[volunteer.latitude, volunteer.longitude]}
                    icon={volunteerIcon}
                    eventHandlers={{
                      click: () => setSelectedMarker({ type: 'volunteer', data: volunteer })
                    }}
                  >
                    <Popup maxWidth={300}>
                      <div className="p-2">
                        <div className="flex items-start space-x-2 mb-2">
                          {volunteer.role === 'ngo' ? (
                            <Shield className="w-5 h-5 text-green-600" />
                          ) : (
                            <Heart className="w-5 h-5 text-green-600" />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {volunteer.full_name}
                            </h4>
                            <span className="text-xs text-green-600 capitalize font-medium">
                              {volunteer.role}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {volunteer.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            Trust Level: {volunteer.trust_level}
                          </div>
                        </div>
                        
                        {volunteer.services_offered && volunteer.services_offered.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {volunteer.services_offered.map((service: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button
                          size="sm"
                          variant="mental"
                          className="w-full"
                          onClick={() => {
                            if (volunteer.phone) {
                              window.location.href = `tel:${volunteer.phone}`
                            }
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        </motion.div>

        {/* Map Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-blue-500" />
                Map Legend & Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Map Markers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">🆘</div>
                      Help requests needing assistance
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">❤️</div>
                      Volunteers and NGOs available to help
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">How to Help</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Click on red markers to see help requests</p>
                    <p>• Contact directly using provided information</p>
                    <p>• Green markers show nearby volunteers/NGOs</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="disaster" 
                      size="sm" 
                      onClick={() => window.location.href = '/community-aid'}
                      className="w-full"
                    >
                      Request Help
                    </Button>
                    <Button 
                      variant="mental" 
                      size="sm"
                      onClick={() => window.location.href = '/ngo-dashboard'}
                      className="w-full"
                    >
                      Register as Volunteer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}