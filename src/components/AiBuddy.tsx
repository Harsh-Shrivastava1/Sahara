import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  MessageCircle, Send, Bot, User, Mic, MicOff, Heart,
  AlertTriangle, Phone, Volume2, VolumeX, Sparkles, Shield
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { generateAIResponse, analyzeSentiment } from '../lib/groq'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
}

export function AiBuddy() {
  const { profile, isGuest } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Saathi, your compassionate AI mental health companion. I'm here to listen, support, and help you through difficult times. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    if (isGuest) {
      // For guests, show a limited demo response
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      setIsLoading(true)

      setTimeout(() => {
        const demoResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for sharing. As a guest, you're experiencing a demo of our AI companion. To access full features including personalized responses, sentiment analysis, and progress tracking, please create an account. I'm here to provide comprehensive mental health support when you're ready to join our community.",
          sender: 'ai',
          timestamp: new Date(),
          riskLevel: 'low'
        }
        setMessages(prev => [...prev, demoResponse])
        setIsLoading(false)
      }, 1500)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Analyze sentiment and risk
      const sentimentAnalysis = await analyzeSentiment(userMessage.content)
      
      // Generate AI response
      const context = `User sentiment: ${sentimentAnalysis.sentiment}, Risk level: ${sentimentAnalysis.riskLevel}. 
        ${sentimentAnalysis.needsEscalation ? 'IMPORTANT: This user may be in crisis and needs immediate professional help.' : ''}
        Previous conversation context: ${messages.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}`
      
      const aiResponse = await generateAIResponse(userMessage.content, context)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: sentimentAnalysis.riskLevel
      }

      setMessages(prev => [...prev, aiMessage])

      // Store session in database
      if (profile) {
        await supabase
          .from('mental_health_sessions')
          .insert([{
            user_id: profile.user_id,
            session_type: 'ai_chat',
            session_notes: userMessage.content,
            mood_before: sentimentAnalysis.sentiment === 'positive' ? 8 : 
                        sentimentAnalysis.sentiment === 'negative' ? 3 : 5,
            mood_after: null,
            crisis_detected: sentimentAnalysis.needsEscalation
          }])

        // Smart Integration: If high risk, suggest disaster relief support
        if (sentimentAnalysis.riskLevel === 'high' || sentimentAnalysis.riskLevel === 'critical') {
          // Check if user might benefit from material support
          if (userMessage.content.toLowerCase().includes(['food', 'shelter', 'money', 'help', 'homeless', 'hungry', 'broke'].find(word => 
            userMessage.content.toLowerCase().includes(word)
          ) || '')) {
            // Add suggestion for disaster relief
            const suggestionMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "I notice you might be facing some practical challenges as well. Would you like me to connect you with our Sahara disaster relief network? They can help with food, shelter, and other material needs.",
              sender: 'ai',
              timestamp: new Date(),
              riskLevel: 'low'
            }
            
            setTimeout(() => {
              setMessages(prev => [...prev, suggestionMessage])
            }, 2000)
          }
        }
      }

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speak(aiResponse)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having technical difficulties right now. Please try again in a moment, or consider reaching out to a human counselor if you need immediate support.",
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: 'low'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const emergencyContacts = [
    { name: "National Suicide Prevention Lifeline", number: "988", country: "US" },
    { name: "Crisis Text Line", number: "741741", country: "US", isText: true },
    { name: "AASRA", number: "+91-9820466726", country: "India" },
    { name: "Vandrevala Foundation", number: "+91-9999666555", country: "India" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Saathi AI Buddy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your compassionate AI mental health companion, available 24/7 with advanced emotional intelligence
          </p>
          {isGuest && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                You're using guest mode. Create an account for full AI features and personalized support.
              </p>
            </div>
          )}
        </motion.div>

        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-10 gap-6">
          {/* Chat Interface - 70% */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-[700px] flex flex-col shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                {/* Chat Header */}
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl font-bold">Saathi AI</CardTitle>
                        <CardDescription className="text-white/90 text-sm">
                          AI Mental Health Companion • Online
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className="text-white hover:bg-white/20"
                      >
                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </Button>
                      {isSpeaking && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                              message.sender === 'user' 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-200' 
                                : 'bg-gradient-to-r from-blue-500 to-teal-500 border-blue-200'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </motion.div>
                            
                            <motion.div 
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm max-w-md ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-200'
                                : 'bg-white/95 shadow-xl border border-gray-100'
                            }`}>
                              <p className={`text-sm leading-relaxed ${
                                message.sender === 'user' ? 'font-medium text-white' : 'font-normal text-gray-800'
                              }`}>
                                {message.content}
                              </p>
                              
                              {message.riskLevel && message.riskLevel !== 'low' && message.sender === 'ai' && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`mt-3 flex items-center text-xs p-2 rounded-lg border ${
                                  message.riskLevel === 'critical' || message.riskLevel === 'high'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {message.riskLevel === 'critical' 
                                    ? 'Crisis detected - Please consider professional help'
                                    : message.riskLevel === 'high'
                                    ? 'High concern - Support resources available'
                                    : 'Elevated concern detected'
                                  }
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                          
                          <div className={`text-xs text-gray-500 mt-2 px-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white/95 shadow-lg border border-gray-100 px-4 py-3 rounded-2xl backdrop-blur-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder={isGuest ? "Try the demo - share what's on your mind..." : "Share what's on your mind..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="min-h-[48px] py-3 pr-12 border-2 focus:border-blue-400 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {recognitionRef.current && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={isListening ? stopListening : startListening}
                            className={`${isListening ? 'bg-red-100 text-red-600 border-red-200 shadow-lg' : 'hover:bg-gray-100'} border-2 shadow-md`}
                            disabled={isLoading}
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          variant="mental"
                          size="icon"
                          className="min-w-[48px] h-12 shadow-xl"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-center"
                    >
                      <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full border border-red-200 shadow-md">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Listening...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - 30% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Crisis Resources */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Crisis Support
                  </CardTitle>
                  <CardDescription>
                    If you're in crisis, please reach out immediately
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800 text-sm mb-2">
                        {contact.name}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          if (contact.isText) {
                            window.open(`sms:${contact.number}?body=HOME`, '_blank')
                          } else {
                            window.open(`tel:${contact.number}`, '_blank')
                          }
                        }}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {contact.isText ? `Text ${contact.number}` : contact.number}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                    AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Heart className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p>Sentiment analysis and risk detection</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Volume2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Voice input and audio responses</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-purple-500 mt-0.5" />
                    <p>Crisis escalation to professionals</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <p>24/7 compassionate support</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smart Integration Notice */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Smart Integration</h4>
                      <p className="text-xs text-blue-600">
                        Our AI can connect you with disaster relief resources if you need material support too.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}