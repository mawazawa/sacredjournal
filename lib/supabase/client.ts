import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          personality_profile: Record<string, unknown> | null;
          onboarded: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          personality_profile?: Record<string, unknown> | null;
          onboarded?: boolean;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
          source: "voice" | "email" | "text" | "image";
          mood?: string;
          tags?: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          source: "voice" | "email" | "text" | "image";
          mood?: string;
          tags?: string[];
        };
      };
    };
  };
};
