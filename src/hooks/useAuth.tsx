import React,{ useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { supabase } from "../lib/supabase"

export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  phone: string | null
  user_type: 'individual' | 'volunteer' | 'ngo' | 'admin'
  role?: 'user' | 'volunteer' | 'ngo'
  location: string | null
  latitude: number | null
  longitude: number | null
  services_offered?: string[] | null
  trust_level: number
  badges_earned: number
  badges: string[] | null
  verified: boolean
  is_verified: boolean
  created_at: string
}

interface AuthContextType {
  user: any
  profile: UserProfile | null
  loading: boolean
  isGuest: boolean
  signUp: (email: string, password: string, extra: Partial<UserProfile>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInAsGuest: () => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        fetchProfile(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error.message)
        setProfile(null)
      } else {
        setProfile(data as UserProfile)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email: string, password: string, extra: Partial<UserProfile>) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // Profile will be created by database trigger
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  function signInAsGuest() {
    setIsGuest(true)
    setUser({ id: 'guest' })
    setProfile({
      id: 'guest',
      user_id: 'guest',
      email: 'guest@example.com',
      full_name: 'Guest User',
      phone: null,
      user_type: 'individual',
      location: null,
      latitude: null,
      longitude: null,
      services_offered: [],
      trust_level: 0,
      badges_earned: 0,
      badges: [],
      is_verified: false,
      verified: false,
      created_at: new Date().toISOString(),
    })
    setLoading(false)
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!profile || isGuest) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', profile.user_id)

      if (error) throw error
      
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // ✅ No JSX here — works in .ts file
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        profile,
        loading,
        isGuest,
        signUp,
        signIn,
        signOut,
        signInAsGuest,
        updateProfile,
      },
    },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
