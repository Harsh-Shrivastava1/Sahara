import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'
import { Heart, Shield, Users, Globe, ArrowRight, Sparkles } from 'lucide-react'

interface HomePageProps {
  onContinue: () => void
}

export function HomePage({ onContinue }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-red-100/50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/30 rounded-full"
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sahara
              </h1>
            </div>
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6"
            >
              Bridging Help, Saving Lives
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              A comprehensive platform combining disaster relief coordination and mental health support,
              powered by AI to connect communities, volunteers, and NGOs in times of need.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4"
          >
            <Button
              onClick={onContinue}
              variant="gradient"
              size="lg"
              className="px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl group"
            >
              Continue to Platform
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div>
              <Button
                onClick={() => {
                  document.getElementById('mission-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  })
                }}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-medium border-2 hover:bg-white/10"
              >
                Learn About Our Mission
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Purpose Section */}
      <motion.section
        id="mission-section"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              Our Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              To create a unified ecosystem where disaster relief and mental health support work together,
              ensuring no one faces their challenges alone.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-100"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-12 h-12 text-red-500 mr-4" />
                <h3 className="text-2xl font-bold text-red-600">Disaster Relief</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Connect those in need with volunteers and NGOs. Request help for earthquakes, floods, 
                food, water, shelter, medical aid, and more.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• AI-powered request categorization</li>
                <li>• Real-time location-based mapping</li>
                <li>• Verified NGO and volunteer network</li>
                <li>• Multi-language support</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-2xl border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <Heart className="w-12 h-12 text-blue-500 mr-4" />
                <h3 className="text-2xl font-bold text-blue-600">Mental Wellness</h3>
              </div>
              <p className="text-gray-700 mb-4">
                AI-powered mental health companion with crisis detection, community support,
                and anonymous story sharing.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 24/7 AI mental health buddy</li>
                <li>• Sentiment analysis & risk detection</li>
                <li>• Community support groups</li>
                <li>• Crisis escalation protocols</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, smart, and secure - our platform makes getting help and helping others effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Connect",
                description: "Post help requests or register as a volunteer/NGO to offer assistance.",
                color: "text-purple-500"
              },
              {
                icon: Globe,
                title: "Locate",
                description: "AI matches requests with nearby helpers using real-time location mapping.",
                color: "text-green-500"
              },
              {
                icon: Sparkles,
                title: "Support",
                description: "Get both material aid and emotional support through our integrated platform.",
                color: "text-yellow-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* For Whom Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed for everyone - from those seeking help to those ready to provide it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Individuals in Need",
                description: "Anyone facing disasters or mental health challenges",
                gradient: "from-red-400 to-pink-400"
              },
              {
                title: "Volunteers",
                description: "Community members ready to help their neighbors",
                gradient: "from-green-400 to-teal-400"
              },
              {
                title: "NGOs & Organizations",
                description: "Non-profits coordinating large-scale relief efforts",
                gradient: "from-blue-400 to-purple-400"
              },
              {
                title: "Communities",
                description: "Local groups building resilience together",
                gradient: "from-yellow-400 to-orange-400"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Developer Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👨‍💻</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet the Developer</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Hi, I'm <strong>Harsh Shrivastava</strong>, Aspiring Web & App Developer, a 2nd-year Computer Science student 
                passionate about building innovative digital experiences. Developing skills in MERN, SAP, UI/UX Design, 
                and Database Management. Always eager to learn new technologies, solve real-world problems, and grow as a developer.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="gradient"
                  onClick={() => window.open('https://www.linkedin.com/in/harsh-shrivastava-40b240313/', '_blank')}
                  className="px-6 py-3"
                >
                  <span className="mr-2">💼</span>
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:hshrivastava23032007@gmail.com', '_blank')}
                  className="px-6 py-3"
                >
                  <span className="mr-2">📧</span>
                  Email
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}