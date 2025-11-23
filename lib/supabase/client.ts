import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  persuasion_style: 'logos' | 'pathos' | 'ethos';
  completed_at: string;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          personality_profile: PersonalityProfile | null;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          personality_profile?: PersonalityProfile | null;
          onboarded?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          personality_profile?: PersonalityProfile | null;
          onboarded?: boolean;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          source: 'text' | 'voice' | 'email' | 'image';
          mood: string | null;
          tags: string[];
          audio_url: string | null;
          word_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          source: 'text' | 'voice' | 'email' | 'image';
          mood?: string | null;
          tags?: string[];
          audio_url?: string | null;
          word_count?: number;
        };
        Update: {
          title?: string;
          content?: string;
          source?: 'text' | 'voice' | 'email' | 'image';
          mood?: string | null;
          tags?: string[];
          audio_url?: string | null;
          word_count?: number;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          context: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          context?: Record<string, unknown>;
        };
        Update: {
          title?: string | null;
          context?: Record<string, unknown>;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata?: Record<string, unknown>;
        };
        Update: {
          content?: string;
          metadata?: Record<string, unknown>;
        };
      };
      entities: {
        Row: {
          id: string;
          user_id: string;
          entry_id: string | null;
          name: string;
          type: 'person' | 'place' | 'event' | 'emotion' | 'goal' | 'topic';
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_id?: string | null;
          name: string;
          type: 'person' | 'place' | 'event' | 'emotion' | 'goal' | 'topic';
          metadata?: Record<string, unknown>;
        };
        Update: {
          entry_id?: string | null;
          name?: string;
          type?: 'person' | 'place' | 'event' | 'emotion' | 'goal' | 'topic';
          metadata?: Record<string, unknown>;
        };
      };
    };
  };
};
