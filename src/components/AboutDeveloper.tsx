import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { 
  User, Mail, Linkedin, Code, Database, Palette,
  GraduationCap, Heart, Zap, Target
} from 'lucide-react'

export function AboutDeveloper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet the Developer</h1>
          <p className="text-xl text-gray-600">The mind behind Sahara platform</p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Harsh Shrivastava</h2>
                <p className="text-xl text-indigo-100 mb-6">Aspiring Software Developer</p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-indigo-50 leading-relaxed">
                    Hi, I'm Harsh Shrivastava, a passionate 2nd-year Computer Science student dedicated to building 
                    innovative digital experiences that make a real difference in people's lives. I believe technology 
                    should serve humanity, and Sahara represents my commitment to using code as a force for good.
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => window.open('https://www.linkedin.com/in/harsh-shrivastava-40b240313/', '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => window.open('mailto:hshrivastava23032007@gmail.com', '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills & Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2 text-indigo-500" />
                Technical Skills & Expertise
              </CardTitle>
              <CardDescription>
                Developing proficiency across the full technology stack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-500" />
                    MERN Stack Development
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• MongoDB - Database design and management</li>
                    <li>• Express.js - Backend API development</li>
                    <li>• React.js - Modern frontend development</li>
                    <li>• Node.js - Server-side JavaScript</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-green-500" />
                    Database & Enterprise
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Database Management Systems</li>
                    <li>• SAP - Enterprise resource planning</li>
                    <li>• Supabase - Modern backend services</li>
                    <li>• Real-time data synchronization</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-purple-500" />
                    UI/UX Design
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• User-centered design principles</li>
                    <li>• Modern design systems</li>
                    <li>• Responsive web design</li>
                    <li>• Accessibility best practices</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    Emerging Technologies
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Real-time applications</li>
                    <li>• Progressive Web Apps</li>
                    <li>• Cloud services integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Computer Science Student</h4>
                  <p className="text-sm text-gray-600">2nd Year • Currently Pursuing</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Focusing on software development, algorithms, and modern web technologies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Goals & Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Heart className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                  <span>Build technology that solves real-world problems</span>
                </div>
                <div className="flex items-start">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500 mt-0.5" />
                  <span>Master full-stack development and AI integration</span>
                </div>
                <div className="flex items-start">
                  <Target className="w-4 h-4 mr-2 text-blue-500 mt-0.5" />
                  <span>Create platforms that connect and help communities</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Philosophy & Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center">Development Philosophy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-700 leading-relaxed mb-6">
                  "I believe that great software is not just about clean code or beautiful interfaces—it's about 
                  understanding human needs and creating solutions that genuinely improve lives. Every line of code 
                  I write is driven by empathy and the desire to make technology more accessible and helpful."
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-white rounded-lg">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-800">Human-Centered</h4>
                    <p className="text-gray-600">Technology should serve people, not the other way around</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-800">Innovation-Driven</h4>
                    <p className="text-gray-600">Always exploring new technologies and approaches</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-800">Impact-Focused</h4>
                    <p className="text-gray-600">Measuring success by the positive change created</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Let's Connect!</h3>
              <p className="text-gray-600 mb-6">
                I'm always eager to learn, collaborate, and discuss new ideas. Whether you're interested in 
                technology, have feedback about Sahara, or just want to chat about development, I'd love to hear from you!
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="gradient"
                  onClick={() => window.open('https://www.linkedin.com/in/harsh-shrivastava-40b240313/', '_blank')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect on LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:hshrivastava23032007@gmail.com', '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}