-- Policies for admins table

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admins'
      AND policyname = 'Users can view own admin status'
  ) THEN
    CREATE POLICY "Users can view own admin status"
      ON public.admins FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admins'
      AND policyname = 'Admins can view all admins'
  ) THEN
    CREATE POLICY "Admins can view all admins"
      ON public.admins FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;
