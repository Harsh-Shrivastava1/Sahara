import { createClient } from '@supabase/supabase-js'

// -----------------------------
// Supabase Client Initialization
// -----------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// -----------------------------
// Database Type Definitions
// -----------------------------
export type Database = {
  public: {
    Tables: {

      // -----------------------------
      // Profiles Table
      // -----------------------------
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'user' | 'volunteer' | 'ngo'
          location: string | null
          latitude: number | null
          longitude: number | null
          services_offered: string[] | null
          trust_level: number
          badges: string[] | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'volunteer' | 'ngo'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          services_offered?: string[] | null
          trust_level?: number
          badges?: string[] | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'volunteer' | 'ngo'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          services_offered?: string[] | null
          trust_level?: number
          badges?: string[] | null
          verified?: boolean
          created_at?: string
        }
      }

      // -----------------------------
      // Help Requests Table
      // -----------------------------
      help_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'active' | 'in_progress' | 'completed' | 'cancelled'
          location: string
          latitude: number
          longitude: number
          contact_info: string
          needed_by: string | null
          volunteers_needed: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status?: 'active' | 'in_progress' | 'completed' | 'cancelled'
          location: string
          latitude: number
          longitude: number
          contact_info: string
          needed_by?: string | null
          volunteers_needed?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'active' | 'in_progress' | 'completed' | 'cancelled'
          location?: string
          latitude?: number
          longitude?: number
          contact_info?: string
          needed_by?: string | null
          volunteers_needed?: number | null
          created_at?: string
          updated_at?: string
        }
      }

      // -----------------------------
      // Mental Health Sessions Table
      // -----------------------------
      mental_health_sessions: {
        Row: {
          id: string
          user_id: string
          session_type: 'ai_chat' | 'community_support' | 'story_sharing'
          content: string
          sentiment_score: number | null
          risk_level: 'low' | 'medium' | 'high' | 'critical' | null
          escalated: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_type: 'ai_chat' | 'community_support' | 'story_sharing'
          content: string
          sentiment_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          escalated?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_type?: 'ai_chat' | 'community_support' | 'story_sharing'
          content?: string
          sentiment_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          escalated?: boolean
          created_at?: string
        }
      }

      // -----------------------------
      // Community Stories Table
      // -----------------------------
      community_stories: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          anonymous: boolean
          category: string
          likes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          anonymous?: boolean
          category: string
          likes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          anonymous?: boolean
          category?: string
          likes?: number
          created_at?: string
        }
      }

    }
  }
}
