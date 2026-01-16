-- Repair status history, reviews, and support chat

-- Status history
CREATE TABLE IF NOT EXISTS public.repair_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
  status public.repair_status NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.repair_status_history ENABLE ROW LEVEL SECURITY;

-- Reviews
CREATE TABLE IF NOT EXISTS public.repair_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS repair_reviews_unique_repair
  ON public.repair_reviews (repair_id);

ALTER TABLE public.repair_reviews ENABLE ROW LEVEL SECURITY;

-- Support chat
CREATE TABLE IF NOT EXISTS public.support_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS support_threads_unique_user
  ON public.support_threads (user_id);

ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.support_threads(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'support')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Functions
CREATE OR REPLACE FUNCTION public.handle_repair_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.repair_status_history (repair_id, status, changed_at)
    VALUES (NEW.id, NEW.status, NEW.created_at);
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.repair_status_history (repair_id, status, changed_at)
      VALUES (NEW.id, NEW.status, now());
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_support_thread()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.support_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

-- Triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'repairs_status_history_trigger'
  ) THEN
    CREATE TRIGGER repairs_status_history_trigger
      AFTER INSERT OR UPDATE OF status ON public.repairs
      FOR EACH ROW EXECUTE FUNCTION public.handle_repair_status_change();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_repair_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_repair_reviews_updated_at
      BEFORE UPDATE ON public.repair_reviews
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'touch_support_thread_on_message'
  ) THEN
    CREATE TRIGGER touch_support_thread_on_message
      AFTER INSERT ON public.support_messages
      FOR EACH ROW EXECUTE FUNCTION public.touch_support_thread();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_threads_updated_at'
  ) THEN
    CREATE TRIGGER update_support_threads_updated_at
      BEFORE UPDATE ON public.support_threads
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- RLS Policies: repair_status_history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'repair_status_history'
      AND policyname = 'Users can view own repair history'
  ) THEN
    CREATE POLICY "Users can view own repair history"
      ON public.repair_status_history FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.repairs
          WHERE repairs.id = repair_status_history.repair_id
          AND repairs.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'repair_status_history'
      AND policyname = 'Users can insert repair history for own repairs'
  ) THEN
    CREATE POLICY "Users can insert repair history for own repairs"
      ON public.repair_status_history FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.repairs
          WHERE repairs.id = repair_status_history.repair_id
          AND repairs.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- RLS Policies: repair_reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'repair_reviews'
      AND policyname = 'Users can view own reviews'
  ) THEN
    CREATE POLICY "Users can view own reviews"
      ON public.repair_reviews FOR SELECT
      TO authenticated
      USING (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'repair_reviews'
      AND policyname = 'Users can create reviews for delivered repairs'
  ) THEN
    CREATE POLICY "Users can create reviews for delivered repairs"
      ON public.repair_reviews FOR INSERT
      TO authenticated
      WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM public.repairs
          WHERE repairs.id = repair_reviews.repair_id
          AND repairs.user_id = auth.uid()
          AND repairs.status IN ('completed', 'delivered')
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'repair_reviews'
      AND policyname = 'Users can update own reviews'
  ) THEN
    CREATE POLICY "Users can update own reviews"
      ON public.repair_reviews FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies: support_threads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_threads'
      AND policyname = 'Users can view own support thread'
  ) THEN
    CREATE POLICY "Users can view own support thread"
      ON public.support_threads FOR SELECT
      TO authenticated
      USING (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_threads'
      AND policyname = 'Users can create own support thread'
  ) THEN
    CREATE POLICY "Users can create own support thread"
      ON public.support_threads FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_threads'
      AND policyname = 'Users can update own support thread'
  ) THEN
    CREATE POLICY "Users can update own support thread"
      ON public.support_threads FOR UPDATE
      TO authenticated
      USING (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      )
      WITH CHECK (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- RLS Policies: support_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_messages'
      AND policyname = 'Users can view own support messages'
  ) THEN
    CREATE POLICY "Users can view own support messages"
      ON public.support_messages FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.support_threads
          WHERE support_threads.id = support_messages.thread_id
          AND support_threads.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_messages'
      AND policyname = 'Users can create support messages'
  ) THEN
    CREATE POLICY "Users can create support messages"
      ON public.support_messages FOR INSERT
      TO authenticated
      WITH CHECK (
        (
          sender_role = 'user'
          AND EXISTS (
            SELECT 1 FROM public.support_threads
            WHERE support_threads.id = support_messages.thread_id
            AND support_threads.user_id = auth.uid()
          )
        )
        OR EXISTS (
          SELECT 1 FROM public.admins
          WHERE admins.user_id = auth.uid()
        )
      );
  END IF;
END $$;
