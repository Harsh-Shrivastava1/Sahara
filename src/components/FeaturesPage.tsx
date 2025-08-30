import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  Shield, Heart, Users, MapPin, Bot, MessageCircle, 
  Award, BarChart3, HandHeart, AlertTriangle 
} from 'lucide-react'

interface FeaturesPageProps {
  onFeatureSelect: (feature: string) => void
}

export function FeaturesPage({ onFeatureSelect }: FeaturesPageProps) {
  const [activeTab, setActiveTab] = useState<'sahara' | 'saathi'>('sahara')

  const saharaFeatures = [
    {
      icon: HandHeart,
      title: "Community Aid",
      description: "Request or offer help for earthquakes, floods, food, water, shelter, medical needs, and more",
      action: () => onFeatureSelect('community-aid'),
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Users,
      title: "NGO & Volunteer Hub",
      description: "Connect with verified organizations and volunteers for coordinated relief efforts",
      action: () => onFeatureSelect('ngo-dashboard'),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Live Relief Map",
      description: "Real-time mapping of help requests and available resources with AI-powered matching",
      action: () => onFeatureSelect('relief-map'),
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: AlertTriangle,
      title: "Smart Integration",
      description: "AI suggests emotional support for disaster victims and material aid for mental health users",
      action: () => onFeatureSelect('smart-integration'),
      gradient: "from-yellow-500 to-red-500"
    }
  ]

  const saathiFeatures = [
    {
      icon: Bot,
      title: "AI Mental Health Buddy",
      description: "24/7 compassionate AI companion with voice and chat support powered by advanced language models",
      action: () => onFeatureSelect('ai-buddy'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Sentiment Analysis",
      description: "Real-time emotional state detection with automatic crisis escalation to professional help",
      action: () => onFeatureSelect('sentiment-analysis'),
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: MessageCircle,
      title: "Community Story Wall",
      description: "Safe, anonymous platform for sharing experiences and finding peer support",
      action: () => onFeatureSelect('story-wall'),
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: Heart,
      title: "Wellness Programs",
      description: "Personalized mental health journeys with guided support and progress tracking",
      action: () => onFeatureSelect('wellness-programs'),
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const currentFeatures = activeTab === 'sahara' ? saharaFeatures : saathiFeatures

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sahara offers two integrated platforms - disaster relief coordination and mental health support.
            Select your focus area to explore specialized features.
          </p>
        </motion.div>

        {/* Toggle Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'sahara' ? 'disaster' : 'ghost'}
                onClick={() => setActiveTab('sahara')}
                className="px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                <Shield className="w-5 h-5 mr-2" />
                Sahara (Disaster Relief)
              </Button>
              <Button
                variant={activeTab === 'saathi' ? 'mental' : 'ghost'}
                onClick={() => setActiveTab('saathi')}
                className="px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Saathi (Mental Wellness)
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {currentFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="group cursor-pointer h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  onClick={feature.action}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300"
                      >
                        Explore Feature
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Gamification Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Gamified Trust & Rewards</h2>
            <p className="text-lg text-gray-600">
              Build trust, earn badges, and climb leaderboards as you help others and grow personally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: "Achievement Badges",
                description: "Earn Food Hero, Relief Warrior, Wellness Guide badges and more",
                color: "text-yellow-500"
              },
              {
                icon: BarChart3,
                title: "Trust Levels",
                description: "Build credibility through verified actions and community feedback",
                color: "text-green-500"
              },
              {
                icon: Users,
                title: "Leaderboards",
                description: "See top contributors and get motivated to help more",
                color: "text-blue-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}