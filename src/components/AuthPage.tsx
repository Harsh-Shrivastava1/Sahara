import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Heart, Shield, User, Mail, Lock, Phone, MapPin, CheckCircle, UserCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailSentPopup, setShowEmailSentPopup] = useState(false)
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false)
  const [userType, setUserType] = useState<'user' | 'volunteer' | 'ngo'>('user')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
  })

  const { signUp, signIn, signInAsGuest } = useAuth()

  // Check for email confirmation on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('type') === 'signup' && urlParams.get('token_hash')) {
      setShowLoginSuccessPopup(true)
      setIsLogin(true)
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
        // Redirect to home page after successful login
        window.location.href = '/'
      } else {
        let latitude = null
        let longitude = null

        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject)
            })
            latitude = position.coords.latitude
            longitude = position.coords.longitude
          } catch (error) {
            console.log('Geolocation not available:', error)
          }
        }

        await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          phone: formData.phone,
          role: userType,
          location: formData.location,
          latitude,
          longitude,
        })
        
        setShowEmailSentPopup(true)
      }

    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    signInAsGuest()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-6 pt-24">
      <Card className="w-full max-w-md shadow-lg border-2 border-blue-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Sahara</CardTitle>
          <CardDescription className="mt-1">
            {isLogin ? 'Welcome back! Please login to continue.' : 'Join Sahara and become part of a caring community.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Extra fields for Sign Up */}
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* User Type Selection */}
                <div className="flex justify-center gap-3 mt-3">
                  <Button
                    type="button"
                    variant={userType === 'user' ? 'default' : 'outline'}
                    onClick={() => setUserType('user')}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> User
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'volunteer' ? 'default' : 'outline'}
                    onClick={() => setUserType('volunteer')}
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> Volunteer
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'ngo' ? 'default' : 'outline'}
                    onClick={() => setUserType('ngo')}
                    className="flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" /> NGO
                  </Button>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Guest Login */}
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
              Continue as Guest
            </Button>
          </div>

          {/* Toggle between Login & Signup */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Email Sent Popup */}
      <AnimatePresence>
        {showEmailSentPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-sm text-gray-600 mt-2">
                We've sent a confirmation link to your email. Please check your inbox and click the link to verify your account.
              </p>
              <Button className="mt-4 w-full" onClick={() => setShowEmailSentPopup(false)}>
                Okay
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Success Popup */}
      <AnimatePresence>
        {showLoginSuccessPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">✅ Login successful</h3>
              <p className="text-sm text-gray-600 mt-2">
                Please sign in to continue.
              </p>
              <Button 
                className="mt-4 w-full" 
                onClick={() => {
                  setShowLoginSuccessPopup(false)
                  setIsLogin(true)
                }}
              >
                Continue to Sign In
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
