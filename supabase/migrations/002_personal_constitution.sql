-- Personal Constitution Schema
-- Principles and values for measuring life decisions

-- Principles table (user's core values/principles)
CREATE TABLE IF NOT EXISTS public.principles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('core_value', 'life_principle', 'decision_rule', 'aspiration')),
  examples TEXT[], -- Concrete examples of applying this principle
  priority INTEGER DEFAULT 0, -- Higher = more important
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Principle reflections (how user has applied or violated principles)
CREATE TABLE IF NOT EXISTS public.principle_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  principle_id UUID NOT NULL REFERENCES public.principles(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES public.entries(id) ON DELETE SET NULL,
  reflection_type TEXT NOT NULL CHECK (reflection_type IN ('applied', 'violated', 'learned', 'refined')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Working memory table (extracted entities and context from conversations)
CREATE TABLE IF NOT EXISTS public.memory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('person', 'goal', 'event', 'concern', 'achievement', 'habit', 'relationship')),
  name TEXT NOT NULL,
  context TEXT, -- Additional context about this item
  last_mentioned TIMESTAMPTZ DEFAULT NOW(),
  mention_count INTEGER DEFAULT 1,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral', 'mixed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_principles_user_id ON public.principles(user_id);
CREATE INDEX IF NOT EXISTS idx_principles_category ON public.principles(category);
CREATE INDEX IF NOT EXISTS idx_principle_reflections_user_id ON public.principle_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_principle_reflections_principle_id ON public.principle_reflections(principle_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_user_id ON public.memory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_type ON public.memory_items(item_type);
CREATE INDEX IF NOT EXISTS idx_memory_items_last_mentioned ON public.memory_items(last_mentioned DESC);

-- RLS Policies
ALTER TABLE public.principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.principle_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_items ENABLE ROW LEVEL SECURITY;

-- Principles policies
CREATE POLICY "Users can view own principles"
  ON public.principles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own principles"
  ON public.principles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own principles"
  ON public.principles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own principles"
  ON public.principles FOR DELETE USING (auth.uid() = user_id);

-- Principle reflections policies
CREATE POLICY "Users can view own reflections"
  ON public.principle_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reflections"
  ON public.principle_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Memory items policies
CREATE POLICY "Users can view own memory"
  ON public.memory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own memory"
  ON public.memory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memory"
  ON public.memory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memory"
  ON public.memory_items FOR DELETE USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_principles_updated_at
  BEFORE UPDATE ON public.principles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_memory_items_updated_at
  BEFORE UPDATE ON public.memory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
