import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  Heart, Shield, Users, Globe, Zap, Brain,
  MapPin, MessageCircle, Award, BarChart3
} from 'lucide-react'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              About Sahara
            </h1>
          </div>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Bridging Help, Saving Lives - A comprehensive platform uniting disaster relief and mental health support
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-blue-50 leading-relaxed max-w-4xl mx-auto">
                To create a unified ecosystem where disaster relief and mental health support work together seamlessly, 
                ensuring no one faces their challenges alone. We believe that physical and emotional well-being are 
                interconnected, and our platform reflects this holistic approach to human care.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How Sahara Works</h2>
            <p className="text-xl text-gray-600">A comprehensive approach to community support</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Sahara Side */}
            <div>
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-red-600">Sahara - Disaster Relief</h3>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-500" />
                      Community Aid Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Connect people in need with volunteers and NGOs for immediate disaster relief assistance.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• AI-powered request categorization and translation</li>
                      <li>• Real-time geolocation matching</li>
                      <li>• Support for earthquakes, floods, food, water, shelter, medical, and financial needs</li>
                      <li>• Verified volunteer and NGO network</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-500" />
                      Live Relief Mapping
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Interactive maps showing real-time help requests and available resources.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Red pins: Areas needing help</li>
                      <li>• Green pins: Available volunteers and NGOs</li>
                      <li>• Smart matching based on location and needs</li>
                      <li>• Real-time updates and notifications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Saathi Side */}
            <div>
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-blue-600">Saathi - Mental Wellness</h3>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-500" />
                      AI Mental Health Companion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      24/7 AI-powered mental health support with advanced sentiment analysis and crisis detection.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Voice and text chat capabilities</li>
                      <li>• Real-time emotional state analysis</li>
                      <li>• Automatic crisis escalation to professionals</li>
                      <li>• Multilingual support (English, Hindi, Gujarati)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-purple-500" />
                      Community Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Safe spaces for sharing experiences and finding peer support through community stories.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Anonymous story sharing</li>
                      <li>• Peer support networks</li>
                      <li>• AI-curated wellness programs</li>
                      <li>• Progress tracking and insights</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smart Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl">
                <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                Smart Integration - The Sahara Difference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Disaster → Mental Health</h4>
                  <p className="text-gray-600 text-sm">
                    When someone requests disaster relief, our AI recognizes the emotional impact and suggests 
                    mental health support through Saathi, understanding that disasters affect both physical and emotional well-being.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Mental Health → Material Support</h4>
                  <p className="text-gray-600 text-sm">
                    When mental health conversations reveal material needs (food, shelter, financial stress), 
                    Saathi intelligently suggests connecting with Sahara's disaster relief network for practical support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* For Whom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-600">Sahara is designed for everyone in our global community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Individuals in Crisis",
                description: "People facing natural disasters, emergencies, or mental health challenges",
                icon: Heart,
                color: "text-red-500",
                gradient: "from-red-500 to-pink-500"
              },
              {
                title: "Volunteers",
                description: "Community members ready to help their neighbors in times of need",
                icon: Users,
                color: "text-green-500",
                gradient: "from-green-500 to-teal-500"
              },
              {
                title: "NGOs & Organizations",
                description: "Non-profits and organizations coordinating large-scale relief efforts",
                icon: Shield,
                color: "text-blue-500",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                title: "Communities",
                description: "Local groups building resilience and supporting each other",
                icon: Globe,
                color: "text-purple-500",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 group h-full">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Sahara Exists */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Why Sahara Exists</h2>
                <p className="text-xl text-gray-300">The vision behind our platform</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">The Problem</h3>
                  <p className="text-gray-300 text-sm">
                    Disaster relief and mental health support operate in silos, missing the interconnected nature of human needs during crises.
                  </p>
                </div>
                
                <div className="text-center">
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Our Solution</h3>
                  <p className="text-gray-300 text-sm">
                    A unified platform that recognizes both physical and emotional needs, providing comprehensive support through AI-powered integration.
                  </p>
                </div>
                
                <div className="text-center">
                  <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">The Impact</h3>
                  <p className="text-gray-300 text-sm">
                    Faster response times, better resource allocation, and holistic care that addresses the complete spectrum of human needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technology & Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-600">Cutting-edge AI and modern web technologies for maximum impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "AI-powered request categorization and translation",
              "Real-time sentiment analysis and crisis detection",
              "Geolocation-based smart matching",
              "Multi-language support (English, Hindi, Gujarati)",
              "Gamified trust and verification system",
              "Real-time database with instant updates",
              "Voice and text chat capabilities",
              "Interactive mapping with live data",
              "Anonymous and secure story sharing"
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}