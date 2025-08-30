import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { 
  BookOpen, Plus, Heart, MessageCircle, User, 
  Calendar, Eye, EyeOff, Sparkles
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'

interface Story {
  id: string
  title: string
  content: string
  is_anonymous: boolean
  category: string
  likes_count: number
  created_at: string
  author_id: string | null
  profiles?: {
    full_name: string
  }
}

export function CommunityStories() {
  const { profile, isGuest } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'recovery',
    isAnonymous: true
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('community_stories')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || isGuest) {
      alert('Please create an account to share your story with the community.')
      return
    }

    try {
      const { error } = await supabase
        .from('community_stories')
        .insert([{
          title: formData.title,
          content: formData.content,
          category: formData.category,
          is_anonymous: formData.isAnonymous,
          author_id: formData.isAnonymous ? null : profile.user_id,
          is_approved: true // Auto-approve for now
        }])

      if (error) throw error

      setFormData({
        title: '',
        content: '',
        category: 'recovery',
        isAnonymous: true
      })
      setShowForm(false)
      fetchStories()
      document.dispatchEvent(new CustomEvent('showConfetti'))
    } catch (error) {
      console.error('Error posting story:', error)
    }
  }

  const handleLike = async (storyId: string) => {
    if (isGuest) {
      alert('Please create an account to like stories.')
      return
    }

    try {
      const story = stories.find(s => s.id === storyId)
      if (!story) return

      const { error } = await supabase
        .from('community_stories')
        .update({ likes_count: story.likes_count + 1 })
        .eq('id', storyId)

      if (error) throw error
      fetchStories()
    } catch (error) {
      console.error('Error liking story:', error)
    }
  }

  const categories = [
    { value: 'recovery', label: 'Recovery Journey', icon: '🌱' },
    { value: 'hope', label: 'Hope & Inspiration', icon: '✨' },
    { value: 'support', label: 'Community Support', icon: '🤝' },
    { value: 'challenge', label: 'Overcoming Challenges', icon: '💪' },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'advice', label: 'Advice & Tips', icon: '💡' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading community stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Community Stories</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your journey, inspire others, and find strength in our supportive community
          </p>
          {isGuest && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                You're viewing as a guest. Create an account to share your story and connect with the community.
              </p>
            </div>
          )}
        </motion.div>

        {/* Share Story Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => setShowForm(true)}
            variant="mental"
            size="lg"
            className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            <Plus className="w-6 h-6 mr-2" />
            {isGuest ? 'View Stories (Login to Share)' : 'Share Your Story'}
          </Button>
        </motion.div>

        {/* Story Form Modal */}
        <AnimatePresence>
          {showForm && !isGuest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Share Your Story</h2>
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
                      Story Title
                    </label>
                    <Input
                      type="text"
                      placeholder="Give your story a meaningful title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Story
                    </label>
                    <textarea
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Share your experience, journey, or message of hope..."
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.category === cat.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-lg mb-1">{cat.icon}</div>
                          <div className="text-xs font-medium">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.isAnonymous
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {formData.isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span className="text-sm font-medium">
                        {formData.isAnonymous ? 'Post Anonymously' : 'Post with Name'}
                      </span>
                    </button>
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
                      variant="mental"
                      className="flex-1"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="text-lg">
                          {categories.find(c => c.value === story.category)?.icon || '📖'}
                        </span>
                        <span className="capitalize">
                          {categories.find(c => c.value === story.category)?.label || story.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="mb-4 line-clamp-4">
                    {story.content}
                  </CardDescription>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>
                          {story.is_anonymous ? 'Anonymous' : story.profiles?.full_name || 'Community Member'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(story.created_at)}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(story.id)}
                      className={`flex items-center space-x-1 hover:text-red-500 ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isGuest}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{story.likes_count}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your inspiring journey</p>
            <Button 
              onClick={() => setShowForm(true)} 
              variant="mental"
              disabled={isGuest}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGuest ? 'Login to Share Story' : 'Share First Story'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}